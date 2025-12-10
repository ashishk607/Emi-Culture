import React from "react";
import ViewEmiHeader from "./ViewEmiHeader";
import ViewEmiSummary from "./ViewEmiSummary";
import ViewEmiSchedule from "./ViewEmiSchedule";
import GuestDetailsCard from "./GuestDetailsCard";

export default function ViewEmi({ emi }) {
  if (!emi) return <div className="p-6">No EMI data available</div>;  
  return (
    <div className="flex w-full min-h-auto bg-gradient-to-br from-[#002454] to-[#0050BA] rounded-2xl">
      {/* LEFT BLUE PANEL */}
      <div className="w-1/2 text-white p-10 flex flex-col justify-between">
        <div>
          <ViewEmiHeader />
          <GuestDetailsCard
            name={emi.guestName}
            room={emi.roomNo}
          />
          <ViewEmiSummary
            tenure={emi.tenure}
            installment={emi.monthly}
            totalPayable={emi.totalPayable}
            start={emi.start}
            end={emi.end}
          />
        </div>
      </div>

      {/* RIGHT WHITE PANEL */}
      <div className="w-1/2  p-8">
        <ViewEmiSchedule schedule={emi.schedule} />
      </div>
    </div>
  );
}
