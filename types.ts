export enum RoleType {
  FTB = 'FTB',
  LINER = 'LINER',
  CLOSER = 'CLOSER',
  CAPTADOR = 'CAPTADOR'
}

export enum UnitType {
  ONE_BEDROOM = '1 Quarto',
  TWO_BEDROOM = '2 Quartos',
  MIX = 'Mix'
}

export type PaymentMethod = 'credit_card' | 'pix' | 'debit_card' | 'cash' | 'boleto';

export interface PaymentPart {
  id: string;
  method: PaymentMethod;
  amount: number;
  installments: number;
}

export interface CommissionEntry {
  id: string;
  saleId: string;
  description: string;
  amount: number;
  dueDate: string;
  dueMonth: string;
  status: 'predicted' | 'received' | 'cancelled';
}

export interface Product {
  id: string;
  userId: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  weeks: number;
  capacity: number;
  area: number;
  bathrooms: number;
  parking: number;
  commissionType: 'fixed' | 'percentage';
  commissionValue: number;
  commissions?: {
    captador: number;
    liner: number;
    closer: number;
    ftb: number;
    capFtb: number;
  };
  category?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  clientName: string;
  saleDate: string;
  project: string;
  category: string;
  unitType: string;
  quotaQty: number;
  role: RoleType;
  saleValue: number;
  commissionTotal: number;
  commissionStatus: 'Calculada' | 'Pendente' | 'Recebida';
  entryTableValue: number;
  entryPayments: PaymentPart[];
  balancePayments: PaymentPart[];
  commissionEntries: CommissionEntry[];
  sourceType?: 'manual' | 'import_image' | 'import_pdf' | 'import_excel';
  sourceFileRef?: string;
  observation?: string;
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  subscriptionStatus: 'active' | 'pending' | 'inactive';
  subscriptionDate?: string;
  expirationDate?: string;
  createdAt: string;
}