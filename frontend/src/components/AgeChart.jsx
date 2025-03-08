import React from 'react';
import PropTypes from 'prop-types';

const AgeChart = ({ patients }) => {
  if (patients.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="text-white/70">Chart will appear when patients are added</p>
      </div>
    );
  }

  // Calculate age groups
  const ageGroups = {
    '0-18': 0,
    '19-35': 0,
    '36-50': 0,
    '51+': 0
  };

  patients.forEach(patient => {
    if (patient.age <= 18) ageGroups['0-18']++;
    else if (patient.age <= 35) ageGroups['19-35']++;
    else if (patient.age <= 50) ageGroups['36-50']++;
    else ageGroups['51+']++;
  });

  const maxValue = Math.max(...Object.values(ageGroups));

  return (
    <div className="flex h-40 items-end justify-around">
      {Object.entries(ageGroups).map(([group, count]) => {
        // Calculate percentage height relative to the max value
        const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
        
        // Define colors based on age group
        let barColor;
        if (group === '0-18') barColor = 'from-blue-400 to-cyan-400';
        else if (group === '19-35') barColor = 'from-green-400 to-teal-400';
        else if (group === '36-50') barColor = 'from-yellow-400 to-orange-400';
        else barColor = 'from-red-400 to-pink-400';
        
        return (
          <div key={group} className="flex flex-col items-center group">
            <div className="relative mb-1">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md rounded px-2 py-1 text-xs text-white whitespace-nowrap">
                {count} patients ({Math.round((count / patients.length) * 100)}%)
              </div>
              {/* Bar */}
              <div 
                className={`w-12 rounded-t-lg bg-gradient-to-b ${barColor} shadow-lg hover:w-14 transition-all duration-200`} 
                style={{ height: `${Math.max(percentage, 5)}%` }}
              ></div>
            </div>
            <div className="text-xs mt-1 text-white/80">{group}</div>
            <div className="text-xs text-blue-400/80 font-medium">{count}</div>
          </div>
        );
      })}
    </div>
  );
};

AgeChart.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      age: PropTypes.number.isRequired
    })
  ).isRequired
};

export default AgeChart; 