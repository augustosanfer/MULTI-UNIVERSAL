import React, { useState, useEffect } from 'react';
import { X, Home, MapPin, DollarSign, Bed, Bath, Car, Maximize, Percent, Hash, Users, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface NewProductFormProps {
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
  initialData?: Product | null;
}

const NewProductForm: React.FC<NewProductFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    location: '',
    price: 0,
    bedrooms: 1,
    weeks: 1,
    capacity: 4,
    area: 0,
    bathrooms: 1,
    parking: 0,
    commissionType: 'percentage',
    commissionValue: 0,
    imageUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim()) {
      alert("⚠️ Por favor, insira o nome do empreendimento.");
      return;
    }

    if (formData.price === undefined || formData.price === null || formData.price < 0) {
      alert("⚠️ Por favor, insira um preço válido.");
      return;
    }

    // Sanitização final dos dados para garantir tipos corretos no banco
    const sanitizedData = {
      ...formData,
      title: formData.title.trim(),
      price: Number(formData.price) || 0,
      commissionValue: Number(formData.commissionValue) || 0,
      area: Number(formData.area) || 0,
      capacity: Number(formData.capacity) || 0,
      bedrooms: Number(formData.bedrooms) || 1,
      weeks: Number(formData.weeks) || 1,
      bathrooms: Number(formData.bathrooms) || 1,
      parking: Number(formData.parking) || 0,
    };

    onSave(sanitizedData);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-cardBg border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[95vh]">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-cardBg sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Home className="text-neon" size={24} /> 
            {initialData ? 'Editar Empreendimento' : 'Cadastrar Empreendimento'}
          </h2>
          <button type="button" onClick={onCancel} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form id="productForm" onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome do Empreendimento</label>
                <div className="relative">
                  <Home className="absolute left-4 top-3.5 text-gray-600" size={18} />
                  <input className="w-full bg-darkBg border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" placeholder="Ex: Aspen Mountain - Casa Alma" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Localização</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-gray-600" size={18} />
                  <input className="w-full bg-darkBg border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" placeholder="Cidade / Estado" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Preço de Tabela (VGV)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-3.5 text-gray-600" size={18} />
                  <input type="number" step="0.01" className="w-full bg-darkBg border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" placeholder="0.00" value={formData.price ?? ''} onChange={e => setFormData({...formData, price: e.target.value ? parseFloat(e.target.value) : 0})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL da Imagem</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-3.5 text-gray-600" size={18} />
                  <input className="w-full bg-darkBg border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none" placeholder="https://..." value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
              </div>

              <div className="col-span-2 p-5 bg-darkBg/50 border border-gray-800 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-6">
                 <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase mb-1.5"><Bed size={12}/> Quartos</label>
                    <select className="w-full bg-cardBg border border-gray-700 rounded-lg p-2 text-white outline-none" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: parseInt(e.target.value)})}>
                      <option value={1}>1 Quarto</option>
                      <option value={2}>2 Quartos</option>
                      <option value={3}>3+ Quartos</option>
                    </select>
                 </div>
                 <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase mb-1.5"><Hash size={12}/> Semanas</label>
                    <select className="w-full bg-cardBg border border-gray-700 rounded-lg p-2 text-white outline-none" value={formData.weeks} onChange={e => setFormData({...formData, weeks: parseInt(e.target.value)})}>
                      <option value={1}>1 Semana</option>
                      <option value={2}>2 Semanas</option>
                      <option value={4}>4 Semanas</option>
                    </select>
                 </div>
                 <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase mb-1.5"><Users size={12}/> Cap. Pessoas</label>
                    <input type="number" className="w-full bg-cardBg border border-gray-700 rounded-lg p-2 text-white outline-none" value={formData.capacity ?? ''} onChange={e => setFormData({...formData, capacity: e.target.value ? parseInt(e.target.value) : 0})} />
                 </div>
                 <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase mb-1.5"><Maximize size={12}/> Área m²</label>
                    <input type="number" className="w-full bg-cardBg border border-gray-700 rounded-lg p-2 text-white outline-none" value={formData.area ?? ''} onChange={e => setFormData({...formData, area: e.target.value ? parseFloat(e.target.value) : 0})} />
                 </div>
              </div>

              <div className="col-span-2 p-6 bg-neon/5 border border-neon/10 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-neon uppercase tracking-widest">Regra de Comissão</span>
                  <div className="flex bg-darkBg p-1 rounded-lg border border-gray-800">
                    <button type="button" onClick={() => setFormData({...formData, commissionType: 'percentage'})} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${formData.commissionType === 'percentage' ? 'bg-neon text-darkBg' : 'text-gray-500'}`}>% Porcentagem</button>
                    <button type="button" onClick={() => setFormData({...formData, commissionType: 'fixed'})} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${formData.commissionType === 'fixed' ? 'bg-neon text-darkBg' : 'text-gray-500'}`}>R$ Fixo</button>
                  </div>
                </div>
                <div className="relative">
                  {formData.commissionType === 'percentage' ? <Percent className="absolute left-4 top-3.5 text-neon" size={18} /> : <DollarSign className="absolute left-4 top-3.5 text-neon" size={18} />}
                  <input type="number" step="0.01" className="w-full bg-darkBg border border-neon/30 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon outline-none font-bold" placeholder={formData.commissionType === 'percentage' ? "0.00%" : "R$ 0,00"} value={formData.commissionValue ?? ''} onChange={e => setFormData({...formData, commissionValue: e.target.value ? parseFloat(e.target.value) : 0})} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-800 bg-cardBg grid grid-cols-2 gap-4 sticky bottom-0 z-10">
            <button type="button" onClick={onCancel} className="py-4 border border-gray-800 text-gray-400 font-bold rounded-xl hover:bg-white/5 transition-all">Cancelar</button>
            <button type="submit" className="py-4 bg-neon text-darkBg font-black rounded-xl hover:bg-neon/90 transition-all shadow-[0_0_20px_rgba(124,255,79,0.2)]">Salvar Produto</button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default NewProductForm;