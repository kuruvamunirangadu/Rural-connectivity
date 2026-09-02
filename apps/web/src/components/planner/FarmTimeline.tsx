'use client';

import React from 'react';

export interface TimelineActivity {
  id: string;
  name: string;
  activityType: string;
  plannedDate: string;
  status: string;
  requirementsSummary: string;
}

interface FarmTimelineProps {
  timeline: Record<string, TimelineActivity[]>;
  onSelectActivity?: (activityId: string) => void;
}

export const FarmTimeline: React.FC<FarmTimelineProps> = ({ timeline, onSelectActivity }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">✓ COMPLETED</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">● IN PROGRESS</span>;
      case 'RESOURCE_SEARCH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">🔍 FINDING RESOURCES</span>;
      case 'BOOKED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">📅 BOOKED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-300">PLANNED</span>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'LAND_PREPARATION': return '🚜';
      case 'SOWING': return '🌱';
      case 'IRRIGATION': return '💧';
      case 'SPRAYING': return '🧪';
      case 'FERTILIZATION': return '🌾';
      case 'WEEDING': return '🌿';
      case 'HARVESTING': return '✨';
      default: return '📋';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Crop Season Operations Timeline</h2>
          <p className="text-xs text-stone-500">Chronological farm plan mapped to seasonal cultivation cycle</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
          Kharif 2026 Season
        </span>
      </div>

      <div className="space-y-8 relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {Object.entries(timeline).map(([month, activities]) => (
          <div key={month} className="space-y-3 relative">
            <div className="flex items-center gap-2 -ml-6">
              <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white shadow-sm" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                {month}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
              {activities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity && onSelectActivity(act.id)}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer bg-stone-50/50 hover:bg-white group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getActivityIcon(act.activityType)}</span>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800">
                          {act.name}
                        </h4>
                        <p className="text-xs text-stone-500">📅 {act.plannedDate}</p>
                      </div>
                    </div>
                    {getStatusBadge(act.status)}
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium truncate max-w-[200px]">
                      ⚙️ {act.requirementsSummary || 'No resources defined'}
                    </span>
                    <span className="text-emerald-700 font-bold group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
