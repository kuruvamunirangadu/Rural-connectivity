'use client';

import React, { useState } from 'react';

const AVAILABLE_ROLES = [
  { id: 'FARMER', label: 'Farmer', description: 'I cultivate land and need agricultural services & machinery.' },
  { id: 'CONTRACTOR', label: 'Contractor', description: 'I manage multi-village agricultural projects and teams.' },
  { id: 'TRACTOR_OWNER', label: 'Tractor Owner', description: 'I own tractors and attachments for hire.' },
  { id: 'SKILLED_WORKER', label: 'Skilled Worker', description: 'I provide skilled agricultural labour & machinery operation.' },
  { id: 'EQUIPMENT_OWNER', label: 'Equipment Owner', description: 'I own sprayers, pumps, or other agricultural equipment.' },
  { id: 'SUPPLIER', label: 'Supplier', description: 'I supply fertilizers, seeds, and agricultural inputs.' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('Ravi Kumar');
  const [village, setVillage] = useState('Tangipalli');
  const [mandal, setMandal] = useState('Tandur');
  const [district, setDistrict] = useState('Vikarabad');
  const [language, setLanguage] = useState('Telugu');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['FARMER', 'CONTRACTOR', 'TRACTOR_OWNER']);

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        {step === 1 ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-stone-900">Welcome to RuralConnect</h1>
            <p className="text-sm text-stone-600 mb-4">Let's set up your profile details.</p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Mandal</label>
                <input
                  type="text"
                  value={mandal}
                  onChange={(e) => setMandal(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
              >
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="English">English</option>
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm transition mt-4"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-stone-900">How will you use RuralConnect?</h1>
            <p className="text-sm text-stone-600">Select one or more roles. You can freely switch between them anytime.</p>

            <div className="space-y-2 mt-4">
              {AVAILABLE_ROLES.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    selectedRoles.includes(r.id)
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(r.id)}
                    onChange={() => toggleRole(r.id)}
                    className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-stone-900">{r.label}</span>
                    <p className="text-xs text-stone-500">{r.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2.5 rounded-lg text-sm transition"
              >
                Back
              </button>
              <button
                disabled={selectedRoles.length === 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
              >
                Complete Registration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
