import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, UserX, UserCheck, ChevronRight, TrendingUp, Search, Star, FileText, CheckSquare, Clock, MapPin, Plus, Calendar, ClipboardEdit, FileCheck, AlertCircle, UserPlus, Activity, X } from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';// --- MOCK DATA ---
const trendData = [
  { date: 'Aug 1', applications: 12 },
  { date: 'Aug 5', applications: 25 },
  { date: 'Aug 10', applications: 18 },
  { date: 'Aug 15', applications: 45 },
  { date: 'Aug 20', applications: 38 },
  { date: 'Aug 25', applications: 60 },
  { date: 'Aug 30', applications: 52 },
];

const sourceData = [
  { name: 'LinkedIn', value: 45, quality: 4.8 },
  { name: 'Referrals', value: 25, quality: 4.9 },
  { name: 'Careers Page', value: 20, quality: 4.2 },
  { name: 'Indeed', value: 10, quality: 3.5 },
];

const COLORS = ['#1890FF', '#00A76F', '#FFC107', '#FF5630'];

const pipelineData = [
  { stage: 'Application Review', count: 124, avgTime: '2d' },
  { stage: 'To be rejected', count: 45, avgTime: null },
  { stage: 'To be rejected - After interview', count: 12, avgTime: null },
  { stage: 'Reference Check', count: 8, avgTime: '14d', warning: true },
  { stage: 'Put on hold', count: 3, avgTime: '21d', warning: true },
  { stage: 'Offer', count: 2, avgTime: '3d' },
  { stage: 'Hired', count: 1, avgTime: null },
];

const rediscoveryCandidates = [
  { id: 1, name: 'Sarah Jenkins', role: 'Senior React Developer', match: '98%', lastContact: '2 months ago' },
  { id: 2, name: 'Michael Chen', role: 'Frontend Engineer', match: '95%', lastContact: '6 months ago' },
  { id: 3, name: 'Emily Davis', role: 'UI Developer', match: '92%', lastContact: '1 year ago' },
];

const hiringTeam = [
  { id: 1, name: 'Alice (Recruiter)', initials: 'AL', color: 'bg-[#1890FF]/20 text-[#1890FF]' },
  { id: 2, name: 'Bob (Manager)', initials: 'BO', color: 'bg-[#00A76F]/20 text-[#00A76F]' },
  { id: 3, name: 'Charlie (Interviewer)', initials: 'CH', color: 'bg-[#FFC107]/20 text-[#b78103]' },
];

const actionItems = [
  { id: 1, title: 'Interview with Jane Doe', subtitle: 'Today, 2:00 PM', type: 'interview' },
  { id: 2, title: 'Review 3 Scorecards', subtitle: 'High Priority', type: 'review' },
  { id: 3, title: 'Approve Offer: Michael', subtitle: 'Due tomorrow', type: 'offer' },
];

const roleOptions = [
  { value: 'interviewer', label: 'Interviewer', description: 'Can score candidates' },
  { value: 'hiring_manager', label: 'Hiring Manager', description: 'Full access to pipeline and offers' },
  { value: 'recruiter', label: 'Recruiter', description: 'Can manage pipeline and screen candidates' },
  { value: 'observer', label: 'Observer', description: 'Read-only access' }
];

const recentActivity = [
  { id: 1, action: 'Jane Doe applied for the role via LinkedIn', time: '2 hours ago', icon: UserPlus, color: 'text-[#1890FF] bg-[#1890FF]/10' },
  { id: 2, action: 'Alice left a 4-star scorecard for Michael Chen', time: '4 hours ago', icon: Star, color: 'text-[#FFC107] bg-[#FFC107]/10' },
  { id: 3, action: 'Bob moved Sarah Jenkins to Tech Interview', time: 'Yesterday, 3:30 PM', icon: Activity, color: 'text-[#00A76F] bg-[#00A76F]/10' },
  { id: 4, action: 'Automated screening rejected 12 candidates', time: 'Yesterday, 9:00 AM', icon: UserX, color: 'text-[#FF5630] bg-[#FF5630]/10' },
];

export default function JobDashboardPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  const handleSendInvite = () => {
    setIsInviteModalOpen(false);
    setInviteRole('');
    setShowInviteSuccess(true);
    setTimeout(() => {
      setShowInviteSuccess(false);
    }, 3000);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6 relative">
      
      {/* HEADER */}
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
        
        {/* LEFT COLUMN (Charts) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Trend Chart */}
          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-[#00A76F]" />
                Application Trends
              </h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A76F" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00A76F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#919eab', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#919eab', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ color: '#212b36', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#00A76F" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sources Breakdown */}
          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6">Candidate Source Breakdown & Quality</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-[#212b36] dark:text-white ">100%</span>
                  <span className="text-xs text-[#637381] dark:text-white ">Sources</span>
                </div>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                {sourceData.map((source, index) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm font-medium text-[#212b36] dark:text-white ">{source.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[#637381] dark:text-white w-12 text-right">{source.value}%</span>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md min-w-[60px] justify-center">
                        <Star size={12} className="text-[#FFC107] fill-[#FFC107]" />
                        <span className="text-xs font-bold text-[#b78103]">{source.quality}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
          
          {/* Action Items */}
          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-[#FF5630]" />
              Action Items
            </h3>
            <div className="space-y-3">
              {actionItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:border-[#1890FF]/30 hover:shadow-sm transition-all cursor-pointer group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.type === 'interview' ? 'bg-[#FFC107]/10 text-[#FFC107]' :
                    item.type === 'review' ? 'bg-[#1890FF]/10 text-[#1890FF]' :
                    'bg-[#00A76F]/10 text-[#00A76F]'
                  }`}>
                    {item.type === 'interview' && <Calendar size={14} />}
                    {item.type === 'review' && <ClipboardEdit size={14} />}
                    {item.type === 'offer' && <FileCheck size={14} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors leading-tight mb-1">{item.title}</h4>
                    <p className="text-xs font-medium text-[#637381] dark:text-white ">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6">Pipeline</h3>
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

          {/* Talent Rediscovery */}
          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                <Search size={20} className="text-[#1890FF]" />
                Talent Rediscovery
              </h3>
            </div>
            <p className="text-sm text-[#637381] dark:text-white mb-3 leading-relaxed">
              TalentFlow system found past candidates in your database perfectly matching your open roles.
            </p>
            
            <div className="space-y-2">
              {rediscoveryCandidates.slice(0, 2).map(candidate => (
                <div key={candidate.id} className="border border-gray-100 dark:border-gray-800/50 p-2.5 rounded-xl hover:border-[#1890FF]/30 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">{candidate.name}</h4>
                    <span className="text-[10px] font-bold text-[#00A76F] bg-[#00A76F]/10 px-1.5 py-0.5 rounded-full">
                      {candidate.match} Match
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#637381] dark:text-white ">
                    {candidate.role} <span className="text-gray-300 mx-1">•</span> <span className="text-[10px] text-[#919eab]">{candidate.lastContact}</span>
                  </p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-3 py-1.5 text-sm font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors flex items-center justify-center gap-1">
              View All Matches <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800/50">
              <h2 className="text-lg font-bold text-[#212b36] dark:text-white ">Invite Team Member</h2>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 dark:text-white hover:text-gray-600 transition-colors">
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
    </div>
  );
}
