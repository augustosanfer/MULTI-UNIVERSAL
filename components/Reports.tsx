import React, { useState, useMemo } from 'react';
import { Sale } from '../types';
import { formatCurrency, PAYMENT_METHOD_LABELS } from '../constants';
import { FileBarChart, Printer, Filter, CalendarCheck } from 'lucide-react';

interface ReportsProps {
  sales: Sale[];
}

const Reports: React.FC<ReportsProps> = ({ sales }) => {
  const [activeTab, setActiveTab] = useState<'productivity' | 'bordero'>('productivity');
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  const [prodStartDate, setProdStartDate] = useState(startOfMonth);
  const [prodEndDate, setProdEndDate] = useState(endOfMonth);
  const [borderoMonth, setBorderoMonth] = useState(today.toISOString().slice(0, 7));

  const isSaleCancelled = (sale: Sale) => sale.commissionEntries.length > 0 && sale.commissionEntries.every(e => e.status === 'cancelled');
  const productivityData = useMemo(() => sales.filter(s => { if (isSaleCancelled(s)) return false; const sDate = s.saleDate; return sDate >= prodStartDate && sDate <= prodEndDate; }), [sales, prodStartDate, prodEndDate]);
  const totalVGV = productivityData.reduce((acc, s) => acc + s.saleValue, 0);
  const borderoData = useMemo(() => sales.flatMap(s => s.commissionEntries.map(entry => ({ ...entry, clientName: s.clientName, project: s.project, saleDate: s.saleDate }))).filter(e => e.dueMonth === borderoMonth && e.status !== 'cancelled').sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [sales, borderoMonth]);
  const totalCommission = borderoData.reduce((acc, e) => acc + e.amount, 0);

  const handlePrint = () => window.print();

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 pb-20 print:p-0 print:max-w-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 print:hidden">
        <div><h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><FileBarChart className="text-neon" size={32} /> Relatórios</h2></div>
        <div className="flex gap-2 bg-cardBg p-1 rounded-xl border border-gray-800"><button onClick={() => setActiveTab('productivity')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'productivity' ? 'bg-neon text-darkBg shadow-lg' : 'text-gray-400'}`}>Produtividade</button><button onClick={() => setActiveTab('bordero')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'bordero' ? 'bg-neon text-darkBg shadow-lg' : 'text-gray-400'}`}>Borderô</button></div>
      </div>
      {activeTab === 'productivity' && (
        <div className="animate-fade-in">
          <div className="bg-cardBg border border-gray-800 p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden shadow-lg">
             <div className="flex items-center gap-4"><Filter size={16} /><input type="date" value={prodStartDate} onChange={e => setProdStartDate(e.target.value)} className="bg-darkBg border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm" /><input type="date" value={prodEndDate} onChange={e => setProdEndDate(e.target.value)} className="bg-darkBg border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm" /></div>
             <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-bold"><Printer size={16} /> Imprimir</button>
          </div>
          <div className="bg-cardBg border border-gray-800 rounded-2xl overflow-hidden print:border-none print:bg-white print:text-black">
             <div className="hidden print:block p-6 border-b border-gray-200"><h1 className="text-2xl font-bold mb-2">Relatório VGV</h1><p>Período: {new Date(prodStartDate).toLocaleDateString()} - {new Date(prodEndDate).toLocaleDateString()}</p></div>
             <table className="w-full text-left border-collapse"><thead><tr className="bg-darkBg/50 text-gray-400 text-xs uppercase tracking-wider print:bg-gray-100 print:text-gray-600"><th className="px-6 py-4">Data</th><th className="px-6 py-4">Cliente</th><th className="px-6 py-4">Projeto</th><th className="px-6 py-4 text-right">Valor</th></tr></thead><tbody>{productivityData.map(s => (<tr key={s.id} className="border-b border-gray-800 print:border-gray-300"><td className="px-6 py-4 text-sm">{new Date(s.saleDate).toLocaleDateString()}</td><td className="px-6 py-4 text-sm font-bold">{s.clientName}</td><td className="px-6 py-4 text-sm">{s.project}</td><td className="px-6 py-4 text-right text-sm font-bold">{formatCurrency(s.saleValue)}</td></tr>))}</tbody><tfoot><tr><td colSpan={3} className="px-6 py-4 text-right font-bold">TOTAL:</td><td className="px-6 py-4 text-right font-bold text-neon print:text-black">{formatCurrency(totalVGV)}</td></tr></tfoot></table>
          </div>
        </div>
      )}
      {activeTab === 'bordero' && (
        <div className="animate-fade-in">
           <div className="bg-cardBg border border-gray-800 p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden shadow-lg"><div className="flex items-center gap-4"><CalendarCheck size={16} /><input type="month" value={borderoMonth} onChange={e => setBorderoMonth(e.target.value)} className="bg-darkBg border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm" /></div><button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-bold"><Printer size={16} /> Imprimir</button></div>
           <div className="bg-cardBg border border-gray-800 rounded-2xl overflow-hidden print:border-none print:bg-white print:text-black">
             <div className="hidden print:block p-6 border-b border-gray-200"><h1 className="text-2xl font-bold mb-2">Borderô de Comissões</h1><p>Mês: {borderoMonth}</p></div>
             <table className="w-full text-left border-collapse"><thead><tr className="bg-darkBg/50 text-gray-400 text-xs uppercase tracking-wider print:bg-gray-100 print:text-gray-600"><th className="px-6 py-4">Vencimento</th><th className="px-6 py-4">Cliente</th><th className="px-6 py-4">Descrição</th><th className="px-6 py-4 text-right">Valor</th></tr></thead><tbody>{borderoData.map((e, idx) => (<tr key={`${e.id}-${idx}`} className="border-b border-gray-800 print:border-gray-300"><td className="px-6 py-4 text-sm">{new Date(e.dueDate).toLocaleDateString()}</td><td className="px-6 py-4 text-sm font-bold">{e.clientName}</td><td className="px-6 py-4 text-sm">{e.description}</td><td className="px-6 py-4 text-right text-sm font-bold">{formatCurrency(e.amount)}</td></tr>))}</tbody><tfoot><tr><td colSpan={3} className="px-6 py-4 text-right font-bold">TOTAL:</td><td className="px-6 py-4 text-right font-bold text-neon print:text-black">{formatCurrency(totalCommission)}</td></tr></tfoot></table>
           </div>
        </div>
      )}
    </div>
  );
};
export default Reports;