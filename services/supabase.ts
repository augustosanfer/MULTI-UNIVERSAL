import { createClient } from '@supabase/supabase-js';

// Credenciais fornecidas
const supabaseUrl = 'https://qjqlrrobjfdbzdqhiogu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWxycm9iamZkYnpkcWhpb2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjM4NDQsImV4cCI6MjA4NTg5OTg0NH0.moMIjnKzVfrr4aMGCK2ageUjw5Rc8hG_Jzf1uyERuCs';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => true;

// Helpers de Autenticação
export const authService = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name } // Salva o nome nos metadados do usuário
      }
    });
    return { data, error };
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};