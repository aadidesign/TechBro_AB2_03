import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import reportsData, { reportTypes, reportCategories, statusOptions } from '../data/reportsData';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  
  // New state for the report generation form
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'line',
    description: '',
    status: 'draft',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [65, 59, 80, 81, 56, 55],
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6'
        }
      ]
    }
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Load reports data
  useEffect(() => {
    setReports(reportsData);
    setFilteredReports(reportsData);
  }, []);

  // Filter reports based on search term, type and status
  useEffect(() => {
    if (!reports || reports.length === 0) return;
    
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  // Handle new report form change
  const handleNewReportChange = (e) => {
    const { name, value } = e.target;
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate new report
  const handleGenerateReport = () => {
    // Create a new report object
    const newReportObj = {
      id: reports.length + 1,
      title: newReport.title,
      type: newReport.type,
      description: newReport.description,
      date: new Date().toISOString().split('T')[0],
      status: newReport.status,
      data: newReport.data
    };

    // Add the new report to the reports array
    setReports(prev => [newReportObj, ...prev]);
    
    // Reset the form
    setNewReport({
      title: '',
      type: 'line',
      description: '',
      status: 'draft',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6'
          }
        ]
      }
    });
    
    // Close the modal
    setIsGenerateModalOpen(false);
  };

  // Get chart preview (existing function)
  const getChartPreview = (report) => {
    // This function should remain unchanged to maintain functionality
    switch(report.type) {
      case 'line':
        return (
          <div className="h-40 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 300 150">
              <path
                d={report.data.datasets[0].data.map((value, i) => {
                  const x = (i / (report.data.labels.length - 1)) * 300;
                  const y = 150 - (value / 100) * 150;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke={report.data.datasets[0].borderColor}
                strokeWidth="2"
              />
            </svg>
          </div>
        );
      
      case 'bar':
        return (
          <div className="h-40 flex items-end justify-between px-4">
            {report.data.datasets[0].data.map((value, i) => (
              <div 
                key={i}
                className="w-8 bg-blue-500/70 rounded-t-md"
                style={{ height: `${(value / 100) * 100}%` }}
              />
            ))}
          </div>
        );
      
      case 'pie':
      case 'donut':
        return (
          <div className="h-40 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="#0f172a" />
              {report.data.datasets[0].data.map((value, i, arr) => {
                const total = arr.reduce((sum, val) => sum + val, 0);
                const startAngle = arr.slice(0, i).reduce((sum, val) => sum + (val / total) * 360, 0);
                const endAngle = startAngle + (value / total) * 360;
                
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                const x1 = 60 + 50 * Math.cos(startRad);
                const y1 = 60 + 50 * Math.sin(startRad);
                const x2 = 60 + 50 * Math.cos(endRad);
                const y2 = 60 + 50 * Math.sin(endRad);
                
                const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                
                const pathData = `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
                
                return (
                  <path 
                    key={i}
                    d={pathData}
                    fill={report.data.datasets[0].backgroundColor[i] || '#3b82f6'}
                    stroke="#0f172a"
                    strokeWidth="1"
                  />
                );
              })}
              {report.type === 'donut' && (
                <circle cx="60" cy="60" r="30" fill="#0f172a" />
              )}
            </svg>
          </div>
        );
      
      case 'radar':
        return (
          <div className="h-40 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="1" />
              <circle cx="60" cy="60" r="35" fill="none" stroke="#1e293b" strokeWidth="1" />
              <circle cx="60" cy="60" r="20" fill="none" stroke="#1e293b" strokeWidth="1" />
              
              {report.data.labels.map((_, i) => {
                const angle = (i / report.data.labels.length) * Math.PI * 2 - Math.PI / 2;
                const x = 60 + 50 * Math.cos(angle);
                const y = 60 + 50 * Math.sin(angle);
                return (
                  <line 
                    key={i}
                    x1="60" 
                    y1="60" 
                    x2={x} 
                    y2={y} 
                    stroke="#1e293b" 
                    strokeWidth="1" 
                  />
                );
              })}
              
              {report.data.datasets.map((dataset, datasetIndex) => {
                const points = dataset.data.map((value, i) => {
                  const angle = (i / dataset.data.length) * Math.PI * 2 - Math.PI / 2;
                  const distance = (value / 100) * 50;
                  const x = 60 + distance * Math.cos(angle);
                  const y = 60 + distance * Math.sin(angle);
                  return `${x},${y}`;
                });
                
                return (
                  <polygon 
                    key={datasetIndex}
                    points={points.join(' ')}
                    fill="none"
                    stroke={dataset.borderColor}
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
          </div>
        );
      
      default:
        return (
          <div className="h-40 flex items-center justify-center text-white/50">
            No preview available
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Reports Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg"
          onClick={() => setIsGenerateModalOpen(true)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Generate New Report
        </motion.button>
      </div>
      
      {/* Search and Filters */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 space-y-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
      >
        <div className="relative">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports..."
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <div className="absolute left-3 top-3.5 text-white/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="absolute right-3 top-3 text-white/50 text-sm">
            Press '/' to search
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => setTypeFilter('all')}
          >
            All Types
          </motion.button>
          
          {reportTypes.map(type => (
            <motion.button
              key={type.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === type.value 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setTypeFilter(type.value)}
            >
              {type.label}
            </motion.button>
          ))}
          
          <div className="ml-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Reports Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {!filteredReports || filteredReports.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="col-span-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
          >
            <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No reports found</h3>
            <p className="text-white/70">Try changing your filters or generate a new report</p>
          </motion.div>
        ) : (
          filteredReports.map((report) => (
            <motion.div 
              key={report.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10"
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
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
      
      {/* Report Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedReport && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-[#0c1524] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">Report Details</h2>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsDetailsModalOpen(false)}
                      className="text-white/50 hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white text-lg font-medium">{selectedReport.title}</h3>
                      <div className={`px-3 py-1 rounded-full bg-${getStatusColor(selectedReport.status)}-500/20 text-${getStatusColor(selectedReport.status)}-400 capitalize`}>
                        {selectedReport.status}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-6 bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                        {selectedReport.type.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">Type: {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)} Chart</p>
                        <p className="text-white/70 text-sm">Created: {formatDate(selectedReport.date)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-white/80 mb-2 font-medium">Description</h4>
                      <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10">
                        {selectedReport.description}
                      </div>
                    </div>
                    
                    <div className="bg-black/20 rounded-lg p-6 border border-white/5">
                      {getChartPreview(selectedReport)}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-8">
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/10 text-white/80 rounded-lg transition-all"
                      onClick={() => {/* Edit report functionality */}}
                    >
                      Edit Report
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg transition-all"
                      onClick={() => {/* Print report functionality */}}
                    >
                      Print Report
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg transition-all"
                      onClick={() => setIsDetailsModalOpen(false)}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Generate New Report Modal */}
      <AnimatePresence>
        {isGenerateModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGenerateModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-[#0c1524] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">Generate New Report</h2>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsGenerateModalOpen(false)}
                      className="text-white/50 hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Report Title</label>
                        <input
                          type="text"
                          name="title"
                          value={newReport.title}
                          onChange={handleNewReportChange}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Report Type</label>
                        <select
                          name="type"
                          value={newReport.type}
                          onChange={handleNewReportChange}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                        >
                          {reportTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Description</label>
                        <textarea
                          name="description"
                          value={newReport.description}
                          onChange={handleNewReportChange}
                          rows="3"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Status</label>
                        <select
                          name="status"
                          value={newReport.status}
                          onChange={handleNewReportChange}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 rounded-lg p-6 border border-white/5">
                      <h4 className="text-white/80 mb-4 font-medium">Preview</h4>
                      {getChartPreview(newReport)}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-8">
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/10 text-white/80 rounded-lg transition-all"
                      onClick={() => setIsGenerateModalOpen(false)}
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/10 text-white/80 rounded-lg transition-all"
                      onClick={handleGenerateReport}
                    >
                      Generate
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Reports; 