export default function PaymentSchedule({ schedule }) {
  return (
   <div className="bg-white rounded-xl shadow-sm border p-6 h-80 overflow-y-auto hide-scrollbar">

      <h4 className="font-semibold text-gray-800 mb-4">Payment Schedule</h4>
      <ul className="space-y-4">
        {schedule.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between py-3 border-b-1"
          >
            {/* Left — Number + Month */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                {i + 1}
              </div>

              <span className="text-gray-700 font-medium">{item.display}</span>
            </div>

            {/* EMI Amount */}
            <div className="text-gray-900 font-bold">
              ${item.amount}
            </div>

            {/* Status */}
            <div className="text-blue-600 text-sm font-medium">
              Upcoming
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}
