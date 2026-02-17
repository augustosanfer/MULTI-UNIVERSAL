import React from 'react';
import { User } from '../types';
import { Shield, CheckCircle, Clock, XCircle, Search } from 'lucide-react';

interface AdminUsersProps {
  users: User[];
}

const AdminUsers: React.FC<AdminUsersProps> = ({ users }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="mb-8"><h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><Shield className="text-neon" size={32} /> Gestão de Usuários</h2></div>
      <div className="bg-cardBg border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-darkBg/50"><div className="relative w-64"><Search className="absolute left-3 top-2.5 text-gray-500" size={16} /><input type="text" placeholder="Buscar usuário..." className="w-full bg-darkBg border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-neon outline-none" /></div><div className="text-gray-400 text-sm">Total: <strong className="text-white">{users.length}</strong></div></div>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-darkBg text-gray-400 text-xs uppercase tracking-wider"><th className="px-6 py-4 font-bold">Usuário</th><th className="px-6 py-4 font-bold">E-mail</th><th className="px-6 py-4 font-bold">Tipo</th><th className="px-6 py-4 font-bold">Status</th></tr></thead><tbody className="divide-y divide-gray-800">{users.map(user => (<tr key={user.id} className="hover:bg-white/5 transition-colors"><td className="px-6 py-4"><span className="text-white font-medium text-sm">{user.name}</span></td><td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td><td className="px-6 py-4"><span className={`text-xs font-bold uppercase ${user.role === 'admin' ? 'text-neon' : 'text-gray-500'}`}>{user.role}</span></td><td className="px-6 py-4">{user.subscriptionStatus === 'active' ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold"><CheckCircle size={12}/> Ativo</span> : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold"><Clock size={12}/> Pendente</span>}</td></tr>))}</tbody></table></div>
      </div>
    </div>
  );
};
export default AdminUsers;