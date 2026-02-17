import React from 'react';
import { Handshake, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const frameworks = ["Angular", "Express", "NestJS", "Next.js", "Nuxt", "Parcel", "React", "Vite", "Vue.js"];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4 min-h-[90vh] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="relative rounded-3xl p-8 md:p-12 border border-neon/20 bg-gradient-to-b from-cardBg/90 to-darkBg shadow-[0_0_50px_rgba(124,255,79,0.05)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_0%,rgba(124,255,79,0.15),transparent_50%)] pointer-events-none" />
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse"></span>
                <span className="text-neon text-xs font-bold tracking-wider uppercase">Infraestrutura Hostinger • Performance Máxima</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                Controle suas vendas e <span className="text-neon">comissões pro-rata</span> automaticamente.
              </h1>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                O MultiCota calcula exatamente quanto você recebe da entrada e projeta seu fluxo de caixa futuro. Cadastre-se agora e comece a usar.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={onCtaClick} className="px-8 py-4 rounded-2xl bg-neon text-darkBg font-black text-lg shadow-[0_0_30px_rgba(124,255,79,0.4)] hover:shadow-[0_0_50px_rgba(124,255,79,0.6)] hover:scale-105 transition-all flex items-center gap-2">
                  Começar Agora <ArrowRight size={20} strokeWidth={3} />
                </button>
                <button onClick={onCtaClick} className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all text-sm md:text-base">Criar Conta Grátis</button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                 {["Cálculo Pro-Rata", "Fluxo de Caixa", "Acesso Imediato"].map((feat, i) => (
                   <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-gray-300">
                      <CheckCircle2 size={14} className="text-neon" /> {feat}
                   </div>
                 ))}
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
               <div className="w-72 h-72 md:w-96 md:h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-neon to-neonDark rounded-[3rem] rotate-6 opacity-20 blur-2xl"></div>
                  <div className="absolute inset-0 bg-cardBg border border-neon/30 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,255,79,0.1),transparent)]"></div>
                    <Handshake size={120} className="text-neon drop-shadow-[0_0_15px_rgba(124,255,79,0.5)]" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Nova seção de tecnologia Hostinger */}
        <div className="mt-12 px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 shrink-0">
              <Cpu className="text-neon" size={20} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Powered by Hostinger Tech:</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3">
              {frameworks.map((fw) => (
                <span key={fw} className="text-[11px] font-bold text-gray-500 hover:text-neon transition-colors cursor-default">
                  {fw}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-6 text-[11px] text-gray-600 text-center md:text-left italic">
            "Atualmente, a MultiCota opera com suporte aos frameworks JavaScript mais conhecidos do mercado, garantindo estabilidade e escalabilidade em servidores Hostinger."
          </p>
        </div>
      </div>
    </section>
  );
};
export default Hero;