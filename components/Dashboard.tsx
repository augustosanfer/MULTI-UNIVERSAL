import React, { useMemo, useState } from 'react';
import { Sale } from '../types';
import { formatCurrency } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Wallet, TrendingUp, Layers, Calendar, Filter, History } from 'lucide-react';

interface DashboardProps {
  sales: Sale[];
  onAddSale: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sales, onAddSale }) => {
  // Período padrão solicitado: 01/01/2026 até 31/12/2026
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const setYearFilter = (year: string) => {
    setStartDate(`${year}-01-01`);
    setEndDate(`${year}-12-31`);
  };

  const isSaleCancelled = (sale: Sale) => 
    sale.commissionEntries.length > 0 && sale.commissionEntries.every(e => e.status === 'cancelled');

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const saleDate = s.saleDate;
      return saleDate >= startDate && saleDate <= endDate;
    });
  }, [sales, startDate, endDate]);

  const vgvBruto = filteredSales.reduce((acc, s) => acc + s.saleValue, 0);
  const vgvLiquido = filteredSales.reduce((acc, s) => isSaleCancelled(s) ? acc : acc + s.saleValue, 0);
  
  const allEntries = useMemo(() => sales.flatMap(s => s.commissionEntries).filter(e => e.status !== 'cancelled'), [sales]);
  const receiptsInPeriod = allEntries.filter(e => e.dueDate >= startDate && e.dueDate <= endDate).reduce((acc, e) => acc + e.amount, 0);

  const futureCash = allEntries.filter(e => {
    const today = new Date().toISOString().split('T')[0];
    return e.dueDate > today;
  }).reduce((acc, e) => acc + e.amount, 0);

  const totalQuotasInPeriod = filteredSales.reduce((acc, s) => {
    return isSaleCancelled(s) ? acc : acc + (s.quotaQty || 1);
  }, 0);

  const cancelledSalesCount = filteredSales.filter(isSaleCancelled).length;
  const cancellationRate = filteredSales.length > 0 ? (cancelledSalesCount / filteredSales.length) * 100 : 0;
  
  const gaugeColor = cancellationRate >= 30 ? '#EF4444' : '#7CFF4F';
  const gaugeData = [{ name: 'Rate', value: Math.min(cancellationRate, 100) }, { name: 'Remaining', value: Math.max(0, 100 - cancellationRate) }];

  const productivityData = [
    { name: 'FTB', value: filteredSales.filter(s => s.role === 'FTB' && !isSaleCancelled(s)).length },
    { name: 'LINER', value: filteredSales.filter(s => s.role === 'LINER' && !isSaleCancelled(s)).length },
    { name: 'CLOSER', value: filteredSales.filter(s => s.role === 'CLOSER' && !isSaleCancelled(s)).length },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-gray-400">Visão analítica de performance.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setYearFilter('2025')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 transition-all text-sm font-bold"
          >
            <History size={16} /> Ver 2025
          </button>

          <div className="bg-cardBg border border-gray-800 p-2 rounded-xl flex flex-wrap items-center gap-2 shadow-lg">
             <div className="flex items-center gap-2 px-3 border-r border-gray-800 mr-1">
                <Filter size={16} className="text-neon" />
                <span className="text-sm font-bold text-white">Filtro Período</span>
             </div>
             <div className="flex items-center gap-2 bg-darkBg border border-gray-700 rounded-lg px-3 py-1.5">
                <Calendar size={14} className="text-gray-500" />
                <input type="date" className="bg-transparent text-white text-sm outline-none w-32" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
             </div>
             <span className="text-gray-600">até</span>
             <div className="flex items-center gap-2 bg-darkBg border border-gray-700 rounded-lg px-3 py-1.5">
                <Calendar size={14} className="text-gray-500" />
                <input type="date" className="bg-transparent text-white text-sm outline-none w-32" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-cardBg border border-gray-800 p-6 rounded-2xl flex flex-col justify-between h-[180px] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon/5 blur-3xl -mr-12 -mt-12 group-hover:bg-neon/10 transition-all"></div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Vendido (VGV)</span>
            <div className="p-2 bg-gray-800 rounded-lg text-gray-300"><DollarSign size={20} /></div>
          </div>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between items-baseline">
              <p className="text-[10px] text-gray-500 uppercase">Bruto</p>
              <h3 className="text-lg font-bold text-gray-400">{formatCurrency(vgvBruto)}</h3>
            </div>
            <div className="flex justify-between items-baseline pt-1 border-t border-gray-800/50">
              <p className="text-[10px] text-neon/60 uppercase font-black">Líquido</p>
              <h3 className="text-2xl font-black text-neon">{formatCurrency(vgvLiquido)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-cardBg border border-gray-800 p-6 rounded-2xl flex flex-col justify-between h-[180px] shadow-xl">
          <div className="flex justify-between items-start"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Comissão Recebida</span><div className="p-2 bg-neon/10 rounded-lg text-neon"><Wallet size={20} /></div></div>
          <div><h3 className="text-3xl font-black text-white">{formatCurrency(receiptsInPeriod)}</h3><p className="text-[10px] text-gray-500 uppercase mt-1">Neste período</p></div>
        </div>

        <div className="bg-cardBg border border-gray-800 p-6 rounded-2xl flex flex-col justify-between h-[180px] shadow-xl">
          <div className="flex justify-between items-start"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Caixa Futuro</span><div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><TrendingUp size={20} /></div></div>
          <div><h3 className="text-3xl font-black text-blue-400">{formatCurrency(futureCash)}</h3><p className="text-[10px] text-gray-500 uppercase mt-1">A receber total</p></div>
        </div>

        <div className="bg-cardBg border border-gray-800 p-6 rounded-2xl flex flex-col justify-between h-[180px] shadow-xl">
          <div className="flex justify-between items-start"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cotas Ativas</span><div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Layers size={20} /></div></div>
          <div><h3 className="text-3xl font-black text-purple-400">{totalQuotasInPeriod}</h3><p className="text-[10px] text-gray-500 uppercase mt-1">Unidades vendidas</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-cardBg border border-gray-800 p-6 rounded-2xl h-[400px] shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Produtividade por Cargo</h3>
            <span className="text-[10px] text-gray-500 bg-darkBg px-2 py-1 rounded border border-gray-800 uppercase font-black">Vendas Ativas</span>
          </div>
          {filteredSales.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" allowDecimals={false} fontSize={12} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#12151A', border: '1px solid #333', borderRadius: '12px' }} />
                <Bar dataKey="value" fill="#7CFF4F" radius={[6,6,0,0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-full flex items-center justify-center text-gray-500 flex-col gap-2">Nenhuma venda no período</div>}
        </div>

        <div className="lg:col-span-1 bg-cardBg border border-gray-800 p-6 rounded-2xl h-[400px] relative overflow-hidden shadow-xl">
           <div className="flex justify-between items-center mb-2"><h3 className="text-lg font-bold text-white">Taxa de Cancelamento</h3></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center pt-8">
              <div className="relative w-[240px] h-[120px]">
                <ResponsiveContainer width="100%" height="200%">
                  <PieChart>
                    <Pie data={gaugeData} cx="50%" cy="50%" startAngle={180} endAngle={0} innerRadius={80} outerRadius={100} paddingAngle={0} dataKey="value" stroke="none">
                      <Cell key="value" fill={gaugeColor} />
                      <Cell key="rest" fill="#222" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-center">
                  <span className="text-4xl font-black" style={{ color: gaugeColor }}>{cancellationRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-8 text-center space-y-1 px-4">
                <p className="text-sm text-gray-400">Total de <span className="text-white font-bold">{filteredSales.length}</span> contratos no período.</p>
                <p className="text-xs text-red-500/80 font-medium">{cancelledSalesCount} vendas canceladas.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;