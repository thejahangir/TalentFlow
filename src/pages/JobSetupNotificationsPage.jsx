import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Save, X } from 'lucide-react';

export default function JobSetupNotificationsPage() {
 const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
 const location = useLocation();
 const navigate = useNavigate();
 const jobData = location.state?.jobData;

 const handleFinish = (action) => {
 setIsPublishModalOpen(false);
 navigate('/dashboard/jobs');
 };

 return (
 <div className="p-6 flex flex-col min-h-[calc(100vh-100px)] animate-fade-in">
 <div className="flex-1 space-y-6 flex flex-col">
 <h1 className="text-2xl font-bold mb-4">Notifications</h1>
 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
 <p className="text-gray-600">Dummy data for Notifications. Proper content will be shared later.</p>
 </div>
 </div>
 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
 <button 
 onClick={() => navigate('/dashboard/job-setup/agencies', { state: { jobData } })}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Agencies
 </button>
 <button 
 onClick={() => setIsPublishModalOpen(true)}
 className="px-6 py-3 bg-[#00A76F] text-white rounded-xl font-bold hover:bg-[#00A76F]/90 transition-colors shadow-sm cursor-pointer"
 >
 Finish Setup and Publish
 </button>
 </div>

 {isPublishModalOpen && createPortal(
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-scale-up overflow-hidden">
 <div className="p-6 text-center space-y-4">
 <div className="w-16 h-16 bg-[#00A76F]/10 text-[#00A76F] rounded-full flex items-center justify-center mx-auto mb-4">
 <CheckCircle2 size={32} />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Ready to Finish?</h3>
 <p className="text-sm text-black dark:text-gray-400">
 You've completed the setup for this job. Would you like to publish it now so candidates can start applying, or save it as a draft for later review?
 </p>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex flex-col sm:flex-row gap-3 bg-gray-50 dark:bg-gray-800/30">
 <button 
 onClick={() => setIsPublishModalOpen(false)} 
 className="px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer sm:mr-auto"
 >
 Cancel
 </button>
 <button 
 onClick={() => handleFinish('draft')}
 className="px-4 py-2.5 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
 >
 <Save size={16} /> Save as Draft
 </button>
 <button 
 onClick={() => handleFinish('publish')}
 className="px-4 py-2.5 text-sm font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={16} /> Publish Job
 </button>
 </div>
 </div>
 </div>,
 document.body
 )}
 </div>
 );
}
