import React from "react";
import familyImage from "../assets/Rectangle 376714341.png";

export default function ConvertToEMI() {
  return (
    <div className="flex w-full min-h-screen bg-white rounded-2xl p-4 gap-4">
      {/* LEFT PANEL */}
      <div
        className="w-1/3 rounded-2xl overflow-hidden flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${familyImage})` }}
      >
        <div className="h-full w-auto m-2 rounded-2xl border border-gray-200">
            <div className="p-6">
            <h2 className="text-3xl font-bold leading-snug">
                Simplify collections.{" "}
                <span className="text-blue-500">
                Make time for better things in life.
                </span>
            </h2>
            </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-2/3 bg-white p-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Convert Guest Payment to EMI
        </h1>
        <p className="text-gray-600 mb-8 mt-2">
          Help your guest pay in easy monthly installments. While you sit back
          and relax.
        </p>

        {/* Guest Info Card */}
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-xl mb-10">
          <p className="text-sm text-gray-500">Guest Name</p>
          <h3 className="text-lg font-semibold mt-1">
            Richard Hendricks • Room 1
          </h3>

          <hr className="my-4" />

          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-gray-500">Total Cost <span className="font-semibold">14,744</span></p>              
            </div>

            <div className="w-px h-10 bg-gray-300" />

            <div>
              <p className="text-gray-500">Amount Paid <span className="font-semibold text-gray-900">14,744</span></p>
              
            </div>

            <div className="w-px h-10 bg-gray-300" />

            <div>
              <p className="text-gray-500">Amount Due <span className="font-semibold text-gray-900">14,744</span></p>
              
            </div>
          </div>

          <p className="text-sm text-red-600 font-medium mt-4 flex items-center gap-2">
            🔔 Payment Due — Jan 26, 2023
          </p>
        </div>

        {/* EMI Tenure Selection */}
        <h3 className="text-lg font-semibold mb-4">Choose EMI Tenure</h3>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[3, 3, 3, 3].map((tenure, idx) => (
            <div
              key={idx}
              className="py-5 border rounded-xl text-center hover:bg-blue-50 hover:border-blue-500 cursor-pointer transition"
            >
              <p className="font-semibold">3 Months</p>
              <p className="text-green-600 text-sm mt-1">$1500 / month</p>
            </div>
          ))}
        </div>

        {/* EMI Summary Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm">Monthly EMI</p>
              <p className="text-2xl font-bold text-gray-900">$1500 / month</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Total Payable</p>
              <p className="text-2xl font-bold text-gray-900">$4500</p>
            </div>
          </div>

          <div className="flex justify-between text-gray-600 text-sm mb-6">
            <p className="flex items-center gap-1">📅 Starting: Jan 2026</p>
            <p className="flex items-center gap-1">📅 Ends: Jan 2026</p>
          </div>

          {/* Schedule */}
          <div className="border bg-white rounded-xl p-5">
            <h4 className="font-semibold text-gray-800 mb-3">
              Payment Schedule
            </h4>

            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>• Jan 2026</span> <strong>$1500</strong>
              </li>
              <li className="flex justify-between">
                <span>• Feb 2026</span> <strong>$1500</strong>
              </li>
              <li className="flex justify-between">
                <span>• Mar 2026</span> <strong>$1500</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
            Convert to EMI
          </button>
        </div>
      </div>
    </div>
  );
}
