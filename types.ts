export enum TemplateStyle {
  MODERN = 'MODERN',
  MINIMALIST = 'MINIMALIST',
  CLASSIC = 'CLASSIC',
  BOLD = 'BOLD'
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteData {
  number: string;
  date: string;
  dueDate: string;
  currency: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  items: LineItem[];
  notes: string;
  terms: string;
  taxRate: number; // Percentage
}

export const DEFAULT_QUOTE: QuoteData = {
  number: 'DEV-2023-001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: '€',
  companyName: 'Ma Société',
  companyAddress: '123 Rue de l\'Innovation, 75001 Paris',
  companyEmail: 'contact@masociete.com',
  clientName: 'Client Exemple',
  clientAddress: '456 Avenue du Succès, 69002 Lyon',
  clientEmail: 'client@exemple.com',
  items: [
    { id: '1', description: 'Consulting Stratégique', quantity: 1, unitPrice: 850 },
    { id: '2', description: 'Développement Web', quantity: 5, unitPrice: 400 },
  ],
  notes: 'Merci de votre confiance.',
  terms: 'Paiement à 30 jours. Ce devis est valable 1 mois.',
  taxRate: 20
};