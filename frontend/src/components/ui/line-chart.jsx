import React from 'react';

export function LineChart({ data }) {
  // Check if data exists and is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-white/50">
        <p>No data available</p>
      </div>
    );
  }

  // Now that we know data is a valid array, proceed safely
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1; // Prevent division by zero

  return (
    <div className="h-64 w-full">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * 25}
            x2="100"
            y2={i * 25}
            stroke="white"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Line chart */}
        <path
          d={data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 100;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          className="transition-all duration-300"
        />
        
        {/* Area fill */}
        <path
          d={`
            ${data.map((value, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((value - minValue) / range) * 100;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            L 100 100 L 0 100 Z
          `}
          fill="url(#gradient)"
          fillOpacity="0.1"
        />
        
        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - minValue) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="#fff"
              className="hover:r-2 transition-all duration-200"
            >
              <title>{value}</title>
            </circle>
          );
        })}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
} 