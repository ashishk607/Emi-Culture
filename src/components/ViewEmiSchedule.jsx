export default function ViewEmiSchedule({ schedule }) {
  return (
    <div className="bg-[#BEDBFF] rounded-2xl p-6 shadow-md">
      <div className="bg-white rounded-2xl p-6 shadow-md h-70 overflow-y-auto hide-scrollbar">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Payment Schedule
        </h3>

        <ul className="space-y-4 pr-2">
          {schedule.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between py-3 border-[#E1DFDF] border-b last:border-none"
            >
              {/* Left number + date */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  {i + 1}
                </div>
                <span className="text-gray-700 font-medium">
                  {item.display}
                </span>
              </div>

              {/* Amount */}
              <div className="text-gray-900 font-bold">${item.amount}</div>

              {/* Status */}
              <div
                className={`text-sm font-medium ${
                  item.paid ? "text-green-600" : "text-blue-600"
                }`}
              >
                {item.paid ? "Paid" : "Upcoming"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
