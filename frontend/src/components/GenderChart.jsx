import React from 'react';
import PropTypes from 'prop-types';

const GenderChart = ({ data }) => {
  // Add default values and validation
  const genderCounts = data || {
    male: 0,
    female: 0,
    other: 0
  };
  
  // Check if all values are 0
  const total = Object.values(genderCounts).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return (
      <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6">Gender Distribution</h2>
        <div className="h-40 flex items-center justify-center">
          <p className="text-white/70">No gender distribution data available</p>
        </div>
      </div>
    );
  }
  
  // Calculate percentages
  const percentages = {
    male: Math.round((genderCounts.male / total) * 100) || 0,
    female: Math.round((genderCounts.female / total) * 100) || 0,
    other: Math.round((genderCounts.other / total) * 100) || 0
  };

  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-6">Gender Distribution</h2>
      <div className="flex h-40 items-center justify-center gap-6">
        <div className="h-36 w-36 relative">
          {/* Donut chart */}
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#334155" strokeWidth="2" opacity="0.1" />
            
            {/* Male segment - blue */}
            <circle 
              cx="18" 
              cy="18" 
              r="15.915" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="3.8" 
              strokeDasharray={`${percentages.male} 100`} 
              strokeDashoffset="25" 
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            
            {/* Female segment - pink */}
            <circle 
              cx="18" 
              cy="18" 
              r="15.915" 
              fill="none" 
              stroke="#ec4899" 
              strokeWidth="3.8" 
              strokeDasharray={`${percentages.female} 100`} 
              strokeDashoffset={25 - percentages.male} 
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            
            {/* Other segment - purple */}
            <circle 
              cx="18" 
              cy="18" 
              r="15.915" 
              fill="none" 
              stroke="#a855f7" 
              strokeWidth="3.8" 
              strokeDasharray={`${percentages.other} 100`} 
              strokeDashoffset={25 - percentages.male - percentages.female} 
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            
            {/* Center text */}
            <text x="18" y="17.5" textAnchor="middle" className="text-xs font-medium fill-white">
              {total}
            </text>
            <text x="18" y="22" textAnchor="middle" className="text-[8px] fill-white/70">
              patients
            </text>
          </svg>
        </div>
        
        <div className="text-sm text-white/80">
          <div className="flex items-center mb-2 group cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="flex-1">Male:</span>
            <span className="font-medium text-blue-400">{genderCounts.male}</span>
            <span className="text-xs ml-1 text-white/50">({percentages.male}%)</span>
          </div>
          <div className="flex items-center mb-2 group cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
            <span className="flex-1">Female:</span>
            <span className="font-medium text-pink-400">{genderCounts.female}</span>
            <span className="text-xs ml-1 text-white/50">({percentages.female}%)</span>
          </div>
          <div className="flex items-center group cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="flex-1">Other:</span>
            <span className="font-medium text-purple-400">{genderCounts.other}</span>
            <span className="text-xs ml-1 text-white/50">({percentages.other}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

GenderChart.propTypes = {
  data: PropTypes.shape({
    male: PropTypes.number,
    female: PropTypes.number,
    other: PropTypes.number
  })
};

GenderChart.defaultProps = {
  data: {
    male: 0,
    female: 0,
    other: 0
  }
};

export default GenderChart; 