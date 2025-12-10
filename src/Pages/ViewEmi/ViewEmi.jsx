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
          start: d.start,
          end: d.end,
          schedule: d.schedule.map((s) => ({
            display: s.display,
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
      <div className="p-2 inter-font-family">
        <div className="flex w-full min-h-auto bg-gradient-to-br from-[#002454] to-[#0050BA] rounded-2xl">
          {/* Left Section */}
          <div className="w-1/2 text-white p-10 flex flex-col justify-between">
            <div>
              {/* Header Shimmer */}
              <div className="mb-8">
                <div className="shimmer-light h-9 w-3/4 mb-2 rounded-lg" />
                <div className="shimmer-light h-5 w-full rounded-lg" />
              </div>

              {/* Cards Shimmer */}
              <div className="flex justify-between mb-6">
                <div className="shimmer-white border border-[#D9D9D9] rounded-2xl p-6 w-[30%]">
                  <div className="shimmer-gray h-4 w-20 mb-2 rounded" />
                  <div className="shimmer-gray h-6 w-24 rounded" />
                </div>
                <div className="shimmer-blue-card border border-[#D9D9D93B]/23 rounded-2xl p-6 w-[30%]">
                  <div className="shimmer-light-blue h-4 w-20 mb-2 rounded" />
                  <div className="shimmer-light-blue h-6 w-28 rounded" />
                </div>
                <div className="shimmer-blue-card border border-[#D9D9D93B]/23 rounded-2xl p-6 w-[30%]">
                  <div className="shimmer-light-blue h-4 w-24 mb-2 rounded" />
                  <div className="shimmer-light-blue h-6 w-20 rounded" />
                </div>
              </div>

              {/* Divider */}
              <hr className="border-[#FFFFFF66] mb-4" />

              {/* Date Range Shimmer */}
              <div className="flex justify-between text-sm">
                <div className="shimmer-light h-5 w-40 rounded" />
                <div className="shimmer-light h-5 w-36 rounded" />
              </div>
            </div>
          </div>

          {/* Right Section - Payment Schedule */}
          <div className="w-1/2 p-8">
            <div className="bg-[#BEDBFF] rounded-2xl p-6 shadow-md">
              <div className="bg-white rounded-2xl p-6 shadow-md h-70">
                {/* Title Shimmer */}
                <div className="shimmer-gray h-6 w-48 mb-4 rounded" />

                {/* Schedule Items Shimmer */}
                <ul className="space-y-4 pr-2">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center justify-between py-3 border-[#E1DFDF] border-b last:border-none">
                      <div className="flex items-center gap-3">
                        <div className="shimmer-blue-circle w-8 h-8 rounded-full" />
                        <div className="shimmer-gray h-5 w-20 rounded" />
                      </div>
                      <div className="shimmer-gray h-5 w-12 rounded" />
                      <div className="shimmer-blue-text h-4 w-20 rounded" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
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
// import React, { useEffect, useState } from "react";
// import ViewEmi from "../../components/ViewEmi";
// import { useSearchParams } from "react-router-dom";
// import { getGuestEmiPlan } from "../../api/guestApi";
// import "./ViewEmi.css";

// export default function ViewEmiPage() {
//   const [params] = useSearchParams();
//   const travId = params.get("travId");

//   const [emiData, setEmiData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // -----------------------------
//   // LOAD EMI PLAN FROM API
//   // -----------------------------
//   useEffect(() => {
//     if (!travId) {
//       setError("Invalid Traveller ID");
//       setLoading(false);
//       return;
//     }

//     async function fetchData() {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await getGuestEmiPlan(travId);

//         if (!res.data.status) throw new Error(res.data.message);

//         const d = res.data.data;
//         console.log(d);

//         // Map API → Component format
//         setEmiData({
//           tenure: d.tenure,
//           monthly: d.monthly,
//           totalPayable: d.totalPayable,
//           start: d.start,     // e.g. "Jan 2026"
//           end: d.end,         // e.g. "Mar 2026"
//           schedule: d.schedule.map((s) => ({
//             display: s.display,    // "Jan 2026"
//             amount: s.amount,
//             paid: s.paid || false,
//           })),
//         });
//       } catch (err) {
//         setError(err.message || "Failed to load EMI data");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [travId]);

//   // -----------------------------
//   // LOADING STATE (Shimmer)
//   // -----------------------------
//   if (loading) {
//   return (
//     <div className="p-10 animate-pulse">
//       <div className="shimmer h-8 w-1/3 mb-6" />

//       <div className="flex gap-5 mb-6">
//         <div className="shimmer h-28 w-40 rounded-xl"/>
//         <div className="shimmer h-28 flex-1 rounded-xl"/>
//         <div className="shimmer h-28 w-40 rounded-xl"/>
//       </div>

//       <div className="shimmer h-64 w-full rounded-xl" />
//     </div>
//   );
// }

//   // -----------------------------
//   // ERROR STATE
//   // -----------------------------
//   if (error) {
//     return (
//       <div className="p-10 text-center text-red-600 text-lg font-semibold inter-font-family">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-2 inter-font-family">
//       <ViewEmi emi={emiData} />
//     </div>
//   );
// }

