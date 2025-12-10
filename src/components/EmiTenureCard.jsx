import React from 'react';
export default function EmiTenureCard({ months, amountLabel, selected, onSelect, recommended }) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e)=> (e.key === 'Enter' || e.key === ' ') && onSelect()}
      className={`group border rounded-xl text-center cursor-pointer transition p-3 flex flex-col justify-between ${selected ? "bg-[#0451BB] border-[#3D9EFF] text-white" : "bg-white border-[#D9D9D9] hover:bg-[#0451BB] hover:text-white"}`}
    >
      <div>
        <p className="font-semibold text-lg"><span className={`font-semibold text-base poppins-font-family ${selected ? "text-white" : "text-[#404040] group-hover:text-white"}`}>{months} Months</span>
        <br/>{recommended && (<span className="ml-2 text-xs bg-yellow-200 px-2 py-1 rounded text-black">Recommended</span>)}</p>
        <p className={`text-sm mt-1 inter-font-family ${selected ? "text-white" : "text-[#3AB46D] group-hover:text-white"}`}>${amountLabel}</p>
      </div>
    </div>
  );
}