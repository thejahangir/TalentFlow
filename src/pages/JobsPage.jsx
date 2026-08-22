import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Filter, MoreVertical, Briefcase, MapPin, 
  Users, Clock, CheckCircle, AlertCircle, Calendar, 
  ChevronDown, ArrowUpRight, Copy, Edit, Trash2, X, UploadCloud, Send
} from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';

const MOCK_JOBS = [
  { id: 1, title: 'Senior AI Research Scientist', department: 'Engineering', location: 'Bangalore, India', type: 'Full-time', status: 'Published', applicants: 450, newApplicants: 184, postedDate: '2026-08-10', hiringManager: 'Amit Sharma', score: 98 },
  { id: 2, title: 'Frontend Engineer (React)', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Published', applicants: 105, newApplicants: 45, postedDate: '2026-08-12', hiringManager: 'Priya Patel', score: 92 },
  { id: 3, title: 'Product Design Lead', department: 'Design', location: 'San Francisco, CA', type: 'Hybrid', status: 'Draft', applicants: 0, newApplicants: 0, postedDate: '2026-08-20', hiringManager: 'Sarah Jenkins', score: 0 },
  { id: 4, title: 'VP of Marketing', department: 'Marketing', location: 'New York, NY', type: 'Full-time', status: 'Closed', applicants: 89, newApplicants: 0, postedDate: '2026-07-01', hiringManager: 'David Chen', score: 100 },
  { id: 5, title: 'Data Engineer', department: 'Data Science', location: 'London, UK', type: 'Full-time', status: 'Internal', applicants: 12, newApplicants: 2, postedDate: '2026-08-18', hiringManager: 'Amit Sharma', score: 85 },
  { id: 6, title: 'Backend Developer (Node.js)', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Published', applicants: 320, newApplicants: 12, postedDate: '2026-08-15', hiringManager: 'Priya Patel', score: 88 },
  { id: 7, title: 'UX Researcher', department: 'Design', location: 'London, UK', type: 'Contract', status: 'Published', applicants: 156, newApplicants: 30, postedDate: '2026-08-16', hiringManager: 'Sarah Jenkins', score: 95 },
  { id: 8, title: 'Sales Director', department: 'Sales', location: 'San Francisco, CA', type: 'Full-time', status: 'Internal', applicants: 45, newApplicants: 5, postedDate: '2026-08-10', hiringManager: 'David Chen', score: 82 },
  { id: 9, title: 'DevOps Engineer', department: 'Engineering', location: 'Bangalore, India', type: 'Hybrid', status: 'Published', applicants: 210, newApplicants: 50, postedDate: '2026-08-19', hiringManager: 'Amit Sharma', score: 90 },
  { id: 10, title: 'HR Manager', department: 'Human Resources', location: 'New York, NY', type: 'Full-time', status: 'Draft', applicants: 0, newApplicants: 0, postedDate: '2026-08-21', hiringManager: 'Michael Lee', score: 0 },
  { id: 11, title: 'Product Manager', department: 'Product', location: 'Remote', type: 'Full-time', status: 'Published', applicants: 530, newApplicants: 80, postedDate: '2026-08-05', hiringManager: 'Sarah Jenkins', score: 91 },
  { id: 12, title: 'Customer Support Lead', department: 'Support', location: 'London, UK', type: 'Full-time', status: 'Closed', applicants: 180, newApplicants: 0, postedDate: '2026-07-15', hiringManager: 'David Chen', score: 85 },
  { id: 13, title: 'Security Analyst', department: 'IT', location: 'Remote', type: 'Contract', status: 'Published', applicants: 95, newApplicants: 15, postedDate: '2026-08-18', hiringManager: 'Amit Sharma', score: 89 },
  { id: 14, title: 'Content Writer', department: 'Marketing', location: 'New York, NY', type: 'Part-time', status: 'Published', applicants: 400, newApplicants: 120, postedDate: '2026-08-12', hiringManager: 'Priya Patel', score: 93 },
  { id: 15, title: 'QA Automation Engineer', department: 'Engineering', location: 'Bangalore, India', type: 'Full-time', status: 'Draft', applicants: 0, newApplicants: 0, postedDate: '2026-08-22', hiringManager: 'Michael Lee', score: 0 }
];

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const [isSendAgencyModalOpen, setIsSendAgencyModalOpen] = useState(false);
  const [selectedJobForAgency, setSelectedJobForAgency] = useState(null);
  const [sendAgencyData, setSendAgencyData] = useState({ agency: '', message: '' });
  const [customAlert, setCustomAlert] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [editingJobId, setEditingJobId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const handleClickOutside = () => setOpenActionMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  const [newJobData, setNewJobData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    hiringManager: '',
    jdText: '',
    jdFile: null
  });

  const validate = () => {
    const newErrors = {};
    if (!newJobData.title.trim()) newErrors.title = 'Job Title is required';
    if (!newJobData.department.trim()) newErrors.department = 'Department is required';
    if (!newJobData.location.trim()) newErrors.location = 'Location is required';
    if (!newJobData.hiringManager.trim()) newErrors.hiringManager = 'Hiring Manager is required';
    if (!newJobData.jdText.trim() && !newJobData.jdFile) newErrors.jd = 'Job Description or Document is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingJobId(null);
    setNewJobData({title: '', department: '', location: '', type: 'Full-time', hiringManager: '', jdText: '', jdFile: null});
    setErrors({});
  };
  
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'bg-[#00A76F]/10 text-[#00A76F]';
      case 'Draft': return 'bg-[#FFC107]/10 text-[#b78103] dark:text-[#FFC107]';
      case 'Closed': return 'bg-[#FF5630]/10 text-[#FF5630]';
      case 'Internal': return 'bg-[#1890FF]/10 text-[#1890FF]';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <>
      <div className="p-6 space-y-6 relative">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#212b36] dark:text-white">List of Jobs</h1>
          <p className="text-sm text-[#637381] dark:text-gray-400 mt-1">Manage and track all open requisitions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800/50 text-[#212b36] dark:text-white rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
            <ArrowUpRight size={16} /> Export
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] rounded-lg text-sm font-bold shadow-sm hover:bg-[#161c24] dark:hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Create Job
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Active Jobs', value: '34', icon: Briefcase, color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },
          { label: 'Total Candidates', value: '12,450', icon: Users, color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10' },
          { label: 'Pending Reviews', value: '84', icon: Clock, color: 'text-[#FFC107]', bg: 'bg-[#FFC107]/10' },
          { label: 'Interviews This Week', value: '12', icon: Calendar, color: 'text-[#8E33FF]', bg: 'bg-[#8E33FF]/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#212b36] dark:text-white">{stat.value}</h3>
              <p className="text-sm font-medium text-[#637381] dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-[#161c24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          {['All', 'Published', 'Draft', 'Internal', 'Closed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                statusFilter === status 
                  ? 'bg-[#212b36] dark:bg-white text-white dark:text-[#212b36]' 
                  : 'bg-gray-50 dark:bg-gray-800/50 text-[#637381] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-sm focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none text-[#212b36] dark:text-white transition-all"
            />
          </div>
          <button className="px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-[#637381] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800/50">
                <th className="px-6 py-4 text-xs font-bold text-[#637381] dark:text-gray-400 uppercase tracking-wider">Job Details</th>
                <th className="px-6 py-4 text-xs font-bold text-[#637381] dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#637381] dark:text-gray-400 uppercase tracking-wider">Active Candidates</th>
                <th className="px-6 py-4 text-xs font-bold text-[#637381] dark:text-gray-400 uppercase tracking-wider">Hiring Manager</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-[#637381] dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {paginatedJobs.length > 0 ? paginatedJobs.map((job, index) => (
                <tr 
                  key={job.id} 
                  onClick={() => navigate('/dashboard/agencies')}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#1890FF] shrink-0">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors cursor-pointer">{job.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs font-medium text-[#637381] dark:text-gray-400">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                          <span>{job.department}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(job.status)} flex inline-flex items-center gap-1.5 w-fit`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {job.status}
                    </span>
                    <p className="text-[11px] text-[#637381] dark:text-gray-500 mt-1.5 font-medium">Posted: {job.postedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {job.applicants === 0 ? (
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-[#161c24] flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
                          N/A
                        </div>
                      ) : (
                        <div className="flex -space-x-2">
                           {job.applicants > 2 && (
                             <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-[#161c24] flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 z-30">
                               +{job.applicants - 2 > 99 ? '99' : job.applicants - 2}
                             </div>
                           )}
                           <img src={`https://i.pravatar.cc/150?u=${job.id + 1}`} alt="Candidate" className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#161c24] z-20 object-cover" />
                           {job.applicants > 1 && (
                             <img src={`https://i.pravatar.cc/150?u=${job.id + 2}`} alt="Candidate" className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#161c24] z-10 object-cover" />
                           )}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-[#212b36] dark:text-white">{job.applicants.toLocaleString()}</div>
                        {job.newApplicants > 0 && (
                          <div className="text-[11px] font-bold text-[#00A76F]">+{job.newApplicants} new</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1890FF]/20 text-[#1890FF] flex items-center justify-center text-[10px] font-bold">
                        {job.hiringManager.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-[#212b36] dark:text-gray-300">{job.hiringManager}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionMenuId(openActionMenuId === job.id ? null : job.id);
                        }}
                        className="p-2 text-[#637381] hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                        title="Actions"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openActionMenuId === job.id && (
                        <div className={`absolute right-0 ${index >= paginatedJobs.length - 2 && paginatedJobs.length > 2 ? 'bottom-full mb-1' : 'top-10 mt-1'} w-48 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1 animate-fade-in`}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJobForAgency(job);
                              setIsSendAgencyModalOpen(true);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-[#00A76F] hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Send size={14} />
                            Send to Agency
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Copy size={14} />
                            Copy Link
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(null);
                              setEditingJobId(job.id);
                              setNewJobData({
                                title: job.title,
                                department: job.department,
                                location: job.location,
                                type: job.type,
                                hiringManager: job.hiringManager,
                                jdText: job.jdText || '',
                                jdFile: null
                              });
                              setIsCreateModalOpen(true);
                            }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Edit size={14} />
                            Edit Job
                          </button>
                          <div className="my-1 border-t border-gray-100 dark:border-gray-800/50"></div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Briefcase size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-1">No jobs found</h3>
                      <p className="text-[#637381] dark:text-gray-400 text-sm max-w-sm">
                        We couldn't find any jobs matching your current search and filter criteria.
                      </p>
                      <button className="mt-4 text-[#1890FF] font-bold text-sm hover:underline" onClick={() => {setSearchQuery(''); setStatusFilter('All');}}>
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredJobs.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
            <span className="text-sm text-[#637381] dark:text-gray-400 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
            </span>
            <div className="flex gap-1 items-center">
              <span className="text-sm text-[#637381] dark:text-gray-400 font-medium mr-2">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Send to Agency Modal */}
      {isSendAgencyModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#212b36] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col scale-in-center">
            
            <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
              <h2 className="text-xl font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                <Send size={24} className="text-[#00A76F]" />
                Send to Agency
              </h2>
              <button 
                onClick={() => setIsSendAgencyModalOpen(false)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-visible space-y-4">
              <p className="text-sm text-[#637381] dark:text-gray-400">
                You are sending <span className="font-bold text-[#212b36] dark:text-white">{selectedJobForAgency?.title}</span> to an agency partner.
              </p>
              
              <div className="flex flex-col">
                <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Select Agency</label>
                <SearchableSelect 
                  options={[
                    { label: 'Adecco', value: 'Adecco' },
                    { label: 'Randstad', value: 'Randstad' },
                    { label: 'ManpowerGroup', value: 'ManpowerGroup' },
                    { label: 'Kelly Services', value: 'Kelly Services' }
                  ]}
                  value={sendAgencyData.agency}
                  onChange={(val) => setSendAgencyData({...sendAgencyData, agency: val})}
                  placeholder="Select an agency..."
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Message / Instructions</label>
                <textarea 
                  value={sendAgencyData.message}
                  onChange={(e) => setSendAgencyData({...sendAgencyData, message: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-0 focus:border-[#1890FF] transition-colors resize-y text-[#212b36] dark:text-white"
                  placeholder="Enter any specific requirements, priority notes, or guidelines..."
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/10 rounded-b-2xl">
              <button 
                onClick={() => setIsSendAgencyModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-[#637381] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                disabled={!sendAgencyData.agency}
                onClick={() => {
                  setCustomAlert({
                    title: 'Request Sent Successfully',
                    message: `Job "${selectedJobForAgency?.title}" has been sent to ${sendAgencyData.agency}!`
                  });
                  setIsSendAgencyModalOpen(false);
                  setSendAgencyData({ agency: '', message: '' });
                }}
                className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm transition-colors cursor-pointer ${sendAgencyData.agency ? 'bg-[#00A76F] hover:bg-[#00A76F]/90' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {customAlert && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#212b36] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col scale-in-center items-center text-center p-8 border border-gray-100 dark:border-gray-800/50">
            <div className="w-20 h-20 bg-[#00A76F]/10 text-[#00A76F] rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-[#212b36] dark:text-white mb-3">{customAlert.title}</h3>
            <p className="text-[#637381] dark:text-gray-400 mb-8 text-[15px] leading-relaxed">
              {customAlert.message}
            </p>
            <button 
              onClick={() => setCustomAlert(null)}
              className="w-full py-3.5 text-[15px] font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 rounded-xl shadow-[0_8px_16px_rgba(0,167,111,0.24)] transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800/50 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#212b36] dark:text-white">{editingJobId ? 'Edit Job' : 'Create New Job'}</h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex flex-col">
                <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Job Title</label>
                <input 
                  type="text" 
                  value={newJobData.title}
                  onChange={(e) => {
                    setNewJobData({...newJobData, title: e.target.value});
                    if (errors.title) setErrors({...errors, title: null});
                  }}
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.title ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
                  placeholder="e.g. Senior Frontend Engineer"
                />
                <div className="min-h-[20px] mt-1 flex items-start">
                  {errors.title && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.title}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Department</label>
                  <input 
                    type="text" 
                    value={newJobData.department}
                    onChange={(e) => {
                      setNewJobData({...newJobData, department: e.target.value});
                      if (errors.department) setErrors({...errors, department: null});
                    }}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.department ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
                    placeholder="e.g. Engineering"
                  />
                  <div className="min-h-[20px] mt-1 flex items-start">
                    {errors.department && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.department}</p>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Employment Type</label>
                  <select 
                    value={newJobData.type}
                    onChange={(e) => setNewJobData({...newJobData, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-0 focus:border-[#1890FF] transition-colors text-[#212b36] dark:text-white"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Hybrid</option>
                  </select>
                  <div className="min-h-[20px] mt-1"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Location</label>
                  <input 
                    type="text" 
                    value={newJobData.location}
                    onChange={(e) => {
                      setNewJobData({...newJobData, location: e.target.value});
                      if (errors.location) setErrors({...errors, location: null});
                    }}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.location ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
                    placeholder="e.g. San Francisco, CA or Remote"
                  />
                  <div className="min-h-[20px] mt-1 flex items-start">
                    {errors.location && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.location}</p>}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Hiring Manager</label>
                  <input 
                    type="text" 
                    value={newJobData.hiringManager}
                    onChange={(e) => {
                      setNewJobData({...newJobData, hiringManager: e.target.value});
                      if (errors.hiringManager) setErrors({...errors, hiringManager: null});
                    }}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.hiringManager ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
                    placeholder="e.g. Jane Doe"
                  />
                  <div className="min-h-[20px] mt-1 flex items-start">
                    {errors.hiringManager && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.hiringManager}</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5 flex justify-between items-center">
                  <span>Job Description</span>
                  <label className="text-xs font-bold text-[#1890FF] cursor-pointer hover:underline flex items-center gap-1">
                    <UploadCloud size={14} /> Upload Document (PDF, DOC, TXT)
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.txt" 
                      className="hidden" 
                      onChange={(e) => {
                        setNewJobData({...newJobData, jdFile: e.target.files[0]});
                        if (errors.jd) setErrors({...errors, jd: null});
                      }}
                    />
                  </label>
                </label>
                {newJobData.jdFile ? (
                  <div className="flex items-center justify-between p-3 bg-[#1890FF]/10 rounded-lg border border-[#1890FF]/20">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1890FF]">
                      <UploadCloud size={16} />
                      {newJobData.jdFile.name}
                    </div>
                    <button 
                      onClick={() => {
                        setNewJobData({...newJobData, jdFile: null});
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <textarea 
                    value={newJobData.jdText}
                    onChange={(e) => {
                      setNewJobData({...newJobData, jdText: e.target.value});
                      if (errors.jd) setErrors({...errors, jd: null});
                    }}
                    rows="4"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors resize-y ${errors.jd ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
                    placeholder="Paste job description here or click upload document above..."
                  ></textarea>
                )}
                <div className="min-h-[20px] mt-1 flex items-start">
                  {errors.jd && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.jd}</p>}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/10 rounded-b-2xl">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-bold text-[#637381] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (validate()) {
                    if (editingJobId) {
                      setJobs(jobs.map(j => j.id === editingJobId ? { ...j, ...newJobData } : j));
                      setSuccessMessage(`Job "${newJobData.title}" updated successfully!`);
                    } else {
                      const newJob = {
                        id: Math.max(...jobs.map(j => j.id), 0) + 1,
                        ...newJobData,
                        status: 'Draft',
                        applicants: 0,
                        newApplicants: 0,
                        postedDate: new Date().toISOString().split('T')[0],
                        score: 0
                      };
                      setJobs([...jobs, newJob]);
                      setSuccessMessage(`Job "${newJobData.title}" created successfully!`);
                    }
                    setTimeout(() => setSuccessMessage(null), 4000);
                    handleCloseModal();
                  }
                }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {editingJobId ? 'Update Job' : 'Save Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-[60] bg-white dark:bg-[#161c24] border border-[#00A76F]/20 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 flex items-center gap-4 animate-fade-in transform transition-all">
          <div className="w-10 h-10 rounded-full bg-[#00A76F]/10 flex items-center justify-center text-[#00A76F] shrink-0">
            <CheckCircle size={20} />
          </div>
          <div className="pr-2">
            <h4 className="text-sm font-bold text-[#212b36] dark:text-white">Success</h4>
            <p className="text-xs font-medium text-[#637381] dark:text-gray-400 mt-0.5">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
