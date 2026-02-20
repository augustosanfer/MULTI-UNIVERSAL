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
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-darkBg border-2 border-neon rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(124,255,79,0.15)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon text-darkBg text-xs font-black uppercase tracking-wider rounded-full">Mais Popular</div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Pro</h3>
            <div className="text-center mb-6"><span className="text-4xl font-extrabold text-neon">R$ 19,90</span><span className="text-gray-500 font-medium">/mês</span></div>
            <p className="text-gray-400 text-sm text-center mb-8 h-10">Para profissionais que buscam agilidade.</p>
            <button onClick={onChoosePlan} className="w-full py-4 rounded-xl bg-neon text-darkBg font-bold hover:bg-neon/90 transition-all mb-8 shadow-[0_10px_20px_rgba(124,255,79,0.2)]">Escolher Plano</button>
            <div className="space-y-4 flex-1">
              {['Vendas Ilimitadas', 'Cálculo Pro-Rata', 'Fluxo de Caixa', 'Importação', 'Suporte Prioritário'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white font-medium"><Check size={18} className="text-neon shrink-0" />{item}</div>
              ))}
            </div>
          </div>
          <div className="bg-cardBg border border-gray-800 rounded-3xl p-8 flex flex-col hover:border-gray-700 transition-all">
            <h3 className="text-xl font-bold text-white text-center mb-2">Anual</h3>
            <div className="text-center mb-6"><span className="text-4xl font-extrabold text-neon">R$ 199,90</span><span className="text-gray-500 font-medium">/ano</span></div>
            <p className="text-gray-400 text-sm text-center mb-8 h-10">Economia máxima com acesso total.</p>
            <button onClick={onChoosePlan} className="w-full py-4 rounded-xl border border-gray-700 text-white font-bold hover:bg-gray-800 transition-all mb-8">Escolher Plano</button>
            <div className="space-y-4 flex-1">
              {['Tudo do Pro', 'Acesso Anual (12 meses)', 'Relatórios Avançados', 'Exportação Excel', 'Gestão Multi-projetos'].map((item, i) => (
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