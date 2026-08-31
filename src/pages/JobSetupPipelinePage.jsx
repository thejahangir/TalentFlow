import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Columns, GitBranch, ArrowRight, Settings, Plus, Zap, Settings2, Trash2, ArrowUp, ArrowDown, GripVertical, PenLine } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchableSelect from '../components/ui/SearchableSelect';
import JobSetupHeader from '../components/dashboard/JobSetupHeader';

const SYSTEM_STAGES = [
  'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'
];

const getStageColor = (systemStage) => {
  switch (systemStage) {
    case 'Applied': return 'from-[#1890FF] to-[#1890FF]/70 text-[#1890FF] bg-[#1890FF]/10';
    case 'Screening': return 'from-[#FFC107] to-[#FFC107]/70 text-[#FFC107] bg-[#FFC107]/10';
    case 'Interview': return 'from-[#8A2BE2] to-[#8A2BE2]/70 text-[#8A2BE2] bg-[#8A2BE2]/10';
    case 'Offer': return 'from-[#00A76F] to-[#00A76F]/70 text-[#00A76F] bg-[#00A76F]/10';
    case 'Hired': return 'from-[#00A76F] to-[#00A76F]/70 text-[#00A76F] bg-[#00A76F]/10';
    case 'Rejected': return 'from-[#FF5630] to-[#FF5630]/70 text-[#FF5630] bg-[#FF5630]/10';
    default: return 'from-[#637381] to-[#637381]/70 text-black bg-[#637381]/10';
  }
};

const TerminalSwitch = ({ isTerminal, onChange }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onChange(!isTerminal); }}
    className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
  >
    <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${isTerminal ? 'bg-[#FF5630]' : 'bg-gray-200 dark:bg-gray-700'}`}>
      <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isTerminal ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isTerminal ? 'text-[#FF5630]' : 'text-gray-400'}`}>
      {isTerminal ? 'Terminal' : 'Active'}
    </span>
  </div>
);

const SortableStageCard = ({ stage, index, totalStages, getStageColor, updateStage, removeStage, moveUp, moveDown, SYSTEM_STAGES }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 50 - index,
  };

  const colorTheme = getStageColor(stage.systemStage);
  const isTerminal = stage.isTerminal;

  return (
    <div ref={setNodeRef} style={style} className={`flex flex-col bg-white dark:bg-[#161c24] rounded-xl border ${isDragging ? 'border-[#1890FF] shadow-2xl scale-[1.02]' : isTerminal ? 'border-[#FF5630]/40 shadow-[0_4px_12px_rgba(255,86,48,0.05)]' : 'border-gray-200 dark:border-gray-700 shadow-sm'} transition-all duration-300 hover:shadow-md relative group/card`}>
      <div className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 -ml-1.5 touch-none shrink-0">
            <GripVertical size={16} />
          </div>
          
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-extrabold shrink-0 shadow-sm ${isTerminal ? 'bg-[#FF5630] text-white' : 'bg-[#1890FF] text-white'}`}>
            {index + 1}
          </div>
          
          <div className="relative flex-1 group/edit flex items-center justify-between gap-2">
            <input 
              type="text" 
              value={stage.customName}
              onChange={(e) => updateStage(index, 'customName', e.target.value)}
              className="bg-transparent text-[15px] font-semibold text-[#212b36] dark:text-white border-b border-dashed border-transparent hover:border-gray-300 dark:hover:border-gray-600 outline-none focus:border-solid focus:border-[#1890FF] focus:bg-blue-50/50 dark:focus:bg-blue-900/10 px-1 py-1 w-full transition-all"
              placeholder="Stage Name"
            />
            <div className="flex items-center gap-1 shrink-0">
               <PenLine size={14} className="text-[#1890FF] opacity-0 group-hover/edit:opacity-100 pointer-events-none transition-opacity" />
               <button 
                 onClick={() => removeStage(index)}
                 className="p-1.5 text-gray-400 hover:text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                 title="Delete Stage"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          </div>
        </div>
        
        {/* Mapping & Terminal Toggle Row */}
        <div className="flex items-center justify-between pl-[42px]">
          {/* Left: System Mapping */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 shrink-0">
               <GitBranch size={12} /> Maps to:
            </span>
            <div className="w-[120px] bg-gray-50/50 dark:bg-[#1a222c] rounded-md border border-gray-100 dark:border-gray-800">
              <SearchableSelect 
                options={SYSTEM_STAGES.map(sys => ({ label: sys, value: sys }))}
                value={stage.systemStage}
                onChange={(value) => updateStage(index, 'systemStage', value)}
                placeholder="Mapping..."
                showSearch={false}
              />
            </div>
          </div>

          {/* Right: Toggle */}
          <TerminalSwitch isTerminal={isTerminal} onChange={(val) => updateStage(index, 'isTerminal', val)} />
        </div>
      </div>
    </div>
  );
};

const StageCardReadOnly = ({ stage, index, getStageColor, updateStage }) => {
  const colorTheme = getStageColor(stage.systemStage);
  const isTerminal = stage.isTerminal;
  
  return (
    <div style={{ zIndex: 50 - index }} className={`flex flex-col bg-white dark:bg-[#161c24] rounded-xl border ${isTerminal ? 'border-[#FF5630]/40 shadow-[0_4px_12px_rgba(255,86,48,0.05)]' : 'border-gray-200 dark:border-gray-700 shadow-sm'} transition-all hover:shadow-md hover:-translate-y-0.5 relative group/card`}>
      <div className="p-4 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-extrabold shrink-0 shadow-sm ${isTerminal ? 'bg-[#FF5630] text-white' : 'bg-[#1890FF] text-white'}`}>
            {index + 1}
          </div>
          <h3 className="text-[15px] font-semibold text-[#212b36] dark:text-white leading-snug truncate">
            {stage.customName}
          </h3>
        </div>
        
        {/* Mapping & Terminal Toggle Row */}
        <div className="flex items-center justify-between pl-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 shrink-0">
               <GitBranch size={12} /> Maps to:
            </span>
            <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-md border ${colorTheme.split(' ')[2]} ${colorTheme.split(' ')[3]} border-current/20 shadow-sm bg-white dark:bg-[#161c24]`}>
              {stage.systemStage}
            </span>
          </div>

          <TerminalSwitch isTerminal={isTerminal} onChange={(val) => updateStage(index, 'isTerminal', val)} />
        </div>
      </div>
    </div>
  );
};

export default function JobSetupPipelinePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const initialJobData = location.state?.jobData;
  const [jobData, setJobData] = useState({ ...initialJobData });

  const handleJobDataChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const [stages, setStages] = useState([
    { id: '1', customName: 'Applied', systemStage: 'Applied', isTerminal: false },
    { id: '2', customName: 'Screening', systemStage: 'Screening', isTerminal: false },
    { id: '3', customName: 'Technical Interview', systemStage: 'Interview', isTerminal: false },
    { id: '4', customName: 'Offer', systemStage: 'Offer', isTerminal: false },
    { id: '5', customName: 'Hired', systemStage: 'Hired', isTerminal: true },
    { id: '6', customName: 'Rejected', systemStage: 'Rejected', isTerminal: true }
  ]);

  const updateStage = (index, field, value) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setStages(newStages);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newStages = [...stages];
    [newStages[index - 1], newStages[index]] = [newStages[index], newStages[index - 1]];
    setStages(newStages);
  };

  const moveDown = (index) => {
    if (index === stages.length - 1) return;
    const newStages = [...stages];
    [newStages[index + 1], newStages[index]] = [newStages[index], newStages[index + 1]];
    setStages(newStages);
  };

  const removeStage = (index) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const addStage = () => {
    const newId = (Math.max(...stages.map(s => parseInt(s.id) || 0), 0) + 1).toString();
    setStages([...stages, { id: newId, customName: 'New Stage', systemStage: 'Screening', isTerminal: false }]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
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
        title="Pipeline Workflow" 
        subtitle="Design the stages candidates will go through for this job." 
        isConfidential={jobData?.isConfidential}
        onConfidentialChange={(val) => handleJobDataChange('isConfidential', val)}
      />

      <div className="flex-1 space-y-6 flex flex-col">
        <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
              <GitBranch size={20} className="text-[#1890FF]" />
              Hiring Stages
            </h2>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#1890FF] rounded-lg hover:bg-[#1890FF]/90 transition-colors shadow-sm cursor-pointer"
              >
                <Settings2 size={16} />
                Edit Pipeline
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#212b36] dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer"
              >
                Done Editing
              </button>
            )}
          </div>

          <div className="relative pt-4">
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 pb-8">
                {stages.map((stage, index) => (
                  <StageCardReadOnly
                    key={stage.id}
                    stage={stage}
                    index={index}
                    getStageColor={getStageColor}
                    updateStage={updateStage}
                  />
                ))}
              </div>
            ) : (
              <>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={stages.map(s => s.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 pb-8">
                      {stages.map((stage, index) => (
                        <SortableStageCard
                          key={stage.id}
                          stage={stage}
                          index={index}
                          totalStages={stages.length}
                          getStageColor={getStageColor}
                          updateStage={updateStage}
                          removeStage={removeStage}
                          moveUp={moveUp}
                          moveDown={moveDown}
                          SYSTEM_STAGES={SYSTEM_STAGES}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="mt-8 flex items-center justify-center pb-6">
                  <button 
                    onClick={addStage}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#212b36] dark:text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm border border-transparent"
                  >
                    <Plus size={16} /> Add New Stage
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
        <button 
          onClick={() => navigate('/dashboard/job-setup/hiring-team', { state: { jobData } })}
          className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Hiring Team
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsConfirmDraftModalOpen(true)}
            className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => navigate('/dashboard/job-setup/applications', { state: { jobData } })}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >
            Save and Continue to 'Applications'
          </button>
        </div>
      </div>
      
      {/* Draft Confirm Modal */}
      {isConfirmDraftModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-scale-up overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-[#1890FF]/10 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-2">
                <Settings2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Save as Draft?</h3>
              <p className="text-sm text-black dark:text-gray-400">
                You can return and finish setting up this job pipeline later. Your current progress will be saved.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
              <button 
                onClick={() => setIsConfirmDraftModalOpen(false)} 
                className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsConfirmDraftModalOpen(false);
                  navigate('/dashboard/jobs');
                }}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Yes, Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
