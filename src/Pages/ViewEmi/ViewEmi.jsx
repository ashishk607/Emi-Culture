import React, { useEffect, useState } from "react";
import ViewEmi from "../../components/ViewEmi";
import { useSearchParams } from "react-router-dom";
import { getGuestEmiPlan } from "../../api/guestApi";
import "./ViewEmi.css";

export default function ViewEmiPage() {
  const [params] = useSearchParams();
  const travId = params.get("travId");

  const [emiData, setEmiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // LOAD EMI PLAN FROM API
  // -----------------------------
  useEffect(() => {
    if (!travId) {
      setError("Invalid Traveller ID");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const res = await getGuestEmiPlan(travId);

        if (!res.data.status) throw new Error(res.data.message);

        const d = res.data.data;
        console.log(d);

        // Map API → Component format
        setEmiData({
          tenure: d.tenure,
          monthly: d.monthly,
          totalPayable: d.totalPayable,
          start: d.start,     // e.g. "Jan 2026"
          end: d.end,         // e.g. "Mar 2026"
          schedule: d.schedule.map((s) => ({
            display: s.display,    // "Jan 2026"
            amount: s.amount,
            paid: s.paid || false,
          })),
        });
      } catch (err) {
        setError(err.message || "Failed to load EMI data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [travId]);

  // -----------------------------
  // LOADING STATE (Shimmer)
  // -----------------------------
  if (loading) {
    return (
      <div className="p-10">
        <div className="shimmer h-8 w-1/3 mb-6" />
        <div className="shimmer h-64 w-full mb-6" />
      </div>
    );
  }

  // -----------------------------
  // ERROR STATE
  // -----------------------------
  if (error) {
    return (
      <div className="p-10 text-center text-red-600 text-lg font-semibold inter-font-family">
        {error}
      </div>
    );
  }

  return (
    <div className="p-2 inter-font-family">
      <ViewEmi emi={emiData} />
    </div>
  );
}

