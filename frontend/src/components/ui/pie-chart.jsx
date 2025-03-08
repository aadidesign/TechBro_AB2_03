import React from 'react';

export function PieChart({ data }) {
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  let currentAngle = 0;

  return (
    <div className="relative h-64 w-full flex justify-center items-center">
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] max-h-[200px] mx-auto">
        {data.datasets[0].data.map((value, index) => {
          const angle = (value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          const startRad = (startAngle - 90) * Math.PI / 180;
          const endRad = (endAngle - 90) * Math.PI / 180;

          const x1 = 50 + 40 * Math.cos(startRad);
          const y1 = 50 + 40 * Math.sin(startRad);
          const x2 = 50 + 40 * Math.cos(endRad);
          const y2 = 50 + 40 * Math.sin(endRad);

          const largeArcFlag = angle > 180 ? 1 : 0;
          const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={data.datasets[0].backgroundColor[index]}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              className="hover:opacity-90 transition-opacity duration-300"
            >
              <title>{data.labels[index]}: {value} ({Math.round((value / total) * 100)}%)</title>
            </path>
          );
        })}
        
        {/* Optional center hole for donut effect */}
        <circle cx="50" cy="50" r="20" fill="rgba(0,0,0,0.3)" />
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-3 text-xs">
        {data.labels.map((label, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 mr-1 rounded-sm"
              style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
            ></div>
            <span className="text-white/80">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 