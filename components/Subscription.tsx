import React from 'react';
import { CreditCard, Calendar, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface SubscriptionProps {
  currentUser: User;
}

const Subscription: React.FC<SubscriptionProps> = ({ currentUser }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const isExpired = currentUser.expirationDate ? new Date(currentUser.expirationDate) < new Date() : false;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <CreditCard className="text-neon" size={32} /> Minha Assinatura
        </h2>
        <p className="text-gray-400 mt-1">Detalhes do seu plano e período de acesso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-cardBg border border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 blur-3xl -mr-16 -mt-16 group-hover:bg-neon/10 transition-all"></div>
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Plano Atual</p>
              <h3 className="text-2xl font-black text-white">MultiCota Pro</h3>
            </div>
            <div className="p-3 bg-neon/10 rounded-2xl text-neon shadow-[0_0_15px_rgba(124,255,79,0.2)]">
              <ShieldCheck size={24} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-darkBg border border-gray-800 flex items-center justify-center text-gray-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Data de Início</p>
                <p className="text-white font-bold">{formatDate(currentUser.subscriptionDate || currentUser.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-darkBg border border-gray-800 flex items-center justify-center ${isExpired ? 'text-red-400' : 'text-neon'}`}>
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Expira em</p>
                <p className={`font-bold ${isExpired ? 'text-red-400' : 'text-white'}`}>
                  {formatDate(currentUser.expirationDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isExpired ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-neon/10 text-neon border border-neon/20'}`}>
              {isExpired ? 'Assinatura Expirada' : 'Assinatura Ativa'}
            </div>
          </div>
        </div>

        <div className="bg-cardBg border border-gray-800 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Renovação Automática</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Sua assinatura é renovada automaticamente. Para gerenciar pagamentos ou cancelar, entre em contato com nosso suporte.
              </p>
            </div>
          </div>
          
          <button className="w-full py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all border border-gray-700">
            Gerenciar Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
