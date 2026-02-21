import { Sale, Product } from '../types';
import { supabase } from './supabase';

const GUEST_USER_ID = '00000000-0000-0000-0000-000000000000';

// Chaves para o LocalStorage (Fallback para modo Convidado)
const LS_KEYS = {
  PRODUCTS: 'multicota_guest_products',
  SALES: 'multicota_guest_sales'
};

export const database = {
  products: {
    getAll: async (): Promise<Product[]> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || GUEST_USER_ID;

        // Se for convidado, busca do LocalStorage
        if (userId === GUEST_USER_ID) {
          const localData = localStorage.getItem(LS_KEYS.PRODUCTS);
          return localData ? JSON.parse(localData) : [];
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar produtos no Supabase:', error);
          // Fallback para LocalStorage se a tabela não existir
          if (error.message.includes('not find the table') || error.code === 'PGRST116') {
            console.warn('Tabela "products" não encontrada. Usando LocalStorage como fallback.');
            const localData = localStorage.getItem(LS_KEYS.PRODUCTS);
            return localData ? JSON.parse(localData) : [];
          }
          return [];
        }

        return (data || []).map(row => ({
          id: row.id,
          userId: row.user_id,
          title: row.title,
          location: row.location,
          price: row.price,
          bedrooms: row.bedrooms,
          weeks: row.weeks,
          capacity: row.capacity,
          area: row.area,
          bathrooms: row.bathrooms,
          parking: row.parking,
          commissionType: row.commission_type,
          commissionValue: row.commission_value,
          commissions: row.commissions,
          category: row.category,
          imageUrl: row.image_url,
          createdAt: row.created_at
        }));
      } catch (err) {
        console.error('Erro fatal ao buscar produtos:', err);
        return [];
      }
    },

    save: async (product: Partial<Product>): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || GUEST_USER_ID;

      // Lógica para modo CONVIDADO
      if (userId === GUEST_USER_ID) {
        const localData = localStorage.getItem(LS_KEYS.PRODUCTS);
        let products: Product[] = localData ? JSON.parse(localData) : [];
        
        if (product.id) {
          products = products.map(p => p.id === product.id ? { ...p, ...product } as Product : p);
        } else {
          const newProduct: Product = {
            ...product,
            id: Math.random().toString(36).substr(2, 9),
            userId: GUEST_USER_ID,
            createdAt: new Date().toISOString()
          } as Product;
          products.unshift(newProduct);
        }
        localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(products));
        return;
      }

      // Lógica para modo USUÁRIO REAL (Supabase)
      const payload = {
        user_id: userId,
        title: product.title,
        location: product.location || '',
        price: Number(product.price) || 0,
        bedrooms: Number(product.bedrooms) || 1,
        weeks: Number(product.weeks) || 1,
        capacity: Number(product.capacity) || 1,
        area: Number(product.area) || 0,
        bathrooms: Number(product.bathrooms) || 1,
        parking: Number(product.parking) || 0,
        commission_type: product.commissionType,
        commission_value: Number(product.commissionValue) || 0,
        commissions: product.commissions,
        category: product.category,
        image_url: product.imageUrl || ''
      };

      let result;
      if (product.id) {
        result = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id)
          .eq('user_id', userId);
      } else {
        result = await supabase
          .from('products')
          .insert(payload);
      }

      if (result.error) {
        console.error('Erro ao salvar no Supabase:', result.error);
        // Fallback para LocalStorage se a tabela não existir
        if (result.error.message.includes('not find the table')) {
          console.warn('Tabela "products" não encontrada. Salvando no LocalStorage.');
          const localData = localStorage.getItem(LS_KEYS.PRODUCTS);
          let products: Product[] = localData ? JSON.parse(localData) : [];
          
          if (product.id) {
            products = products.map(p => p.id === product.id ? { ...p, ...product } as Product : p);
          } else {
            const newProduct: Product = {
              ...product,
              id: Math.random().toString(36).substr(2, 9),
              userId: userId,
              createdAt: new Date().toISOString()
            } as Product;
            products.unshift(newProduct);
          }
          localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(products));
          return;
        }
        throw new Error(result.error.message);
      }
    },

    delete: async (id: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || GUEST_USER_ID;
      
      if (userId === GUEST_USER_ID) {
        const localData = localStorage.getItem(LS_KEYS.PRODUCTS);
        if (localData) {
          const products = JSON.parse(localData).filter((p: any) => p.id !== id);
          localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(products));
        }
        return;
      }

      const { error } = await supabase.from('products').delete().eq('id', id).eq('user_id', userId);
      if (error) throw error;
    }
  },

  sales: {
    getAll: async (): Promise<Sale[]> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || GUEST_USER_ID;

        if (userId === GUEST_USER_ID) {
          const localData = localStorage.getItem(LS_KEYS.SALES);
          return localData ? JSON.parse(localData) : [];
        }

        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Erro ao buscar vendas:', error);
          return [];
        }

        return (data || []).map((row: any) => ({
          ...row.raw_data,
          id: row.id,
          userId: row.user_id
        }));
      } catch (e) {
        console.error("Erro inesperado ao buscar vendas", e);
        return [];
      }
    },

    save: async (sale: Sale): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || GUEST_USER_ID;

      if (userId === GUEST_USER_ID) {
        const localData = localStorage.getItem(LS_KEYS.SALES);
        let sales: Sale[] = localData ? JSON.parse(localData) : [];
        const existingIndex = sales.findIndex(s => s.id === sale.id);
        
        if (existingIndex >= 0) {
          sales[existingIndex] = { ...sale, userId: GUEST_USER_ID };
        } else {
          sales.push({ ...sale, userId: GUEST_USER_ID });
        }
        localStorage.setItem(LS_KEYS.SALES, JSON.stringify(sales));
        return;
      }

      const { error } = await supabase.from('sales').upsert({
        id: sale.id,
        user_id: userId,
        client_name: sale.clientName,
        sale_date: sale.saleDate,
        project: sale.project,
        sale_value: sale.saleValue,
        commission_total: sale.commissionTotal,
        raw_data: { ...sale, userId: userId }
      });

      if (error) console.error('Erro ao salvar venda:', error);
    },

    delete: async (saleId: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || GUEST_USER_ID;

      if (userId === GUEST_USER_ID) {
        const localData = localStorage.getItem(LS_KEYS.SALES);
        if (localData) {
          const sales = JSON.parse(localData).filter((s: any) => s.id !== saleId);
          localStorage.setItem(LS_KEYS.SALES, JSON.stringify(sales));
        }
        return;
      }

      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId)
        .eq('user_id', userId);
      
      if (error) console.error('Erro ao deletar venda:', error);
    }
  }
};