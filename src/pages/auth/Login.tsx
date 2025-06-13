
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn } from '../../services/authService';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      dispatch(loginStart());
      
      // Verificação do usuário de teste
      if (data.email === 'teste@teste.com' && data.password === 'teste123') {
        // Configura o localStorage para manter a sessão do usuário de teste
        localStorage.setItem('testUserLoggedIn', 'true');
      }
      
      const { user, session } = await signIn(data.email, data.password);
      
      if (user && session) {
        dispatch(loginSuccess(user));
        navigate('/dashboard');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta ao RadarHunter Pro.",
        });
      }
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Erro ao fazer login'));
      toast({
        title: "Falha no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-lg rounded-lg p-8 border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-radar-700">RadarHunter Pro</h1>
            <p className="text-muted-foreground mt-2">
              Acesse sua plataforma de automação comercial com IA
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="seu@email.com"
                        type="email"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="••••••••"
                        type="password"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-sm text-right">
                <Link to="/forgot-password" className="text-radar-600 hover:text-radar-700">
                  Esqueceu sua senha?
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : "Entrar"}
              </Button>
              
              <div className="text-center mt-4 text-sm">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-radar-600 hover:text-radar-700 font-medium">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
