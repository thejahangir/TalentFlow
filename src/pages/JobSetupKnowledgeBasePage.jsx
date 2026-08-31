import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Book, UploadCloud, FileText, Bot, HelpCircle , Settings2} from 'lucide-react';

export default function JobSetupKnowledgeBasePage() {
  const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state?.jobData;

  


  const [docs, setDocs] = useState([
    { id: 1, name: 'Company_Benefits_2024.pdf', size: '2.4 MB', type: 'PDF' },
    { id: 2, name: 'Engineering_Culture_Deck.pptx', size: '5.1 MB', type: 'PPTX' }
  ]);

  
  

  
  if (!jobData) {
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
      <div className="flex-1 space-y-6 flex flex-col">
        <div>
          <h1 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">Knowledge Base</h1>
          <p className="text-black text-sm">Upload documents to train the AI screening agent to answer candidate questions about this role.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
            <h2 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">
              <UploadCloud size={20} className="text-[#1890FF]" />
              Upload Documents
            </h2>
            
            <div className="border-2 border-dashed border-[#1890FF]/30 bg-[#1890FF]/5 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1890FF]/10 transition-colors mb-8">
              <div className="w-16 h-16 bg-white dark:bg-[#212b36] shadow-sm rounded-full flex items-center justify-center text-[#1890FF] mb-4">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-2">Drag & Drop files here</h3>
              <p className="text-black text-sm max-w-sm">Support for PDF, DOCX, TXT, and PPTX up to 50MB. These documents will be used to train the AI agent.</p>
              <button className="mt-6 px-6 py-2.5 bg-white dark:bg-[#212b36] text-[#212b36] dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Browse Files
              </button>
            </div>

            <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-4">Training Materials ({docs.length})</h3>
            <div className="space-y-3">
              {docs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800/50 hover:border-[#1890FF]/30 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-black">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#212b36] dark:text-white">{doc.name}</p>
                      <p className="text-xs text-black mt-0.5">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#00A76F] bg-[#00A76F]/10 px-2 py-1 rounded-md">Trained</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#FFC107]/5 to-transparent dark:from-[#FFC107]/10 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#FFC107]/20">
              <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-4 flex items-center gap-2">
                <Bot size={20} className="text-[#FFC107]" />
                Test the AI Agent
              </h3>
              <p className="text-sm text-black dark:text-gray-300 leading-relaxed mb-6">
                Ask a question to see how the AI responds based on the uploaded training materials.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#161c24] p-3 rounded-xl border border-gray-200 dark:border-gray-700 rounded-br-none max-w-[85%] self-end ml-auto shadow-sm">
                  <p className="text-sm text-[#212b36] dark:text-white">What is the remote work policy?</p>
                </div>
                
                <div className="bg-[#FFC107]/10 p-3 rounded-xl border border-[#FFC107]/20 rounded-bl-none max-w-[90%] shadow-sm flex gap-3">
                  <Bot size={16} className="text-[#FFC107] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#212b36] dark:text-white leading-relaxed">
                    We have a flexible hybrid policy! Employees are expected to be in the office 2 days a week, but the schedule is highly flexible. Check out the Benefits doc for more info.
                  </p>
                </div>

                <div className="relative mt-4">
                  <input 
                    type="text" 
                    placeholder="Ask another question..." 
                    className="w-full bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:border-[#FFC107]"
                  />
                  <HelpCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
        <button 
          onClick={() => navigate('/dashboard/job-setup/sourcing', { state: { jobData } })}
          className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Sourcing
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
        >Save and Continue to 'Applications'</button>
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
    </div>
  );
}
