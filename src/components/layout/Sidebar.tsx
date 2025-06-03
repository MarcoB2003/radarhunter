
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
        `flex items-center py-3 px-4 rounded-md transition-colors ${
          isActive 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`
      }
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-sidebar-background transition-all duration-300 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-black">
          RadarHunter Pro
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
          <SidebarLink to="/leads" icon={<Users className="h-5 w-5" />} label="Leads" />
          <SidebarLink to="/pipeline" icon={<PieChart className="h-5 w-5" />} label="Pipeline" />
          <SidebarLink to="/meetings" icon={<Calendar className="h-5 w-5" />} label="Reuniões" />
        </div>

        {/* IA Section */}
        <div className="pt-6 mt-6 border-t border-sidebar-border">
          <div className="px-4 mb-2">
            <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/60 font-semibold">
              Inteligência Artificial
            </h3>
          </div>
          <div className="space-y-1">
            <SidebarLink to="/ai-scoring" icon={<Brain className="h-5 w-5" />} label="Scoring IA" />
            <SidebarLink to="/ai-sdr" icon={<Target className="h-5 w-5" />} label="IA SDR" />
            <SidebarLink to="/ai-closer" icon={<Zap className="h-5 w-5" />} label="IA Closer" />
            <SidebarLink to="/ai-manager" icon={<Settings className="h-5 w-5" />} label="Gerente IA" />
          </div>
        </div>

        {/* Analytics & Automation */}
        <div className="pt-6 mt-6 border-t border-sidebar-border">
          <div className="px-4 mb-2">
            <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/60 font-semibold">
              Analytics & Automação
            </h3>
          </div>
          <div className="space-y-1">
            <SidebarLink to="/empresas" icon={<BarChart3 className="h-5 w-5" />} label="Empresas" />
            <SidebarLink to="/campaigns" icon={<MessageSquare className="h-5 w-5" />} label="Campanhas" />
            <SidebarLink to="/social" icon={<Eye className="h-5 w-5" />} label="Social" />
            <SidebarLink to="/reports" icon={<FilePlus className="h-5 w-5" />} label="Relatórios" />
          </div>
        </div>

        {/* Tools */}
        <div className="pt-6 mt-6 border-t border-sidebar-border space-y-1">
          
          <SidebarLink to="/chatbot" icon={<MessageSquare className="h-5 w-5" />} label="Chatbot" />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
