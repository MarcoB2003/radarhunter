
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  MessageSquare, 
  Settings,
  Database,
  LineChart,
  FilePlus,
  Brain,
  Target,
  Zap,
  Eye,
  BarChart3,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  const { activePage } = useSelector((state: RootState) => state.ui);
  const isActive = activePage.toLowerCase() === label.toLowerCase();

  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center py-2 px-3 rounded-md text-sm transition-colors ${
          isActive 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`
      }
    >
      <div className="mr-2">{icon}</div>
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 w-60 h-screen bg-sidebar-background transition-all duration-300 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-14 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-black">
          RadarHunter Pro
        </h1>
      </div>

      {/* Navigation - Now with scrolling */}
      <nav className="h-[calc(100vh-3.5rem)] overflow-y-auto py-2 px-2">
        <div className="space-y-0.5">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <SidebarLink to="/leads" icon={<Users className="h-4 w-4" />} label="Leads" />
          <SidebarLink to="/pipeline" icon={<PieChart className="h-4 w-4" />} label="Pipeline" />
          <SidebarLink to="/meetings" icon={<Calendar className="h-4 w-4" />} label="Reuniões" />
        </div>

        {/* IA Section */}
        <div className="pt-3 mt-3 border-t border-sidebar-border">
          <div className="px-3 mb-1">
            <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/60 font-semibold">
              Inteligência Artificial
            </h3>
          </div>
          <div className="space-y-0.5">
            <SidebarLink to="/ai-scoring" icon={<Brain className="h-4 w-4" />} label="Scoring IA" />
            <SidebarLink to="/ai-sdr" icon={<Target className="h-4 w-4" />} label="IA SDR" />
            <SidebarLink to="/ai-closer" icon={<Zap className="h-4 w-4" />} label="IA Closer" />
            <SidebarLink to="/ai-manager" icon={<Settings className="h-4 w-4" />} label="Gerente IA" />
          </div>
        </div>

        {/* Analytics & Automation */}
        <div className="pt-3 mt-3 border-t border-sidebar-border">
          <div className="px-3 mb-1">
            <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/60 font-semibold">
              Analytics & Automação
            </h3>
          </div>
          <div className="space-y-0.5">
            <SidebarLink to="/companies" icon={<BarChart3 className="h-4 w-4" />} label="Empresas" />
            <SidebarLink to="/campaigns" icon={<MessageSquare className="h-4 w-4" />} label="Campanhas" />
            <SidebarLink to="/social" icon={<Eye className="h-4 w-4" />} label="Social" />
            <SidebarLink to="/reports" icon={<FilePlus className="h-4 w-4" />} label="Relatórios" />
          </div>
        </div>

        {/* Tools */}
        <div className="pt-3 mt-3 border-t border-sidebar-border space-y-0.5">
          <div className="px-3 mb-1">
            <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/60 font-semibold">
              Ferramentas
            </h3>
          </div>
          <SidebarLink to="/chatbot" icon={<MessageSquare className="h-4 w-4" />} label="Chatbot" />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
