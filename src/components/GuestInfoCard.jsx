import React from "react";

export default function GuestInfoCard({ guest }) {
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <div className="bg-[#F9FAFB] p-6 border border-gray-200 rounded-xl mb-4">
      <p className="text-sm text-[#A09E9E] inter-font-family">Guest Name</p>
      <h3 className="text-lg font-bold mt-1 text-[#6F6F6F] inter-font-family">
        {guest.name} <span className="text-[#CDCDCD]">•</span> Room {guest.roomNumber}
      </h3>

      <hr className="my-2 text-[#9C9C9C]" />

      <div className="flex items-center gap-6 text-sm inter-font-family">
        <div>
          <p className="text-[#404040]">
            Total Cost <span className="font-bold poppins-font-family">{guest.totalAmount}</span>
          </p>
        </div>

        <div className="w-px h-10 bg-gray-300" />

        <div>
          <p className="text-[#404040]">
            Amount Paid{" "}
            <span className="font-bold poppins-font-family">
              {guest.paidAmount}
            </span>
          </p>
        </div>

        <div className="w-px h-10 bg-gray-300" />

        <div>
          <p className="text-[#404040]">
            Amount Due{" "}
            <span className="font-bold poppins-font-family">{guest.dueAmount}</span>
          </p>
        </div>
      </div>
      <p className="text-[#A6A7A8] font-medium flex items-center gap-2 inter-font-family">
        🔔 Payment Due — <span className="text-[#BE4B53]">{formatDate(guest.paymentDue)}</span>
      </p>
    </div>
  );
}
