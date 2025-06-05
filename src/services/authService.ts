
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// Create Supabase client - in a real app these would be environment variables
// NOTE: Na implementação real, você deve usar variáveis de ambiente para armazenar
// as credenciais do Supabase e não colocar diretamente no código.
const supabaseUrl = 'https://gntccknejxmfunltwxuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudGNja25lanhtZnVubHR3eHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTI1NDEsImV4cCI6MjA2NDUyODU0MX0.xa6SRmR5Su-cKISZu7Owa746DFijlz2UFOgGSQjXIAk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Usuário de teste para desenvolvimento
const testUser: UserProfile = {
  id: 'test-user-id',
  email: 'teste@teste.com',
  firstName: 'Usuário',
  lastName: 'Teste',
  role: 'agent',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    // Verifica se as credenciais correspondem ao usuário de teste
    if (email === 'teste@teste.com' && password === 'teste123') {
      console.log('Logged in with test user');
      return {
        user: testUser,
        session: { access_token: 'fake-token' },
      };
    }

    // Fluxo normal do Supabase para usuários reais
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Once authenticated, fetch the user profile
    if (data?.user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        user: profile as UserProfile,
        session: data.session,
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    // Register the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data?.user) {
      // Create the user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email,
          firstName,
          lastName,
          role: 'agent', // Default role for new users
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        user: profile as UserProfile,
        session: data.session,
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (data?.user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      return profile as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
};

export const updateProfile = async (profile: Partial<UserProfile>) => {
  // Get current user first
  const { data } = await supabase.auth.getUser();
  
  if (!data?.user) throw new Error('No authenticated user found');
  
  // Update profile in database
  const { data: updatedProfile, error } = await supabase
    .from('user_profiles')
    .update({
      ...profile,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', data.user.id)
    .select()
    .single();
  
  if (error) throw error;
  
  return updatedProfile as UserProfile;
};
