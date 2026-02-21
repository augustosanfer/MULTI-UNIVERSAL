import React, { useState } from 'react';
import { User } from '../types';
import { Handshake, Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/supabase';

interface AuthProps {
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, onCancel }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const { data, error } = await authService.signIn(email, password);
    
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
      setIsLoading(false);
    } else if (data.user) {
      // Converte User Supabase para User App
      const appUser: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata.name || 'Usuário',
        role: 'user',
        subscriptionStatus: 'active',
        createdAt: data.user.created_at
      };
      onSuccess(appUser);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { data, error } = await authService.signUp(email, password, name);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else if (data.user) {
      // Login automático após registro
      const appUser: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: name,
        role: 'user',
        subscriptionStatus: 'active',
        createdAt: data.user.created_at
      };
      onSuccess(appUser);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const { error } = await authService.resetPassword(email);
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setResetSent(true);
      setIsLoading(false);
    }
  };

  const renderLogin = () => (
    <div className="w-full max-w-md bg-cardBg border border-gray-800 rounded-3xl p-8 shadow-2xl relative">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-neon/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-neon"><Handshake size={28} /></div>
        <h2 className="text-2xl font-bold text-white">Acessar Conta</h2>
        <p className="text-gray-500 text-sm mt-2">Suas vendas, salvas na nuvem.</p>
      </div>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div className="relative"><Mail className="absolute left-4 top-3.5 text-gray-500" size={18} /><input type="email" placeholder="E-mail" required className="w-full bg-darkBg border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="relative"><Lock className="absolute left-4 top-3.5 text-gray-500" size={18} /><input type="password" placeholder="Senha" required className="w-full bg-darkBg border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div className="flex justify-end">
          <button type="button" onClick={() => { setView('forgot-password'); setError(''); }} className="text-xs text-gray-500 hover:text-neon transition-colors">Esqueci minha senha</button>
        </div>
        {error && <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg"><AlertCircle size={16}/> {error}</div>}
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-neon text-darkBg font-bold rounded-xl hover:bg-neon/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(124,255,79,0.2)]">{isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}</button>
      </form>
      <div className="mt-6 text-center text-sm"><span className="text-gray-500">Não tem conta? </span><button onClick={() => { setView('register'); setError(''); }} className="text-neon font-bold hover:underline">Criar conta grátis</button></div>
      <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-white">Esc</button>
    </div>
  );

  const renderRegister = () => (
    <div className="w-full max-w-md bg-cardBg border border-gray-800 rounded-3xl p-8 shadow-2xl relative">
      <div className="text-center mb-6"><h2 className="text-2xl font-bold text-white">Criar Conta</h2><p className="text-gray-500 text-sm mt-1">Comece a gerenciar suas comissões hoje.</p></div>
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <div className="relative"><UserIcon className="absolute left-4 top-3.5 text-gray-500" size={18} /><input type="text" placeholder="Nome Completo" required className="w-full bg-darkBg border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="relative"><Mail className="absolute left-4 top-3.5 text-gray-500" size={18} /><input type="email" placeholder="E-mail" required className="w-full bg-darkBg border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="relative"><Lock className="absolute left-4 top-3.5 text-gray-500" size={18} /><input type="password" placeholder="Senha (min. 6 caracteres)" required minLength={6} className="w-full bg-darkBg border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" value={password} onChange={e => setPassword(e.target.value)} /></div>
        {error && <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg"><AlertCircle size={16}/> {error}</div>}
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-neon text-darkBg font-bold rounded-xl hover:bg-neon/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(124,255,79,0.2)]">{isLoading ? <Loader2 className="animate-spin" /> : <>Criar Conta <ArrowRight size={18}/></>}</button>
      </form>
      <div className="mt-6 text-center text-sm"><span className="text-gray-500">Já tem conta? </span><button onClick={() => { setView('login'); setError(''); }} className="text-neon font-bold hover:underline">Fazer Login</button></div>
      <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-white">Esc</button>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="w-full max-w-md bg-cardBg border border-gray-800 rounded-3xl p-8 shadow-2xl relative">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-neon/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-neon"><KeyRound size={28} /></div>
        <h2 className="text-2xl font-bold text-white">Recuperar Senha</h2>
        <p className="text-gray-500 text-sm mt-2">Enviaremos um link para o seu e-mail.</p>
      </div>
      
      {resetSent ? (
        <div className="text-center space-y-6 py-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 text-neon bg-neon/10 p-4 rounded-xl border border-neon/20">
            <CheckCircle2 size={20} />
            <span className="font-bold">E-mail enviado com sucesso!</span>
          </div>
          <p className="text-gray-400 text-sm">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
          <button onClick={() => { setView('login'); setResetSent(false); }} className="text-neon font-bold hover:underline">Voltar para o Login</button>
        </div>
      ) : (
        <form onSubmit={handleResetSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
            <input 
              type="email" 
              placeholder="Seu e-mail cadastrado" 
              required 
              className="w-full bg-darkBg border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          {error && <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg"><AlertCircle size={16}/> {error}</div>}
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-neon text-darkBg font-bold rounded-xl hover:bg-neon/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(124,255,79,0.2)]">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Enviar Link de Recuperação'}
          </button>
          <div className="text-center">
            <button type="button" onClick={() => { setView('login'); setError(''); }} className="text-gray-500 hover:text-white text-sm transition-colors">Voltar para o Login</button>
          </div>
        </form>
      )}
      <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-white">Esc</button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      {view === 'login' && renderLogin()}
      {view === 'register' && renderRegister()}
      {view === 'forgot-password' && renderForgotPassword()}
    </div>
  );
};
export default Auth;