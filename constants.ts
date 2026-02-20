import { RoleType } from './types';

export const addDays = (date: string, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (dateStr: string, months: number): Date => {
  const d = new Date(dateStr);
  const originalDay = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + months);
  if (d.getUTCDate() !== originalDay) {
    d.setUTCDate(0);
  }
  return d;
};

export const getDueMonth = (date: Date): string => {
  return date.toISOString().slice(0, 7);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card: 'Cartão de Crédito',
  pix: 'Pix',
  debit_card: 'Débito',
  cash: 'Dinheiro',
  boleto: 'Boleto'
};
