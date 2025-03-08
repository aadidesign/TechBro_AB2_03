import React from 'react';
import PropTypes from 'prop-types';

const AgeChart = ({ data }) => {
  // Add default value and validation
  const ageGroups = data || {
    '0-18': 0,
    '19-35': 0,
    '36-50': 0,
    '51+': 0
  };

  // Check if all values are 0
  const hasData = Object.values(ageGroups).some(value => value > 0);

  if (!hasData) {
    return (
      <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6">Age Distribution</h2>
        <div className="h-40 flex items-center justify-center">
          <p className="text-white/70">No age distribution data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...Object.values(ageGroups));
  const totalPatients = Object.values(ageGroups).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-6">Age Distribution</h2>
      <div className="flex h-40 items-end justify-around">
        {Object.entries(ageGroups).map(([group, count]) => {
          // Calculate percentage height relative to the max value
          const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
          const populationPercentage = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0;
          
          // Define colors based on age group
          let barColor;
          switch(group) {
            case '0-18':
              barColor = 'from-blue-400 to-cyan-400';
              break;
            case '19-35':
              barColor = 'from-green-400 to-teal-400';
              break;
            case '36-50':
              barColor = 'from-yellow-400 to-orange-400';
              break;
            default:
              barColor = 'from-red-400 to-pink-400';
          }
          
          return (
            <div key={group} className="flex flex-col items-center group">
              <div className="relative mb-1">
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md rounded px-2 py-1 text-xs text-white whitespace-nowrap">
                  {count} patients ({populationPercentage}%)
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
    </div>
  );
};

AgeChart.propTypes = {
  data: PropTypes.shape({
    '0-18': PropTypes.number,
    '19-35': PropTypes.number,
    '36-50': PropTypes.number,
    '51+': PropTypes.number
  })
};

AgeChart.defaultProps = {
  data: {
    '0-18': 0,
    '19-35': 0,
    '36-50': 0,
    '51+': 0
  }
};

export default AgeChart; 