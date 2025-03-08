import React, { useState, useEffect } from 'react';
import medicalRecordsData, { recordTypes, statusOptions, fileTypes } from '../data/medicalRecordsData';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
      filtered = filtered.filter(record => record.recordType === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredRecords(filtered);
  }, [records, searchTerm, typeFilter, statusFilter]);

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (!statusOption) return 'gray';
    return statusOption.color;
  };

  // View record details
  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
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

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'zip':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 h-full overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Medical Records</h1>
          <p className="text-white/70">View and manage patient medical records</p>
        </div>

        <button 
          type="button" 
          className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Record
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
            placeholder="Search records..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all" className="bg-gray-800">All Record Types</option>
          {recordTypes.map((type, index) => (
            <option key={index} value={type} className="bg-gray-800">
              {type}
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

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-black/20 rounded-xl p-10 text-center border border-white/5">
            <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No records found</h3>
            <p className="text-white/70">Try changing your filters or add a new record</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div 
              key={record.id} 
              className="bg-black/20 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              onClick={() => viewRecordDetails(record)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <div className={`w-2 h-2 rounded-full bg-${getStatusColor(record.status)}-500 mr-2`}></div>
                    <span className="text-white/70 text-sm">{formatDate(record.date)}</span>
                    <span className="mx-2 text-white/50">•</span>
                    <span className={`text-${getStatusColor(record.status)}-400 text-sm capitalize`}>{record.status}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{record.title}</h3>
                  <div className="flex items-center text-white/70 text-sm mt-1">
                    <span className="bg-black/30 px-2 py-1 rounded-md">{record.recordType}</span>
                    <span className="mx-2">•</span>
                    <span>{record.doctor}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                    {record.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{record.patientName}</p>
                    <p className="text-white/70 text-sm">Patient ID: #{record.patientId}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-white/80 text-sm mb-4 line-clamp-2">
                {record.content}
              </div>
              
              {record.attachments && record.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {record.attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center bg-black/30 px-3 py-1.5 rounded-lg text-white/80 text-sm hover:bg-black/40 transition-colors"
                    >
                      {getFileIcon(attachment.type)}
                      <span className="ml-2">{attachment.name}</span>
                      <span className="ml-2 text-white/50 text-xs">{attachment.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Record Details Modal */}
      {isDetailsModalOpen && selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-3xl relative z-10 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Medical Record Details</h2>
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
                  <h3 className="text-xl font-semibold text-white">{selectedRecord.title}</h3>
                  <div className="flex items-center text-white/70 text-sm mt-1">
                    <span className="bg-black/30 px-2 py-1 rounded-md">{selectedRecord.recordType}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(selectedRecord.date)}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full bg-${getStatusColor(selectedRecord.status)}-500/20 text-${getStatusColor(selectedRecord.status)}-400 capitalize`}>
                  {selectedRecord.status}
                </div>
              </div>
              
              <div className="flex items-center mb-6 bg-black/20 p-3 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                  {selectedRecord.patientName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedRecord.patientName}</p>
                  <p className="text-white/70 text-sm">Patient ID: #{selectedRecord.patientId}</p>
                </div>
                <div className="ml-auto text-white/70 text-sm">
                  <p>Doctor: {selectedRecord.doctor}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-white/80 mb-2 font-medium">Record Content</h4>
                <div className="bg-black/20 rounded-lg px-4 py-3 text-white/90 border border-white/5">
                  {selectedRecord.content}
                </div>
              </div>
              
              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <h4 className="text-white/80 mb-2 font-medium">Attachments</h4>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedRecord.attachments.map((attachment) => (
                        <div 
                          key={attachment.id} 
                          className="flex items-center bg-black/30 p-3 rounded-lg text-white/80 hover:bg-black/40 transition-colors cursor-pointer"
                        >
                          {getFileIcon(attachment.type)}
                          <div className="ml-3 flex-1">
                            <p className="text-white text-sm font-medium">{attachment.name}</p>
                            <p className="text-white/50 text-xs">{attachment.size}</p>
                          </div>
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/15 hover:text-white transition-colors">
                Edit Record
              </button>
              <button className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
                Print Record
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

export default MedicalRecords; 