import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bold, Italic, Underline, List, ListOrdered, Link, AlignLeft, AlignCenter, AlignRight, MessageSquare, Send, AtSign, X, Check, FileText, ThumbsDown, AlertCircle, CheckCircle2, Award } from 'lucide-react';
import JobSetupHeader from '../components/dashboard/JobSetupHeader';

// Mock Rating Component
const RatingControl = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
    <span className="text-sm font-medium text-[#212b36] dark:text-gray-300">{label}</span>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            value === num 
              ? 'bg-[#1890FF] text-white shadow-md transform scale-110' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  </div>
);

export default function JobSetupScorecardsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state?.jobData;

  const [ratings, setRatings] = useState({});
  const [recommendation, setRecommendation] = useState(null);
  
  // Note Modals state
  const [activeNoteModal, setActiveNoteModal] = useState(null); // 'private' | 'other' | null
  const [notes, setNotes] = useState({ private: '', other: '' });
  const [tempNoteText, setTempNoteText] = useState('');

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Amit (Manager)', text: 'I added the standard qualifications. Does anyone want to add specific coding test scores here?', time: '10:00 AM', color: 'bg-[#00A76F]/20 text-[#00A76F]' },
    { id: 2, user: 'Priya (Recruiter)', text: '@Amit we usually put coding scores in a separate stage, this looks good for the main interview.', time: '10:15 AM', color: 'bg-[#1890FF]/20 text-[#1890FF]' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showTagMenu, setShowTagMenu] = useState(false);

  const personalTraits = [
    'Self motivated',
    'Team player',
    'Disciplined',
    'Attention to details',
    'Communications skills',
    'Job Stability'
  ];

  const qualifications = [
    'Five years relevant experience',
    'Strong communication skill'
  ];

  const recommendationOptions = [
    { label: 'Definitely Not', value: 'definitely_not', icon: ThumbsDown, color: 'text-[#FF5630]', bgActive: 'bg-[#FF5630]/10', borderActive: 'border-[#FF5630]', shadow: 'shadow-[0_4px_12px_rgba(255,86,48,0.24)]' },
    { label: 'No', value: 'no', icon: AlertCircle, color: 'text-[#FFC107]', bgActive: 'bg-[#FFC107]/10', borderActive: 'border-[#FFC107]', shadow: 'shadow-[0_4px_12px_rgba(255,193,7,0.24)]' },
    { label: 'Yes', value: 'yes', icon: CheckCircle2, color: 'text-[#00A76F]', bgActive: 'bg-[#00A76F]/10', borderActive: 'border-[#00A76F]', shadow: 'shadow-[0_4px_12px_rgba(0,167,111,0.24)]' },
    { label: 'Strong Yes', value: 'strong_yes', icon: Award, color: 'text-[#1890FF]', bgActive: 'bg-[#1890FF]/10', borderActive: 'border-[#1890FF]', shadow: 'shadow-[0_4px_12px_rgba(24,144,255,0.24)]' }
  ];

  const handleRatingChange = (category, item, value) => {
    setRatings(prev => ({
      ...prev,
      [`${category}_${item}`]: value
    }));
  };

  const openNoteModal = (type) => {
    setTempNoteText(notes[type]);
    setActiveNoteModal(type);
  };

  const saveNote = () => {
    setNotes(prev => ({ ...prev, [activeNoteModal]: tempNoteText }));
    setActiveNoteModal(null);
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      user: 'You',
      text: chatInput,
      time: 'Just now',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    setShowTagMenu(false);
  };

  const handleChatInputChange = (e) => {
    setChatInput(e.target.value);
    if (e.target.value.endsWith('@')) {
      setShowTagMenu(true);
    } else if (showTagMenu && !e.target.value.includes('@')) {
      setShowTagMenu(false);
    }
  };

  const selectTag = (name) => {
    setChatInput(prev => prev.slice(0, -1) + `@${name} `);
    setShowTagMenu(false);
  };

  return (
    <div className="p-6 flex flex-col min-h-[calc(100vh-100px)] animate-fade-in font-sans">
      <div className="relative z-10 w-full mb-6">
        <JobSetupHeader 
          title="Scorecards" 
          subtitle="Define how interviewers will evaluate candidates for this role." 
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT PANE: Scorecard Evaluation Form (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Take-aways & Notes */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-4">Key Take-aways</h3>
            
            {/* Mock Rich Text Editor */}
            <div className="border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden focus-within:border-[#1890FF] focus-within:ring-1 focus-within:ring-[#1890FF]/20 transition-all">
              <div className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700/50 p-2 flex items-center gap-1 flex-wrap">
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Bold size={16} /></button>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Italic size={16} /></button>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Underline size={16} /></button>
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><List size={16} /></button>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><ListOrdered size={16} /></button>
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><AlignLeft size={16} /></button>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><AlignCenter size={16} /></button>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><AlignRight size={16} /></button>
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Link size={16} /></button>
              </div>
              <textarea 
                className="w-full h-32 p-4 bg-transparent resize-y outline-none text-sm text-[#212b36] dark:text-white"
                placeholder="Enter overall thoughts and key take-aways..."
              ></textarea>
            </div>

            {/* Note Links */}
            <div className="mt-4 flex gap-4">
              <button 
                onClick={() => openNoteModal('private')}
                className="text-sm font-bold text-[#1890FF] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={16} /> Private Note {notes.private && <span className="w-2 h-2 rounded-full bg-[#FF5630]"></span>}
              </button>
              <button 
                onClick={() => openNoteModal('other')}
                className="text-sm font-bold text-[#1890FF] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={16} /> Note for other interviewers {notes.other && <span className="w-2 h-2 rounded-full bg-[#00A76F]"></span>}
              </button>
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800/50 pb-3">Personal Traits</h3>
            <div className="space-y-1">
              {personalTraits.map(trait => (
                <RatingControl 
                  key={trait} 
                  label={trait} 
                  value={ratings[`traits_${trait}`]} 
                  onChange={(val) => handleRatingChange('traits', trait, val)} 
                />
              ))}
            </div>

            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 mt-8 border-b border-gray-100 dark:border-gray-800/50 pb-3">Qualifications</h3>
            <div className="space-y-1">
              {qualifications.map(qual => (
                <RatingControl 
                  key={qual} 
                  label={qual} 
                  value={ratings[`quals_${qual}`]} 
                  onChange={(val) => handleRatingChange('quals', qual, val)} 
                />
              ))}
            </div>
          </div>

          {/* Overall Recommendations */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-4">Overall Recommendation</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendationOptions.map(opt => {
                const Icon = opt.icon;
                const isActive = recommendation === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setRecommendation(opt.value)}
                    className={`relative py-2.5 px-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group cursor-pointer ${
                      isActive 
                        ? `${opt.borderActive} ${opt.bgActive} ${opt.shadow} scale-[1.02]` 
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={16} className={`${isActive ? opt.color : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className={`text-[13px] font-bold ${
                      isActive ? opt.color : 'text-[#212b36] dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`}>
                      {opt.label}
                    </span>
                    
                    {/* Selection Indicator */}
                    {isActive && (
                      <div className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${opt.color.replace('text-', 'bg-')}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT PANE: Chat Box (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col h-[600px] lg:h-auto lg:sticky lg:top-24 bg-gray-50/50 dark:bg-[#212b36]/30 rounded-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden shadow-sm">
          <div className="bg-white dark:bg-[#161c24] p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between z-10">
            <h3 className="font-bold text-[#212b36] dark:text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-[#1890FF]" /> Team Chat
            </h3>
            <span className="text-xs font-bold bg-[#1890FF]/10 text-[#1890FF] px-2 py-1 rounded-md">2 Online</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map(msg => (
              <div key={msg.id} className="animate-fade-in">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-bold text-[#212b36] dark:text-white">{msg.user}</span>
                  <span className="text-[10px] font-medium text-gray-400">{msg.time}</span>
                </div>
                <div className="bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-700/50 p-3 rounded-2xl rounded-tl-none shadow-[0_2px_10px_rgb(0,0,0,0.02)] text-sm text-[#454f5b] dark:text-gray-300 leading-relaxed">
                  {/* Highlight mentions */}
                  {msg.text.split(' ').map((word, i) => 
                    word.startsWith('@') ? <span key={i} className="font-bold text-[#1890FF] bg-[#1890FF]/10 px-1 rounded mx-0.5">{word} </span> : word + ' '
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white dark:bg-[#161c24] border-t border-gray-100 dark:border-gray-800/50 relative">
            {showTagMenu && (
              <div className="absolute bottom-full mb-2 left-4 w-48 bg-white dark:bg-[#212b36] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-20">
                <div className="p-2 text-xs font-bold text-gray-400 border-b border-gray-100 dark:border-gray-700/50">Tag a team member</div>
                <button onClick={() => selectTag('Amit')} className="w-full text-left px-3 py-2 text-sm text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Amit (Manager)</button>
                <button onClick={() => selectTag('Priya')} className="w-full text-left px-3 py-2 text-sm text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Priya (Recruiter)</button>
              </div>
            )}
            <form onSubmit={sendChatMessage} className="flex items-end gap-2">
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl flex items-center px-2 focus-within:border-[#1890FF] focus-within:ring-1 focus-within:ring-[#1890FF]/20 transition-all">
                <button type="button" onClick={() => setShowTagMenu(!showTagMenu)} className="p-1.5 text-gray-400 hover:text-[#1890FF] transition-colors" title="Tag someone">
                  <AtSign size={16} />
                </button>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={handleChatInputChange}
                  className="flex-1 bg-transparent border-none py-2.5 px-2 text-sm focus:outline-none text-[#212b36] dark:text-white"
                  placeholder="Type a message..."
                />
              </div>
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="w-11 h-11 bg-[#1890FF] text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1890FF]/90 transition-colors shrink-0 shadow-sm"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-12">
        <button 
          onClick={() => navigate('/dashboard/job-setup/applications', { state: { jobData } })}
          className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Applications
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-2.5 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => navigate('/dashboard/job-setup/ranking-rules', { state: { jobData } })}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >
            Save and Continue to 'Ranking Rules'
          </button>
        </div>
      </div>

      {/* Note Modal */}
      {activeNoteModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-lg flex flex-col shadow-2xl animate-scale-up overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-[#161c24]">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                {activeNoteModal === 'private' ? <FileText size={18} className="text-[#1890FF]" /> : <MessageSquare size={18} className="text-[#00A76F]" />}
                {activeNoteModal === 'private' ? 'Private Note' : 'Note for other interviewers'}
              </h3>
              <button onClick={() => setActiveNoteModal(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                {activeNoteModal === 'private' 
                  ? 'This note will only be visible to you and will not be shared with the hiring team.' 
                  : 'This note will be pinned to the scorecard for all other interviewers to see.'}
              </p>
              <textarea 
                value={tempNoteText}
                onChange={(e) => setTempNoteText(e.target.value)}
                className="w-full h-40 p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl outline-none text-sm focus:border-[#1890FF] focus:ring-1 focus:ring-[#1890FF]/20 resize-y text-[#212b36] dark:text-white placeholder-gray-400 transition-all"
                placeholder="Type your notes here..."
                autoFocus
              ></textarea>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-[#161c24]">
              <button 
                onClick={() => setActiveNoteModal(null)}
                className="px-4 py-2 text-sm font-bold text-[#212b36] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveNote}
                className="px-6 py-2 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check size={16} /> Save Note
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
