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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  
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

  // Handle chart data change
  const handleChartDataChange = (e, index) => {
    const { value } = e.target;
    const newValue = parseInt(value, 10) || 0;
    
    setNewReport(prev => {
      const newData = {...prev.data};
      newData.datasets[0].data[index] = newValue;
      return {
        ...prev,
        data: newData
      };
    });
  };

  // Handle label change
  const handleLabelChange = (e, index) => {
    const { value } = e.target;
    
    setNewReport(prev => {
      const newData = {...prev.data};
      newData.labels[index] = value;
      return {
        ...prev,
        data: newData
      };
    });
  };

  // Handle edit report
  const handleEditReport = (report) => {
    setEditingReport({...report});
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  // Handle print report
  const handlePrintReport = (report) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Determine which chart SVG to use based on report type
    let chartSvg = '';
    
    switch(report.type) {
      case 'line':
        chartSvg = `
          <svg width="100%" height="300" viewBox="0 0 600 300" style="background-color: #f9fafb; border-radius: 8px;">
            <polyline
              points="${report.data.datasets[0].data.map((value, i) => {
                const x = (i / (report.data.labels.length - 1)) * 600;
                return `${x},${300 - (value / 100) * 300}`;
              }).join(' ')}"
              fill="none"
              stroke="#3b82f6"
              stroke-width="3"
            />
            ${report.data.labels.map((label, i) => {
              const x = (i / (report.data.labels.length - 1)) * 600;
              return `
                <text x="${x}" y="320" text-anchor="middle" font-size="12" fill="#6b7280">${label}</text>
                <circle cx="${x}" cy="${300 - (report.data.datasets[0].data[i] / 100) * 300}" r="4" fill="#3b82f6" />
              `;
            }).join('')}
          </svg>
        `;
        break;
        
      case 'bar':
        const barWidth = 500 / report.data.datasets[0].data.length;
        chartSvg = `
          <svg width="100%" height="300" viewBox="0 0 600 300" style="background-color: #f9fafb; border-radius: 8px;">
            ${report.data.datasets[0].data.map((value, i) => {
              const x = (i * barWidth) + 50;
              const height = (value / 100) * 250;
              return `
                <rect x="${x}" y="${300 - height}" width="${barWidth * 0.8}" height="${height}" fill="#3b82f6" rx="4" />
                <text x="${x + (barWidth * 0.4)}" y="320" text-anchor="middle" font-size="12" fill="#6b7280">${report.data.labels[i]}</text>
              `;
            }).join('')}
          </svg>
        `;
        break;
        
      case 'pie':
        let total = report.data.datasets[0].data.reduce((a, b) => a + b, 0);
        let startAngle = 0;
        
        chartSvg = `
          <svg width="100%" height="300" viewBox="0 0 600 300" style="background-color: #f9fafb; border-radius: 8px;">
            <g transform="translate(300, 150)">
              ${report.data.datasets[0].data.map((value, i) => {
                const percentage = value / total;
                const endAngle = startAngle + percentage * Math.PI * 2;
                
                // Calculate the path for the pie slice
                const x1 = Math.cos(startAngle) * 100;
                const y1 = Math.sin(startAngle) * 100;
                const x2 = Math.cos(endAngle) * 100;
                const y2 = Math.sin(endAngle) * 100;
                
                const largeArcFlag = percentage > 0.5 ? 1 : 0;
                
                const pathData = `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                
                const slice = `
                  <path
                    d="${pathData}"
                    fill="${report.data.datasets[0].backgroundColor[i] || `hsl(${i * 50}, 70%, 60%)`}"
                    stroke="#fff"
                    stroke-width="1"
                  />
                `;
                
                // Calculate position for the label
                const labelAngle = startAngle + (percentage * Math.PI);
                const labelX = Math.cos(labelAngle) * 60;
                const labelY = Math.sin(labelAngle) * 60;
                
                const label = `
                  <text
                    x="${labelX}"
                    y="${labelY}"
                    text-anchor="middle"
                    fill="#fff"
                    font-size="12"
                  >${report.data.labels[i]}</text>
                `;
                
                startAngle = endAngle;
                return slice + label;
              }).join('')}
            </g>
          </svg>
        `;
        break;
        
      case 'donut':
        // Similar to pie but with inner circle
        total = report.data.datasets[0].data.reduce((a, b) => a + b, 0);
        startAngle = 0;
        
        chartSvg = `
          <svg width="100%" height="300" viewBox="0 0 600 300" style="background-color: #f9fafb; border-radius: 8px;">
            <g transform="translate(300, 150)">
              ${report.data.datasets[0].data.map((value, i) => {
                const percentage = value / total;
                const endAngle = startAngle + percentage * Math.PI * 2;
                
                // Calculate the path for the donut slice
                const innerRadius = 50;
                const outerRadius = 100;
                
                const x1 = Math.cos(startAngle) * outerRadius;
                const y1 = Math.sin(startAngle) * outerRadius;
                const x2 = Math.cos(endAngle) * outerRadius;
                const y2 = Math.sin(endAngle) * outerRadius;
                
                const x3 = Math.cos(endAngle) * innerRadius;
                const y3 = Math.sin(endAngle) * innerRadius;
                const x4 = Math.cos(startAngle) * innerRadius;
                const y4 = Math.sin(startAngle) * innerRadius;
                
                const largeArcFlag = percentage > 0.5 ? 1 : 0;
                
                const pathData = `
                  M ${x1} ${y1}
                  A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                  L ${x3} ${y3}
                  A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
                  Z
                `;
                
                const slice = `
                  <path
                    d="${pathData}"
                    fill="${report.data.datasets[0].backgroundColor[i] || `hsl(${i * 50}, 70%, 60%)`}"
                    stroke="#fff"
                    stroke-width="1"
                  />
                `;
                
                // Calculate position for the label
                const labelAngle = startAngle + (percentage * Math.PI);
                const labelX = Math.cos(labelAngle) * 75;
                const labelY = Math.sin(labelAngle) * 75;
                
                const label = `
                  <text
                    x="${labelX}"
                    y="${labelY}"
                    text-anchor="middle"
                    fill="#fff"
                    font-size="12"
                  >${report.data.labels[i]}</text>
                `;
                
                startAngle = endAngle;
                return slice + label;
              }).join('')}
            </g>
          </svg>
        `;
        break;
        
      case 'radar':
        // Radar chart
        chartSvg = `
          <svg width="100%" height="300" viewBox="0 0 600 300" style="background-color: #f9fafb; border-radius: 8px;">
            <g transform="translate(300, 150)">
              <!-- Background circles -->
              <circle cx="0" cy="0" r="100" fill="none" stroke="#e5e7eb" stroke-width="1" />
              <circle cx="0" cy="0" r="75" fill="none" stroke="#e5e7eb" stroke-width="1" />
              <circle cx="0" cy="0" r="50" fill="none" stroke="#e5e7eb" stroke-width="1" />
              <circle cx="0" cy="0" r="25" fill="none" stroke="#e5e7eb" stroke-width="1" />
              
              <!-- Axis lines -->
              ${report.data.labels.map((_, i) => {
                const angle = (i / report.data.labels.length) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 100;
                const y = Math.sin(angle) * 100;
                return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#e5e7eb" stroke-width="1" />`;
              }).join('')}
              
              <!-- Data -->
              ${report.data.datasets.map((dataset, datasetIndex) => {
                const points = dataset.data.map((value, i) => {
                  const angle = (i / dataset.data.length) * Math.PI * 2 - Math.PI / 2;
                  const distance = (value / 100) * 100;
                  const x = Math.cos(angle) * distance;
                  const y = Math.sin(angle) * distance;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ') + ' Z';
                
                return `
                  <path
                    d="${points}"
                    fill="rgba(59, 130, 246, 0.2)"
                    stroke="${dataset.borderColor || '#3b82f6'}"
                    stroke-width="2"
                  />
                `;
              }).join('')}
              
              <!-- Labels -->
              ${report.data.labels.map((label, i) => {
                const angle = (i / report.data.labels.length) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 120;
                const y = Math.sin(angle) * 120;
                return `
                  <text
                    x="${x}"
                    y="${y}"
                    text-anchor="middle"
                    fill="#6b7280"
                    font-size="12"
                  >${label}</text>
                `;
              }).join('')}
            </g>
          </svg>
        `;
        break;
        
      default:
        chartSvg = '<div>Chart preview not available</div>';
    }
    
    // Write the HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${report.title} - Report</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .report-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e5e7eb;
            }
            .report-title {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 10px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 14px;
              font-weight: 500;
              background-color: ${report.status === 'published' ? '#dcfce7' : '#f3f4f6'};
              color: ${report.status === 'published' ? '#166534' : '#4b5563'};
            }
            .meta {
              display: flex;
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f9fafb;
              border-radius: 8px;
            }
            .meta-item {
              flex: 1;
            }
            .meta-label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            .meta-value {
              font-weight: 500;
            }
            .description {
              margin-bottom: 30px;
              padding: 15px;
              background-color: #f9fafb;
              border-radius: 8px;
            }
            .chart-container {
              margin-bottom: 30px;
              padding: 20px;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <div class="report-title">${report.title}</div>
            <div class="status-badge">${report.status}</div>
          </div>
          
          <div class="meta">
            <div class="meta-item">
              <div class="meta-label">Report Type</div>
              <div class="meta-value">${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Chart</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Generated On</div>
              <div class="meta-value">${formatDate(report.date)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Category</div>
              <div class="meta-value">${report.category || 'General'}</div>
            </div>
          </div>
          
          <div class="description">
            <strong>Description:</strong>
            <p>${report.description}</p>
          </div>
          
          <div class="chart-container">
            ${chartSvg}
          </div>
          
          <div class="footer">
            Generated on ${new Date().toLocaleString()} | Medical Records Management System
          </div>
        </body>
      </html>
    `);
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Get chart preview for the UI
  const getChartPreview = (report) => {
    if (!report || !report.type) return null;
    
    switch(report.type) {
      case 'line':
        return (
          <div className="h-40 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 120 80">
              <path
                d="M10 70 L30 50 L50 60 L70 30 L90 40 L110 20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <circle cx="10" cy="70" r="3" fill="#3b82f6" />
              <circle cx="30" cy="50" r="3" fill="#3b82f6" />
              <circle cx="50" cy="60" r="3" fill="#3b82f6" />
              <circle cx="70" cy="30" r="3" fill="#3b82f6" />
              <circle cx="90" cy="40" r="3" fill="#3b82f6" />
              <circle cx="110" cy="20" r="3" fill="#3b82f6" />
            </svg>
          </div>
        );
      
      case 'bar':
        return (
          <div className="h-40 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 120 80">
              <rect x="10" y="20" width="15" height="60" fill="#3b82f6" rx="2" />
              <rect x="30" y="30" width="15" height="50" fill="#3b82f6" rx="2" />
              <rect x="50" y="40" width="15" height="40" fill="#3b82f6" rx="2" />
              <rect x="70" y="10" width="15" height="70" fill="#3b82f6" rx="2" />
              <rect x="90" y="25" width="15" height="55" fill="#3b82f6" rx="2" />
            </svg>
          </div>
        );
      
      case 'pie':
        return (
          <div className="h-40 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <path d="M60 60 L60 10 A50 50 0 0 1 110 60 Z" fill="#3b82f6" />
              <path d="M60 60 L110 60 A50 50 0 0 1 60 110 Z" fill="#10b981" />
              <path d="M60 60 L60 110 A50 50 0 0 1 10 60 Z" fill="#f59e0b" />
              <path d="M60 60 L10 60 A50 50 0 0 1 60 10 Z" fill="#8b5cf6" />
            </svg>
          </div>
        );
      
      case 'donut':
        return (
          <div className="h-40 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="20" />
              <circle cx="60" cy="60" r="25" fill="none" stroke="#1e40af" strokeWidth="20" />
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
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ') + ' Z';
                
                return (
                  <path 
                    key={datasetIndex}
                    d={points}
                    fill="rgba(59, 130, 246, 0.2)"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
        );
      
      default:
        return <div className="h-40 flex items-center justify-center text-white/50">Chart preview not available</div>;
    }
  };

  // Generate a new report
  const handleGenerateReport = () => {
    // Create a new report object
    const newReportObj = {
      id: reports.length + 1,
      title: newReport.title,
      description: newReport.description,
      type: newReport.type,
      category: 'general',
      status: newReport.status,
      date: new Date().toISOString().split('T')[0],
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
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
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
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Reports Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredReports.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="col-span-full text-center py-12"
          >
            <div className="text-white/50 text-lg">No reports found</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          filteredReports.map(report => (
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
                      onClick={() => handleEditReport(selectedReport)}
                    >
                      Edit Report
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg transition-all"
                      onClick={() => handlePrintReport(selectedReport)}
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

      {/* Edit Report Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingReport && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
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
                    <h2 className="text-2xl font-bold text-blue-400">Edit Report</h2>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsEditModalOpen(false)}
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