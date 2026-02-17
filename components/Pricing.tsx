import React from 'react';
import { Check } from 'lucide-react';

interface PricingProps {
  onChoosePlan: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onChoosePlan }) => {
  return (
    <section id="plans" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-neon/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Escolha o plano <span className="text-neon">perfeito para você</span></h2>
          <p className="text-gray-400 text-lg">Desde corretores iniciantes até gestores que precisam de controle total.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-cardBg border border-gray-800 rounded-3xl p-8 flex flex-col hover:border-gray-700 transition-all">
            <h3 className="text-xl font-bold text-white text-center mb-2">Gratuito</h3>
            <div className="text-center mb-6"><span className="text-4xl font-extrabold text-neon">Grátis</span></div>
            <p className="text-gray-400 text-sm text-center mb-8 h-10">Perfeito para começar.</p>
            <button onClick={onChoosePlan} className="w-full py-3 rounded-xl border border-neon text-neon font-bold hover:bg-neon/10 transition-colors mb-8">Começar Grátis</button>
            <div className="space-y-4 flex-1">
              {['Até 5 vendas por mês', 'Cálculo básico', 'Dashboard', 'Suporte por email'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300"><Check size={18} className="text-neon shrink-0" />{item}</div>
              ))}
            </div>
          </div>
          <div className="bg-darkBg border-2 border-neon rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(124,255,79,0.15)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon text-darkBg text-xs font-black uppercase tracking-wider rounded-full">Mais Popular</div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Pro</h3>
            <div className="text-center mb-6"><span className="text-4xl font-extrabold text-neon">R$ 19,90</span><span className="text-gray-500 font-medium">/mês</span></div>
            <p className="text-gray-400 text-sm text-center mb-8 h-10">Para profissionais.</p>
            <button onClick={onChoosePlan} className="w-full py-3 rounded-xl bg-neon text-darkBg font-bold hover:bg-neon/90 transition-colors mb-8 shadow-lg shadow-neon/20">Escolher Plano</button>
            <div className="space-y-4 flex-1">
              {['Vendas Ilimitadas', 'Cálculo Pro-Rata', 'Fluxo de Caixa', 'Importação', 'Suporte Prioritário'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white font-medium"><Check size={18} className="text-neon shrink-0" />{item}</div>
              ))}
            </div>
          </div>
          <div className="bg-cardBg border border-gray-800 rounded-3xl p-8 flex flex-col hover:border-gray-700 transition-all">
            <h3 className="text-xl font-bold text-white text-center mb-2">Vitalício</h3>
            <div className="text-center mb-6"><span className="text-4xl font-extrabold text-neon">R$ 49,90</span><span className="text-gray-500 font-medium">/único</span></div>
            <p className="text-gray-400 text-sm text-center mb-8 h-10">Acesso total.</p>
            <button onClick={onChoosePlan} className="w-full py-3 rounded-xl border border-gray-600 text-white font-bold hover:bg-gray-800 transition-colors mb-8">Escolher Plano</button>
            <div className="space-y-4 flex-1">
              {['Tudo do Pro', 'Acesso Vitalício', 'Relatórios', 'Exportação Excel', 'Gestão Multi-projetos'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300"><Check size={18} className="text-neon shrink-0" />{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Pricing;