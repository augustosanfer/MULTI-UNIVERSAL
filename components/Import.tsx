import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image, FileSpreadsheet, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { Sale, RoleType, UnitType } from '../types';

interface ImportProps {
  onReviewSale: (data: Partial<Sale>) => void;
}

const Import: React.FC<ImportProps> = ({ onReviewSale }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [extractedData, setExtractedData] = useState<Partial<Sale> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setProcessStatus('idle');
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessStatus('success');
      const mockData: Partial<Sale> = {
        clientName: "Fernando S. Machado",
        saleDate: "2023-11-20",
        unitType: UnitType.TWO_BEDROOM,
        role: RoleType.LINER,
        saleValue: 65900,
        entryTableValue: 4490,
        entryPayments: [ { id: '1', method: 'pix', amount: 1000, installments: 1 }, { id: '2', method: 'boleto', amount: 3490, installments: 10 } ],
        sourceType: 'import_image',
        sourceFileRef: selectedFile.name
      };
      setExtractedData(mockData);
    }, 2000);
  };

  const handleReviewClick = () => { if (extractedData) onReviewSale(extractedData); };
  const clearFile = () => { setSelectedFile(null); setProcessStatus('idle'); setExtractedData(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 pb-20">
      <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">Importar Vendas</h2><p className="text-gray-400">Arraste seus documentos.</p></div>
      {!selectedFile ? (
        <div className="bg-darkBg/50 border-2 border-dashed rounded-3xl p-12 text-center transition-colors cursor-pointer border-gray-700 hover:border-gray-500" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv" />
          <UploadCloud size={48} className="mx-auto mb-4 text-gray-600" /><p className="text-gray-300 font-medium mb-2">Clique para buscar</p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto"><div className="bg-cardBg border border-gray-800 rounded-3xl p-8 text-center animate-fade-in shadow-2xl">
            {isProcessing ? <div className="py-10"><Loader2 size={48} className="mx-auto text-neon animate-spin mb-4" /><h3 className="text-xl font-bold text-white mb-2">Processando...</h3></div> : processStatus === 'success' ? (
              <div className="py-8"><div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-green-500" /></div><h3 className="text-xl font-bold text-white mb-2">Concluído!</h3><button onClick={handleReviewClick} className="px-6 py-3 bg-neon text-darkBg rounded-xl font-bold hover:bg-neon/90 transition-colors shadow-[0_0_20px_rgba(124,255,79,0.2)]">Revisar Venda</button></div>
            ) : (<div className="py-8"><h3 className="text-lg font-bold text-white mb-4">{selectedFile.name}</h3><button onClick={processFile} className="px-6 py-3 bg-neon text-darkBg rounded-xl font-bold hover:bg-neon/90 transition-colors">Processar</button></div>)}
        </div></div>
      )}
    </div>
  );
};
export default Import;