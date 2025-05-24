
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../../store/slices/authSlice';
import { UserProfile } from '../../types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verifica no localStorage se o usuário de teste está logado
        const testUserLoggedIn = localStorage.getItem('testUserLoggedIn');
        if (testUserLoggedIn === 'true') {
          const testUser: UserProfile = {
            id: 'test-user-id',
            email: 'teste@teste.com',
            firstName: 'Usuário',
            lastName: 'Teste',
            role: 'agent',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          dispatch(loginSuccess(testUser));
          setLoading(false);
          return;
        }
        
        // Check if there's an active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            // Store user in Redux state
            dispatch(loginSuccess(profile as UserProfile));
          }
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        toast({
          title: "Erro de autenticação",
          description: "Houve um problema ao verificar sua sessão",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            dispatch(loginSuccess(profile as UserProfile));
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('testUserLoggedIn');
          dispatch(logout());
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
