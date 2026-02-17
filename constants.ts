import { RoleType } from './types';

// --- TABELA VÁLIDA ATÉ 31/01/2025 (Primeira Imagem) ---
const COMMISSION_DATA_2025 = [
  { project: 'Areya Barra', category: 'Faixa 1', liner: 339.15, closer: 339.15, ftb: 678.30 },
  { project: 'Areya Barra', category: 'Faixa 2', liner: 640.29, closer: 640.29, ftb: 1280.58 },
  { project: 'Areya Barra', category: 'Faixa 3', liner: 703.23, closer: 703.23, ftb: 1406.46 },
  { project: 'Beach', category: 'Faixa 1', liner: 452.8, closer: 452.8, ftb: 905.6 },
  { project: 'Exclusive', category: '1 Quarto e 2 Semanas', liner: 479.43, closer: 479.43, ftb: 958.86 },
  { project: 'Exclusive', category: '1 Quarto e 4 Semanas', liner: 1118.67, closer: 1118.67, ftb: 2237.34 },
  { project: 'Exclusive', category: '2 Quartos e 2 Semanas', liner: 692.51, closer: 692.51, ftb: 1385.02 },
  { project: 'Exclusive', category: '2 Quartos e 4 Semanas', liner: 1438.29, closer: 1438.29, ftb: 2876.58 },
  { project: 'Gran Garden', category: 'Faixa 1', liner: 977.45, closer: 977.45, ftb: 1954.90 },
  { project: 'Gran Garden', category: 'Faixa 2', liner: 1288.48, closer: 1288.48, ftb: 2576.96 },
  { project: 'Gran Valley', category: 'Faixa 1', liner: 817.76, closer: 817.76, ftb: 1635.52 },
  { project: 'Gran Valley', category: 'Faixa 2', liner: 1171.89, closer: 1171.89, ftb: 2343.78 },
  { project: 'Gran Valley', category: 'Faixa 3', liner: 1334.08, closer: 1334.08, ftb: 2668.16 },
  { project: 'Gran Valley', category: 'Faixa 4', liner: 1589.44, closer: 1589.44, ftb: 3178.88 },
  { project: 'Jeriquiá Dunas', category: 'Faixa 1', liner: 296.04, closer: 296.04, ftb: 592.08 },
  { project: 'Jeriquiá Dunas', category: 'Faixa 2', liner: 500.82, closer: 500.82, ftb: 1001.64 },
  { project: 'Jeriquiá Dunas', category: 'Faixa 3', liner: 688.59, closer: 688.59, ftb: 1377.18 },
  { project: 'Jeriquiá', category: 'Faixa 1', liner: 319.18, closer: 319.18, ftb: 638.36 },
  { project: 'Jeriquiá', category: 'Faixa 2', liner: 548.11, closer: 548.11, ftb: 1096.22 },
  { project: 'Jeriquiá', category: 'Faixa 3', liner: 741.94, closer: 741.94, ftb: 1483.88 },
  { project: 'Oikos', category: 'Faixa 1', liner: 326.72, closer: 326.72, ftb: 653.44 },
  { project: 'Oikos', category: 'Faixa 2', liner: 361.06, closer: 361.06, ftb: 722.12 },
  { project: 'Oikos', category: 'Faixa 3', liner: 550.18, closer: 550.18, ftb: 1100.36 },
  { project: 'Oikos', category: 'Faixa 4', liner: 605.76, closer: 605.76, ftb: 1211.52 },
  { project: 'Park', category: '1 Quarto e 1 Semana', liner: 292.99, closer: 292.99, ftb: 585.98 },
  { project: 'Park', category: '2 Quartos e 1 Semana', liner: 386.21, closer: 386.21, ftb: 772.42 },
  { project: 'Pipa Island', category: 'Faixa 1', liner: 404.35, closer: 404.35, ftb: 808.70 },
  { project: 'Pipa Island', category: 'Faixa 2', liner: 582.43, closer: 582.43, ftb: 1164.86 },
  { project: 'Pipa Island', category: 'Faixa 3', liner: 706.05, closer: 706.05, ftb: 1412.10 },
  { project: 'Pipa Island', category: 'Faixa 4', liner: 1052.51, closer: 1052.51, ftb: 2105.02 },
  { project: 'Porto 2 Life', category: 'Faixa 1', liner: 626.52, closer: 626.52, ftb: 1253.04 },
  { project: 'Porto 2 Life', category: 'Faixa 2', liner: 835.36, closer: 835.36, ftb: 1670.72 },
  { project: 'Porto 2 Life', category: 'Faixa 3', liner: 1069.51, closer: 1069.51, ftb: 2139.02 },
  { project: 'Porto Alto', category: 'Faixa 1', liner: 689.17, closer: 689.17, ftb: 1378.34 },
  { project: 'Porto Alto', category: 'Faixa 2', liner: 960.66, closer: 960.66, ftb: 1921.32 },
  { project: 'Porto Alto', category: 'Faixa 3', liner: 1283.41, closer: 1283.41, ftb: 2566.82 },
  { project: 'Premium', category: '1 Quarto', liner: 1039.83, closer: 1039.83, ftb: 2079.66 },
  { project: 'Premium', category: '2 Quartos', liner: 1507.54, closer: 1507.54, ftb: 3015.08 },
  { project: 'Premium', category: 'Smart (BL 02)', liner: 839.54, closer: 839.54, ftb: 1679.08 },
  { project: 'Pyrénées', category: '2 Semanas', liner: 532.70, closer: 532.70, ftb: 1065.40 },
];

// --- TABELA VÁLIDA A PARTIR DE 01/01/2026 (Segunda Imagem) ---
const COMMISSION_DATA_2026 = [
  { project: 'Areya Barra', category: 'Faixa 1 (1 quarto e 1 semana)', liner: 359.23, closer: 359.23, ftb: 718.46 },
  { project: 'Areya Barra', category: 'Faixa 2 (1 quarto e 2 semanas)', liner: 678.19, closer: 678.19, ftb: 1356.38 },
  { project: 'Areya Barra', category: 'Faixa 3 (2 quartos e 1 semana)', liner: 744.86, closer: 744.86, ftb: 1489.72 },
  { project: 'Beach', category: '2 Semanas', liner: 479.60, closer: 479.60, ftb: 959.20 },
  { project: 'Exclusive', category: '1 Quarto e 2 Semanas', liner: 507.81, closer: 507.81, ftb: 1015.62 },
  { project: 'Exclusive', category: '1 Quarto e 4 Semanas', liner: 1184.90, closer: 1184.90, ftb: 2369.80 },
  { project: 'Exclusive', category: '2 Quartos e 2 Semanas', liner: 733.51, closer: 733.51, ftb: 1467.02 },
  { project: 'Exclusive', category: '2 Quartos e 4 Semanas', liner: 1523.44, closer: 1523.44, ftb: 3046.88 },
  { project: 'Gran Garden', category: 'Faixa 1', liner: 1035.32, closer: 1035.32, ftb: 2070.64 },
  { project: 'Gran Garden', category: 'Faixa 2', liner: 1364.76, closer: 1364.76, ftb: 2729.52 },
  { project: 'Gran Valley', category: 'Faixa 1', liner: 866.17, closer: 866.17, ftb: 1732.34 },
  { project: 'Gran Valley', category: 'Faixa 2', liner: 1241.26, closer: 1241.26, ftb: 2482.52 },
  { project: 'Gran Valley', category: 'Faixa 3', liner: 1413.06, closer: 1413.06, ftb: 2826.12 },
  { project: 'Gran Valley', category: 'Faixa 4', liner: 1683.53, closer: 1683.53, ftb: 3367.06 },
  { project: 'Jeriquiá Dunas', category: 'Faixa 1', liner: 313.57, closer: 313.57, ftb: 627.14 },
  { project: 'Jeriquiá Dunas', category: 'Faixa 2', liner: 530.47, closer: 530.47, ftb: 1060.94 },
  { project: 'Jeriquiá Dunas', category: 'Faixa 3', liner: 729.35, closer: 729.35, ftb: 1458.70 },
  { project: 'Jeriquiá', category: 'Faixa 1', liner: 338.08, closer: 338.08, ftb: 676.16 },
  { project: 'Jeriquiá', category: 'Faixa 2', liner: 580.55, closer: 580.55, ftb: 1161.10 },
  { project: 'Jeriquiá', category: 'Faixa 3', liner: 785.87, closer: 785.87, ftb: 1571.74 },
  { project: 'Oikos', category: 'Faixa 1', liner: 346.06, closer: 346.06, ftb: 692.12 },
  { project: 'Oikos', category: 'Faixa 2', liner: 382.44, closer: 382.44, ftb: 764.88 },
  { project: 'Oikos', category: 'Faixa 3', liner: 582.75, closer: 582.75, ftb: 1165.50 },
  { project: 'Oikos', category: 'Faixa 4', liner: 641.62, closer: 641.62, ftb: 1283.24 },
  { project: 'Park', category: '1 Quarto e 1 Semana', liner: 310.34, closer: 310.34, ftb: 620.68 },
  { project: 'Park', category: '2 Quartos e 1 Semana', liner: 409.07, closer: 409.07, ftb: 818.14 },
  { project: 'Park', category: '1 Quarto e 4 Semanas', liner: 1241.32, closer: 1241.32, ftb: 2482.64 },
  { project: 'Park', category: '2 Quartos e 4 Semanas', liner: 1636.28, closer: 1636.28, ftb: 3272.56 },
  { project: 'Pipa Island', category: 'Faixa 1', liner: 428.29, closer: 428.29, ftb: 856.58 },
  { project: 'Pipa Island', category: 'Faixa 2', liner: 616.91, closer: 616.91, ftb: 1233.82 },
  { project: 'Pipa Island', category: 'Faixa 3', liner: 747.85, closer: 747.85, ftb: 1495.70 },
  { project: 'Pipa Island', category: 'Faixa 4', liner: 1114.82, closer: 1114.82, ftb: 2229.64 },
  { project: 'Porto 2 Life', category: 'Faixa 1', liner: 663.61, closer: 663.61, ftb: 1327.22 },
  { project: 'Porto 2 Life', category: 'Faixa 2', liner: 884.81, closer: 884.81, ftb: 1769.62 },
  { project: 'Porto 2 Life', category: 'Faixa 3', liner: 1132.83, closer: 1132.83, ftb: 2265.66 },
  { project: 'Porto Alto', category: 'Faixa 1', liner: 689.17, closer: 689.17, ftb: 1378.34 },
  { project: 'Porto Alto', category: 'Faixa 2', liner: 960.66, closer: 960.66, ftb: 1921.32 },
  { project: 'Porto Alto', category: 'Faixa 3', liner: 1283.41, closer: 1283.41, ftb: 2566.82 },
  { project: 'Premium', category: '1 Quarto', liner: 1101.39, closer: 1101.39, ftb: 2202.78 },
  { project: 'Premium', category: '2 Quartos', liner: 1596.79, closer: 1596.79, ftb: 3193.58 },
  { project: 'Premium', category: 'Smart (BL 02)', liner: 889.24, closer: 889.24, ftb: 1778.48 },
  { project: 'Pyrénées', category: '2 Semanas', liner: 564.24, closer: 564.24, ftb: 1128.48 },
];

export const PROJECT_PRICING: Record<string, { label: string; value: number }[]> = {
  'Gran Garden': [
    { label: '2Q - R$ 74.097,07', value: 74097.07 },
    { label: '2Q - R$ 75.972,47', value: 75972.47 },
    { label: '2Q - R$ 77.847,87', value: 77847.87 },
    { label: '2Q - R$ 78.785,57', value: 78785.57 },
    { label: '2Q - R$ 76.910,16', value: 76910.16 },
    { label: '2Q - R$ 79.723,27', value: 79723.27 },
    { label: '1Q - R$ 50.242,45', value: 50242.45 },
    { label: '1Q - R$ 51.189,53', value: 51189.53 },
  ],
  'Gran Valley': [
    { label: '1Q - R$ 38.213,25', value: 38213.25 },
    { label: '1Q - R$ 40.842,65', value: 40842.65 },
    { label: '1Q - R$ 43.207,47', value: 43207.47 },
    { label: '1Q - R$ 41.770,89', value: 41770.89 },
    { label: '2Q - R$ 70.026,52', value: 70026.52 },
    { label: '2Q - R$ 82.835,09', value: 82835.09 },
    { label: '2Q - R$ 91.268,18', value: 91268.18 },
    { label: '2Q - R$ 92.990,26', value: 92990.26 },
    { label: '2Q - R$ 111.982,70', value: 111982.70 },
    { label: '2Q - R$ 114.018,74', value: 114018.74 },
    { label: '2Q - R$ 112.334,53', value: 112334.53 },
  ],
  'Jeriquiá': [
    { label: '2Q - R$ 70.389,14', value: 70389.14 },
    { label: '2Q - R$ 72.826,35', value: 72826.35 },
    { label: '2Q - R$ 74.270,45', value: 74270.45 },
    { label: '1Q - R$ 31.134,91', value: 31134.91 },
    { label: '1Q (PCD) - R$ 31.134,91', value: 31134.91 },
    { label: '2Q - R$ 72.189,16', value: 72189.16 },
  ],
  'Jeriquiá Dunas': [
    { label: '2Q - R$ 64.316,24', value: 64316.24 },
    { label: '2Q - R$ 66.543,17', value: 66543.17 },
    { label: '2Q - R$ 67.862,67', value: 67862.67 },
    { label: '1Q - R$ 28.448,70', value: 28448.70 },
    { label: '1Q (PCD) - R$ 28.448,70', value: 28448.70 },
    { label: '2Q - R$ 65.960,96', value: 65960.96 },
  ],
  'Oikos': [
    { label: '1Q - R$ 35.631,71', value: 35631.71 },
    { label: '1Q - R$ 34.462,49', value: 34462.49 },
    { label: '1Q (PCD) - R$ 34.462,49', value: 34462.49 },
    { label: '1Q - R$ 34.682,36', value: 34682.36 },
    { label: '1Q (PCD) - R$ 34.682,36', value: 34682.36 },
    { label: '1Q - R$ 34.351,41', value: 34351.41 },
    { label: '2Q - R$ 34.351,41', value: 34351.41 },
    { label: '1Q - R$ 34.174,36', value: 34174.36 },
    { label: '1Q (PCD) - R$ 34.174,36', value: 34174.36 },
    { label: '1Q - R$ 35.196,11', value: 35196.11 },
    { label: '1Q (PCD) - R$ 35.196,11', value: 35196.11 },
    { label: '1Q - R$ 35.445,09', value: 35445.09 },
    { label: '1Q - R$ 36.973,60', value: 36973.60 },
  ],
  'Areya Barra': [
    { label: '1Q - R$ 27.235,89', value: 27235.89 },
    { label: '1Q - R$ 27.603,94', value: 27603.94 },
    { label: '1Q - R$ 27.972,00', value: 27972.00 },
    { label: '1Q - R$ 28.340,05', value: 28340.05 },
    { label: '1Q - R$ 28.708,11', value: 28708.11 },
    { label: '1Q - R$ 29.076,15', value: 29076.15 },
    { label: '2Q - R$ 57.105,33', value: 57105.33 },
    { label: '2Q - R$ 57.837,47', value: 57837.47 },
    { label: '2Q - R$ 58.569,59', value: 58569.59 },
    { label: '2Q - R$ 59.301,71', value: 59301.71 },
    { label: '2Q - R$ 60.033,82', value: 60033.82 },
    { label: '2Q - R$ 61.498,06', value: 61498.06 },
    { label: '2Q - R$ 52.773,98', value: 52773.98 },
    { label: '2Q - R$ 54.476,36', value: 54476.36 },
    { label: '2Q - R$ 56.178,75', value: 56178.75 },
    { label: '2Q - R$ 57.881,13', value: 57881.13 },
    { label: '2Q - R$ 59.583,52', value: 59583.52 },
    { label: '2Q - R$ 61.285,91', value: 61285.91 },
  ]
};

export const getUniqueProjects = () => {
  const projects2025 = COMMISSION_DATA_2025.map(item => item.project);
  const projects2026 = COMMISSION_DATA_2026.map(item => item.project);
  const pricingProjects = Object.keys(PROJECT_PRICING);
  return Array.from(new Set([...projects2025, ...projects2026, ...pricingProjects])).sort();
};

export const getCategoriesByProject = (project: string) => {
  const cats2025 = COMMISSION_DATA_2025.filter(item => item.project === project).map(item => item.category);
  const cats2026 = COMMISSION_DATA_2026.filter(item => item.project === project).map(item => item.category);
  return Array.from(new Set([...cats2025, ...cats2026]));
};

export const getTableCommission = (project: string, category: string, role: RoleType, saleDate: string): number => {
  // A partir de 01/01/2026 utiliza a tabela de 2026.
  // Até 31/01/2025 utiliza a tabela de 2025.
  const is2026Table = saleDate >= '2026-01-01';
  const dataset = is2026Table ? COMMISSION_DATA_2026 : COMMISSION_DATA_2025;
  const entry = dataset.find(item => item.project === project && item.category === category);
  
  if (!entry) return 0;

  switch (role) {
    case RoleType.FTB: return entry.ftb;
    case RoleType.LINER: return entry.liner;
    case RoleType.CLOSER: return entry.closer;
    default: return 0;
  }
};

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