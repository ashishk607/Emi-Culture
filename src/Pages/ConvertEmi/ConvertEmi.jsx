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
      try {
        setLoading(true);

        const res = await getGuestEmiDetails(travId);

        const api = res.data;

        if (!api?.data) {
          setGuest(null);
          setError(api.message || "Guest not found.");
          return;
        }
        const g = api.data;
        setGuest({
          id: g.traV_ID,
          name: g.name,
          roomNumber: g.roomNo,
          totalAmount: g.totalAmount,
          paidAmount: g.paidAmount,
          dueAmount: g.dueAmount,
          paymentDue: g.dueDate,
        });

        setError(null);
      } catch (error) {
        console.error(error);
        setError("Something went wrong!");
        setGuest(null);
      } finally {
        setLoading(false);
      }
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
      <div className="flex w-full min-h-screen bg-white rounded-2xl p-4 gap-4">
        {/* LEFT SIDE - Image Shimmer */}
        <div className="w-1/3 rounded-2xl overflow-hidden flex flex-col bg-gradient-to-br from-gray-200 to-gray-300">
          <div className="h-full w-auto m-2 rounded-2xl border border-gray-200 p-6">
            <div className="shimmer-gray h-8 w-3/4 mb-3 rounded-lg" />
            <div className="shimmer-gray h-6 w-full rounded-lg" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3 p-10 bg-white">
          {/* Header Shimmer */}
          <div className="shimmer-gray h-9 w-80 mb-2 rounded-lg" />
          <div className="shimmer-gray h-5 w-96 mb-8 rounded-lg" />

          {/* Guest Info Card Shimmer */}
          <div className="bg-[#F9FAFB] p-6 border border-gray-200 rounded-xl mb-4">
            <div className="shimmer-light-gray h-4 w-24 mb-2 rounded" />
            <div className="shimmer-gray h-6 w-48 mb-3 rounded" />
            <hr className="my-2 text-[#9C9C9C]" />
            
            <div className="flex items-center gap-6 mb-3">
              <div className="shimmer-gray h-5 w-24 rounded" />
              <div className="w-px h-10 bg-gray-300" />
              <div className="shimmer-gray h-5 w-28 rounded" />
              <div className="w-px h-10 bg-gray-300" />
              <div className="shimmer-gray h-5 w-24 rounded" />
            </div>
            
            <div className="shimmer-gray h-5 w-52 rounded" />
          </div>

          {/* Tenure Selection Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="shimmer-gray h-5 w-40 rounded" />
            <div className="shimmer-gray h-9 w-56 rounded" />
          </div>

          {/* Tenure Cards Grid Shimmer */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shimmer-card border border-[#D9D9D9] rounded-xl p-4 h-28" />
            ))}
          </div>

          {/* EMI Summary Section Shimmer */}
          <div className="bg-[#EFF6FF] border border-[#BEDBFF] rounded-2xl px-6 py-6 shadow-sm">
            {/* Summary Top */}
            <div className="flex justify-between mb-6">
              <div>
                <div className="shimmer-blue-light h-4 w-24 mb-2 rounded" />
                <div className="shimmer-blue-light h-5 w-32 rounded" />
              </div>
              <div>
                <div className="shimmer-blue-light h-4 w-28 mb-2 rounded" />
                <div className="shimmer-blue-light h-5 w-20 rounded" />
              </div>
            </div>

            {/* Date Range */}
            <div className="flex justify-between text-sm border-[#BEDBFF] border-t pt-4 mb-6">
              <div className="shimmer-blue-light h-5 w-40 rounded" />
              <div className="shimmer-blue-light h-5 w-36 rounded" />
            </div>

            {/* Payment Schedule */}
            <div className="bg-white rounded-xl border border-[#BEDBFF] p-6">
              <div className="shimmer-gray h-6 w-44 mb-4 rounded" />
              
              <ul className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center justify-between py-3 border-[#E1DFDF] border-b last:border-none">
                    <div className="flex items-center gap-4">
                      <div className="shimmer-blue-circle w-8 h-8 rounded-full" />
                      <div className="shimmer-gray h-5 w-28 rounded" />
                    </div>
                    <div className="shimmer-gray h-5 w-12 rounded" />
                    <div className="shimmer-light-gray h-4 w-20 rounded" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm Button */}
            <div className="mt-8 text-end">
              <div className="shimmer-blue-button h-12 w-36 rounded-xl ml-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. error OR no guest
  if (error || !guest) {
    return (
      <div className="p-10 text-center text-red-600 text-lg font-semibold">
        {error || "Guest not found"}
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold leading-snug inter-font-family">
            Simplify collections.{" "}
            <span className="text-[#0451BB]">Make time for better things.</span>
          </h2>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/3 p-10 bg-white">
        <h1 className="text-3xl font-bold inter-font-family">Convert Guest Payment to EMI</h1>
        <p className="text-gray-600 mb-8 mt-2 inter-font-family">Help your guest pay in easy monthly installments. While you sit back and relax.</p>

        <GuestInfoCard guest={guest} />

        {/* TENURE + PAYMENT DATE */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base text-[#6F6F6F] font-semibold inter-font-family">Choose EMI Tenure</h3>
          <div className="text-base text-[#6F6F6F] inter-font-family">
            <label className="font-semibold">
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
              className="border ml-2 p-1 w-20 rounded"
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
          <div className="border border-[#D9D9D9] p-3 rounded-xl inter-font-family">
            <p className="font-semibold mb-2">Custom Months</p>
            <input
              type="number"
              min={3}
              max={maxMonths}
              value={customMonths}
              onChange={(e) => setCustomMonths(e.target.value)}
              className="border w-full p-1 rounded mb-2"
              placeholder={`3 - ${maxMonths}`}
            />
            <button
              className="bg-blue-600 text-white w-full py-1 rounded"
              onClick={handleCustomSubmit}
            >
              Apply
            </button>
          </div>
        </div>
        <div className="bg-[#EFF6FF] border border-[#BEDBFF] rounded-2xl px-6 py-6 shadow-sm">
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

              <div className="mt-8 text-end inter-font-family">
                <button
                  onClick={handleConfirmEmi}
                  disabled={saving || success}
                  className={`bg-blue-600 text-white px-6 py-3 rounded-xl text-base font-semibold transition 
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
