import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import medicalRecordsData, { recordTypes, statusOptions, fileTypes } from '../data/medicalRecordsData';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const fileInputRef = useRef(null);  
  
  const [newRecord, setNewRecord] = useState({
    patientName: '',
    patientId: '',
    recordType: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    title: '',
    content: '',
    status: 'active',
    attachments: []
  });
  
  // Define all record types including the ones from the dropdown
  const allRecordTypes = [
    { value: "all", label: "All Record Types" },
    { value: "diagnosis", label: "Diagnosis" },
    { value: "prescription", label: "Prescription" },
    { value: "labresults", label: "Lab Results" },
    { value: "surgery", label: "Surgery" },
    { value: "vaccination", label: "Vaccination" },
    { value: "imaging", label: "Imaging" },
    { value: "consultation", label: "Consultation" },
    { value: "followup", label: "Follow-up" }
  ];

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

  // Load records data
  useEffect(() => {
    setRecords(medicalRecordsData);
  }, []);

  // Filter records based on search term, type and status
  useEffect(() => {
    let filtered = [...records];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(record => 
        record.recordType.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredRecords(filtered);
  }, [records, searchTerm, typeFilter, statusFilter]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusMap = {
      'completed': 'green',
      'pending': 'yellow',
      'active': 'blue',
      'cancelled': 'red'
    };
    return statusMap[status] || 'gray';
  };

  // View record details
  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailsModalOpen(true);
  };

  // Get file icon based on file type
  const getFileIcon = (type) => {
    const iconMap = {
      'pdf': (
        <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      'image': (
        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ),
      'zip': (
        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      'doc': (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    };
    
    return iconMap[type] || (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  };

  // Handle new record form change
  const handleNewRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const newAttachments = files.map((file, index) => {
      // Determine file type
      let type = 'doc';
      if (file.type.includes('pdf')) type = 'pdf';
      else if (file.type.includes('image')) type = 'image';
      else if (file.type.includes('zip') || file.name.endsWith('.zip')) type = 'zip';
      
      return {
        id: Date.now() + index,
        name: file.name,
        type,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
    });
    
    setNewRecord(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setNewRecord(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== id)
    }));
  };

  // Save new record
  const saveNewRecord = () => {
    const newId = Math.max(...records.map(r => r.id)) + 1;
    
    const recordToAdd = {
      ...newRecord,
      id: newId,
      date: new Date().toISOString().split('T')[0]
    };
    
    setRecords(prev => [...prev, recordToAdd]);
    
    // Reset form
    setNewRecord({
      patientName: '',
      patientId: '',
      recordType: '',
      date: new Date().toISOString().split('T')[0],
      doctor: '',
      title: '',
      content: '',
      status: 'active',
      attachments: []
    });
    
    setIsAddRecordModalOpen(false);
  };

  // Handle download attachment
  const handleDownloadAttachment = (attachment) => {
    // In a real application, this would trigger a file download
    console.log(`Downloading: ${attachment.name}`);
    
    // Create a mock download by creating a temporary anchor element
    const link = document.createElement('a');
    link.href = `#${attachment.name}`; // In a real app, this would be a URL to the file
    link.setAttribute('download', attachment.name);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show notification
    alert(`Downloading ${attachment.name}`);
  };

  // Handle edit record
  const handleEditRecord = (record) => {
    // Set up the edit form with the current record data
    setNewRecord({
      ...record,
      // Make a deep copy of attachments to avoid reference issues
      attachments: [...record.attachments]
    });
    
    // Close details modal and open the add/edit modal
    setIsDetailsModalOpen(false);
    setIsAddRecordModalOpen(true);
  };

  // Handle print record
  const handlePrintRecord = (record) => {
    // Create a printable version of the record
    const printContent = `
      <html>
        <head>
          <title>Medical Record - ${record.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; }
            .record-header { display: flex; justify-content: space-between; }
            .status { color: #10b981; font-weight: bold; }
            .content { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
            .attachments { margin-top: 20px; }
            .attachment { padding: 5px 0; }
          </style>
        </head>
        <body>
          <h1>${record.title}</h1>
          <div class="record-header">
            <div>
              <p><strong>Patient:</strong> ${record.patientName}</p>
              <p><strong>Patient ID:</strong> #${record.patientId}</p>
            </div>
            <div>
              <p><strong>Doctor:</strong> ${record.doctor}</p>
              <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span class="status">${record.status}</span></p>
            </div>
          </div>
          <h2>Record Content</h2>
          <div class="content">${record.content}</div>
          ${record.attachments && record.attachments.length > 0 ? `
            <h2>Attachments</h2>
            <div class="attachments">
              ${record.attachments.map(att => `
                <div class="attachment">
                  <p>${att.name} (${att.size})</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;
    
    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-full"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Medical Records Management</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddRecordModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Record</span>
          </motion.button>
        </div>

        {/* AI Insight Card */}
        

        {/* Search and Filters */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 space-y-4"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient name, age, or gender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
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

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${typeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              All
            </button>
            {recordTypes.map(type => (
              <button 
                key={type}
                onClick={() => setTypeFilter(type.toLowerCase())}
                className={`px-4 py-2 rounded-lg transition-all ${typeFilter === type.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
              >
                {type}
              </button>
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

        {/* Records List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredRecords.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="col-span-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
            >
              <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">No records found</h3>
              <p className="text-white/60">Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            filteredRecords.map((record) => (
              <motion.div 
                key={record.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.2)"
                }}
                onClick={() => viewRecordDetails(record)}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                      {record.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{record.title}</h3>
                      <p className="text-white/60 text-sm">{record.patientName}</p>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <p className="text-white/70 text-sm line-clamp-2 mb-3">
                      {record.content.substring(0, 100)}...
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/50 text-sm">
                      {formatDate(record.date)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                        {record.recordType}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full bg-${getStatusColor(record.status)}-500/20 text-${getStatusColor(record.status)}-400 text-xs capitalize`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Record Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedRecord && (
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
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-xl shadow-[0_0_25px_rgba(59,130,246,0.3)] w-full max-w-3xl relative z-10 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                      Medical Record Details
                    </span>
                  </h2>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white text-lg font-medium">{selectedRecord.title}</h3>
                    <div className={`px-3 py-1 rounded-full bg-${getStatusColor(selectedRecord.status)}-500/20 text-${getStatusColor(selectedRecord.status)}-400 capitalize`}>
                      {selectedRecord.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-6 bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                      {selectedRecord.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedRecord.patientName}</p>
                      <p className="text-white/70 text-sm">Patient ID: #{selectedRecord.patientId}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-white/70">Doctor: {selectedRecord.doctor}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-white/80 mb-2 font-medium">Record Content</h4>
                    <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10">
                      {selectedRecord.content}
                    </div>
                  </div>
                  
                  {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                    <div>
                      <h4 className="text-white/80 mb-2 font-medium">Attachments</h4>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedRecord.attachments.map((attachment) => (
                            <motion.div 
                              key={attachment.id} 
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                              className="flex items-center bg-black/30 p-3 rounded-lg text-white/80 transition-colors cursor-pointer border border-white/5"
                            >
                              {getFileIcon(attachment.type)}
                              <div className="ml-3 flex-1">
                                <p className="text-white text-sm font-medium">{attachment.name}</p>
                                <p className="text-white/50 text-xs">{attachment.size}</p>
                              </div>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent modal from closing
                                  handleDownloadAttachment(attachment);
                                }}
                              >
                                Download
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/10 text-white/80 rounded-lg transition-all"
                    onClick={() => handleEditRecord(selectedRecord)}
                  >
                    Edit Record
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg transition-all"
                    onClick={() => handlePrintRecord(selectedRecord)}
                  >
                    Print Record
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Record Modal */}
      <AnimatePresence>
        {isAddRecordModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddRecordModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
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
                    <h2 className="text-2xl font-bold text-blue-400">Add New Medical Record</h2>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsAddRecordModalOpen(false)}
                      className="text-white/50 hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); saveNewRecord(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Patient Name</label>
                        <input
                          type="text"
                          name="patientName"
                          value={newRecord.patientName}
                          onChange={handleNewRecordChange}
                          placeholder="James Miller"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Patient ID</label>
                        <input
                          type="text"
                          name="patientId"
                          value={newRecord.patientId}
                          onChange={handleNewRecordChange}
                          placeholder="#6"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Record Type</label>
                        <select
                          name="recordType"
                          value={newRecord.recordType}
                          onChange={handleNewRecordChange}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        >
                          <option value="" disabled>Select record type</option>
                          {recordTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Doctor</label>
                        <input
                          type="text"
                          name="doctor"
                          value={newRecord.doctor}
                          onChange={handleNewRecordChange}
                          placeholder="Dr. John Doe"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={newRecord.title}
                          onChange={handleNewRecordChange}
                          placeholder="Medical Report"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Content</label>
                        <textarea
                          name="content"
                          value={newRecord.content}
                          onChange={handleNewRecordChange}
                          placeholder="Enter the content of the record here..."
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Status</label>
                        <select
                          name="status"
                          value={newRecord.status}
                          onChange={handleNewRecordChange}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        >
                          <option value="" disabled>Select status</option>
                          {statusOptions.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/70 mb-2 text-sm">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={newRecord.date}
                          onChange={handleNewRecordChange}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                   text-white focus:border-blue-500/50 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-white/70 mb-2 text-sm">Attachments</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileUpload}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                                 text-white focus:border-blue-500/50 focus:ring-2 
                                 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    
                    <div className="mt-6">
                      <button type="submit" className="w-full px-4 py-2.5 rounded-xl bg-blue-500 text-white font-semibold">
                        Add Record
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MedicalRecords; 