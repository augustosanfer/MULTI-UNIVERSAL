import React, { useState } from 'react';
import { X, CreditCard, User, Mail, ShieldCheck, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

interface CheckoutFormProps {
  plan: { name: string; price: number };
  onCancel: () => void;
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ plan, onCancel, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('checkouts')
        .insert([
          {
            customer_name: name,
            customer_email: email,
            plan_name: plan.name,
            amount: plan.price,
            status: 'completed'
          }
        ]);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pedido: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-darkBg/95 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon/30">
            <CheckCircle className="text-neon" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Pedido Confirmado!</h2>
          <p className="text-gray-400">Seu acesso será liberado em instantes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-cardBg border border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-cardBg/50">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <CreditCard className="text-neon" size={24} /> Finalizar Pedido
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Plano {plan.name}</p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-neon/5 border border-neon/10 rounded-2xl p-4 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-400">Total a pagar:</span>
            <span className="text-2xl font-black text-neon">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-600" size={18} />
                <input 
                  type="text" 
                  required 
                  className="w-full bg-darkBg border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-neon outline-none transition-all" 
                  placeholder="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">E-mail de Acesso</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-600" size={18} />
                <input 
                  type="email" 
                  required 
                  className="w-full bg-darkBg border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-neon outline-none transition-all" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-darkBg border border-gray-800 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="text-neon shrink-0" size={20} />
            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
              Seus dados estão protegidos por criptografia de ponta a ponta. Ao clicar em finalizar, você concorda com nossos termos de uso.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full py-5 bg-neon text-darkBg font-black rounded-2xl hover:bg-neon/90 transition-all shadow-[0_10px_30px_rgba(124,255,79,0.2)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Processando...
              </>
            ) : (
              'Finalizar Pagamento'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
