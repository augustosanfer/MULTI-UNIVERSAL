import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { database } from '../services/database';
import { formatCurrency } from '../constants';
import { Plus, Home, MapPin, Bed, Bath, Car, Maximize, Trash2, Edit, Loader2, Users } from 'lucide-react';
import NewProductForm from './NewProductForm';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await database.products.getAll();
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este produto permanentemente?')) {
      try {
        await database.products.delete(id);
        await loadProducts();
      } catch (error) {
        alert("Erro ao excluir produto. Verifique sua conexão.");
      }
    }
  };

  const handleSave = async (productData: Partial<Product>) => {
    setIsSaving(true);
    try {
      console.log('Iniciando salvamento do produto...');
      await database.products.save(productData);
      
      console.log('Salvo com sucesso! Atualizando UI...');
      setShowForm(false);
      setEditingProduct(null);
      
      // Recarrega a lista para refletir as mudanças (seja do LocalStorage ou Supabase)
      await loadProducts();
    } catch (error: any) {
      console.error("Erro no fluxo de salvamento:", error);
      alert("⚠️ Erro ao salvar empreendimento:\n\n" + (error.message || "Verifique sua conexão."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Home className="text-neon" size={32} /> Meus Produtos
          </h2>
          <p className="text-gray-400 mt-1">Cadastre e gerencie seus empreendimentos de multipropriedade.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="bg-neon text-darkBg font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(124,255,79,0.3)]"
        >
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-neon" size={40} />
          <p className="text-gray-500">Carregando catálogo...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-cardBg/50 border-2 border-dashed border-gray-800 rounded-3xl p-20 text-center animate-fade-in">
          <div className="w-20 h-20 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home size={40} className="text-gray-700 opacity-40" />
          </div>
          <p className="text-gray-500 text-lg mb-4">Nenhum produto cadastrado ainda.</p>
          <button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="text-neon font-bold hover:underline bg-neon/5 px-6 py-2 rounded-lg border border-neon/20">Começar agora</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {products.map((product) => (
            <div key={product.id} className="bg-cardBg border border-gray-800 rounded-[2rem] overflow-hidden group hover:border-neon/30 transition-all shadow-xl flex flex-col">
              <div className="relative h-64 overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700">
                    <Home size={64} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-neon text-darkBg px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    {product.bedrooms}Q • {product.weeks} Semanas
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-darkBg/60 backdrop-blur-md p-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingProduct(product); setShowForm(true); }} className="p-2 text-white hover:text-neon transition-colors"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-white hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{product.title}</h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin size={14} className="text-neon" /> {product.location || 'Localização não informada'}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-2xl font-black text-neon">{formatCurrency(product.price)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Comissão:</span>
                    <span className="text-xs font-black text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {product.commissionType === 'percentage' 
                        ? `${product.commissionValue}% (${formatCurrency((product.price * product.commissionValue) / 100)})` 
                        : formatCurrency(product.commissionValue)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-800 mt-auto">
                  <div className="flex flex-col items-center gap-1">
                    <Bed size={16} className="text-gray-500" />
                    <span className="text-xs font-bold text-white">{product.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Bath size={16} className="text-gray-500" />
                    <span className="text-xs font-bold text-white">{product.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Car size={16} className="text-gray-500" />
                    <span className="text-xs font-bold text-white">{product.parking}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Maximize size={16} className="text-gray-500" />
                    <span className="text-[10px] font-bold text-white truncate">{product.area}m²</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-center gap-2 bg-neon/5 py-2 rounded-xl border border-neon/10">
                   <Users size={14} className="text-neon" />
                   <span className="text-xs font-bold text-neon">{product.capacity} Pessoas</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editingProduct) && (
        <NewProductForm 
          onSave={handleSave} 
          onCancel={() => { setShowForm(false); setEditingProduct(null); }} 
          initialData={editingProduct} 
        />
      )}

      {isSaving && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-cardBg p-8 rounded-2xl border border-gray-800 flex flex-col items-center shadow-2xl">
            <Loader2 className="animate-spin text-neon mb-4" size={40} />
            <p className="text-white font-bold">Processando requisição...</p>
            <p className="text-gray-400 text-xs mt-2">Salvando dados com segurança</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;