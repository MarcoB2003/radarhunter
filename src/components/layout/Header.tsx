
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../services/authService';
import { logout } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store';
import { toast } from '@/components/ui/use-toast';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.ui);
  
  const unreadNotifications = notifications.filter(n => !n.read);
  
  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao fazer logout. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-white border-b border-border h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-radar-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-radar-red-600"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map(notification => (
                <DropdownMenuItem key={notification.id} className={!notification.read ? 'font-semibold' : ''}>
                  <div className="flex flex-col w-full">
                    <span className={`text-sm ${!notification.read ? 'text-radar-700 font-medium' : ''}`}>{notification.message}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>Nenhuma notificação</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              <Button variant="link" size="sm" onClick={() => navigate('/notifications')}>
                Ver todas
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user && (
              <>
                <DropdownMenuLabel>
                  {user.firstName} {user.lastName}
                </DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
