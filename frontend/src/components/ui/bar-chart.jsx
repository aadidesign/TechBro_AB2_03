import React from 'react';

export function BarChart({ data }) {
  // Check if data exists and has the expected structure
  if (!data || typeof data !== 'object') {
    return (
      <div className="h-64 w-full flex items-center justify-center text-white/50">
        <p>No data available</p>
      </div>
    );
  }

  let labels = [];
  let values = [];

  // Handle different data formats
  if (data.datasets && data.labels) {
    // Format from chart libraries
    labels = data.labels;
    values = data.datasets[0]?.data || [];
  } else {
    // Simple object format {key: value}
    labels = Object.keys(data);
    values = Object.values(data);
  }

  if (labels.length === 0 || values.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-white/50">
        <p>No data to display</p>
      </div>
    );
  }

  const maxValue = Math.max(...values);

  return (
    <div className="h-64 w-full pt-5">
      <div className="flex h-full items-end justify-around">
        {labels.map((label, index) => {
          const value = values[index];
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          // Define colors based on index
          let barColor;
          if (index === 0) barColor = 'from-blue-400 to-cyan-400';
          else if (index === 1) barColor = 'from-green-400 to-teal-400';
          else if (index === 2) barColor = 'from-yellow-400 to-orange-400';
          else barColor = 'from-red-400 to-pink-400';
          
          return (
            <div key={label} className="flex flex-col items-center group">
              <div className="relative mb-1">
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md rounded px-2 py-1 text-xs text-white whitespace-nowrap">
                  {value} ({Math.round((value / values.reduce((a, b) => a + b, 0)) * 100)}%)
                </div>
                {/* Bar */}
                <div 
                  className={`w-12 rounded-t-lg bg-gradient-to-t ${barColor} shadow-lg hover:w-14 transition-all duration-200`}
                  style={{ height: `${Math.max(percentage, 5)}%` }}
                />
              </div>
              <div className="text-xs mt-2 text-white/80">{label}</div>
              <div className="text-xs text-blue-400/80 font-medium">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 