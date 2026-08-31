import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Plus, Mail, Trash2, Shield , Settings2, X} from 'lucide-react';

import JobSetupHeader from '../components/dashboard/JobSetupHeader';
import SearchableSelect from '../components/ui/SearchableSelect';

export default function JobSetupHiringTeamPage() {
  const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [deleteConfirmMemberId, setDeleteConfirmMemberId] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', role: 'Interviewer', email: '' });
  const [formErrors, setFormErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const initialJobData = location.state?.jobData;
  const [jobData, setJobData] = useState({ ...initialJobData });

  const handleJobDataChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMember = () => {
    const errors = {};
    if (!newMember.name.trim()) errors.name = 'Name is required';
    if (!newMember.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email)) errors.email = 'Invalid email address';
    if (!newMember.role) errors.role = 'Role is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const member = {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      avatar: 'bg-[#1890FF]/20 text-[#1890FF]',
      initials: newMember.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NA'
    };

    setTeam([...team, member]);
    setIsAddMemberModalOpen(false);
    setNewMember({ name: '', role: 'Interviewer', email: '' });
    setFormErrors({});
  };

  const roleOptions = [
    { label: 'Hiring Manager', value: 'Hiring Manager' },
    { label: 'Recruiter', value: 'Recruiter' },
    { label: 'Interviewer', value: 'Interviewer' },
  ];

  const [team, setTeam] = useState([
    { id: 1, name: 'Amit Sharma', role: 'Hiring Manager', email: 'amit@talentflow.com', avatar: 'bg-[#1890FF]/20 text-[#1890FF]', initials: 'AS' },
    { id: 2, name: 'Priya Patel', role: 'Recruiter', email: 'priya@talentflow.com', avatar: 'bg-[#00A76F]/20 text-[#00A76F]', initials: 'PP' },
    { id: 3, name: 'David Chen', role: 'Interviewer', email: 'david@talentflow.com', avatar: 'bg-[#FFC107]/20 text-[#b78103]', initials: 'DC' }
  ]);

  const confirmDelete = () => {
    if (deleteConfirmMemberId) {
      setTeam(prev => prev.filter(m => m.id !== deleteConfirmMemberId));
      setDeleteConfirmMemberId(null);
    }
  };

  if (!initialJobData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">No Job Selected</h2>
        <p className="text-black mb-6">Please create a job or select one to view its setup overview.</p>
        <button 
          onClick={() => navigate('/dashboard/jobs')}
          className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
      <JobSetupHeader 
        title="Hiring Team Setup" 
        subtitle={`Configure the team members who will manage and interview candidates for ${jobData?.title || 'this job'}.`}
        isConfidential={jobData?.isConfidential}
        onConfidentialChange={(val) => handleJobDataChange('isConfidential', val)}
      />

      <div className="flex-1 space-y-6">

        <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
              <Users size={20} className="text-[#00A76F]" />
              Team Members
            </h2>
            <button onClick={() => setIsAddMemberModalOpen(true)} className="px-4 py-2 bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] rounded-lg text-sm font-bold shadow-sm hover:bg-[#161c24] dark:hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
              <Plus size={16} /> Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.id} className="flex flex-col h-full bg-white dark:bg-[#161c24] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative group/card">
                <div className="p-5 flex-1 flex flex-col justify-center">
                  
                  {/* Profile Section */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[16px] ${member.avatar} shadow-sm border border-current/10 shrink-0`}>
                      {member.initials}
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-[16px] font-bold text-[#212b36] dark:text-white leading-snug truncate">
                          {member.name}
                        </h4>
                        <span className="text-[12px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded shrink-0">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate mt-0.5">
                        <Mail size={12} className="shrink-0" /> {member.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/30 dark:bg-[#1a222c]/30 rounded-b-xl flex items-center justify-center mt-auto">
                  <button 
                    onClick={() => setDeleteConfirmMemberId(member.id)}
                    className="p-2 text-[#FF5630] bg-red-50 dark:bg-red-900/20 hover:bg-[#FF5630] hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="Remove Member"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
        <button 
          onClick={() => navigate('/dashboard/job-setup/description-skills', { state: { jobData } })}
          className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Description
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsConfirmDraftModalOpen(true)}
            className="px-6 py-3 text-black hover:text-[#212b36] dark:hover:text-white font-bold transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => navigate('/dashboard/job-setup/pipeline', { state: { jobData } })}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >
            Save and Continue to 'Pipeline'
          </button>
        </div>
      </div>
      
      {/* Confirm Draft Modal */}
      {isConfirmDraftModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-scale-up overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Save as Draft?</h3>
              <p className="text-sm text-black dark:text-gray-400">
                Are you sure you want to save your progress as a draft and return to the Job List? You can resume editing later.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-3 bg-gray-50 dark:bg-gray-800/30">
              <button 
                onClick={() => setIsConfirmDraftModalOpen(false)} 
                className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsConfirmDraftModalOpen(false);
                  if (typeof setToastMessage !== 'undefined') {
                    setToastMessage('Saved as draft.');
                  }
                  setTimeout(() => {
                    if (typeof navigate !== 'undefined') {
                      navigate('/dashboard/jobs');
                    } else {
                      window.location.href = '/dashboard/jobs';
                    }
                  }, 1000);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Yes, Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-visible">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800/50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Add Team Member</h3>
              <button onClick={() => setIsAddMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#212b36] dark:text-gray-300 mb-1.5">Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={newMember.name}
                  onChange={(e) => { setNewMember({...newMember, name: e.target.value}); setFormErrors({...formErrors, name: null}); }}
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-[#212b36] dark:text-white transition-all`}
                  placeholder="e.g. John Doe"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#212b36] dark:text-gray-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  value={newMember.email}
                  onChange={(e) => { setNewMember({...newMember, email: e.target.value}); setFormErrors({...formErrors, email: null}); }}
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-[#212b36] dark:text-white transition-all`}
                  placeholder="e.g. john@company.com"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#212b36] dark:text-gray-300 mb-1.5">Role <span className="text-red-500">*</span></label>
                <SearchableSelect 
                  options={roleOptions}
                  value={newMember.role}
                  onChange={(val) => { setNewMember({...newMember, role: val}); setFormErrors({...formErrors, role: null}); }}
                  placeholder="Select a role..."
                  searchPlaceholder="Search roles..."
                  className={formErrors.role ? 'border-red-500' : ''}
                />
                {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-3 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
              <button 
                onClick={() => setIsAddMemberModalOpen(false)} 
                className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMember}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmMemberId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] p-7 rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.2)] max-w-sm w-full mx-4 border border-gray-100 dark:border-gray-800 animate-scale-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-[#FF5630] rounded-full flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Remove Member?</h3>
            </div>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8 text-center">
              Are you sure you want to remove this team member? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmMemberId(null)}
                className="flex-1 py-3 text-sm font-bold text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 text-sm font-bold text-white bg-[#FF5630] hover:bg-[#FF5630]/90 rounded-xl shadow-[0_8px_16px_rgba(255,86,48,0.24)] transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
