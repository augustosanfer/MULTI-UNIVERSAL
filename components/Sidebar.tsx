import React from 'react';
import { LayoutGrid, Users, CalendarClock, PlusCircle, UploadCloud, LogOut, Handshake, Shield, FileBarChart, Home, User as UserIcon, CreditCard } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout, isMobileOpen, setIsMobileOpen, currentUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'products', label: 'Produtos', icon: Home },
    { id: 'clients', label: 'Clientes e Vendas', icon: Users },
    { id: 'cashflow', label: 'Fluxo de Recebimento', icon: CalendarClock },
    { id: 'add-sale', label: 'Adicionar Venda', icon: PlusCircle },
    { id: 'import', label: 'Importar Arquivo', icon: UploadCloud },
    { id: 'reports', label: 'Relatórios', icon: FileBarChart },
    { id: 'subscription', label: 'Assinatura', icon: CreditCard },
    { id: 'profile', label: 'Meu Perfil', icon: UserIcon },
  ];
  if (currentUser?.role === 'admin') {
    menuItems.push({ id: 'admin-users', label: 'Usuários (Admin)', icon: Shield });
  }

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-cardBg border-r border-gray-800 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static print:hidden`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-neonDark flex items-center justify-center text-darkBg shadow-[0_0_15px_rgba(124,255,79,0.3)]"><Handshake size={20} strokeWidth={2.5} /></div>
            <strong className="text-lg font-bold text-white tracking-tight">MultiCota</strong>
          </div>
          {currentUser && (
             <div className="px-6 py-4 border-b border-gray-800/50">
               <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Logado como</p>
               <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
               <p className="text-xs text-neon">{currentUser.role === 'admin' ? 'Administrador' : 'Assinante'}</p>
             </div>
          )}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => { onTabChange(item.id); setIsMobileOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-neon/10 text-neon border border-neon/20 shadow-[0_0_15px_rgba(124,255,79,0.1)]' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                  <Icon size={20} className={isActive ? 'text-neon' : 'text-gray-400 group-hover:text-white'} />
                  <span className={`text-sm font-semibold ${isActive ? 'translate-x-1' : ''} transition-transform`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-800"><button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"><LogOut size={20} /><span className="text-sm font-semibold">Sair</span></button></div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;