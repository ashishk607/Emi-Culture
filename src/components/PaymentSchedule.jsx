export default function PaymentSchedule({ schedule }) {
  return (
   <div className="bg-white rounded-xl border border-[#BEDBFF] p-6 max-h-80 overflow-y-auto hide-scrollbar">
      <h4 className="font-semibold text-[#6F6F6F] mb-4 inter-font-family">Payment Schedule</h4>
      <ul className="inter-font-family">
        {schedule.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between py-3 border-[#E1DFDF] border-b last:border-none"
          >
            {/* Left — Number + Month */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#0451BB] font-semibold">
                {i + 1}
              </div>

              <span className="text-[#6F6F6F] text-base font-medium">{item.display}</span>
            </div>

            {/* EMI Amount */}
            <div className="text-[#6F6F6F] text-base font-medium">
              ${item.amount}
            </div>

            {/* Status */}
            <div className="text-[#A8A8A8] text-sm font-medium">
              Upcoming
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
