import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Dashboard from './components/Dashboard';
import NewSaleForm from './components/NewSaleForm';
import Sidebar from './components/Sidebar';
import Clients from './components/Clients';
import CashFlow from './components/CashFlow';
import Import from './components/Import';
import Auth from './components/Auth';
import Reports from './components/Reports';
import AdminUsers from './components/AdminUsers';
import Products from './components/Products';
import Profile from './components/Profile';
import { Sale, User } from './types';
import { Menu, Loader2 } from 'lucide-react';
import { addMonths, getDueMonth } from './constants';
import { database } from './services/database';
import { supabase, authService } from './services/supabase';

function App() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingSaleData, setPendingSaleData] = useState<Partial<Sale> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUsersList, setAdminUsersList] = useState<User[]>([]);

  // Verifica a sessão ao iniciar
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted && session?.user) {
          const appUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || 'Usuário',
            role: 'user',
            subscriptionStatus: 'active',
            createdAt: session.user.created_at
          };
          
          if (appUser.email.includes('admin')) {
             appUser.role = 'admin';
          }
          
          setCurrentUser(appUser);
          await loadSales();
        }
      } catch (error) {
        console.error("Erro ao verificar sessão ou conectar:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        // Não resetamos o currentUser se ele for o guest (bypass manual)
        // Apenas se for logout real
      } else if (event === 'SIGNED_IN' && session) {
        const appUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || 'Usuário',
            role: 'user',
            subscriptionStatus: 'active',
            createdAt: session.user.created_at
        };
        if (appUser.email.includes('admin')) { appUser.role = 'admin'; }
        setCurrentUser(appUser);
        await loadSales();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadSales = async () => {
    try {
      const loadedSales = await database.sales.getAll();
      setSales(loadedSales || []);
    } catch (e) {
      console.error("Falha ao carregar vendas", e);
      setSales([]);
    }
  };

  const handleLoginClick = async () => {
    // LOGIN AUTOMÁTICO - BYPASS
    const guestUser: User = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Corretor Convidado',
      email: 'convidado@multicota.com',
      role: 'user',
      subscriptionStatus: 'active',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(guestUser);
    setActiveTab('dashboard');
    setIsLoading(true);
    await loadSales();
    setIsLoading(false);
  };
  
  const handleAuthSuccess = async (user: User) => {
    if (user.email.includes('admin')) user.role = 'admin';
    setCurrentUser(user);
    setShowAuthModal(false);
    setActiveTab('dashboard');
    await loadSales();
  };

  const handleLogout = async () => {
    if (currentUser?.id !== '00000000-0000-0000-0000-000000000000') {
      await authService.signOut();
    }
    setCurrentUser(null);
    setSales([]);
    setActiveTab('dashboard');
  };

  const handleSaveSale = async (newSales: Sale[]) => {
    setSales(prev => {
      let updatedSales = [...prev];
      newSales.forEach(newSale => {
         const existingIndex = updatedSales.findIndex(s => s.id === newSale.id);
         if (existingIndex >= 0) {
           updatedSales[existingIndex] = newSale;
         } else {
           updatedSales.push(newSale);
         }
         database.sales.save(newSale);
      });
      return updatedSales;
    });
    setActiveTab('clients');
  };

  const handleDeleteSale = async (saleId: string) => {
    setSales(prev => prev.filter(s => s.id !== saleId));
    await database.sales.delete(saleId);
  };

  const handleEditSale = (saleId: string) => {
    const saleToEdit = sales.find(s => s.id === saleId);
    if (saleToEdit) {
      setPendingSaleData(saleToEdit);
      setActiveTab('add-sale');
    }
  };

  const updateSaleAndPersist = (updatedSale: Sale) => {
    setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
    database.sales.save(updatedSale);
  };

  const handleToggleEntryStatus = (saleId: string, entryId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    const updatedSale = {
      ...sale,
      commissionEntries: sale.commissionEntries.map(entry => {
        if (entry.id !== entryId) return entry;
        if (entry.status === 'cancelled') return entry;
        return {
          ...entry,
          status: entry.status === 'received' ? 'predicted' : 'received' as any
        };
      })
    };
    updateSaleAndPersist(updatedSale);
  };

  const handleDeleteEntry = (saleId: string, entryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este recebimento específico?')) {
      const sale = sales.find(s => s.id === saleId);
      if (!sale) return;
      
      const updatedSale = {
        ...sale,
        commissionEntries: sale.commissionEntries.filter(e => e.id !== entryId)
      };
      updateSaleAndPersist(updatedSale);
    }
  };

  const handleEditEntryAmount = (saleId: string, entryId: string, newAmount: number) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    const updatedSale = {
      ...sale,
      commissionEntries: sale.commissionEntries.map(entry => {
        if (entry.id !== entryId) return entry;
        return { ...entry, amount: newAmount };
      })
    };
    updateSaleAndPersist(updatedSale);
  };

  const handleRescheduleEntry = (saleId: string, entryId: string) => {
    if (window.confirm('Deseja mover este recebimento para o próximo mês?')) {
      const sale = sales.find(s => s.id === saleId);
      if (!sale) return;

      const updatedSale = {
        ...sale,
        commissionEntries: sale.commissionEntries.map(entry => {
          if (entry.id !== entryId) return entry;
          const newDate = addMonths(entry.dueDate, 1); 
          return {
            ...entry,
            dueDate: newDate.toISOString(),
            dueMonth: getDueMonth(newDate)
          };
        })
      };
      updateSaleAndPersist(updatedSale);
    }
  };

  const handleCancelSale = (saleId: string) => {
    if (window.confirm('VENDA CANCELADA (7 DIAS)?\n\nIsso irá cancelar todos os pagamentos previstos para esta venda e removê-los do fluxo de caixa.')) {
      const sale = sales.find(s => s.id === saleId);
      if (!sale) return;

      const updatedSale = {
        ...sale,
        commissionEntries: sale.commissionEntries.map(entry => ({
          ...entry,
          status: 'cancelled' as const
        }))
      };
      updateSaleAndPersist(updatedSale);
    }
  };

  const handleBlockEntry = (saleId: string, entryId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    const updatedSale = {
      ...sale,
      commissionEntries: sale.commissionEntries.map(entry => {
        if (entry.id !== entryId) return entry;
        const newStatus = entry.status === 'cancelled' ? 'predicted' : 'cancelled';
        return { ...entry, status: newStatus as any };
      })
    };
    updateSaleAndPersist(updatedSale);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="animate-spin text-neon" size={48} />
        <p className="text-gray-400">Iniciando sistema...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg font-sans text-gray-100 selection:bg-neon/30">
      {!currentUser ? (
        <>
          <Header isLoggedIn={false} onLoginClick={handleLoginClick} onLogout={() => {}} />
          <main>
            <Hero onCtaClick={handleLoginClick} />
            <Pricing onChoosePlan={handleLoginClick} />
          </main>
          {showAuthModal && (
            <Auth onSuccess={handleAuthSuccess} onCancel={() => setShowAuthModal(false)} />
          )}
        </>
      ) : (
        <div className="flex h-screen overflow-hidden">
           <Sidebar 
             activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout}
             isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} currentUser={currentUser}
           />
           <main className="flex-1 overflow-y-auto bg-darkBg relative custom-scrollbar">
             <div className="md:hidden p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-darkBg/80 backdrop-blur z-30">
                <strong className="text-white">MultiCota</strong>
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400"><Menu /></button>
             </div>
             {activeTab === 'dashboard' && <Dashboard sales={sales} onAddSale={() => setActiveTab('add-sale')} />}
             {activeTab === 'products' && <Products />}
             {activeTab === 'clients' && (
               <Clients sales={sales} onDeleteSale={handleDeleteSale} onToggleStatus={handleToggleEntryStatus} onCancelSale={handleCancelSale} onBlockEntry={handleBlockEntry} onEditSale={handleEditSale} />
             )}
             {activeTab === 'cashflow' && (
               <CashFlow sales={sales} onToggleStatus={handleToggleEntryStatus} onDeleteEntry={handleDeleteEntry} onEditEntryAmount={handleEditEntryAmount} onRescheduleEntry={handleRescheduleEntry} />
             )}
             {activeTab === 'add-sale' && (
               <NewSaleForm onSave={handleSaveSale} onCancel={() => { setActiveTab('dashboard'); setPendingSaleData(null); }} initialData={pendingSaleData} />
             )}
             {activeTab === 'import' && (
               <Import onReviewSale={(data) => { setPendingSaleData(data); setActiveTab('add-sale'); }} />
             )}
             {activeTab === 'reports' && <Reports sales={sales} />}
             {activeTab === 'profile' && currentUser && <Profile currentUser={currentUser} />}
             {activeTab === 'admin-users' && currentUser.role === 'admin' && <AdminUsers users={adminUsersList} />}
           </main>
        </div>
      )}
    </div>
  );
}

export default App;