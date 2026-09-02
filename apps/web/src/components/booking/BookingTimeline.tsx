'use client';

import React from 'react';

export type BookingStep =
  | 'REQUEST_CREATED'
  | 'TRACTOR_MATCHED'
  | 'OWNER_ACCEPTED'
  | 'BOOKING_CONFIRMED'
  | 'TRACTOR_ARRIVED'
  | 'WORK_STARTED'
  | 'WORK_COMPLETED'
  | 'FARMER_CONFIRMED'
  | 'CLOSED';

interface BookingTimelineProps {
  currentStatus: string;
}

const TIMELINE_STEPS = [
  { id: 'REQUEST_CREATED', label: 'Request Created' },
  { id: 'TRACTOR_MATCHED', label: 'Tractor Matched' },
  { id: 'OWNER_ACCEPTED', label: 'Owner Accepted' },
  { id: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' },
  { id: 'TRACTOR_ARRIVED', label: 'Tractor Arrived' },
  { id: 'WORK_STARTED', label: 'Work Started' },
  { id: 'WORK_COMPLETED', label: 'Work Completed' },
  { id: 'FARMER_CONFIRMED', label: 'Farmer Confirmed' },
  { id: 'CLOSED', label: 'Closed' },
];

export const BookingTimeline: React.FC<BookingTimelineProps> = ({ currentStatus }) => {
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'OPEN': return 0;
      case 'MATCHED': return 1;
      case 'OFFERED': return 2;
      case 'SCHEDULED':
      case 'ACCEPTED': return 3;
      case 'ARRIVED': return 4;
      case 'IN_PROGRESS': return 5;
      case 'COMPLETED': return 6;
      case 'CONFIRMED': return 7;
      case 'CLOSED': return 8;
      default: return 3;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Live Booking Timeline</h3>
      <div className="relative pl-6 space-y-4">
        {TIMELINE_STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="relative flex items-center gap-3">
              {idx < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`absolute -left-4 top-4 w-0.5 h-6 ${
                    isDone ? 'bg-emerald-600' : 'bg-stone-200'
                  }`}
                />
              )}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                    : 'bg-stone-100 text-stone-400 border border-stone-300'
                }`}
              >
                {isDone ? '✓' : isCurrent ? '●' : '○'}
              </div>
              <span
                className={`text-xs ${
                  isCurrent
                    ? 'font-bold text-stone-900'
                    : isDone
                    ? 'font-medium text-emerald-800'
                    : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
