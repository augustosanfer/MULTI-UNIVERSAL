import { Sale, Product } from '../types';
import { supabase } from './supabase';

const GUEST_USER_ID = '00000000-0000-0000-0000-000000000000';

export const database = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || GUEST_USER_ID;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
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
        imageUrl: row.image_url,
        createdAt: row.created_at
      }));
    },

    save: async (product: Partial<Product>): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || GUEST_USER_ID;

      const payload = {
        user_id: userId,
        title: product.title,
        location: product.location,
        price: product.price,
        bedrooms: product.bedrooms,
        weeks: product.weeks,
        capacity: product.capacity,
        area: product.area,
        bathrooms: product.bathrooms,
        parking: product.parking,
        commission_type: product.commissionType,
        commission_value: product.commissionValue,
        image_url: product.imageUrl
      };

      const { error } = product.id 
        ? await supabase.from('products').update(payload).eq('id', product.id).eq('user_id', userId)
        : await supabase.from('products').insert(payload);

      if (error) throw error;
    },

    delete: async (id: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || GUEST_USER_ID;
      
      const { error } = await supabase.from('products').delete().eq('id', id).eq('user_id', userId);
      if (error) throw error;
    }
  },

  sales: {
    getAll: async (): Promise<Sale[]> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || GUEST_USER_ID;

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

      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId)
        .eq('user_id', userId);
      
      if (error) console.error('Erro ao deletar venda:', error);
    }
  }
};