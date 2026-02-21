
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Check, X, Loader2 } from 'lucide-react';
import { RoleType, Sale, PaymentPart, CommissionEntry, PaymentMethod, Product } from '../types';
import { formatCurrency, addMonths, getDueMonth, PAYMENT_METHOD_LABELS } from '../constants';
import { database } from '../services/database';

interface NewSaleFormProps {
  onSave: (sales: Sale[]) => void;
  onCancel: () => void;
  initialData?: Partial<Sale> | null;
}

const NewSaleForm: React.FC<NewSaleFormProps> = ({ onSave, onCancel, initialData }) => {
  const isEditing = !!initialData?.id;
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  
  const [clientName, setClientName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('');
  const [role, setRole] = useState<RoleType>(RoleType.FTB);
  
  const [tableValue, setTableValue] = useState<string>('0'); 
  const [entryValue, setEntryValue] = useState<string>('3990');
  const [quotaQty, setQuotaQty] = useState<number>(1);
  
  const [commissionRule, setCommissionRule] = useState<{type: 'fixed' | 'percentage', value: number}>({ type: 'percentage', value: 0 });

  const [hasSignal, setHasSignal] = useState(true);
  const [signalValue, setSignalValue] = useState<string>('1500');
  const [signalMethod, setSignalMethod] = useState<PaymentMethod>('pix');
  const [hasInstallments, setHasInstallments] = useState(true);
  const [installmentMethod, setInstallmentMethod] = useState<PaymentMethod>('boleto');
  const [installmentsCount, setInstallmentsCount] = useState<number>(4);
  const [observation, setObservation] = useState('');

  // Carrega produtos cadastrados
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingProducts(true);
      const prods = await database.products.getAll();
      setAvailableProducts(prods);
      
      if (initialData) {
        setClientName(initialData.clientName ? initialData.clientName.replace(/ - Cota \d+$/, '') : '');
        if (initialData.saleDate) setSaleDate(initialData.saleDate);
        if (initialData.project) setProjectName(initialData.project);
        if (initialData.category) setCategory(initialData.category);
        if (initialData.role) setRole(initialData.role);
        if (initialData.quotaQty) setQuotaQty(initialData.quotaQty);
        if (initialData.saleValue) setTableValue(initialData.saleValue.toString());
        if (initialData.entryTableValue) setEntryValue(initialData.entryTableValue.toString());
        
        // Tenta encontrar o produto pelo nome para restaurar a regra de comissão
        const matchedProd = prods.find(p => p.title === initialData.project);
        if (matchedProd) {
          setSelectedProjectId(matchedProd.id);
          setCommissionRule({ type: matchedProd.commissionType, value: matchedProd.commissionValue });
        }

        if (initialData.entryPayments && initialData.entryPayments.length > 0) {
          const signalP = initialData.entryPayments.find(p => p.installments === 1);
          if (signalP) { 
            setHasSignal(true);
            setSignalValue((signalP.amount * (initialData.quotaQty || 1)).toString()); 
            setSignalMethod(signalP.method); 
          } else {
            setHasSignal(false);
          }
          
          const installP = initialData.entryPayments.find(p => p.installments > 1);
          if (installP) { 
            setHasInstallments(true); 
            setInstallmentMethod(installP.method); 
            setInstallmentsCount(installP.installments); 
          } else {
            setHasInstallments(false);
          }
        }
        if (initialData.observation) setObservation(initialData.observation);
      }
      setIsLoadingProducts(false);
    };
    loadData();
  }, [initialData]);

  const handleProductSelect = (id: string) => {
    setSelectedProjectId(id);
    const prod = availableProducts.find(p => p.id === id);
    if (prod) {
      setProjectName(prod.title);
      setTableValue(prod.price.toString());
      setCategory(`${prod.bedrooms} Quartos`);
      setCommissionRule({ type: prod.commissionType, value: prod.commissionValue });
    } else {
      setProjectName('');
      setSelectedProjectId('');
    }
  };

  const entryTotal = (parseFloat(entryValue) || 0) * quotaQty;
  const currentSignal = hasSignal ? (parseFloat(signalValue) || 0) : 0;
  const remainingEntryValue = Math.max(0, entryTotal - currentSignal);
  const installmentAmount = (hasInstallments && installmentsCount > 0) ? remainingEntryValue / installmentsCount : 0;

  // Cálculo da comissão baseado na regra do produto
  const calculateCommissionTotal = () => {
    const prod = availableProducts.find(p => p.id === selectedProjectId);
    
    // Se o produto tiver comissões específicas por cargo, usa elas
    if (prod && prod.commissions) {
      let specificComm = 0;
      switch (role) {
        case RoleType.CAPTADOR: specificComm = prod.commissions.captador; break;
        case RoleType.LINER: specificComm = prod.commissions.liner; break;
        case RoleType.CLOSER: specificComm = prod.commissions.closer; break;
        case RoleType.FTB: specificComm = prod.commissions.ftb; break;
      }
      
      if (specificComm > 0) return specificComm * quotaQty;
    }

    const baseValue = commissionRule.type === 'percentage' ? (parseFloat(tableValue) || 0) : 1;
    const unitCommission = commissionRule.type === 'percentage' 
      ? (baseValue * (commissionRule.value / 100)) 
      : commissionRule.value;
    
    // Regra padrão: LINER, CLOSER e CAPTADOR recebem o valor base. FTB recebe o dobro.
    const multiplier = role === RoleType.FTB ? 2 : 1;
    return unitCommission * multiplier * quotaQty;
  };

  const previewCommissionTotal = calculateCommissionTotal();

  const calculateSingleSaleCommission = (unitEntryVal: number, unitSignalVal: number, unitRemainingVal: number) => {
     const totalCommission = calculateCommissionTotal() / quotaQty;
     // Add 'as const' to fix string assignment error on line 201 (in Sale creation loop)
     if (totalCommission <= 0) return { total: 0, status: 'Calculada' as const, entries: [] };
     
     const entries: CommissionEntry[] = [];
     const referenceTotal = unitEntryVal || 1;
     const getFirstPaymentDate = (baseDate: string, method: PaymentMethod) => method === 'credit_card' ? addMonths(baseDate, 2) : addMonths(baseDate, 1);
     let signalDueDateStr = '';

     if (hasSignal && unitSignalVal > 0) {
        const factor = unitSignalVal / referenceTotal;
        const partCommission = totalCommission * factor;
        const signalDateObj = getFirstPaymentDate(saleDate, signalMethod);
        signalDueDateStr = signalDateObj.toISOString();
        entries.push({ 
          id: Math.random().toString(), 
          saleId: 'temp', 
          description: `Comissão Sinal (${PAYMENT_METHOD_LABELS[signalMethod]})`, 
          amount: partCommission, 
          dueDate: signalDueDateStr, 
          dueMonth: getDueMonth(signalDateObj), 
          status: 'predicted' 
        });
     }
     if (hasInstallments && unitRemainingVal > 0 && installmentsCount > 0) {
        const remainingFactor = unitRemainingVal / referenceTotal;
        const totalInstallmentComm = totalCommission * remainingFactor;
        const perInstallmentComm = totalInstallmentComm / installmentsCount;
        let baseDateForInstallments = signalDueDateStr ? new Date(signalDueDateStr) : new Date(saleDate);
        for (let i = 1; i <= installmentsCount; i++) {
          const installmentDate = addMonths(baseDateForInstallments.toISOString(), i);
          entries.push({ 
            id: Math.random().toString(), 
            saleId: 'temp', 
            description: `Comissão Parc. ${i}/${installmentsCount}`, 
            amount: perInstallmentComm, 
            dueDate: installmentDate.toISOString(), 
            dueMonth: getDueMonth(installmentDate), 
            status: 'predicted' 
          });
        }
     }
     return { total: totalCommission, status: 'Calculada' as const, entries };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !projectName) return;
    
    const salesToSave: Sale[] = [];
    const loopCount = isEditing ? 1 : quotaQty;
    const unitEntryVal = parseFloat(entryValue) || 0;
    const unitTableVal = parseFloat(tableValue) || 0;
    const totalSignalInput = hasSignal ? (parseFloat(signalValue) || 0) : 0;
    const unitSignalVal = totalSignalInput / loopCount;
    const unitRemainingVal = Math.max(0, unitEntryVal - unitSignalVal);

    for (let i = 0; i < loopCount; i++) {
       const { total, status, entries } = calculateSingleSaleCommission(unitEntryVal, unitSignalVal, unitRemainingVal);
       const paymentList: PaymentPart[] = [];
       if (hasSignal && unitSignalVal > 0) paymentList.push({ id: Math.random().toString(36), method: signalMethod, amount: unitSignalVal, installments: 1 });
       if (hasInstallments && unitRemainingVal > 0) paymentList.push({ id: Math.random().toString(36), method: installmentMethod, amount: unitRemainingVal, installments: installmentsCount });
       
       let finalClientName = clientName;
       if (!isEditing && loopCount > 1) finalClientName = `${clientName} - Cota ${String(i + 1).padStart(2, '0')}`;

       salesToSave.push({
         id: isEditing && initialData?.id ? initialData.id : Math.random().toString(36).substr(2, 9),
         clientName: finalClientName,
         saleDate,
         project: projectName,
         category: category,
         unitType: category,
         quotaQty: 1,
         role,
         saleValue: unitTableVal > 0 ? unitTableVal : unitEntryVal,
         commissionTotal: total,
         commissionStatus: status,
         entryTableValue: unitEntryVal,
         entryPayments: paymentList,
         balancePayments: [],
         commissionEntries: entries,
         observation,
         createdAt: initialData?.createdAt || new Date().toISOString(),
         sourceType: initialData?.sourceType || 'manual',
         sourceFileRef: initialData?.sourceFileRef,
         userId: initialData?.userId || '' 
       });
    }
    onSave(salesToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-cardBg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-cardBg sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">{isEditing ? 'Editar Venda' : 'Registrar Nova Venda'}</h2>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="saleForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Cliente</label>
              <input type="text" required className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-neon outline-none" placeholder="Nome do cliente" value={clientName} onChange={e => setClientName(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Data da Venda</label>
                <div className="relative">
                  <input type="date" required className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-neon outline-none" value={saleDate} onChange={e => setSaleDate(e.target.value)} />
                  <Calendar className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Empreendimento</label>
                <div className="relative">
                  {isLoadingProducts ? (
                    <div className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-gray-500 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Carregando...
                    </div>
                  ) : (
                    <select 
                      className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white appearance-none focus:border-neon outline-none" 
                      value={selectedProjectId} 
                      onChange={e => handleProductSelect(e.target.value)}
                      required
                    >
                      <option value="">Selecione um produto...</option>
                      {availableProducts.map(p => <option key={p.id} value={p.id}>{p.title} - {formatCurrency(p.price)}</option>)}
                      <option value="manual">-- Outro (Manual) --</option>
                    </select>
                  )}
                  <ChevronDown className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {selectedProjectId === 'manual' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nome do Projeto Manual</label>
                <input type="text" className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-neon outline-none" placeholder="Digite o nome do projeto" value={projectName} onChange={e => setProjectName(e.target.value)} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Unidade / Categoria</label>
                <input type="text" className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-neon outline-none" placeholder="Ex: 1 Quarto, Faixa 1..." value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo de Comissão</label>
                <div className="relative">
                  <select className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white appearance-none focus:border-neon outline-none" value={role} onChange={e => setRole(e.target.value as RoleType)}>
                    {Object.values(RoleType).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Valor Tabela (R$)</label>
                <input type="number" step="0.01" className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-neon outline-none" value={tableValue} onChange={e => setTableValue(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-1.5">Entrada Unitária (R$)</label>
                <input type="number" required step="0.01" className="w-full bg-darkBg border border-neon rounded-xl px-4 py-3 text-white focus:border-neon outline-none font-bold" value={entryValue} onChange={e => setEntryValue(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Quantidade de Cotas</label>
                <input type="number" min="1" required disabled={isEditing} className={`w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-neon outline-none ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} value={quotaQty} onChange={e => setQuotaQty(parseInt(e.target.value))} />
              </div>
              <div className="flex items-center">
                <div className="text-xs text-gray-500 mt-6 uppercase font-bold tracking-wider">
                  Total Entrada: <span className="text-white font-black">{formatCurrency(entryTotal)}</span>
                </div>
              </div>
            </div>

            <div className="bg-darkBg border border-gray-700/50 rounded-xl p-5">
              <label className="flex items-center gap-3 cursor-pointer mb-4 select-none group">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${hasSignal ? 'bg-blue-600 border-blue-600' : 'border-gray-600 group-hover:border-gray-500'}`}>
                  {hasSignal && <Check size={16} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={hasSignal} onChange={e => setHasSignal(e.target.checked)} />
                <span className="text-sm font-bold text-white">Sinal Recebido (R$)</span>
              </label>
              {hasSignal && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Valor do Sinal</label>
                    <input type="number" className="w-full bg-cardBg border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 outline-none" value={signalValue} onChange={e => setSignalValue(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Forma</label>
                    <div className="relative">
                      <select className="w-full bg-cardBg border border-gray-700 rounded-lg px-3 py-2.5 text-white appearance-none focus:border-blue-500 outline-none" value={signalMethod} onChange={e => setSignalMethod(e.target.value as PaymentMethod)}>
                        {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-5">
              <div className="mb-4">
                <p className="text-sm text-blue-200/70 mb-1">Saldo da Entrada</p>
                <p className="text-3xl font-bold text-blue-400">{formatCurrency(remainingEntryValue)}</p>
              </div>
              <label className="flex items-center gap-3 cursor-pointer mb-5 select-none group">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${hasInstallments ? 'bg-blue-600 border-blue-600' : 'border-blue-800/50 bg-blue-900/10 group-hover:border-blue-700'}`}>
                  {hasInstallments && <Check size={16} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={hasInstallments} onChange={e => setHasInstallments(e.target.checked)} />
                <span className="text-sm font-bold text-blue-100">Parcelar Saldo</span>
              </label>
              {hasInstallments && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-blue-200/60 mb-1">Forma</label>
                      <div className="relative">
                        <select className="w-full bg-darkBg/50 border border-blue-900/50 rounded-lg px-3 py-2.5 text-blue-100 appearance-none focus:border-blue-500 outline-none" value={installmentMethod} onChange={e => setInstallmentMethod(e.target.value as PaymentMethod)}>
                          <option value="boleto">Boleto</option>
                          <option value="credit_card">Cartão</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-blue-400 pointer-events-none" size={14} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-200/60 mb-1">Qtd. Parcelas</label>
                      <input type="number" min="1" className="w-full bg-darkBg/50 border border-blue-900/50 rounded-lg px-3 py-2.5 text-blue-100 focus:border-blue-500 outline-none" value={installmentsCount} onChange={e => setInstallmentsCount(parseInt(e.target.value))} />
                    </div>
                  </div>
                  <div className="bg-cardBg border border-gray-800 rounded-lg p-4">
                    <p className="text-white font-bold text-sm">{installmentsCount}x de {formatCurrency(installmentAmount)}</p>
                  </div>
                </div>
              )}
            </div>

            {previewCommissionTotal > 0 && (
              <div className="bg-cardBg border border-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Resumo da Comissão ({quotaQty} {quotaQty > 1 ? 'cotas' : 'cota'}):</h3>
                <div className="flex justify-between items-center bg-neon/10 p-4 rounded-lg border border-neon/20">
                  <span className="text-sm font-bold text-white">Comissão Total Prevista:</span>
                  <span className="text-2xl font-black text-neon">{formatCurrency(previewCommissionTotal)}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center uppercase font-bold italic">
                  * Calculado com base na regra: {commissionRule.type === 'percentage' ? `${commissionRule.value}% do VGV` : formatCurrency(commissionRule.value)}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Observações</label>
              <textarea className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-neon outline-none h-24 resize-none" placeholder="Observações..." value={observation} onChange={e => setObservation(e.target.value)} />
            </div>

            <div className="pt-6 border-t border-gray-800 bg-cardBg z-10">
              <button type="submit" className="w-full py-4 bg-blue-700 hover:bg-blue-600 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-blue-900/20">
                {isEditing ? 'Atualizar Venda' : 'Finalizar Venda(s)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSaleForm;
