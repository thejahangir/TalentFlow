import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserX, UserCheck, ChevronRight, Search, Star, FileText, CheckSquare, Clock, MapPin, Plus, ClipboardEdit, FileCheck, AlertCircle, UserPlus, Activity, X, Video, Filter, MoreHorizontal, Settings, Users as UsersIcon, CheckCircle, Calendar, Briefcase, CalendarDays, ArrowLeft } from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';

// --- MOCK DATA ---
const pipelineData = [
  { stage: 'Application Review', count: 124, avgTime: '2d' },
  { stage: 'To be rejected', count: 45, avgTime: null },
  { stage: 'To be rejected - After interview', count: 12, avgTime: null },
  { stage: 'Reference Check', count: 8, avgTime: '14d', warning: true },
  { stage: 'Put on hold', count: 3, avgTime: '21d', warning: true },
  { stage: 'Offer', count: 2, avgTime: '3d' },
  { stage: 'Hired', count: 1, avgTime: null },
];

const initialPipelineBoardData = [
  {
    title: 'Applied (45)',
    candidates: [
      { id: 101, name: 'Ravi Desai', role: 'Software Engineer', score: 92, time: '2h', experience: '5 YOE', company: 'Infosys', location: 'Bangalore', skills: ['React', 'Node.js', 'AWS'], noticePeriod: '30 Days' },
      { id: 102, name: 'Sneha Patil', role: 'Frontend Engineer', score: 88, time: '5h', experience: '3 YOE', company: 'TCS', location: 'Pune', skills: ['Vue', 'JS', 'CSS'], noticePeriod: '15 Days' },
      { id: 103, name: 'Karan Mehra', role: 'UI Developer', score: 85, time: '1d', experience: '4 YOE', company: 'Wipro', location: 'Delhi', skills: ['React', 'Figma', 'HTML'], noticePeriod: 'Immediate' },
      { id: 104, name: 'Ankita Rao', role: 'React Developer', score: 81, time: '1d', experience: '2 YOE', company: 'Startup Inc', location: 'Hyderabad', skills: ['React', 'Redux', 'Tailwind'], noticePeriod: '60 Days' },
      { id: 105, name: 'Varun Khanna', role: 'Web Developer', score: 79, time: '2d', experience: '1 YOE', company: 'Freelance', location: 'Remote', skills: ['HTML', 'CSS', 'JS'], noticePeriod: 'Immediate' },
    ]
  },
  {
    title: 'Screening (12)',
    candidates: [
      { id: 201, name: 'Pooja Iyer', role: 'Software Engineer', score: 94, time: '1d', experience: '6 YOE', company: 'Amazon', location: 'Chennai', skills: ['Java', 'Spring', 'AWS'], noticePeriod: '90 Days' },
      { id: 202, name: 'Rahul Verma', role: 'Frontend Engineer', score: 91, time: '2d', experience: '4 YOE', company: 'Flipkart', location: 'Bangalore', skills: ['React', 'Next.js', 'TS'], noticePeriod: '30 Days' },
      { id: 203, name: 'Divya Singh', role: 'Senior React', score: 89, time: '3d', experience: '7 YOE', company: 'Paytm', location: 'Noida', skills: ['React', 'GraphQL', 'Jest'], noticePeriod: '45 Days' },
    ]
  },
  {
    title: 'Interviewing (5)',
    candidates: [
      { id: 301, name: 'Ananya Sharma', role: 'Senior React', score: 98, time: '1d', experience: '8 YOE', company: 'Google', location: 'Bangalore', skills: ['React', 'Performance', 'Architecture'], noticePeriod: '30 Days' },
      { id: 302, name: 'Arjun Kumar', role: 'UI Developer', score: 95, time: '2d', experience: '5 YOE', company: 'Microsoft', location: 'Hyderabad', skills: ['React', 'FluentUI', 'C#'], noticePeriod: '60 Days' },
    ]
  },
  {
    title: 'Put On Hold (3)',
    candidates: [
      { id: 401, name: 'Nitin Gupta', role: 'Frontend Engineer', score: 90, time: '5d', experience: '3 YOE', company: 'Swiggy', location: 'Bangalore', skills: ['React', 'Redux', 'Webpack'], noticePeriod: '15 Days' },
    ]
  },
  {
    title: 'Offer (2)',
    candidates: [
      { id: 501, name: 'Priya Patel', role: 'Software Engineer', score: 96, time: '1d', experience: '6 YOE', company: 'Zomato', location: 'Gurgaon', skills: ['React', 'Node', 'System Design'], noticePeriod: '30 Days' },
    ]
  }
];

const rediscoveryCandidates = [
  { id: 1, name: 'Ananya Sharma', role: 'Senior React Developer', match: '98%', lastContact: '2 months ago' },
  { id: 2, name: 'Rahul Verma', role: 'Frontend Engineer', match: '95%', lastContact: '6 months ago' },
  { id: 3, name: 'Priya Patel', role: 'UI Developer', match: '92%', lastContact: '1 year ago' },
];

const hiringTeam = [
  { id: 1, name: 'Priya (Recruiter)', initials: 'PR', color: 'bg-[#1890FF]/20 text-[#1890FF]' },
  { id: 2, name: 'Amit (Manager)', initials: 'AM', color: 'bg-[#00A76F]/20 text-[#00A76F]' },
  { id: 3, name: 'Rahul (Interviewer)', initials: 'RA', color: 'bg-[#FFC107]/20 text-[#b78103]' },
];

const actionItems = [
  { id: 1, title: 'Interview Scorecard: Sneha Patil', subtitle: 'Technical Interview - Pending your review', type: 'review' },
  { id: 2, title: 'Approve Offer: Rahul Verma', subtitle: 'Due tomorrow', type: 'offer' },
  { id: 3, title: 'Review 5 new top applicants', subtitle: 'High Priority', type: 'review' },
];

const upcomingInterviews = [
  { id: 1, candidate: 'Ananya Sharma', role: 'Senior React Developer', time: 'Today, 2:00 PM', duration: '45 mins', platform: 'Zoom', score: 98, type: 'Technical Interview', interviewer: 'Amit', status: 'Accepted' },
  { id: 2, candidate: 'Rahul Verma', role: 'Frontend Engineer', time: 'Tomorrow, 10:30 AM', duration: '30 mins', platform: 'Google Meet', score: 95, type: 'Culture Fit', interviewer: 'Priya', status: 'Pending' },
  { id: 3, candidate: 'Sneha Patil', role: 'Software Engineer', time: 'Tomorrow, 3:00 PM', duration: '60 mins', platform: 'Teams', score: 88, type: 'System Design', interviewer: 'Vikram', status: 'Accepted' },
  { id: 4, candidate: 'Karan Mehra', role: 'UI Developer', time: 'Thursday, 1:00 PM', duration: '45 mins', platform: 'Zoom', score: 85, type: 'Culture Fit', interviewer: 'Priya', status: 'Pending' },
  { id: 5, candidate: 'Pooja Desai', role: 'Product Manager', time: 'Friday, 11:00 AM', duration: '60 mins', platform: 'Google Meet', score: 92, type: 'Leadership Round', interviewer: 'Sanjay', status: 'Accepted' },
  { id: 6, candidate: 'Rohan Gupta', role: 'Data Scientist', time: 'Friday, 4:00 PM', duration: '90 mins', platform: 'Teams', score: 99, type: 'Technical Assessment', interviewer: 'Neha', status: 'Declined' },
  { id: 7, candidate: 'Meera Reddy', role: 'UX Designer', time: 'Next Mon, 10:00 AM', duration: '30 mins', platform: 'Zoom', score: 81, type: 'Portfolio Review', interviewer: 'Amit', status: 'Pending' },
];

const candidateList = [
  { id: 1, name: 'Ananya Sharma', stage: 'Technical Interview', score: '98/100', date: '2 days ago' },
  { id: 2, name: 'Rahul Verma', stage: 'Culture Fit', score: '95/100', date: '1 day ago' },
  { id: 3, name: 'Priya Patel', stage: 'Application Review', score: '88/100', date: '5 hours ago' },
  { id: 4, name: 'Arjun Kumar', stage: 'Reference Check', score: '92/100', date: '4 days ago' },
  { id: 5, name: 'Ravi Desai', stage: 'Applied', score: '92/100', date: '2 hours ago' },
  { id: 6, name: 'Sneha Patil', stage: 'Screening', score: '88/100', date: '5 hours ago' },
  { id: 7, name: 'Karan Mehra', stage: 'Interviewing', score: '85/100', date: '1 day ago' },
  { id: 8, name: 'Ankita Rao', stage: 'Offer', score: '81/100', date: '1 day ago' },
  { id: 9, name: 'Varun Khanna', stage: 'Applied', score: '79/100', date: '2 days ago' },
  { id: 10, name: 'Pooja Iyer', stage: 'Screening', score: '94/100', date: '1 day ago' },
  { id: 11, name: 'Divya Singh', stage: 'Technical Interview', score: '89/100', date: '3 days ago' },
  { id: 12, name: 'Nitin Gupta', stage: 'Put On Hold', score: '90/100', date: '5 days ago' },
  { id: 13, name: 'Neha Sharma', stage: 'Applied', score: '84/100', date: '1 week ago' },
  { id: 14, name: 'Amit Singh', stage: 'Screening', score: '86/100', date: '1 week ago' },
  { id: 15, name: 'Kavita Das', stage: 'Reference Check', score: '91/100', date: '2 weeks ago' },
  { id: 16, name: 'Rohit Joshi', stage: 'Offer', score: '97/100', date: '2 days ago' },
];

const roleOptions = [
  { value: 'interviewer', label: 'Interviewer', description: 'Can score candidates' },
  { value: 'hiring_manager', label: 'Hiring Manager', description: 'Full access to pipeline and offers' },
  { value: 'recruiter', label: 'Recruiter', description: 'Can manage pipeline and screen candidates' },
  { value: 'observer', label: 'Observer', description: 'Read-only access' }
];

const recentActivity = [
  { id: 1, action: 'Sneha Patil applied for the role via LinkedIn', time: '2 hours ago', icon: UserPlus, color: 'text-[#1890FF] bg-[#1890FF]/10' },
  { id: 2, action: 'Priya left a 4-star scorecard for Rahul Verma', time: '4 hours ago', icon: Star, color: 'text-[#FFC107] bg-[#FFC107]/10' },
  { id: 3, action: 'Amit moved Ananya Sharma to Tech Interview', time: 'Yesterday, 3:30 PM', icon: Activity, color: 'text-[#00A76F] bg-[#00A76F]/10' },
  { id: 4, action: 'Automated screening rejected 12 candidates', time: 'Yesterday, 9:00 AM', icon: UserX, color: 'text-[#FF5630] bg-[#FF5630]/10' },
];

export default function JobDashboardPage() {
  const navigate = useNavigate();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [pipelineBoard, setPipelineBoard] = useState(initialPipelineBoardData);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [moveDropdownId, setMoveDropdownId] = useState(null);

  const [interviewsList, setInterviewsList] = useState(upcomingInterviews);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({ candidate: '', type: 'Technical Interview', interviewer: 'Amit', date: '', time: '' });
  const [scheduleErrors, setScheduleErrors] = useState({});

  // Hot reload sync for mock data
  useEffect(() => {
    setInterviewsList(upcomingInterviews);
  }, []);

  // Candidate Tab State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredCandidates = candidateList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const currentCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const tabs = ['Overview', 'Job Description', 'Pipeline', 'Candidates', 'Interviews', 'Team & Scorecards', 'Settings'];

  const handleMoveCandidate = (candidate, fromStage, toStage) => {
    setPipelineBoard(prev => {
      const newData = [...prev];
      const fromIndex = newData.findIndex(col => col.title === fromStage);
      
      if (fromIndex !== -1) {
        // If Rejecting, just remove from current column
        if (toStage === 'Reject') {
          newData[fromIndex] = { ...newData[fromIndex], candidates: newData[fromIndex].candidates.filter(c => c.id !== candidate.id) };
        } else {
          const toIndex = newData.findIndex(col => col.title === toStage);
          if (toIndex !== -1) {
            newData[fromIndex] = { ...newData[fromIndex], candidates: newData[fromIndex].candidates.filter(c => c.id !== candidate.id) };
            newData[toIndex] = { ...newData[toIndex], candidates: [candidate, ...newData[toIndex].candidates] };
          }
        }
      }
      return newData;
    });
    setMoveDropdownId(null);
  };

  const handleSendInvite = () => {
    setIsInviteModalOpen(false);
    setInviteRole('');
    setShowInviteSuccess(true);
    setTimeout(() => {
      setShowInviteSuccess(false);
    }, 3000);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const errors = {};
    if (!scheduleData.candidate) errors.candidate = 'Please select a candidate';
    if (!scheduleData.interviewer) errors.interviewer = 'Please select an interviewer';
    if (!scheduleData.date) errors.date = 'Date is required';
    if (!scheduleData.time) errors.time = 'Time is required';
    
    if (Object.keys(errors).length > 0) {
      setScheduleErrors(errors);
      return;
    }
    
    // Convert date string to a friendlier format for mock
    const dateObj = new Date(scheduleData.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const newInt = {
      id: Date.now(),
      candidate: scheduleData.candidate,
      role: 'Senior AI Research Scientist',
      time: `${dateStr}, ${scheduleData.time}`,
      duration: '45 mins',
      platform: 'Google Meet',
      score: 92,
      status: 'Pending',
      type: scheduleData.type,
      interviewer: scheduleData.interviewer
    };
    
    setInterviewsList([newInt, ...interviewsList]);
    setIsScheduleModalOpen(false);
    setScheduleData({ candidate: '', type: 'Technical Interview', interviewer: 'Amit', date: '', time: '' });
    setScheduleErrors({});
  };

  return (
    <div className="p-6 space-y-6 relative">
      
      {/* HEADER */}
      <div className="mb-2">
        <button onClick={() => navigate('/dashboard/jobs')} className="text-sm font-bold text-[#637381] dark:text-gray-400 hover:text-[#1890FF] flex items-center gap-1.5 transition-colors w-fit mb-4 cursor-pointer">
          <ArrowLeft size={16} /> Back to Job List
        </button>
        <div className="flex items-center justify-between">
          <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#212b36] dark:text-white ">Senior AI Research Scientist</h1>
            <span className="bg-[#00A76F]/10 text-[#00A76F] text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A76F]"></span>
              Published
            </span>
          </div>
          <p className="text-sm text-[#637381] dark:text-white mt-1 flex items-center gap-1.5 font-medium">
            <MapPin size={16} className="text-[#00A76F]" />
            Bangalore, India • Hybrid
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex -space-x-2">
             {hiringTeam.map(member => (
               <div key={member.id} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#161c24] cursor-pointer ${member.color}`} title={member.name}>
                 {member.initials}
               </div>
             ))}
           </div>
           <button 
             onClick={() => setIsInviteModalOpen(true)}
             className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700/50 flex items-center justify-center text-gray-400 dark:text-white hover:text-[#1890FF] hover:border-[#1890FF] transition-colors cursor-pointer" 
             title="Invite Team Member"
           >
             <Plus size={14} />
           </button>
        </div>
      </div>
      </div>

      {/* JOB NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 dark:border-gray-800/50 mt-4 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap relative cursor-pointer ${
              activeTab === tab 
                ? 'text-[#1890FF] dark:text-[#1890FF]' 
                : 'text-[#637381] hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1890FF] rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'Overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1890FF]/10 flex items-center justify-center shrink-0">
                <Users size={24} className="text-[#1890FF]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#637381] dark:text-white mb-1">Total Applications</p>
                <h3 className="text-3xl font-bold text-[#212b36] dark:text-white ">2,450</h3>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#00A76F]/10 flex items-center justify-center shrink-0">
                <UserCheck size={24} className="text-[#00A76F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#637381] dark:text-white mb-1">Active Candidates</p>
                <h3 className="text-3xl font-bold text-[#212b36] dark:text-white ">184</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#FF5630]/10 flex items-center justify-center shrink-0">
                <UserX size={24} className="text-[#FF5630]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#637381] dark:text-white mb-1">Rejected</p>
                <h3 className="text-3xl font-bold text-[#212b36] dark:text-white ">2,266</h3>
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN (Manager Activity) */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Upcoming Interviews */}
              <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                    <Video size={20} className="text-[#1890FF]" />
                    Upcoming Interviews
                  </h3>
                  <button onClick={() => setActiveTab('Interviews')} className="text-sm font-bold text-[#1890FF] hover:bg-[#1890FF]/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                    View Calendar
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviewsList.map(interview => (
                    <div key={interview.id} className="border border-gray-100 dark:border-gray-800/50 p-4 rounded-xl hover:border-[#1890FF]/30 hover:shadow-sm transition-all group cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">{interview.candidate}</h4>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(interview.score || 90) >= 90 ? 'bg-[#00A76F]/20 text-[#00A76F] dark:text-[#22c55e]' : 'bg-[#FFC107]/20 text-[#b78103] dark:text-[#FFC107]'}`}>
                              {interview.score || 90}% Match
                            </span>
                          </div>
                          <p className="text-xs text-[#637381] dark:text-gray-400 mt-0.5">{interview.role}</p>
                        </div>
                        <span className="bg-[#1890FF]/10 text-[#1890FF] text-[11px] font-bold px-2 py-1 rounded-md text-right">
                          {interview.time}<br/><span className="text-[10px] opacity-90">{interview.platform || 'Zoom'}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-[#637381] dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><UserCheck size={14} className="text-[#1890FF]/70 shrink-0" /> {interview.type}</span>
                        <span className="mx-1">•</span>
                        <span>{interview.duration || '45 mins'}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-1.5 text-xs font-bold text-[#1890FF] bg-[#1890FF]/10 hover:bg-[#1890FF]/20 rounded-lg transition-colors cursor-pointer">
                          Join Call
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setActiveTab('Candidates'); }} className="flex-1 py-1.5 text-xs font-bold text-[#637381] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Reviews / Action Items */}
              <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
                <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-4 flex items-center gap-2">
                  <ClipboardEdit size={20} className="text-[#FFC107]" />
                  Pending Reviews & Approvals
                </h3>
                <div className="space-y-3">
                  {actionItems.map(item => (
                    <div key={item.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:border-[#FFC107]/30 hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          item.type === 'offer' ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-[#FFC107]/10 text-[#FFC107]'
                        }`}>
                          {item.type === 'offer' ? <FileCheck size={18} /> : <FileText size={18} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#FFC107] transition-colors mb-1">{item.title}</h4>
                          <p className="text-xs font-medium text-[#637381] dark:text-gray-400">{item.subtitle}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-xs font-bold text-white bg-[#212b36] dark:bg-gray-700 hover:bg-[#161c24] dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
                <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-[#1890FF]" />
                  Recent Activity
                </h3>
                <div className="space-y-6 relative">
                  <div className="absolute top-2 bottom-2 left-[15px] w-px bg-gray-100 dark:bg-gray-800/50 z-0"></div>
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="relative z-10 flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#161c24] ${activity.color}`}>
                        <activity.icon size={14} />
                      </div>
                      <div className="pt-1.5">
                        <p className="text-sm font-medium text-[#212b36] dark:text-white leading-snug">{activity.action}</p>
                        <p className="text-xs text-[#919eab] mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              {/* Pipeline summary */}
              <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#212b36] dark:text-white">Pipeline</h3>
                  <button onClick={() => setActiveTab('Pipeline')} className="text-sm font-bold text-[#1890FF] hover:bg-[#1890FF]/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                    Board
                  </button>
                </div>
                <div className="space-y-1 relative">
                  {/* Vertical line connecting the steps */}
                  <div className="absolute top-4 bottom-4 left-[11px] w-0.5 bg-gray-100 dark:bg-gray-800/50 z-0"></div>
                  
                  {pipelineData.map((item, index) => {
                    const isFinal = index >= pipelineData.length - 2; // Offer, Hired
                    const isRejected = item.stage.toLowerCase().includes('reject');
                    const isReview = item.stage === 'Application Review';
                    const isRefCheck = item.stage === 'Reference Check';
                    const isHold = item.stage === 'Put on hold';
                    
                    let dotColor = "border-gray-300 dark:border-gray-700/50 bg-white dark:bg-[#161c24]";
                    if (isFinal) dotColor = "border-[#00A76F] bg-[#00A76F]";
                    else if (isRejected) dotColor = "border-[#FF5630] bg-[#FF5630]";
                    else if (isHold) dotColor = "border-[#FFC107] bg-[#FFC107]";
                    else dotColor = "border-[#1890FF] bg-[#1890FF]";

                    return (
                      <div key={item.stage} className="relative z-10 flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${dotColor}`}>
                             {isFinal && <UserCheck size={12} className="text-white" />}
                             {isRejected && <UserX size={12} className="text-white" />}
                             {isReview && <FileText size={12} className="text-white" />}
                             {isRefCheck && <CheckSquare size={12} className="text-white" />}
                             {isHold && <Clock size={12} className="text-white" />}
                          </div>
                          <span className="text-sm font-medium text-[#454f5b] dark:text-white group-hover:text-[#1890FF] transition-colors">{item.stage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.avgTime && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.warning ? 'bg-[#FF5630]/10 text-[#FF5630]' : 'bg-gray-100 dark:bg-gray-800/50 text-[#637381] dark:text-white '}`} title="Average time in stage">
                              Avg {item.avgTime}
                            </span>
                          )}
                          <span className="text-sm font-bold bg-gray-100 dark:bg-gray-800/50 px-2.5 py-0.5 rounded-full text-[#212b36] dark:text-white ">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Recommendations / Talent Rediscovery */}
              <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                    <Search size={20} className="text-[#1890FF]" />
                    Top Recommendations
                  </h3>
                </div>
                <p className="text-sm text-[#637381] dark:text-white mb-3 leading-relaxed">
                  AI found past candidates perfectly matching this role.
                </p>
                
                <div className="space-y-3">
                  {rediscoveryCandidates.slice(0, 3).map(candidate => (
                    <div key={candidate.id} className="border border-gray-100 dark:border-gray-800/50 p-3 rounded-xl hover:border-[#1890FF]/30 hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">{candidate.name}</h4>
                        <span className="text-[10px] font-bold text-[#00A76F] bg-[#00A76F]/10 px-1.5 py-0.5 rounded-full">
                          {candidate.match} Match
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#637381] dark:text-gray-400 mb-2">
                        {candidate.role}
                      </p>
                      <button onClick={(e) => { e.stopPropagation(); setActiveTab('Candidates'); }} className="w-full py-1 text-xs font-bold text-[#1890FF] bg-[#1890FF]/5 hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer">
                        Review Profile
                      </button>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 py-1.5 text-sm font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  View All Matches <ChevronRight size={16} />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* JOB DESCRIPTION TAB */}
      {activeTab === 'Job Description' && (
        <div className="bg-white dark:bg-[#161c24] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 animate-fade-in text-[#454f5b] dark:text-gray-300">
          <h2 className="text-xl font-bold text-[#212b36] dark:text-white mb-6">Job Description: Senior AI Research Scientist</h2>
          
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-3">About the Role</h3>
              <p className="leading-relaxed">
                We are looking for a Senior AI Research Scientist to join our cutting-edge AI labs team. In this role, you will be responsible for leading research and development of novel deep learning architectures, particularly focusing on large language models and multimodal AI systems. You will work closely with a cross-functional team of researchers, engineers, and product managers to push the boundaries of what's possible with artificial intelligence.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-3">Key Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Design, develop, and train state-of-the-art machine learning models for natural language processing and computer vision tasks.</li>
                <li>Conduct independent research leading to publications in top-tier AI conferences (e.g., NeurIPS, ICML, ICLR).</li>
                <li>Collaborate with the engineering team to optimize models for efficient deployment in production environments.</li>
                <li>Provide technical leadership and mentor junior researchers on the team.</li>
                <li>Stay up-to-date with the latest advancements in AI research and identify new opportunities for innovation.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-3">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ph.D. or Master's degree in Computer Science, Artificial Intelligence, Machine Learning, or a related field.</li>
                <li>5+ years of industry or academic experience in developing and training deep learning models.</li>
                <li>Strong programming skills in Python and proficiency with frameworks like PyTorch or TensorFlow.</li>
                <li>A solid track record of publications in top-tier AI conferences or journals.</li>
                <li>Excellent problem-solving skills and the ability to work collaboratively in a fast-paced environment.</li>
                <li>Experience with distributed training and model optimization techniques is a strong plus.</li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {/* PIPELINE TAB */}
      {activeTab === 'Pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 animate-fade-in pt-2">
          {pipelineBoard.map((col) => {
            const titleParts = col.title.split(' ');
            const stageName = titleParts.slice(0, titleParts.length - 1).join(' ');
            const stageCount = titleParts[titleParts.length - 1].replace(/[\(\)]/g, '');
            
            return (
              <div key={col.title} className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#637381] dark:text-gray-400">
                    {stageName} 
                    <span className="text-[10px] font-black bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-[#212b36] dark:text-white px-2 py-0.5 rounded-full ml-2 shadow-sm">
                      {stageCount}
                    </span>
                  </h3>
                </div>
                <div className="flex-1 space-y-4">
                  {col.candidates.map((card) => (
                     <div 
                       key={card.id} 
                       onMouseLeave={() => { if (moveDropdownId === card.id) setMoveDropdownId(null); }}
                       className="bg-white dark:bg-[#161c24] p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 dark:border-gray-800/50 hover:border-[#1890FF]/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer transition-all duration-300 group flex flex-col gap-3 relative overflow-visible"
                     >
                       
                       {/* Top Section */}
                       <div className="flex justify-between items-start">
                         <div className="flex items-center gap-2.5">
                           <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1890FF]/20 to-[#1890FF]/5 flex items-center justify-center text-[#1890FF] font-bold text-sm ring-2 ring-white dark:ring-[#161c24] shrink-0">
                              {card.name.split(' ').map(n => n[0]).join('')}
                           </div>
                           <div>
                             <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors leading-tight">{card.name}</h4>
                             <p className="text-[10px] font-semibold text-[#637381] dark:text-gray-400 mt-0.5">{card.role}</p>
                           </div>
                         </div>
                         <div className="flex flex-col items-end">
                           <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${card.score >= 90 ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-[#FFC107]/10 text-[#FFC107]'}`}>
                             {card.score}%
                           </span>
                           <span className="text-[9px] font-medium text-gray-400 mt-1 flex items-center gap-0.5"><Clock size={9} /> {card.time}</span>
                         </div>
                       </div>

                       {/* Info grid */}
                       <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-medium bg-gray-50/50 dark:bg-gray-800/20 p-2.5 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
                         <div className="flex items-center gap-1.5 text-[#454f5b] dark:text-gray-300">
                           <Briefcase size={11} className="text-[#1890FF]/70 shrink-0" />
                           <span className="truncate">{card.company} • {card.experience}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[#454f5b] dark:text-gray-300">
                           <MapPin size={11} className="text-[#1890FF]/70 shrink-0" />
                           <span className="truncate">{card.location}</span>
                         </div>
                         <div className="col-span-2 flex items-center gap-1.5 text-[#454f5b] dark:text-gray-300">
                           <CalendarDays size={11} className="text-[#1890FF]/70 shrink-0" />
                           <span className="truncate">Notice: <span className="font-bold">{card.noticePeriod}</span></span>
                         </div>
                       </div>

                       {/* Skills Tags */}
                       <div className="flex flex-wrap gap-1">
                         {card.skills.map(skill => (
                           <span key={skill} className="text-[9px] font-bold bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded text-[#637381] dark:text-gray-400">
                             {skill}
                           </span>
                         ))}
                       </div>

                       {/* Hover Actions - Slide up on hover */}
                       <div className="absolute -bottom-14 left-0 w-full p-2.5 bg-white/95 dark:bg-[#161c24]/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex gap-2 group-hover:bottom-0 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 pointer-events-none group-hover:pointer-events-auto">
                         <button onClick={(e) => { e.stopPropagation(); setSelectedCandidate(card); }} className="flex-1 py-1.5 bg-[#1890FF] text-white text-[11px] font-bold rounded-lg hover:bg-[#1890FF]/90 transition-colors shadow-sm cursor-pointer">
                           Review
                         </button>
                         <div className="flex-1 relative">
                           <button onClick={(e) => { e.stopPropagation(); setMoveDropdownId(moveDropdownId === card.id ? null : card.id); }} className="w-full py-1.5 bg-gray-100 dark:bg-gray-800 text-[#212b36] dark:text-white text-[11px] font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                             Move
                           </button>
                           {moveDropdownId === card.id && (
                             <div className="absolute bottom-full left-0 mb-2 w-36 bg-white dark:bg-[#212b36] shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 py-1 z-50">
                               {pipelineBoard.map(stage => stage.title !== col.title && (
                                 <button 
                                   key={stage.title} 
                                   onClick={(e) => { e.stopPropagation(); handleMoveCandidate(card, col.title, stage.title); }}
                                   className="w-full text-left px-4 py-1.5 text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                 >
                                   To {stage.title.split(' ').slice(0, -1).join(' ')}
                                 </button>
                               ))}
                               <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); handleMoveCandidate(card, col.title, 'Reject'); }}
                                   className="w-full text-left px-4 py-1.5 text-[10px] font-bold text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                 >
                                   Reject Candidate
                                 </button>
                               </div>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANDIDATES TAB */}
      {activeTab === 'Candidates' && (
        <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 overflow-hidden animate-fade-in flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search candidates by name or stage..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1890FF]/20 outline-none text-[#212b36] dark:text-white" 
              />
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-[#637381] bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <Filter size={16} /> Filters
            </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm text-[#637381] dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/50 text-[#637381] font-bold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Match Score</th>
                  <th className="px-6 py-4">Applied</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.length > 0 ? (
                  currentCandidates.map(cand => (
                    <tr key={cand.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#212b36] dark:text-white">{cand.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-[#1890FF]/10 text-[#1890FF] px-2.5 py-1 rounded-md text-xs font-bold">{cand.stage}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-[#00A76F]">{cand.score}</td>
                      <td className="px-6 py-4 font-medium">{cand.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button title="View Resume" className="text-[#1890FF] hover:bg-[#1890FF]/10 p-1.5 rounded-md cursor-pointer transition-colors"><FileText size={16} /></button>
                          <button title="Schedule Interview" className="text-[#00A76F] hover:bg-[#00A76F]/10 p-1.5 rounded-md cursor-pointer transition-colors"><Calendar size={16} /></button>
                          <button title="Reject Candidate" className="text-[#FF5630] hover:bg-[#FF5630]/10 p-1.5 rounded-md cursor-pointer transition-colors"><UserX size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                      No candidates found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between bg-white dark:bg-[#161c24]">
              <span className="text-sm text-gray-500 font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronRight size={18} className="rotate-180" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-bold cursor-pointer transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-[#1890FF] text-white' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* INTERVIEWS TAB */}
      {activeTab === 'Interviews' && (
        <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white">Upcoming Interviews for this Role</h3>
            <button onClick={() => setIsScheduleModalOpen(true)} className="text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm">
              Schedule Interview
            </button>
          </div>
          <div className="space-y-4">
             {interviewsList.map(interview => (
                <div key={interview.id} className="flex items-center justify-between border border-gray-100 dark:border-gray-800/50 p-4 rounded-xl hover:border-[#1890FF]/30 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
                       <Video size={20} />
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h4 className="text-[15px] font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">{interview.candidate}</h4>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${(interview.score || 90) >= 90 ? 'bg-[#00A76F]/20 text-[#00A76F] dark:text-[#22c55e]' : 'bg-[#FFC107]/20 text-[#b78103] dark:text-[#FFC107]'}`}>
                           {interview.score || 90}% Match
                         </span>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                           (interview.status || 'Pending') === 'Accepted' ? 'bg-[#1890FF]/20 text-[#1890FF] dark:text-[#60a5fa]' : 
                           ((interview.status === 'Declined') ? 'bg-[#FF5630]/20 text-[#FF5630] dark:text-[#FF5630]' : 
                           'bg-gray-100 dark:bg-gray-800 text-[#637381] dark:text-gray-400 border border-gray-200 dark:border-gray-700')
                         }`}>
                           {interview.status || 'Pending'}
                         </span>
                       </div>
                       <p className="text-sm font-medium text-[#212b36] dark:text-gray-300 mt-1">{interview.type}</p>
                       <p className="text-xs text-[#637381] dark:text-gray-400 flex items-center gap-2 mt-1.5">
                         <Calendar size={13} className="text-[#1890FF]/70 shrink-0" /> {interview.time} ({interview.duration || '45 mins'}) <span className="mx-1">•</span> 
                         <Video size={13} className="text-[#1890FF]/70 shrink-0" /> {interview.platform || 'Zoom'} <span className="mx-1">•</span>
                         <UsersIcon size={13} className="text-[#1890FF]/70 shrink-0" /> {interview.interviewer}
                       </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer" title="View Resume">
                      <FileText size={16} />
                    </button>
                    <button className="px-4 py-2 text-xs font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 shadow-sm rounded-lg transition-colors cursor-pointer" onClick={(e) => e.stopPropagation()}>
                      Join Call
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-center py-8 text-[#637381] text-sm">No more upcoming interviews this week.</div>
          </div>
        </div>
      )}

      {/* TEAM & SCORECARDS TAB */}
      {activeTab === 'Team & Scorecards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white">Hiring Team</h3>
              <button onClick={() => setIsInviteModalOpen(true)} className="text-sm font-bold text-[#1890FF] hover:bg-[#1890FF]/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                <Plus size={16} /> Add Member
              </button>
            </div>
            <div className="space-y-4">
              {hiringTeam.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${member.color}`}>
                      {member.initials}
                    </div>
                    <span className="font-medium text-sm text-[#212b36] dark:text-white">{member.name}</span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 cursor-pointer p-1"><X size={16} /></button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">Pending Scorecards</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 flex justify-between items-center cursor-pointer hover:border-[#FFC107]/30 hover:shadow-sm transition-all group">
                <div>
                  <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#FFC107] transition-colors">Sneha Patil</h4>
                  <p className="text-xs text-[#637381] mt-1">Technical Interview (Completed 2h ago)</p>
                </div>
                <button className="text-xs font-bold text-white bg-[#FFC107] hover:bg-[#e0a800] px-3 py-1.5 rounded-lg cursor-pointer">Fill Scorecard</button>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 flex justify-between items-center opacity-60">
                <div>
                  <h4 className="text-sm font-bold text-[#212b36] dark:text-white line-through">Rahul Verma</h4>
                  <p className="text-xs text-[#637381] mt-1">Culture Fit (Completed)</p>
                </div>
                <CheckCircle size={20} className="text-[#00A76F]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800/50">
              <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2"><Calendar size={20} className="text-[#1890FF]" /> Schedule Interview</h2>
              <button onClick={() => { setIsScheduleModalOpen(false); setScheduleErrors({}); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${scheduleErrors.candidate ? 'text-[#FF5630]' : 'text-gray-500'}`}>Select Candidate</label>
                <SearchableSelect 
                  options={candidateList.map(c => ({ value: c.name, label: c.name, description: `Stage: ${c.stage}` }))}
                  value={scheduleData.candidate}
                  onChange={(val) => { setScheduleData({...scheduleData, candidate: val}); if (scheduleErrors.candidate) setScheduleErrors({...scheduleErrors, candidate: null}); }}
                  placeholder="Search and select candidate..."
                  hasError={!!scheduleErrors.candidate}
                />
                <div className="min-h-[16px] mt-1"><p className="text-[#FF5630] text-xs animate-fade-in">{scheduleErrors.candidate}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Interview Type</label>
                  <select value={scheduleData.type} onChange={e => setScheduleData({...scheduleData, type: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-sm dark:text-white cursor-pointer">
                    <option>Technical Interview</option>
                    <option>Culture Fit</option>
                    <option>HR Round</option>
                    <option>System Design</option>
                  </select>
                  <div className="min-h-[16px] mt-1"></div>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${scheduleErrors.interviewer ? 'text-[#FF5630]' : 'text-gray-500'}`}>Interviewer</label>
                  <SearchableSelect 
                    options={hiringTeam.map(m => ({ value: m.name.split(' ')[0], label: m.name }))}
                    value={scheduleData.interviewer}
                    onChange={(val) => { setScheduleData({...scheduleData, interviewer: val}); if (scheduleErrors.interviewer) setScheduleErrors({...scheduleErrors, interviewer: null}); }}
                    placeholder="Search interviewer..."
                    hasError={!!scheduleErrors.interviewer}
                  />
                  <div className="min-h-[16px] mt-1"><p className="text-[#FF5630] text-xs animate-fade-in">{scheduleErrors.interviewer}</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${scheduleErrors.date ? 'text-[#FF5630]' : 'text-gray-500'}`}>Date</label>
                  <input type="date" value={scheduleData.date} onChange={e => { setScheduleData({...scheduleData, date: e.target.value}); if (scheduleErrors.date) setScheduleErrors({...scheduleErrors, date: null}); }} className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 text-sm dark:text-white cursor-pointer transition-colors ${scheduleErrors.date ? 'border-[#FF5630] bg-red-50 dark:bg-[#FF5630]/10 focus:ring-[#FF5630]/20' : 'border-gray-200 dark:border-gray-700/50 focus:ring-[#1890FF]/20'}`} />
                  <div className="min-h-[16px] mt-1"><p className="text-[#FF5630] text-xs animate-fade-in">{scheduleErrors.date}</p></div>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${scheduleErrors.time ? 'text-[#FF5630]' : 'text-gray-500'}`}>Time</label>
                  <input type="time" value={scheduleData.time} onChange={e => { setScheduleData({...scheduleData, time: e.target.value}); if (scheduleErrors.time) setScheduleErrors({...scheduleErrors, time: null}); }} className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 text-sm dark:text-white cursor-pointer transition-colors ${scheduleErrors.time ? 'border-[#FF5630] bg-red-50 dark:bg-[#FF5630]/10 focus:ring-[#FF5630]/20' : 'border-gray-200 dark:border-gray-700/50 focus:ring-[#1890FF]/20'}`} />
                  <div className="min-h-[16px] mt-1"><p className="text-[#FF5630] text-xs animate-fade-in">{scheduleErrors.time}</p></div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800/50">
                <button type="button" onClick={() => { setIsScheduleModalOpen(false); setScheduleErrors({}); }} className="px-5 py-2.5 text-sm font-bold text-[#637381] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl transition-colors shadow-md shadow-[#1890FF]/20 cursor-pointer">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800/50">
              <h2 className="text-lg font-bold text-[#212b36] dark:text-white ">Invite Team Member</h2>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 dark:text-white hover:text-gray-600 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#212b36] dark:text-white mb-1.5">Email Address</label>
                <input type="email" placeholder="colleague@company.com" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-sm transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212b36] dark:text-white mb-1.5">Role / Purpose</label>
                <SearchableSelect 
                  options={roleOptions}
                  value={inviteRole}
                  onChange={setInviteRole}
                  placeholder="Select a role..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212b36] dark:text-white mb-1.5">Personal Message (Optional)</label>
                <textarea rows="3" placeholder="Please join this job to help interview candidates..." className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-sm transition-all resize-none"></textarea>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50 dark:bg-[#161c24]">
              <button onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 text-sm font-bold text-[#637381] dark:text-white bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSendInvite} className="px-4 py-2 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showInviteSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#212b36] text-white px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 animate-fade-in border border-gray-700">
          <div className="w-6 h-6 bg-[#00A76F]/20 text-[#00A76F] rounded-full flex items-center justify-center shrink-0">
            ✓
          </div>
          <div className="font-medium text-sm">
            Invitation sent successfully!
          </div>
        </div>
      )}

      {/* Side Panel: Candidate Review */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCandidate(null)}>
          <div className="w-full max-w-[450px] h-full bg-white dark:bg-[#161c24] shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 translate-x-0" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Candidate Review</h2>
              <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors"><X size={20}/></button>
            </div>
            
            {/* Profile Header */}
            <div className="flex gap-4 items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1890FF]/20 to-[#1890FF]/5 flex items-center justify-center text-[#1890FF] font-bold text-2xl ring-4 ring-white dark:ring-[#161c24]">
                {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold dark:text-white">{selectedCandidate.name}</h3>
                <p className="text-sm font-medium text-gray-500">{selectedCandidate.role}</p>
              </div>
              <div className="ml-auto text-center bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl">
                <div className={`text-xl font-black ${selectedCandidate.score >= 90 ? 'text-[#00A76F]' : 'text-[#FFC107]'}`}>{selectedCandidate.score}%</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">AI Match</div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">AI Insights</h4>
                <div className="bg-[#1890FF]/5 border border-[#1890FF]/20 rounded-xl p-4 text-sm text-[#212b36] dark:text-gray-300 leading-relaxed shadow-sm">
                  <p className="flex gap-2.5 mb-2.5"><CheckCircle size={16} className="text-[#00A76F] mt-0.5 shrink-0" /> <span><strong>Strong fit:</strong> Extensive experience in <span className="font-semibold">{selectedCandidate.skills[0]}</span> and <span className="font-semibold">{selectedCandidate.skills[1]}</span>.</span></p>
                  <p className="flex gap-2.5"><AlertCircle size={16} className="text-[#FFC107] mt-0.5 shrink-0" /> <span><strong>Note:</strong> Notice period is <span className="font-semibold">{selectedCandidate.noticePeriod}</span>. Evaluate timeline constraints.</span></p>
                </div>
              </div>

              <div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Experience & Details</h4>
                 <div className="grid grid-cols-2 gap-3">
                   <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                     <div className="text-[10px] font-semibold text-gray-400 mb-1">Company</div>
                     <div className="text-sm font-bold text-[#212b36] dark:text-white">{selectedCandidate.company}</div>
                   </div>
                   <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                     <div className="text-[10px] font-semibold text-gray-400 mb-1">Experience</div>
                     <div className="text-sm font-bold text-[#212b36] dark:text-white">{selectedCandidate.experience}</div>
                   </div>
                   <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                     <div className="text-[10px] font-semibold text-gray-400 mb-1">Location</div>
                     <div className="text-sm font-bold text-[#212b36] dark:text-white">{selectedCandidate.location}</div>
                   </div>
                   <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                     <div className="text-[10px] font-semibold text-gray-400 mb-1">Applied</div>
                     <div className="text-sm font-bold text-[#212b36] dark:text-white">{selectedCandidate.time}</div>
                   </div>
                 </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Resume</h4>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-center p-8 text-gray-400 flex-col gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText size={24} className="text-[#1890FF]" />
                  </div>
                  <p className="text-sm font-medium text-[#212b36] dark:text-gray-300">resume_{selectedCandidate.name.split(' ')[0].toLowerCase()}.pdf</p>
                  <span className="text-[11px] font-bold text-[#1890FF]">View Full Document</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
               <button onClick={() => {
                 setPipelineBoard(prev => prev.map(c => ({...c, candidates: c.candidates.filter(cand => cand.id !== selectedCandidate.id)})));
                 setSelectedCandidate(null);
               }} className="flex-1 py-2 bg-[#FF5630]/10 text-[#FF5630] text-sm font-bold rounded-lg hover:bg-[#FF5630]/20 transition-colors cursor-pointer">Reject</button>
               <button onClick={() => setSelectedCandidate(null)} className="flex-1 py-2 bg-[#1890FF] text-white text-sm font-bold rounded-lg hover:bg-[#1890FF]/90 shadow-md shadow-[#1890FF]/20 transition-all cursor-pointer">Advance Candidate</button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'Settings' && (
        <div className="animate-fade-in space-y-6 pb-12">
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            {/* Job Settings - Full Width */}
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 xl:col-span-2 flex flex-col">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">
                <Settings size={20} className="text-gray-400" /> Job Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-2">Job Title</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-sm dark:text-white" defaultValue="Senior AI Research Scientist" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-2">Location</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-sm dark:text-white" defaultValue="Bangalore, India" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-2">Job Status</label>
                  <select className="w-full px-4 py-2.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-sm dark:text-white cursor-pointer" defaultValue="Published">
                    <option>Published</option>
                    <option>Draft</option>
                    <option>On Hold</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <button className="px-6 py-2.5 text-sm font-bold text-[#637381] bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">Cancel</button>
                <button className="px-6 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 shadow-md shadow-[#1890FF]/20 rounded-xl transition-colors cursor-pointer">Save Changes</button>
              </div>
            </div>

            {/* AI Screening Rules */}
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 flex flex-col">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">
                <Star size={20} className="text-[#00A76F]" /> AI Screening & Automation
              </h3>
              
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-[#212b36] dark:text-white">Auto-Reject Threshold</label>
                    <span className="text-sm font-bold text-[#00A76F] bg-[#00A76F]/10 px-2 py-0.5 rounded-lg">60%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="60" className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00A76F]" />
                  <p className="text-xs text-[#637381] mt-2">Automatically move candidates scoring below this match threshold to the "Reject" stage.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700/50 rounded-xl cursor-pointer hover:border-[#1890FF]/40 bg-gray-50/50 dark:bg-gray-800/30 transition-colors">
                    <input type="checkbox" defaultChecked className="mt-1 accent-[#1890FF] w-4 h-4 cursor-pointer" />
                    <div>
                      <span className="block text-sm font-bold text-[#212b36] dark:text-white">Strict Location Match</span>
                      <span className="block text-xs text-[#637381] mt-1 leading-relaxed">Only accept candidates located in Bangalore or willing to relocate.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700/50 rounded-xl cursor-pointer hover:border-[#1890FF]/40 bg-gray-50/50 dark:bg-gray-800/30 transition-colors">
                    <input type="checkbox" defaultChecked className="mt-1 accent-[#1890FF] w-4 h-4 cursor-pointer" />
                    <div>
                      <span className="block text-sm font-bold text-[#212b36] dark:text-white">Require Assessment</span>
                      <span className="block text-xs text-[#637381] mt-1 leading-relaxed">Automatically send coding test to candidates scoring {'>'}85%.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Interview Defaults */}
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 flex flex-col">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-[#FFC107]" /> Interview Defaults
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 content-start">
                <div>
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-2">Default Duration</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-sm dark:text-white cursor-pointer" defaultValue="45 Minutes">
                    <option>30 Minutes</option>
                    <option>45 Minutes</option>
                    <option>60 Minutes</option>
                    <option>90 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-2">Default Platform</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-sm dark:text-white cursor-pointer" defaultValue="Google Meet">
                    <option>Zoom</option>
                    <option>Google Meet</option>
                    <option>Microsoft Teams</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-2">Scorecard Template</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-sm dark:text-white cursor-pointer">
                    <option>Engineering (Standard)</option>
                    <option>Engineering (Leadership)</option>
                    <option>General Tech</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
