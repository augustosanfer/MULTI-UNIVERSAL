import { createClient } from '@supabase/supabase-js';

// Credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://abqtkyfoicepzwxnuwbn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZnRdVY0AR9flPS7pc6uVng_2edXnS93';

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
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  }
};