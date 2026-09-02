'use client';

import React, { useState } from 'react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Enter Verification Code</h1>
        <p className="text-sm text-stone-600 mb-6">OTP sent to <span className="font-semibold text-stone-800">+91 98765 43210</span></p>
        
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-12 h-14 text-center text-xl font-bold border border-stone-300 rounded-lg focus:border-emerald-600 focus:outline-none"
            />
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs text-stone-500 mb-1">Development mode code: <span className="font-mono font-bold text-emerald-700">123456</span></p>
          <button className="text-xs text-emerald-600 hover:underline">Resend OTP</button>
        </div>

        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm transition">
          Verify
        </button>
      </div>
    </div>
  );
}
