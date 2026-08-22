import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Columns, 
  CheckSquare, 
  BarChart2, 
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  Info,
  Rocket,
  Briefcase,
  ClipboardList,
  Calendar,
  Workflow,
  Bell,
  CheckCircle,
  Activity
} from 'lucide-react';
import UserMenu from './UserMenu';

export default function AgencySidebar({ isSidebarCollapsed }) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [expandedMenu, setExpandedMenu] = useState(null);

  const sidebarLinks = [
    { name: 'Jobs', path: '/dashboard/jobs', icon: Briefcase },
    { name: 'Job Dashboard', path: '/dashboard/agencies', icon: LayoutDashboard },
    { name: 'Sourcing', path: '/dashboard/sourcing', icon: Search },
    { name: 'Candidates', path: '/dashboard/candidates', icon: Users },
    { name: 'Pipeline', path: '/dashboard/pipeline', icon: Columns },
    { name: 'Approvals', path: '/dashboard/approvals', icon: CheckSquare },
    { name: 'Reports', path: '/dashboard/reports', icon: BarChart2 },
    { name: 'Job Setup', path: '/dashboard/job-setup', icon: Settings }
  ];

  const jobSetupSubItems = [
    { name: 'Overview', path: '/dashboard/job-setup/overview', icon: FileText },
    { name: 'Job Info', path: '/dashboard/job-setup/info', icon: Info },
    { name: 'Job Kickoff', path: '/dashboard/job-setup/kickoff', icon: Rocket },
    { name: 'Job Posts', path: '/dashboard/job-setup/posts', icon: Briefcase },
    { name: 'Scorecard', path: '/dashboard/job-setup/scorecard', icon: ClipboardList },
    { name: 'Interview Plan', path: '/dashboard/job-setup/interview-plan', icon: Calendar },
    { name: 'Stage Transitions', path: '/dashboard/job-setup/stage-transitions', icon: Workflow },
    { name: 'Hiring Team', path: '/dashboard/job-setup/hiring-team', icon: Users },
    { name: 'Notifications', path: '/dashboard/job-setup/notifications', icon: Bell },
    { name: 'Approvals', path: '/dashboard/job-setup/approvals', icon: CheckCircle },
    { name: 'Activity Feed', path: '/dashboard/job-setup/activity-feed', icon: Activity }
  ];

  const reportsSubItems = [
    { name: 'Custom Reports', path: '/dashboard/reports/custom', icon: BarChart2 },
    { name: 'Export Data', path: '/dashboard/reports/export', icon: FileText },
    { name: 'Analytics', path: '/dashboard/reports/analytics', icon: Activity }
  ];

  const getSubItems = (linkName) => {
    if (linkName === 'Job Setup') return jobSetupSubItems;
    if (linkName === 'Reports') return reportsSubItems;
    return null;
  };

  return (
    <aside className={`fixed top-16 left-0 bottom-0 bg-white dark:bg-[#161c24] border-r border-gray-200 dark:border-gray-800/50 flex flex-col z-30 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar overflow-x-hidden">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const subItems = getSubItems(link.name);
            const hasSubItems = subItems !== null;
            const isExpanded = expandedMenu === link.name;
            const isActive = currentPath === link.path || (link.path !== '/dashboard/agencies' && currentPath.includes(link.path));
            
            const renderLinkContent = () => (
              <>
                <Icon size={20} className="shrink-0 text-[#00A76F]" />
                {!isSidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{link.name}</span>
                    {hasSubItems && (
                       <ChevronRight 
                         size={16} 
                         className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                       />
                    )}
                  </div>
                )}
              </>
            );
            
            return (
              <div key={link.name}>
                {hasSubItems ? (
                  <button
                    onClick={() => setExpandedMenu(isExpanded ? null : link.name)}
                    title={isSidebarCollapsed ? link.name : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive || isExpanded
                        ? 'text-[#212b36] dark:text-white font-bold' 
                        : 'text-[#637381] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#212b36] dark:hover:text-white'
                    } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    {renderLinkContent()}
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    title={isSidebarCollapsed ? link.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive 
                        ? 'bg-[#00A76F]/10 text-[#00A76F]' 
                        : 'text-[#637381] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#212b36] dark:hover:text-white'
                    } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    {renderLinkContent()}
                  </Link>
                )}
                
                {/* Render sub items */}
                {hasSubItems && (
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className={`mt-1 space-y-1 ${isSidebarCollapsed ? '' : 'ml-6'} ${isExpanded ? 'pb-2' : ''}`}>
                        {subItems.map(subItem => {
                          const isSubActive = currentPath === subItem.path;
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              title={isSidebarCollapsed ? subItem.name : undefined}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[0.875rem] transition-colors cursor-pointer ${
                                isSubActive
                                  ? 'bg-[#00A76F]/10 text-[#00A76F] font-bold'
                                  : 'text-[#637381] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#212b36] dark:hover:text-white'
                              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                            >
                              <SubIcon size={16} className="shrink-0 text-[#00A76F]" />
                              {!isSidebarCollapsed && <span>{subItem.name}</span>}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      
      <UserMenu isSidebarCollapsed={isSidebarCollapsed} />
    </aside>
  );
}
