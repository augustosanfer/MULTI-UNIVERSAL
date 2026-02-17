import React, { useState, useMemo } from 'react';
import { Sale } from '../types';
import { Users, Edit2, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, Ban, Calendar, Layers, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../constants';

interface ClientsProps {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
  onToggleStatus: (saleId: string, entryId: string) => void;
  onCancelSale: (saleId: string) => void;
  onBlockEntry: (saleId: string, entryId: string) => void;
  onEditSale: (saleId: string) => void;
}

const Clients: React.FC<ClientsProps> = ({ sales, onDeleteSale, onToggleStatus, onCancelSale, onBlockEntry, onEditSale }) => {
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  const toggleExpandSale = (id: string) => setExpandedSaleId(expandedSaleId === id ? null : id);
  
  const toggleExpandMonth = (monthKey: string) => {
    setExpandedMonths(prev => 
      prev.includes(monthKey) ? prev.filter(m => m !== monthKey) : [...prev, monthKey]
    );
  };

  const isSaleCancelled = (sale: Sale) => 
    sale.commissionEntries.length > 0 && sale.commissionEntries.every(e => e.status === 'cancelled');

  // Agrupamento por mês baseado na data da venda
  const groupedSales = useMemo(() => {
    const groups: Record<string, Sale[]> = {};
    sales.forEach(sale => {
      const monthKey = sale.saleDate.substring(0, 7); // YYYY-MM
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(sale);
    });
    // Ordenar meses decrescente
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(month => ({
        month,
        sales: groups[month].sort((a, b) => b.saleDate.localeCompare(a.saleDate))
      }));
  }, [sales]);

  const getMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-neon" size={32} /> Clientes e Vendas
          </h2>
          <p className="text-gray-400">Gerenciamento de contratos agrupado por mês.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-2xl font-black text-white">{sales.length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Contratos Totais</p>
        </div>
      </div>

      {groupedSales.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-gray-800 rounded-3xl bg-cardBg/30">
          <Users size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
          <p className="text-gray-500 font-medium">Nenhuma venda encontrada.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedSales.map(({ month, sales: monthSales }) => {
            const isMonthExpanded = expandedMonths.includes(month);
            const vgvBruto = monthSales.reduce((acc, s) => acc + s.saleValue, 0);
            const vgvLiquido = monthSales.reduce((acc, s) => isSaleCancelled(s) ? acc : acc + s.saleValue, 0);

            return (
              <div key={month} className="bg-cardBg/40 border border-gray-800/60 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-gray-800">
                {/* Cabeçalho do Mês (Accordion) */}
                <button 
                  onClick={() => toggleExpandMonth(month)}
                  className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 hover:bg-white/[0.02] transition-colors text-left ${isMonthExpanded ? 'bg-white/[0.03] border-b border-gray-800' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${isMonthExpanded ? 'bg-neon text-darkBg' : 'bg-gray-800 text-gray-500'}`}>
                      {isMonthExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white capitalize">{getMonthLabel(month)}</h3>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{monthSales.length} Contratos</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-8 md:gap-12 pl-12 md:pl-0">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">VGV Bruto</p>
                      <p className="text-sm font-bold text-gray-300">{formatCurrency(vgvBruto)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neon/60 uppercase tracking-widest font-black mb-0.5">VGV Líquido</p>
                      <p className="text-base font-black text-neon">{formatCurrency(vgvLiquido)}</p>
                    </div>
                  </div>
                </button>

                {/* Lista de Vendas do Mês */}
                {isMonthExpanded && (
                  <div className="p-4 md:p-6 space-y-4 animate-fade-in bg-darkBg/20">
                    {monthSales.map(sale => {
                      const isExpanded = expandedSaleId === sale.id;
                      const validEntries = sale.commissionEntries.filter(e => e.status !== 'cancelled');
                      const receivedCount = validEntries.filter(e => e.status === 'received').length;
                      const progress = validEntries.length > 0 ? (receivedCount / validEntries.length) * 100 : 0;
                      const isFullyCancelled = isSaleCancelled(sale);

                      return (
                        <div key={sale.id} className={`bg-cardBg border rounded-2xl overflow-hidden hover:border-gray-700 transition-all shadow-lg ${isFullyCancelled ? 'border-red-900/30 opacity-70' : 'border-gray-800'}`}>
                          <div className="p-4 grid md:grid-cols-12 gap-4 items-center relative">
                            {isFullyCancelled && (
                              <div className="absolute top-0 right-0 p-3">
                                <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 uppercase">Cancelada</span>
                              </div>
                            )}
                            
                            <div className="md:col-span-4 flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${isFullyCancelled ? 'bg-gray-800 text-gray-600' : 'bg-gradient-to-br from-gray-800 to-gray-900 text-neon border border-gray-700'}`}>
                                {sale.clientName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className={`font-bold text-white truncate ${isFullyCancelled ? 'line-through text-gray-500' : ''}`}>
                                  {sale.clientName}
                                </h4>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                                  <Calendar size={10} /> {new Date(sale.saleDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="md:col-span-4 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[9px] text-gray-500 uppercase font-black mb-0.5">Projeto</p>
                                <p className="text-xs text-gray-300 font-medium truncate">{sale.project}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-gray-500 uppercase font-black mb-0.5">VGV</p>
                                <p className={`text-xs font-black ${isFullyCancelled ? 'text-gray-600' : 'text-white'}`}>{formatCurrency(sale.saleValue)}</p>
                              </div>
                            </div>

                            <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-4">
                              <div className="text-right">
                                <p className="text-[9px] text-gray-500 uppercase font-black mb-0.5">Comissão</p>
                                <p className={`font-black text-sm ${isFullyCancelled ? 'text-gray-600 line-through' : 'text-neon'}`}>{formatCurrency(sale.commissionTotal)}</p>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => toggleExpandSale(sale.id)} 
                                  className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-neon text-darkBg' : 'text-gray-500 hover:bg-gray-800 hover:text-white'}`}
                                >
                                  {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                </button>
                                <button onClick={() => onEditSale(sale.id)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl"><Edit2 size={16}/></button>
                                <button onClick={() => onDeleteSale(sale.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"><Trash2 size={16}/></button>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-gray-800 bg-darkBg/50 p-6 animate-fade-in">
                              <div className="flex justify-between items-center mb-4">
                                <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                  <Layers size={14} /> Recebimentos ({receivedCount}/{validEntries.length})
                                </h5>
                                <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-neon transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                              </div>
                              <div className="grid gap-2">
                                {sale.commissionEntries.sort((a,b) => a.dueDate.localeCompare(b.dueDate)).map((entry) => {
                                  const isEntryCancelled = entry.status === 'cancelled';
                                  return (
                                    <div key={entry.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors border ${isEntryCancelled ? 'bg-red-900/5 border-red-900/10' : 'bg-cardBg border-gray-800 hover:border-gray-700'}`}>
                                      <div className="flex items-center gap-3">
                                        <button 
                                          onClick={() => !isEntryCancelled && onToggleStatus(sale.id, entry.id)} 
                                          className={`p-1.5 rounded-lg transition-all ${isEntryCancelled ? 'text-gray-700' : entry.status === 'received' ? 'bg-neon text-darkBg' : 'bg-gray-800 text-gray-600 hover:text-neon'}`}
                                        >
                                          {isEntryCancelled ? <Ban size={16} /> : entry.status === 'received' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                        </button>
                                        <div>
                                          <p className={`text-xs font-bold ${isEntryCancelled ? 'text-gray-600 line-through' : 'text-gray-200'}`}>{entry.description}</p>
                                          <p className="text-[10px] text-gray-500">{new Date(entry.dueDate).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <p className={`text-xs font-mono font-bold ${isEntryCancelled ? 'text-gray-700 line-through' : entry.status === 'received' ? 'text-neon' : 'text-white'}`}>
                                          {formatCurrency(entry.amount)}
                                        </p>
                                        <button onClick={() => onBlockEntry(sale.id, entry.id)} className={`p-1.5 rounded-lg transition-colors ${isEntryCancelled ? 'text-red-500 bg-red-500/10' : 'text-gray-700 hover:bg-gray-800'}`}>
                                          <Ban size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Clients;