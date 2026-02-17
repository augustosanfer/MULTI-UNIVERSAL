import React, { useMemo, useState } from 'react';
import { Sale } from '../types';
import { CalendarClock, ChevronRight, CheckCircle2, Circle, Trash2, Edit2, CalendarPlus } from 'lucide-react';
import { formatCurrency } from '../constants';

interface CashFlowProps {
  sales: Sale[];
  onToggleStatus: (saleId: string, entryId: string) => void;
  onDeleteEntry: (saleId: string, entryId: string) => void;
  onEditEntryAmount: (saleId: string, entryId: string, newAmount: number) => void;
  onRescheduleEntry: (saleId: string, entryId: string) => void;
}

const CashFlow: React.FC<CashFlowProps> = ({ sales, onToggleStatus, onDeleteEntry, onEditEntryAmount, onRescheduleEntry }) => {
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const allEntries = useMemo(() => sales.flatMap(sale => sale.commissionEntries.filter(entry => entry.status !== 'cancelled').map(entry => ({ ...entry, clientName: sale.clientName, saleId: sale.id }))), [sales]);
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof allEntries> = {};
    allEntries.forEach(entry => { if (!groups[entry.dueMonth]) groups[entry.dueMonth] = []; groups[entry.dueMonth].push(entry); });
    return groups;
  }, [allEntries]);
  const sortedMonths = Object.keys(groupedByMonth).sort();
  const toggleMonth = (month: string) => setExpandedMonths(expandedMonths.includes(month) ? expandedMonths.filter(m => m !== month) : [...expandedMonths, month]);
  const handleEditClick = (saleId: string, entryId: string, currentAmount: number) => {
    const input = window.prompt("Novo valor (R$):", currentAmount.toString());
    if (input !== null) { const val = parseFloat(input.replace(',', '.')); if (!isNaN(val)) onEditEntryAmount(saleId, entryId, val); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 pb-20">
      <div className="mb-8"><h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><CalendarClock className="text-neon" size={32} /> Fluxo de Recebimento</h2></div>
      <div className="space-y-4">
        {sortedMonths.length === 0 ? <div className="text-center py-20 bg-cardBg border border-gray-800 rounded-2xl"><p className="text-gray-500">Nenhum lançamento futuro.</p></div> : sortedMonths.map(month => {
            const entries = groupedByMonth[month];
            const totalAmount = entries.reduce((acc, e) => acc + e.amount, 0);
            const totalReceived = entries.filter(e => e.status === 'received').reduce((acc, e) => acc + e.amount, 0);
            const isExpanded = expandedMonths.includes(month);
            const [year, m] = month.split('-');
            const monthLabel = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

            return (
              <div key={month} className="bg-cardBg border border-gray-800 rounded-2xl overflow-hidden transition-all shadow-md hover:border-gray-600">
                <button onClick={() => toggleMonth(month)} className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-white/5 transition-colors text-left gap-4">
                  <div className="flex items-center gap-4"><div className={`p-2 rounded-lg bg-gray-800 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90 bg-neon text-darkBg' : ''}`}><ChevronRight size={20} /></div><div><h3 className="text-xl font-bold text-white capitalize">{monthLabel}</h3><p className="text-sm text-gray-500">{entries.length} lançamentos</p></div></div>
                  <div className="flex gap-6 md:gap-12 pl-14 md:pl-0"><div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total</p><p className="text-lg font-bold text-white">{formatCurrency(totalAmount)}</p></div><div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Recebido</p><p className="text-lg font-bold text-neon">{formatCurrency(totalReceived)}</p></div></div>
                </button>
                {isExpanded && (
                  <div className="border-t border-gray-800 bg-darkBg/50 animate-fade-in divide-y divide-gray-800">
                    {entries.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(entry => (
                      <div key={entry.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors gap-4">
                        <div className="flex items-center gap-4 flex-1"><button onClick={() => onToggleStatus(entry.saleId, entry.id)} className={`p-3 rounded-full transition-all duration-200 shrink-0 ${entry.status === 'received' ? 'bg-neon text-darkBg' : 'bg-gray-800 text-gray-500'}`}>{entry.status === 'received' ? <CheckCircle2 size={22} /> : <Circle size={22} />}</button><div><p className="font-bold text-white text-base leading-tight">{entry.clientName}</p><div className="flex items-center gap-2 mt-0.5"><p className="text-xs text-gray-400">{entry.description}</p><p className="text-xs text-gray-500">{new Date(entry.dueDate).toLocaleDateString()}</p></div></div></div>
                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pl-14 md:pl-0">
                           <div className="text-right"><p className={`font-mono text-lg font-bold ${entry.status === 'received' ? 'text-neon line-through opacity-70' : 'text-white'}`}>{formatCurrency(entry.amount)}</p></div>
                           <div className="flex items-center gap-2 bg-cardBg border border-gray-800 rounded-lg p-1.5 shadow-sm"><button onClick={() => handleEditClick(entry.saleId, entry.id, entry.amount)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"><Edit2 size={16} /></button><button onClick={() => onRescheduleEntry(entry.saleId, entry.id)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md"><CalendarPlus size={16} /></button><div className="w-px h-4 bg-gray-800"></div><button onClick={() => onDeleteEntry(entry.saleId, entry.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"><Trash2 size={16} /></button></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};
export default CashFlow;