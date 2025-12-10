export default function ViewEmiSummary({ tenure, installment, totalPayable, start, end }) {
  return (
    <div className="">      
      <div className="flex justify-between mb-6">
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 text-black">
          <p className="text-sm opacity-80">EMI Tenure</p>
          <p className="text-xl font-semibold">{tenure} Months</p>
        </div>

        <div className="bg-white/19 border border-[#D9D9D93B]/23 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-80">Installment</p>
          <p className="text-xl font-semibold">${installment}/month</p>
        </div>

        <div className="bg-white/19 border border-[#D9D9D93B]/23 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-80">Total Payable</p>
          <p className="text-xl font-semibold">${totalPayable}</p>
        </div>
      </div>

      <hr className="border-[#FFFFFF66] mb-4" />

      <div className="flex justify-between text-sm">
        <p>📅 <strong>Starting:</strong> {start}</p>
        <p>📅 <strong>Ends:</strong> {end}</p>
      </div>
    </div>
  );
}
