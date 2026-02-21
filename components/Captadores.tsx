import React, { useMemo } from 'react';
import { Sale, RoleType } from '../types';
import { Handshake, Calendar, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../constants';

interface CaptadoresProps {
  sales: Sale[];
}

const Captadores: React.FC<CaptadoresProps> = ({ sales }) => {
  const captadorSales = useMemo(() => 
    sales.filter(s => s.role === RoleType.CAPTADOR),
    [sales]
  );

  const stats = useMemo(() => {
    const totalVGV = captadorSales.reduce((acc, s) => acc + s.saleValue, 0);
    const totalCommission = captadorSales.reduce((acc, s) => acc + s.commissionTotal, 0);
    return { totalVGV, totalCommission, count: captadorSales.length };
  }, [captadorSales]);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 pb-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Handshake className="text-neon" size={32} /> Captadores
          </h2>
          <p className="text-gray-400">Vendas e comissões vinculadas a captadores.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-cardBg border border-gray-800 p-4 rounded-2xl shadow-lg">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total VGV</p>
            <p className="text-lg font-black text-white">{formatCurrency(stats.totalVGV)}</p>
          </div>
          <div className="bg-cardBg border border-gray-800 p-4 rounded-2xl shadow-lg">
            <p className="text-[10px] text-neon/60 uppercase font-black tracking-widest mb-1">Comissão</p>
            <p className="text-lg font-black text-neon">{formatCurrency(stats.totalCommission)}</p>
          </div>
          <div className="bg-cardBg border border-gray-800 p-4 rounded-2xl shadow-lg col-span-2 md:col-span-1">
            <p className="text-[10px] text-purple-400 uppercase font-black tracking-widest mb-1">Vendas</p>
            <p className="text-lg font-black text-purple-400">{stats.count}</p>
          </div>
        </div>
      </div>

      {captadorSales.length === 0 ? (
        <div className="p-20 text-center border border-dashed border-gray-800 rounded-3xl bg-cardBg/30">
          <Handshake size={64} className="mx-auto text-gray-800 mb-6 opacity-20" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma captação registrada</h3>
          <p className="text-gray-500 max-w-xs mx-auto">As vendas marcadas com o cargo "CAPTADOR" aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {captadorSales.sort((a,b) => b.saleDate.localeCompare(a.saleDate)).map(sale => (
            <div key={sale.id} className="bg-cardBg border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all group shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center text-neon border border-neon/20 group-hover:bg-neon group-hover:text-darkBg transition-all">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{sale.clientName}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(sale.saleDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 font-bold text-gray-400"><TrendingUp size={12} /> {sale.project}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 px-4 md:px-0 border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">VGV da Venda</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(sale.saleValue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neon/60 uppercase font-black mb-1">Comissão Captador</p>
                    <p className="text-lg font-black text-neon">{formatCurrency(sale.commissionTotal)}</p>
                  </div>
                </div>
              </div>
              
              {sale.observation && (
                <div className="mt-4 p-3 bg-darkBg/50 rounded-lg border border-gray-800/50">
                  <p className="text-xs text-gray-400 italic">"{sale.observation}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Captadores;
