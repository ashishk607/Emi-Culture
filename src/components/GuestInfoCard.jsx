import React from "react";

export default function GuestInfoCard({ guest }) {
  return (
    <div className="bg-gray-50 p-6 border border-gray-200 rounded-xl mb-10">
      <p className="text-sm text-gray-500">Guest Name</p>
      <h3 className="text-lg font-semibold mt-1">
        {guest.name} • Room {guest.roomNumber}
      </h3>

      <hr className="my-4" />

      <div className="flex items-center gap-6 text-sm">
        <div>
          <p className="text-gray-500">
            Total Cost <span className="font-semibold">{guest.totalAmount}</span>
          </p>
        </div>

        <div className="w-px h-10 bg-gray-300" />

        <div>
          <p className="text-gray-500">
            Amount Paid{" "}
            <span className="font-semibold text-gray-900">
              {guest.paidAmount}
            </span>
          </p>
        </div>

        <div className="w-px h-10 bg-gray-300" />

        <div>
          <p className="text-gray-500">
            Amount Due{" "}
            <span className="font-semibold text-gray-900">{guest.dueAmount}</span>
          </p>
        </div>
      </div>

      <p className="text-sm text-red-600 font-medium mt-4 flex items-center gap-2">
        🔔 Payment Due — {guest.paymentDue}
      </p>
    </div>
  );
}
