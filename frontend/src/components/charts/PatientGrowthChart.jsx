import React from 'react';
import { LineChart } from '../ui/line-chart';

export function PatientGrowthChart({ data }) {
  return (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-4">
        Patient Growth
      </h2>
      <LineChart data={Array.isArray(data) ? data : []} />
    </div>
  );
} 