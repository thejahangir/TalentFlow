import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Star, GripVertical, Settings2, Plus, Info, X, ChevronDown, 
  ChevronRight, BrainCircuit, Lightbulb, GraduationCap, Briefcase, 
  User, CheckCircle2, Play, Trash2, Code, ArrowRight, FileText, Loader2, Edit3, Wand2
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRuleItem({ rule, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id });
  const [isEditing, setIsEditing] = useState(rule.isNew || false);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const cardColor = rule.color || '#1890FF';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex flex-col h-full rounded-xl border ${isDragging ? 'border-[#1890FF] shadow-2xl bg-white dark:bg-[#212b36] scale-[1.02]' : 'border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-[#161c24] hover:shadow-md'} transition-all duration-300 group overflow-hidden relative`}
    >
      
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="absolute top-4 left-4 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 z-20">
        <GripVertical size={16} />
      </div>

      <div className="p-6 flex-1 flex flex-col relative z-10 pt-6">
        {isEditing ? (
          <div className="flex flex-col h-full gap-5 relative">
            <div className="flex justify-between items-center gap-4">
               <input
                 type="text"
                 value={rule.skill}
                 onChange={(e) => onUpdate(rule.id, 'skill', e.target.value)}
                 className="flex-1 px-4 py-2.5 bg-gray-50/50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl text-[15px] font-bold text-[#212b36] dark:text-white focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all outline-none shadow-sm"
                 placeholder="Skill Name"
               />
               <div className="flex items-center gap-2">
                 <input
                   type="number"
                   min="0"
                   max="100"
                   value={rule.weight === 0 && !rule.weight ? '' : rule.weight}
                   onChange={(e) => onUpdate(rule.id, 'weight', Number(e.target.value))}
                   className="w-20 px-3 py-2.5 bg-gray-50/50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-center text-[#212b36] dark:text-white focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all outline-none shadow-sm"
                 />
                 <span className="text-sm font-bold text-gray-400">%</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Description</label>
               <textarea
                 value={rule.description}
                 onChange={(e) => onUpdate(rule.id, 'description', e.target.value)}
                 className="w-full flex-1 min-h-[100px] px-4 py-3 bg-gray-50/50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-[#212b36] dark:text-white focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all outline-none resize-none shadow-sm leading-relaxed"
                 placeholder="Brief description..."
               />
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full relative">
            <div className="absolute -top-6 -right-6 w-32 h-32 flex items-center justify-center opacity-[0.03] pointer-events-none transform rotate-12">
               <svg viewBox="0 0 100 100" className="w-full h-full" style={{ fill: cardColor }}>
                 <path d="M50 0L61 39L100 50L61 61L50 100L39 61L0 50L39 39L50 0Z" />
               </svg>
            </div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h4 className="text-[16px] font-semibold text-[#212b36] dark:text-white leading-snug pr-4">{rule.skill || 'New Skill'}</h4>
              <span className="text-[16px] font-semibold tracking-tight shrink-0" style={{ color: cardColor }}>{rule.weight}%</span>
            </div>
            
            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-2 relative z-10 line-clamp-4">
              {rule.description || 'No description provided.'}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800/50 p-3 flex items-center justify-center gap-1 bg-gray-50/30 dark:bg-[#1a222c]/30 rounded-b-xl">
         {isEditing ? (
            <button onClick={() => setIsEditing(false)} title="Save" className="p-2 text-[#00A76F] hover:bg-[#00A76F]/10 rounded-xl transition-colors cursor-pointer">
              <CheckCircle2 size={18} />
            </button>
         ) : (
            <button onClick={() => setIsEditing(true)} title="Edit" className="p-2 text-[#1890FF] hover:bg-[#1890FF]/10 rounded-xl transition-colors cursor-pointer">
              <Edit3 size={18} />
            </button>
         )}
         <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
         <button onClick={() => onDelete(rule.id)} title="Delete" className="p-2 text-[#FF5630] hover:bg-[#FF5630]/10 rounded-xl transition-colors cursor-pointer">
           <Trash2 size={18} />
         </button>
      </div>
    </div>
  );
}

export default function JobSetupRankingRulesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state?.jobData;

  const [rules, setRules] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteConfirmRuleId, setDeleteConfirmRuleId] = useState(null);

  const [aiSettings, setAiSettings] = useState({
    semantic: true,
    recency: true,
    transferable: true,
    roleSimilarity: true,
    projectContext: true
  });

  const [threshold, setThreshold] = useState(80);
  
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [howItWorksExpanded, setHowItWorksExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);

  const [mockCandidates] = useState([
    { id: 1, rank: '01', name: 'Priya Sharma', score: 94, match: 'Excellent', color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10', avatar: 'PS', initialsBg: 'bg-emerald-100 text-emerald-700', description: 'Strong match across all mandatory criteria, including 6+ years of relevant experience and recent Python & Deep Learning experience. The candidate also has strong project similarity and meets all required skills.', scores: [{label: 'Deep Learning Experience', score: 95}, {label: 'Python Proficiency', score: 92}, {label: 'System Design', score: 88}, {label: 'Role Similarity', score: 91}] },
    { id: 2, rank: '02', name: 'Rahul Verma', score: 89, match: 'Strong', color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10', avatar: 'RV', initialsBg: 'bg-blue-100 text-blue-700', description: 'Very solid foundation in Python but slightly less Deep Learning production experience. System design knowledge is above average.', scores: [{label: 'Deep Learning Experience', score: 82}, {label: 'Python Proficiency', score: 95}, {label: 'System Design', score: 80}, {label: 'Role Similarity', score: 85}] },
    { id: 3, rank: '03', name: 'Amit Kumar', score: 84, match: 'Strong', color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10', avatar: 'AK', initialsBg: 'bg-purple-100 text-purple-700', description: 'Great System Design experience and solid Python skills, however, Deep Learning experience is somewhat dated.', scores: [{label: 'Deep Learning Experience', score: 75}, {label: 'Python Proficiency', score: 88}, {label: 'System Design', score: 94}, {label: 'Role Similarity', score: 78}] },
    { id: 4, rank: '04', name: 'Sneha Das', score: 76, match: 'Moderate', color: 'text-[#FFAB00]', bg: 'bg-[#FFAB00]/10', avatar: 'SD', initialsBg: 'bg-orange-100 text-orange-700', description: 'Shows potential but falls short on the core Deep Learning requirements and overall system design scaling experience.', scores: [{label: 'Deep Learning Experience', score: 65}, {label: 'Python Proficiency', score: 80}, {label: 'System Design', score: 60}, {label: 'Role Similarity', score: 70}] },
    { id: 5, rank: '05', name: 'Karan Singh', score: 64, match: 'Low', color: 'text-[#FF5630]', bg: 'bg-[#FF5630]/10', avatar: 'KS', initialsBg: 'bg-red-100 text-red-700', description: 'Lacks required Python proficiency and has minimal Deep Learning exposure. Not recommended for this role.', scores: [{label: 'Deep Learning Experience', score: 40}, {label: 'Python Proficiency', score: 55}, {label: 'System Design', score: 50}, {label: 'Role Similarity', score: 45}] },
  ]);
  const [selectedPreviewCandidate, setSelectedPreviewCandidate] = useState(mockCandidates[0]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const totalWeight = rules.reduce((acc, r) => acc + (r.weight || 0), 0);
  const isValid = isGenerated && totalWeight === 100 && rules.length > 0;

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setRules([
        { id: 1, skill: 'Deep Learning Experience', weight: 40, description: 'Must have extensive production experience with deep learning frameworks (PyTorch/TensorFlow) and model deployment.', color: '#1890FF' },
        { id: 2, skill: 'Python Proficiency', weight: 30, description: 'Advanced Python skills including async programming, memory management, and optimizing high-performance code.', color: '#1890FF' },
        { id: 3, skill: 'System Design', weight: 20, description: 'Ability to architect scalable machine learning infrastructure and data pipelines handling large-scale data.', color: '#1890FF' },
        { id: 4, skill: 'Cloud Infrastructure', weight: 10, description: 'Familiarity with AWS/GCP, Docker, and Kubernetes for ML model serving and orchestration.', color: '#1890FF' }
      ]);
      setIsGenerated(true);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setRules((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateRule = (id, field, value) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleAddRule = () => {
    setRules(prev => [...prev, { id: Date.now(), skill: '', weight: 0, description: '', color: '#00A76F', isNew: true }]);
  };

  const confirmDelete = () => {
    if (deleteConfirmRuleId) {
      setRules(prev => prev.filter(r => r.id !== deleteConfirmRuleId));
      setDeleteConfirmRuleId(null);
    }
  };

  const handleSaveAndContinue = () => {
    if (!isValid) return;
    navigate('/dashboard/job-setup/agencies', { state: { jobData } });
  };

  if (!jobData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">No Job Selected</h2>
        <p className="text-black mb-6">Please create a job or select one to view its setup overview.</p>
        <button onClick={() => navigate('/dashboard/jobs')} className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer">
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-100px)] relative">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-2 px-2">
          <div>
            <h2 className="text-[20px] font-bold text-[#212b36] dark:text-white flex items-center gap-2">
          
              Ranking Rules
            </h2>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
              Define the skills and their respective weights to rank candidates.
            </p>
          </div>
          
          {isGenerated && (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGenerate} 
                className="px-5 py-2.5 bg-[#1890FF] hover:bg-[#1890FF]/90 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm whitespace-nowrap"
              >
                <Wand2 size={16} />
                Regenerate from JD
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 dark:bg-[#161c24]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fade-in rounded-2xl">
              <div className="w-16 h-16 bg-[#1890FF]/10 text-[#1890FF] rounded-full flex items-center justify-center mb-4">
                <Loader2 size={32} className="animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white">Generating Ranking Rules...</h3>
              <p className="text-sm text-gray-500 mt-2">Analyzing Job Description to extract key criteria</p>
            </div>
          )}

          {!isGenerated ? (
            <div className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-700 rounded-[20px] bg-gray-50/30 dark:bg-[#161c24]/30">
               <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-6">
                 <FileText size={24} />
               </div>
               <h3 className="text-[16px] font-bold text-[#212b36] dark:text-white mb-2">No Rules Defined Yet</h3>
               <p className="text-[13px] text-gray-500 max-w-sm mx-auto mb-8">
                 Automatically extract and suggest ranking rules based on your Job Description.
               </p>
               <button 
                onClick={handleGenerate} 
                className="px-6 py-3 bg-[#1890FF] hover:bg-[#1890FF]/90 text-white rounded-xl text-sm font-bold transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Wand2 size={18} /> Generate from JD
              </button>
            </div>
          ) : (
            <div className="bg-transparent relative">
                  {/* Visual Weight Allocation Bar */}
                  <div className="mb-8 p-6 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1890FF]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
                    
                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <div>
                        <h3 className="text-[15px] font-bold text-[#212b36] dark:text-white">Weight Distribution</h3>
                        <p className="text-[12px] text-gray-500 mt-1">Allocate exactly 100% across your selected skills.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-[#212b36] dark:text-white tracking-tight">{totalWeight}%</span>
                        {totalWeight === 100 ? (
                          <span className="text-[11px] font-bold text-[#00A76F] bg-[#00A76F]/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider">
                            <CheckCircle2 size={14} /> Balanced
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            {totalWeight < 100 ? `${100 - totalWeight}% remaining` : `${totalWeight - 100}% over limit`}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* The Stacked Progress Bar */}
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800/80 rounded-full flex overflow-hidden shadow-inner relative z-10 border border-gray-200/50 dark:border-gray-700/50">
                      {rules.map((rule, idx) => (
                        <div 
                          key={rule.id} 
                          style={{ 
                            width: `${rule.weight}%`, 
                            backgroundColor: rule.color || '#1890FF'
                          }} 
                          className="h-full transition-all duration-500 ease-out relative group/segment"
                        >
                           <div className="absolute opacity-0 group-hover/segment:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#212b36] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none transition-opacity z-50 shadow-xl flex items-center gap-1.5">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: rule.color || '#1890FF' }}></div>
                             {rule.skill || 'New Rule'} ({rule.weight}%)
                             <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#212b36]"></div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={rules.map(r => r.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rules.map((rule) => (
                          <SortableRuleItem key={rule.id} rule={rule} onUpdate={handleUpdateRule} onDelete={(id) => setDeleteConfirmRuleId(id)} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <div className="mt-8 flex items-center justify-center">
                    <button onClick={handleAddRule} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#212b36] dark:text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm border border-transparent">
                      <Plus size={16} /> Add New Rule
                    </button>
                  </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto bg-white/80 dark:bg-[#161c24]/80 backdrop-blur-md sticky bottom-0 z-20 pb-2">
        <button 
          onClick={() => navigate('/dashboard/job-setup/scorecards', { state: { jobData } })}
          className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Scorecards
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsConfirmDraftModalOpen(true)}
            className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <div className="relative group/btn">
            <button 
              onClick={handleSaveAndContinue}
              disabled={!isValid}
              className={`px-6 py-3 text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer ${isValid ? 'bg-[#1890FF] hover:bg-[#1890FF]/90 shadow-[0_8px_16px_rgba(24,144,255,0.24)]' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70'}`}
            >
              Save and Continue to 'Agencies'
            </button>
            {!isValid && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gray-900 text-white text-[12px] px-3 py-2 rounded-lg pointer-events-none whitespace-nowrap z-30 shadow-xl after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                {totalWeight !== 100 ? 'Total weight must equal 100%' : 'Add at least one rule'}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Delete Confirmation Modal */}
      {deleteConfirmRuleId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] p-7 rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.2)] max-w-sm w-full mx-4 border border-gray-100 dark:border-gray-800 animate-scale-up">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-[#FF5630] rounded-full flex items-center justify-center shrink-0">
                <Trash2 size={24} />
              </div>
              <h3 className="text-[19px] font-bold text-[#212b36] dark:text-white">Delete Rule?</h3>
            </div>
            <p className="text-[14px] text-gray-500 mb-8 leading-relaxed text-center px-2">
              Are you sure you want to delete this rule? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmRuleId(null)} className="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#212b36] dark:text-white rounded-xl font-bold text-sm transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 px-5 py-2.5 bg-[#FF5630] hover:bg-[#FF5630]/90 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm shadow-[#FF5630]/20">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Ranking Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_24px_48px_rgba(0,0,0,0.2)] animate-scale-up overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800/50 bg-gradient-to-r from-gray-50 to-white dark:from-[#161c24] dark:to-[#1c2430]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1890FF] to-[#00A76F] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1890FF]/20">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                    AI Ranking Preview
                  </h3>
                  <p className="text-sm text-black mt-0.5">Mock evaluation simulating your current rule configuration.</p>
                </div>
              </div>
              <button onClick={() => setIsPreviewModalOpen(false)} className="p-2.5 text-gray-400 hover:text-[#212b36] dark:hover:text-white bg-white dark:bg-gray-800 rounded-full transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#F9FAFB] dark:bg-[#12161b]">
              
              {/* Left Panel: Candidates List */}
              <div className="w-full md:w-5/12 border-r border-gray-200 dark:border-gray-800 overflow-y-auto p-4 space-y-3">
                <div className="flex justify-between items-center px-2 pb-2">
                  <span className="text-xs font-bold text-black tracking-wider">Sample Candidates</span>
                  <span className="text-xs font-bold text-[#212b36] dark:text-gray-300">Top 5</span>
                </div>
                {mockCandidates.map((c) => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedPreviewCandidate(c)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedPreviewCandidate.id === c.id ? 'bg-white dark:bg-[#1a222c] border-[#1890FF] shadow-md ring-2 ring-[#1890FF]/10' : 'bg-white/60 dark:bg-[#161c24]/60 border-transparent hover:bg-white dark:hover:bg-[#1a222c] hover:border-gray-200 dark:hover:border-gray-700'} flex items-center gap-4 cursor-pointer relative overflow-hidden`}
                  >
                    {selectedPreviewCandidate.id === c.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1890FF]"></div>
                    )}
                    <div className="font-mono text-[10px] text-black font-bold absolute top-2 right-3">#{c.rank}</div>
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${c.initialsBg} shrink-0`}>
                      {c.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-[#212b36] dark:text-white text-[15px]">{c.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${c.color} ${c.bg}`}>
                          {c.match} Match
                        </span>
                        {c.score >= threshold && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#00A76F]">
                            <CheckCircle2 size={12} /> Auto-Shortlist
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right pl-2">
                      <div className={`text-xl font-bold ${c.score >= threshold ? 'text-[#00A76F]' : 'text-[#212b36] dark:text-white'}`}>{c.score}</div>
                      <div className="text-[10px] text-black font-medium">Score</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Right Panel: Detailed Insights */}
              <div className="w-full md:w-7/12 bg-white dark:bg-[#161c24] overflow-y-auto">
                {selectedPreviewCandidate && (
                  <div className="p-8 animate-fade-in space-y-8">
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[13px] font-bold text-[#1890FF] tracking-wider mb-1">AI Insight Report</h4>
                        <h2 className="text-2xl font-bold text-[#212b36] dark:text-white">{selectedPreviewCandidate.name}</h2>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-4 ${selectedPreviewCandidate.score >= threshold ? 'border-[#00A76F] text-[#00A76F]' : 'border-[#FFAB00] text-[#FFAB00]'}`}>
                          <span className="text-xl font-bold">{selectedPreviewCandidate.score}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30 relative">
                      <div className="absolute top-4 left-4 text-blue-300 dark:text-blue-500/30">
                        <Lightbulb size={24} />
                      </div>
                      <p className="text-[14px] leading-relaxed text-[#212b36] dark:text-gray-200 pl-8 font-medium">
                        {selectedPreviewCandidate.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[13px] font-bold text-black dark:text-gray-400 tracking-wider mb-5 flex items-center gap-2">
                        <Star size={16} /> Criteria Breakdown
                      </h4>
                      <div className="space-y-5">
                        {selectedPreviewCandidate.scores.map((item, i) => (
                          <div key={i} className="group/metric">
                            <div className="flex justify-between items-center text-[13px] font-bold mb-2">
                              <span className="text-[#212b36] dark:text-white group-hover/metric:text-[#1890FF] transition-colors">{item.label}</span>
                              <span className="text-black dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[11px]">{item.score}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                              <div className="h-full bg-gradient-to-r from-[#1890FF] to-indigo-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.score}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${selectedPreviewCandidate.score >= threshold ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                            {selectedPreviewCandidate.score >= threshold ? <CheckCircle2 size={20} /> : <X size={20} />}
                          </div>
                          <div>
                            <div className="font-bold text-[#212b36] dark:text-white text-sm">Auto-Shortlist Status</div>
                            <div className="text-[12px] text-black mt-0.5">
                              {selectedPreviewCandidate.score >= threshold ? `Passed threshold of ${threshold}%` : `Failed to meet threshold of ${threshold}%`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}

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
                  setToastMessage('Ranking rules saved as draft.');
                  setTimeout(() => navigate('/dashboard/jobs'), 1000);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Yes, Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[60] bg-white dark:bg-[#161c24] border border-[#00A76F]/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 flex items-center gap-4 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-[#00A76F]/10 flex items-center justify-center text-[#00A76F] shrink-0">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#212b36] dark:text-white">{toastMessage}</h4>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
