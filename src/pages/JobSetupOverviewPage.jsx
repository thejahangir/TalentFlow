import React, { useState, useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings2, X, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';
import DualRangeSlider from '../components/ui/DualRangeSlider';
import JobSetupHeader from '../components/dashboard/JobSetupHeader';

export default function JobSetupOverviewPage() {
  const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0); // 0 to 5 for steps, -1 for closed
  const location = useLocation();
  const navigate = useNavigate();
  const initialJobData = location.state?.jobData;

  const tourSteps = [
    { target: '.tour-step-confidentiality', title: 'Job Confidentiality', content: 'Mark this job as confidential to restrict access to Admins and the Hiring Manager. It will be hidden from the general team dashboard.' },
    { target: '.tour-step-2', title: 'Basic Information', content: 'Start by filling out the Job Title, Department, and Requisition Ref.' },
    { target: '.tour-step-3', title: 'Budget & Headcount', content: 'Set the required headcount and approved salary range here.' },
    { target: '.tour-step-4', title: 'Logistics', content: 'Define the location, employment type, and work mode.' },
    { target: '.tour-step-5', title: 'Internal Notes', content: "Add any private notes or context that won't be visible to candidates." },
    { target: '.tour-step-6', title: 'Save & Continue', content: 'Save your progress as a draft or proceed to the next setup step.' }
  ];

  useEffect(() => {
    // Auto-start tour on mount
    setTourStep(0);
  }, []);

  const [jobData, setJobData] = useState({
    title: initialJobData?.title || '',
    department: initialJobData?.department || '',
    location: initialJobData?.location || '',
    type: initialJobData?.type || 'Full-time',
    workMode: initialJobData?.workMode || 'On-site',
    headcount: initialJobData?.headcount || '1',
    salaryMin: initialJobData?.salaryMin || '',
    salaryMax: initialJobData?.salaryMax || '',
    currency: initialJobData?.currency || 'INR',
    internalNotes: initialJobData?.internalNotes || '',
    requisitionRef: initialJobData?.requisitionRef || '',
    status: initialJobData?.status || 'Draft',
    isConfidential: initialJobData?.isConfidential || false
  });

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

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const CustomTour = () => {
    const [targetRect, setTargetRect] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      if (tourStep < 0 || tourStep >= tourSteps.length) return;
      
      const updateRect = () => {
        const el = document.querySelector(tourSteps[tourStep].target);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom,
            right: rect.right
          });
        }
      };

      const el = document.querySelector(tourSteps[tourStep].target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      updateRect();
      
      window.addEventListener('scroll', updateRect, { passive: true });
      window.addEventListener('resize', updateRect, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', updateRect);
        window.removeEventListener('resize', updateRect);
      };
    }, [tourStep]);

    if (tourStep < 0 || tourStep >= tourSteps.length || !targetRect) return null;

    const step = tourSteps[tourStep];
    const isLast = tourStep === tourSteps.length - 1;

    // Calculate tooltip position (prefer bottom, fallback to top/side based on screen space)
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const isTooltipAbove = spaceBelow < 250 && targetRect.top > 250;
    
    const tooltipWidth = 320;
    let leftPos = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
    // Clamp to screen edges to prevent overflow
    leftPos = Math.max(20, Math.min(leftPos, window.innerWidth - tooltipWidth - 20));
    
    // Calculate arrow position relative to tooltip (pointing to exact center of target)
    let arrowLeft = (targetRect.left + targetRect.width / 2) - leftPos - 8;
    // Clamp arrow so it doesn't break out of the tooltip's rounded corners
    arrowLeft = Math.max(20, Math.min(arrowLeft, tooltipWidth - 36));

    const tooltipStyle = {
      position: 'fixed',
      left: leftPos,
      width: tooltipWidth,
      ...(isTooltipAbove 
        ? { bottom: window.innerHeight - targetRect.top + 16 }
        : { top: targetRect.bottom + 16 }
      ),
      zIndex: 10001
    };

    return createPortal(
      <>
        {/* Full screen dark overlay cutout */}
        <div 
          className="fixed z-[9999] rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)'
          }}
        />

        {/* Tooltip */}
        <div 
          className="fixed bg-white dark:bg-[#161c24] p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800/80 font-sans"
          style={tooltipStyle}
        >
          {/* Arrow */}
          <div 
            className="absolute w-4 h-4 bg-white dark:bg-[#161c24] border-gray-100 dark:border-gray-800/80 rotate-45"
            style={{
              [isTooltipAbove ? 'bottom' : 'top']: -8,
              left: arrowLeft,
              borderBottom: isTooltipAbove ? '1px solid' : 'none',
              borderRight: isTooltipAbove ? '1px solid' : 'none',
              borderTop: !isTooltipAbove ? '1px solid' : 'none',
              borderLeft: !isTooltipAbove ? '1px solid' : 'none',
            }}
          />
          
          <div className="relative z-10">
            <div className="mb-2 flex justify-between items-start">
              <h3 className="text-[13px] font-bold text-[#212b36] dark:text-white pr-4">{step.title}</h3>
              <button onClick={() => setTourStep(-1)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 transition-colors cursor-pointer">
                <X size={14} />
              </button>
            </div>
            <div className="text-[11px] text-black dark:text-gray-300 leading-relaxed mb-5">
              {step.content}
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setTourStep(-1)} 
                className="text-[11px] font-bold text-black hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                Skip Tour
              </button>
              
              <div className="flex gap-2">
                {tourStep > 0 && (
                  <button onClick={() => setTourStep(t => t - 1)} className="p-1.5 text-gray-500 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                    <ArrowLeft size={14} />
                  </button>
                )}
                <button onClick={() => isLast ? setTourStep(-1) : setTourStep(t => t + 1)} className="px-3 py-1.5 text-[11px] font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer">
                  {isLast ? 'Finish' : 'Next'} {!isLast && <ArrowRight size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>,
      document.body
    );
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
      <CustomTour />
      
      <div className="relative z-10 w-full mb-2">
        <JobSetupHeader 
          title={`Job Setup: ${jobData.title || 'New Job'}`} 
          subtitle="Define the core administrative details for this role." 
          isConfidential={jobData.isConfidential}
          onConfidentialChange={(val) => handleInputChange('isConfidential', val)}
        />
      </div>

      <div className="flex-1 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm transition-all hover:shadow-md tour-step-2">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-base font-bold text-[#212b36] dark:text-white">Basic Information</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-black tracking-wider">Job Title</label>
                    {jobData.status === 'Published' || jobData.status !== 'Draft' ? (
                      <div className="flex items-center gap-3">
                        <span className="bg-[#00A76F]/10 text-[#00A76F] text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A76F]"></span>
                          Published
                        </span>
                        <span className="text-xs font-medium text-[#212b36] dark:text-gray-400">
                          Posted: 2026-08-10
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Draft
                        </span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all text-[#212b36] dark:text-white placeholder-gray-400"
                    placeholder="e.g. Senior Product Designer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-black tracking-wider mb-2">Department</label>
                    <input 
                      type="text" 
                      value={jobData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all text-[#212b36] dark:text-white placeholder-gray-400"
                      placeholder="e.g. Design"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black tracking-wider mb-2">Requisition Ref</label>
                    <input 
                      type="text" 
                      value={jobData.requisitionRef}
                      onChange={(e) => handleInputChange('requisitionRef', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all text-[#212b36] dark:text-white placeholder-gray-400"
                      placeholder="e.g. REQ-2024-001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Budget & Headcount Card */}
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm transition-all hover:shadow-md tour-step-3">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-base font-bold text-[#212b36] dark:text-white">Budget & Headcount</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-black tracking-wider mb-2">Headcount Required</label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleInputChange('headcount', Math.max(1, Number(jobData.headcount) - 1))}
                      className="w-10 h-10 rounded-l-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-center text-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      value={jobData.headcount}
                      onChange={(e) => handleInputChange('headcount', e.target.value)}
                      className="w-20 h-10 border-y border-x-0 border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#161c24] text-center text-sm font-bold focus:outline-none text-[#212b36] dark:text-white"
                    />
                    <button 
                      onClick={() => handleInputChange('headcount', Number(jobData.headcount) + 1)}
                      className="w-10 h-10 rounded-r-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-center text-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-black tracking-wider mb-2 flex justify-between">
                    <span>Approved Salary Range</span>
                    <span className="text-[#1890FF] bg-[#1890FF]/10 px-2 py-0.5 rounded-md text-[10px]">{jobData.currency}</span>
                  </label>
                  <div className="px-2">
                    <DualRangeSlider 
                      min={0}
                      max={500000}
                      value={[Number(jobData.salaryMin) || 50000, Number(jobData.salaryMax) || 150000]}
                      onChange={(values) => {
                        setJobData(prev => ({ ...prev, salaryMin: values[0].toString(), salaryMax: values[1].toString() }));
                      }}
                      currency={jobData.currency}
                    />
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Logistics Card */}
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm transition-all hover:shadow-md tour-step-4">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-base font-bold text-[#212b36] dark:text-white">Logistics</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-black tracking-wider mb-2">Location</label>
                  <input 
                    type="text" 
                    value={jobData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all text-[#212b36] dark:text-white placeholder-gray-400"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-black tracking-wider mb-2">Employment Type</label>
                    <SearchableSelect 
                      options={[
                        { label: 'Full-time', value: 'Full-time' },
                        { label: 'Part-time', value: 'Part-time' },
                        { label: 'Contract', value: 'Contract' },
                        { label: 'Internship', value: 'Internship' }
                      ]}
                      value={jobData.type}
                      onChange={(value) => handleInputChange('type', value)}
                      placeholder="Select type..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black tracking-wider mb-2">Work Mode</label>
                    <SearchableSelect 
                      options={[
                        { label: 'On-site', value: 'On-site' },
                        { label: 'Hybrid', value: 'Hybrid' },
                        { label: 'Remote', value: 'Remote' }
                      ]}
                      value={jobData.workMode}
                      onChange={(value) => handleInputChange('workMode', value)}
                      placeholder="Select mode..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Notes Card */}
            <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm transition-all hover:shadow-md tour-step-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <h2 className="text-base font-bold text-[#212b36] dark:text-white">Internal Notes</h2>
              </div>
              
              <div>
                <textarea 
                  rows="5"
                  value={jobData.internalNotes}
                  onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                  className="w-full px-4 py-3 bg-yellow-50/30 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-700/30 rounded-xl text-sm focus:bg-white dark:focus:bg-[#161c24] focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all resize-y text-[#212b36] dark:text-white placeholder-gray-400"
                  placeholder="Add any private notes, recruiter context, or approval chain details here. This will not be visible to candidates..."
                ></textarea>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <div className="flex items-center gap-4 p-2 rounded-2xl tour-step-6">
          <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsConfirmDraftModalOpen(true)}
            className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => navigate('/dashboard/job-setup/description-skills', { state: { jobData } })}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >Save and Continue to 'Description & Skills'</button>
          </div>
        </div>
      </div>
      
      {/* Confirm Draft Modal */}
      {isConfirmDraftModalOpen && createPortal(
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
        </div>,
        document.body
      )}

      {tourStep < 0 && (
          <button 
            onClick={() => setTourStep(0)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#1890FF] bg-[#1890FF]/10 rounded-xl hover:bg-[#1890FF]/20 transition-colors cursor-pointer absolute top-6 right-6"
          >
            <Info size={16} /> Product Tour
          </button>
        )}
    </div>
  );
}
