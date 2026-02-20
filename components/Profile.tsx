import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Shield, Check, AlertCircle, Loader2 } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../services/supabase';

interface ProfileProps {
  currentUser: User;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (currentUser.id === '00000000-0000-0000-0000-000000000000') {
      setMessage({ type: 'error', text: 'Usuários convidados não podem alterar a senha.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar senha.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <UserIcon className="text-neon" size={32} /> Meu Perfil
        </h2>
        <p className="text-gray-400 mt-1">Gerencie suas informações de conta e segurança.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-cardBg border border-gray-800 rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-neon/10 rounded-full flex items-center justify-center mb-4 border border-neon/20 shadow-[0_0_20px_rgba(124,255,79,0.1)]">
              <UserIcon size={48} className="text-neon" />
            </div>
            <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
            <p className="text-neon text-sm font-bold uppercase tracking-widest mt-1">
              {currentUser.role === 'admin' ? 'Administrador' : 'Assinante'}
            </p>
            <div className="mt-6 w-full pt-6 border-t border-gray-800 space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="shrink-0" />
                <span className="text-sm truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Shield size={18} className="shrink-0" />
                <span className="text-sm">Status: <span className="text-neon font-bold">Ativo</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cardBg border border-gray-800 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock size={20} className="text-neon" /> Alterar Senha
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-600" size={18} />
                  <input 
                    type="password" 
                    className="w-full bg-darkBg border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none transition-all" 
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-600" size={18} />
                  <input 
                    type="password" 
                    className="w-full bg-darkBg border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none transition-all" 
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isUpdating || currentUser.id === '00000000-0000-0000-0000-000000000000'}
                className="w-full py-4 bg-neon text-darkBg font-black rounded-xl hover:bg-neon/90 transition-all shadow-[0_0_20px_rgba(124,255,79,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Atualizando...
                  </>
                ) : 'Atualizar Senha'}
              </button>
              
              {currentUser.id === '00000000-0000-0000-0000-000000000000' && (
                <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-tighter">
                  Acesso de convidado não permite alteração de senha.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
