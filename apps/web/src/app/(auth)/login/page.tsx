'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Welcome to RuralConnect</h1>
        <p className="text-sm text-stone-600 mb-6">Enter your mobile number to sign in or create your multi-role account.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Mobile Number</label>
            <div className="flex rounded-lg border border-stone-300 overflow-hidden">
              <span className="bg-stone-100 text-stone-600 px-3 py-2 text-sm border-r border-stone-300">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm transition">
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
}
