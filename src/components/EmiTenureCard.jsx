import React from 'react';

export default function EmiTenureCard({ months, amountLabel, selected, onSelect, recommended }) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e)=> (e.key === 'Enter' || e.key === ' ') && onSelect()}
      className={`py-5 border rounded-xl text-center cursor-pointer transition p-4 flex flex-col justify-between ${selected ? "bg-blue-100 border-blue-600" : "hover:bg-blue-50 hover:border-blue-500"}`}
    >
      <div>
        <p className="font-semibold text-lg">{months} Months {recommended ? <span className="ml-2 text-xs bg-yellow-200 px-2 py-1 rounded">Recommended</span> : null}</p>
        <p className="text-sm mt-1">{amountLabel}</p>
      </div>
      <div className="text-xs text-gray-500 mt-3">Click to select</div>
    </div>
  );
}