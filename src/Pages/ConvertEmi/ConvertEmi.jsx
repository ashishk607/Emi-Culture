import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import familyImage from "../../assets/Rectangle 376714341.png";

import { getGuestEmiDetails } from "../../api/guestApi";
import { saveGuestEmiPlan } from "../../api/guestApi";

import GuestInfoCard from "../../components/GuestInfoCard";
import EmiTenureCard from "../../components/EmiTenureCard";
import EmiSummary from "../../components/EmiSummary";
import PaymentSchedule from "../../components/PaymentSchedule";

import "./ConvertEmi.css";

import {
  calculateEMI,
  generateSchedule,
  suggestTenures,
  getMonthDifference,
} from "../../utils/emiCalculator";

import { useSearchParams } from "react-router-dom";

export default function ConvertEmi() {
  const [params] = useSearchParams();
  const travId = params.get("travId");

  // -----------------------------
  // HOOKS (TOP LEVEL — SAFE)
  // -----------------------------
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedMonths, setSelectedMonths] = useState(null);
  const [emiInfo, setEmiInfo] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const [paymentDay, setPaymentDay] = useState(5);
  const [customMonths, setCustomMonths] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (success && countdown !== null) {
      if (countdown === 0) {
        navigate(`/ViewEmi?travId=${guest.id}`);
        return;
      }

      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [success, countdown]);

  // -----------------------------
  // FETCH GUEST DATA
  // -----------------------------
  useEffect(() => {
    if (!travId) return;

    async function loadGuestData() {
      setLoading(true);

      const res = await getGuestEmiDetails(travId);

      setGuest({
        id: res.data.data.traV_ID,
        name: res.data.data.name,
        roomNumber: res.data.data.roomNo,
        totalAmount: res.data.data.totalAmount,
        paidAmount: res.data.data.paidAmount,
        dueAmount: res.data.data.dueAmount,
        paymentDue: res.data.data.dueDate,
      });

      setLoading(false);
    }

    loadGuestData();
  }, [travId]);

  // -----------------------------
  // DERIVED VALUES
  // -----------------------------
  const maxMonths = guest
    ? getMonthDifference(new Date(), guest.paymentDue)
    : 0;

  const tenureOptions =
    guest && maxMonths >= 3
      ? suggestTenures(
          guest.dueAmount,
          [3, 6, 9, 12].filter((m) => m <= maxMonths)
        )
      : [];

  // -----------------------------
  // AUTO-SELECT FIRST OPTION
  // (Runs ONCE after guest load)
  // -----------------------------
  useEffect(() => {
    if (
      guest &&
      tenureOptions.length > 0 &&
      selectedMonths === null // prevents infinite loop
    ) {
      const first = tenureOptions[0].months;
      applyEMI(first, paymentDay, false); // do not reset error
    }
  }, [guest, tenureOptions]);

  // -----------------------------
  // RECALCULATE WHEN PAYMENT DATE CHANGES
  // -----------------------------
  useEffect(() => {
    if (selectedMonths) {
      applyEMI(selectedMonths, paymentDay, false);
    }
  }, [paymentDay]);

  // -----------------------------
  // MAIN EMI FUNCTION
  // -----------------------------
  const applyEMI = (months, payDay = paymentDay, showError = true) => {
    if (!guest) return;

    if (months < 3) {
      if (showError) setError("Minimum EMI is 3 months.");
      return;
    }

    if (months > maxMonths) {
      if (showError) setError(`Maximum allowed is ${maxMonths} months.`);
      return;
    }

    setError("");
    setSelectedMonths(months);

    const emi = calculateEMI(guest.dueAmount, months);

    const result = generateSchedule(
      guest.paymentDue,
      months,
      emi.amounts,
      payDay,
      new Date()
    );

    if (!result.ok) {
      if (showError) setError(result.error);
      return;
    }

    setEmiInfo({
      monthly: emi.monthlyBase,
      totalPayable: emi.totalPayable,
    });

    setSchedule(result.schedule);
  };

  const handleCustomSubmit = () => {
    const m = Number(customMonths);
    if (!m) return setError("Enter valid EMI months");
    applyEMI(m);
  };

  // -----------------------------
  // UI RENDERING
  // -----------------------------

  if (loading) {
    return (
      <div className="p-10">
        <div className="shimmer h-6 w-1/3 mb-4"></div>
        <div className="shimmer h-40 w-full mb-6"></div>
        <div className="shimmer h-20 w-full"></div>
      </div>
    );
  }

  if (!guest) return null;

  if (maxMonths < 3) {
    return (
      <div className="p-10 text-center text-red-600 text-lg font-semibold">
        Due date is too near. EMI cannot be created.
      </div>
    );
  }

  const handleConfirmEmi = async () => {
    if (!guest || !emiInfo || schedule.length === 0) {
      setError("Cannot submit EMI. Missing data.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        travId: guest.id,
        dueAmount: guest.dueAmount,
        paymentDay,
        tenure: selectedMonths,
        totalPayable: emiInfo.totalPayable,
        monthlyEmi: emiInfo.monthly,
        schedule: schedule.map((s) => ({
          date: s.iso,
          amount: s.amount,
        })),
      };
      const res = await saveGuestEmiPlan(payload);
      if (!res.data.status) {
        throw new Error(res.data.message || "Unable to save EMI plan");
      }

      // ---- SUCCESS HANDLING ----
      setSuccess(true);
      setSaving(false);

      // Start redirect countdown
      setCountdown(10);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setSaving(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white rounded-2xl p-4 gap-4">
      {/* LEFT SIDE */}
      <div
        className="w-1/3 rounded-2xl overflow-hidden flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${familyImage})` }}
      >
        <div className="h-full w-auto m-2 rounded-2xl border border-gray-200 p-6">
          <h2 className="text-3xl font-inter font-bold leading-snug">
            Simplify collections.{" "}
            <span className="text-[#0451BB]">Make time for better things.</span>
          </h2>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/3 p-10 bg-white">
        <h1 className="text-3xl font-bold">Convert Guest Payment to EMI</h1>
        <p className="text-gray-600 mb-8 mt-2">
          Help your guest pay in monthly installments.
        </p>

        <GuestInfoCard guest={guest} />

        {/* TENURE + PAYMENT DATE */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold mb-4">Choose EMI Tenure</h3>

          <div className="mb-6">
            <label className="font-semibold text-gray-700">
              EMI Payment Date (1–28)
            </label>
            <input
              type="number"
              min={1}
              max={28}
              value={paymentDay}
              onChange={(e) =>
                setPaymentDay(Math.max(1, Math.min(28, Number(e.target.value))))
              }
              className="border ml-4 p-2 w-20 rounded"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm font-semibold mb-3">{error}</div>
        )}

        {/* TENURE CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {tenureOptions.map(({ months, monthly, recommended }) => (
            <EmiTenureCard
              key={months}
              months={months}
              recommended={recommended}
              amountLabel={`${Math.round(monthly)} / month`}
              selected={selectedMonths === months}
              onSelect={() => applyEMI(months)}
            />
          ))}

          {/* CUSTOM EMI */}
          <div className="border p-4 rounded-xl">
            <p className="font-semibold mb-2">Custom Months</p>
            <input
              type="number"
              min={3}
              max={maxMonths}
              value={customMonths}
              onChange={(e) => setCustomMonths(e.target.value)}
              className="border w-full p-2 rounded mb-2"
              placeholder={`3 - ${maxMonths}`}
            />

            <button
              className="bg-blue-600 text-white w-full py-2 rounded"
              onClick={handleCustomSubmit}
            >
              Apply
            </button>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-6 shadow-sm">
          {/* SUMMARY + SCHEDULE */}
          {selectedMonths && schedule.length > 0 && (
            <>
              <EmiSummary
                monthly={emiInfo.monthly}
                totalPayable={emiInfo.totalPayable}
                start={schedule[0]?.display}
                end={schedule[schedule.length - 1]?.display}
              />

              <div className="mt-6">
                <PaymentSchedule schedule={schedule} />
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleConfirmEmi}
                  disabled={saving || success}
                  className={`bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition 
                  ${
                    saving || success
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {saving ? "Saving..." : success ? "EMI Saved" : "Confirm EMI"}
                </button>

                {success && (
                  <div className="text-green-600 mt-4 font-semibold text-center">
                    ✅ EMI Plan saved successfully! Redirecting in {countdown}{" "}
                    seconds...
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
