import React, { useState, useEffect } from 'react';
import reportsData, { reportTypes, reportCategories, statusOptions } from '../data/reportsData';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Load reports data
  useEffect(() => {
    setReports(reportsData);
  }, []);

  // Filter reports based on search term, type and status
  useEffect(() => {
    let filtered = [...reports];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredReports(filtered);
  }, [reports, searchTerm, typeFilter, statusFilter]);

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (!statusOption) return 'gray';
    return statusOption.color;
  };

  // View report details
  const viewReportDetails = (report) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  // Format date to readable format (2023-05-10 -> May 10, 2023)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get chart preview based on report type
  const getChartPreview = (report) => {
    switch (report.type) {
      case 'line':
        return <LineChartPreview data={report.data} />;
      case 'bar':
        return <BarChartPreview data={report.data} />;
      case 'pie':
        return <PieChartPreview data={report.data} isDonut={false} />;
      case 'donut':
        return <PieChartPreview data={report.data} isDonut={true} />;
      case 'radar':
        return <RadarChartPreview data={report.data} />;
      default:
        return null;
    }
  };

  // Line Chart Preview Component
  const LineChartPreview = ({ data }) => {
    const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
    const minValue = Math.min(...data.datasets.flatMap(dataset => dataset.data));
    const range = maxValue - minValue;
    const height = 150;

    return (
      <div className="relative h-[150px] w-full">
        {data.datasets.map((dataset, datasetIndex) => (
          <div key={datasetIndex} className="absolute inset-0">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <path
                d={dataset.data.map((value, index) => {
                  const x = (index / (dataset.data.length - 1)) * 100;
                  const y = height - ((value - minValue) / range) * height;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke={dataset.borderColor}
                strokeWidth="2"
                className="transition-all duration-300"
              />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  // Bar Chart Preview Component
  const BarChartPreview = ({ data }) => {
    const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
    const barWidth = 100 / (data.labels.length * data.datasets.length);

    return (
      <div className="relative h-[150px] w-full">
        {data.datasets.map((dataset, datasetIndex) => (
          <div key={datasetIndex} className="absolute inset-x-0 bottom-0 flex justify-around">
            {dataset.data.map((value, index) => {
              const height = (value / maxValue) * 100;
              const offset = datasetIndex * barWidth;
              
              return (
                <div
                  key={index}
                  className="absolute bottom-0 transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    width: `${barWidth}%`,
                    left: `${(index * data.datasets.length * barWidth) + offset}%`,
                    backgroundColor: dataset.backgroundColor
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Pie/Donut Chart Preview Component
  const PieChartPreview = ({ data, isDonut }) => {
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;

    return (
      <div className="relative h-[150px] w-full flex justify-center items-center">
        <svg viewBox="0 0 100 100" className="w-[150px] h-[150px]">
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

            const pathData = `
              M 50 50
              L ${x1} ${y1}
              A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

            return (
              <path
                key={index}
                d={pathData}
                fill={data.datasets[0].backgroundColor[index]}
                className="transition-all duration-300"
              />
            );
          })}
          {isDonut && <circle cx="50" cy="50" r="25" fill="#111827" />}
        </svg>
      </div>
    );
  };

  // Radar Chart Preview Component
  const RadarChartPreview = ({ data }) => {
    const sides = data.labels.length;
    const radius = 40;
    const center = { x: 50, y: 50 };

    return (
      <div className="relative h-[150px] w-full flex justify-center items-center">
        <svg viewBox="0 0 100 100" className="w-[150px] h-[150px]">
          {/* Background polygon */}
          <path
            d={data.labels.map((_, i) => {
              const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
              const x = center.x + radius * Math.cos(angle);
              const y = center.y + radius * Math.sin(angle);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ') + 'Z'}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Data polygons */}
          {data.datasets.map((dataset, datasetIndex) => (
            <path
              key={datasetIndex}
              d={dataset.data.map((value, i) => {
                const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
                const scaledRadius = (value / 100) * radius;
                const x = center.x + scaledRadius * Math.cos(angle);
                const y = center.y + scaledRadius * Math.sin(angle);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ') + 'Z'}
              fill="none"
              stroke={dataset.borderColor}
              strokeWidth="2"
              className="transition-all duration-300"
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 h-full overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-white/70">View and analyze healthcare data reports</p>
        </div>

        <button 
          type="button" 
          className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Generate New Report
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all" 
            placeholder="Search reports..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all" className="bg-gray-800">All Report Types</option>
          {reportTypes.map((type, index) => (
            <option key={index} value={type.value} className="bg-gray-800">
              {type.label}
            </option>
          ))}
        </select>

        <select 
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all" className="bg-gray-800">All Status</option>
          {statusOptions.map((option, index) => (
            <option key={index} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length === 0 ? (
          <div className="col-span-full bg-black/20 rounded-xl p-10 text-center border border-white/5">
            <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No reports found</h3>
            <p className="text-white/70">Try changing your filters or generate a new report</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div 
              key={report.id} 
              className="bg-black/20 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              onClick={() => viewReportDetails(report)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">{formatDate(report.date)}</span>
                  <span className={`px-2 py-1 text-xs rounded-full bg-${getStatusColor(report.status)}-500/20 text-${getStatusColor(report.status)}-400 capitalize`}>
                    {report.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{report.title}</h3>
                <p className="text-white/70 text-sm line-clamp-2">{report.description}</p>
              </div>

              <div className="bg-black/30 rounded-lg p-4 mb-4 border border-white/5">
                {getChartPreview(report)}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50 capitalize">{report.type} Chart</span>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Details Modal */}
      {isDetailsModalOpen && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-4xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Report Details</h2>
              <button 
                className="text-white/70 hover:text-white text-2xl leading-none transition-colors" 
                onClick={() => setIsDetailsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedReport.title}</h3>
                  <div className="flex items-center text-white/70 text-sm mt-1">
                    <span className="capitalize">{selectedReport.type} Chart</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(selectedReport.date)}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full bg-${getStatusColor(selectedReport.status)}-500/20 text-${getStatusColor(selectedReport.status)}-400 capitalize`}>
                  {selectedReport.status}
                </div>
              </div>
              
              <p className="text-white/80 mb-6">{selectedReport.description}</p>
              
              <div className="bg-black/20 rounded-lg p-6 border border-white/5">
                {getChartPreview(selectedReport)}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/15 hover:text-white transition-colors">
                Edit Report
              </button>
              <button className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
                Download PDF
              </button>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg shadow hover:from-blue-700 hover:to-teal-600 transition-all"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
          
          {/* Modal Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsDetailsModalOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Reports; 