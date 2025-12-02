export default function EmiSummary({ monthly, totalPayable, start, end }) {
  return (
    <div>
      {/* Top Row */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-gray-600 text-sm">Monthly EMI</p>
          <p className="text-3xl font-bold text-gray-900">
            $ {Math.round(monthly)} <span className="text-lg">/ month</span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-600 text-sm">Total Payable</p>
          <p className="text-3xl font-bold text-gray-900">$ {totalPayable}</p>
        </div>
      </div>

      {/* Start & End Dates */}
      <div className="flex justify-between text-gray-700 text-sm border-t pt-4">
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
