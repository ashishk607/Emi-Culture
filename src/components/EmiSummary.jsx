export default function EmiSummary({ monthly, totalPayable, start, end }) {
  return (
    <div>
      {/* Top Row */}
      <div className="flex justify-between mb-6">
        <div className="inter-font-family">
          <p className="text-[#6F6F6F] font-semibold text-sm">Monthly EMI</p>
          <p className="text-[#6F6F6F] text-base font-medium">
            $ {Math.round(monthly)} / month
          </p>
        </div>

        <div className="text-right inter-font-family">
          <p className="text-[#6F6F6F] font-semibold text-sm">Total Payable</p>
          <p className="text-[#6F6F6F] text-base font-medium">$ {totalPayable}</p>
        </div>
      </div>

      {/* Start & End Dates */}
      <div className="flex justify-between text-gray-700 text-sm border-[#BEDBFF] border-t pt-4 inter-font-family">
        <p className="flex items-center gap-2">
          📅 <span>Starting: {start}</span>
        </p>
        <p className="flex items-center gap-2">
          📅 <span>Ends: {end}</span>
        </p>
      </div>
    </div>
  );
}
