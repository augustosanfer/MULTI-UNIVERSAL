import React, { useState, useRef } from 'react';
import { UploadCloud, Check, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Sale } from '../types';
import * as XLSX from 'xlsx';
import { database } from '../services/database';

interface ImportProps {
  onReviewSale: (data: Partial<Sale>) => void;
}

const Import: React.FC<ImportProps> = ({ onReviewSale }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setProcessStatus('idle');
      setErrorMessage('');
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProcessStatus('idle');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        console.log('Dados brutos da importação:', data);

        let count = 0;
        for (const row of data) {
          try {
            let saleData: Partial<Sale> = {};

            // Caso 1: Formato com coluna 'raw_data' (JSON)
            if (row.raw_data) {
              try {
                const parsed = typeof row.raw_data === 'string' ? JSON.parse(row.raw_data) : row.raw_data;
                saleData = { ...parsed };
                // Garante que o ID e datas sejam preservados se existirem
                if (row.id) saleData.id = row.id;
                if (row.created_at) saleData.createdAt = row.created_at;
              } catch (e) {
                console.warn('Erro ao parsear raw_data JSON, tentando mapeamento manual', e);
              }
            } 
            
            // Caso 2: Mapeamento manual de colunas se não houver raw_data ou falhar
            if (!saleData.clientName) {
              saleData.clientName = row.client_name || row.CLIENTE || row.clientName;
              saleData.project = row.project || row.EMPREENDIMENTO || row.projectName;
              saleData.saleDate = row.sale_date || row.DATA || row.saleDate;
              saleData.saleValue = parseFloat(row.sale_value || row.VALOR || row.saleValue || 0);
              saleData.commissionTotal = parseFloat(row.commission_total || row.COMISSAO || row.commissionTotal || 0);
            }

            if (saleData.clientName && saleData.project) {
              // Salva cada venda no banco
              await database.sales.save(saleData as Sale);
              count++;
            }
          } catch (err) {
            console.error('Erro ao processar linha:', row, err);
          }
        }

        setImportedCount(count);
        setProcessStatus('success');
      } catch (error: any) {
        console.error('Erro ao processar arquivo:', error);
        setProcessStatus('error');
        setErrorMessage(error.message || 'Erro desconhecido ao processar arquivo.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setProcessStatus('error');
      setErrorMessage('Erro na leitura do arquivo.');
    };

    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Importar Histórico de Vendas</h2>
        <p className="text-gray-400">Importe suas vendas antigas via Excel ou CSV (formato SQL antigo suportado).</p>
      </div>

      {!selectedFile ? (
        <div 
          className="bg-darkBg/50 border-2 border-dashed rounded-3xl p-12 text-center transition-colors cursor-pointer border-gray-700 hover:border-gray-500 group" 
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept=".xlsx,.xls,.csv" 
          />
          <UploadCloud size={64} className="mx-auto mb-4 text-gray-600 group-hover:text-neon transition-colors" />
          <h3 className="text-xl font-bold text-white mb-2">Selecione seu arquivo</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">Suporta arquivos .xlsx, .xls e .csv exportados do sistema antigo.</p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
          <div className="bg-cardBg border border-gray-800 rounded-3xl p-8 text-center animate-fade-in shadow-2xl">
            {isProcessing ? (
              <div className="py-10">
                <Loader2 size={48} className="mx-auto text-neon animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Processando Dados...</h3>
                <p className="text-gray-500 text-sm">Lendo tabelas e convertendo formatos</p>
              </div>
            ) : processStatus === 'success' ? (
              <div className="py-8">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Importação Concluída!</h3>
                <p className="text-gray-400 mb-8">
                  <span className="text-neon font-black">{importedCount}</span> vendas foram adicionadas ao seu banco de dados.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setSelectedFile(null); setProcessStatus('idle'); }} 
                    className="flex-1 px-6 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
                  >
                    Importar outro
                  </button>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="flex-1 px-6 py-4 bg-neon text-darkBg rounded-xl font-bold hover:bg-neon/90 transition-colors shadow-[0_0_20px_rgba(124,255,79,0.3)]"
                  >
                    Ver Dashboard
                  </button>
                </div>
              </div>
            ) : processStatus === 'error' ? (
              <div className="py-8">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Erro na Importação</h3>
                <p className="text-red-400 text-sm mb-8">{errorMessage}</p>
                <button 
                  onClick={() => { setSelectedFile(null); setProcessStatus('idle'); }} 
                  className="w-full px-6 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <div className="py-8">
                <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neon/20">
                  <FileText size={32} className="text-neon" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{selectedFile.name}</h3>
                <p className="text-gray-500 text-xs mb-8">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedFile(null)} 
                    className="flex-1 px-6 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={processFile} 
                    className="flex-1 px-6 py-4 bg-neon text-darkBg rounded-xl font-bold hover:bg-neon/90 transition-colors shadow-[0_0_20px_rgba(124,255,79,0.3)]"
                  >
                    Iniciar Importação
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 bg-cardBg/30 border border-gray-800 rounded-2xl p-6 max-w-2xl mx-auto">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-blue-400" /> Dicas para Importação
        </h4>
        <ul className="text-sm text-gray-500 space-y-2 list-disc pl-5">
          <li>O sistema reconhece automaticamente o formato <code className="text-gray-300">raw_data</code> do seu banco antigo.</li>
          <li>Você também pode importar planilhas com colunas: <code className="text-gray-300">client_name, project, sale_date, sale_value</code>.</li>
          <li>Certifique-se de que as datas estão no formato <code className="text-gray-300">AAAA-MM-DD</code>.</li>
          <li>Valores monetários não devem conter símbolos como "R$".</li>
        </ul>
      </div>
    </div>
  );
};

export default Import;