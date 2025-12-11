import React, { useState, useRef } from 'react';
import { QuoteData, DEFAULT_QUOTE, LineItem, TemplateStyle } from './types';
import QuotePreview from './components/QuotePreview';
import TemplateSelector from './components/TemplateSelector';
import { generateLineItemsFromPrompt, improveQuoteNotes } from './services/geminiService';
import { Plus, Trash2, Printer, Sparkles, Loader2, Wand2, FileText, User, Building2, Receipt } from 'lucide-react';

const App: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData>(DEFAULT_QUOTE);
  const [template, setTemplate] = useState<TemplateStyle>(TemplateStyle.MODERN);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  // Form Handlers
  const handleInputChange = (section: keyof QuoteData, value: string | number) => {
    setQuote(prev => ({ ...prev, [section]: value }));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: 'Nouvel article',
      quantity: 1,
      unitPrice: 0
    };
    setQuote(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setQuote(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  // AI Actions
  const handleSmartGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const newItems = await generateLineItemsFromPrompt(aiPrompt);
      setQuote(prev => ({
        ...prev,
        items: [...prev.items, ...newItems] // Append items or replace? Let's append.
      }));
      setAiPrompt('');
      setShowAiInput(false);
    } catch (e) {
      alert("Erreur lors de la génération. Vérifiez la clé API.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleImproveNotes = async () => {
    setAiLoading(true);
    try {
      const improved = await improveQuoteNotes(quote.notes || quote.terms);
      setQuote(prev => ({ ...prev, notes: improved }));
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* LEFT SIDEBAR - EDITOR */}
      <div className="w-full lg:w-[450px] xl:w-[500px] bg-white border-r border-gray-200 overflow-y-auto no-print shadow-xl z-10 flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Receipt size={18} strokeWidth={3} />
             </div>
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">SmartQuote</h1>
          </div>
          <p className="text-xs text-slate-500">Éditeur de devis intelligent</p>
        </div>

        <div className="p-6 space-y-8 pb-24">
          
          {/* Template Selection */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <LayoutIcon /> Design
            </h2>
            <TemplateSelector currentTemplate={template} onSelect={setTemplate} />
          </section>

          {/* AI Quick Action */}
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
             <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                   <Sparkles size={16} />
                   <span>Assistant IA</span>
                </div>
                {!showAiInput && (
                    <button 
                        onClick={() => setShowAiInput(true)}
                        className="text-xs bg-white px-2 py-1 rounded shadow-sm text-indigo-600 font-medium hover:bg-indigo-50"
                    >
                        Générer des articles
                    </button>
                )}
             </div>
             
             {showAiInput && (
                 <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                    <textarea 
                        className="w-full text-sm p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none resize-none"
                        rows={3}
                        placeholder="Ex: Création d'un site e-commerce pour une boulangerie..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAiInput(false)} className="text-xs text-slate-500 px-3 py-1 hover:bg-white rounded">Annuler</button>
                        <button 
                            onClick={handleSmartGenerate}
                            disabled={aiLoading || !aiPrompt}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                        >
                            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                            Générer
                        </button>
                    </div>
                 </div>
             )}
             {!showAiInput && <p className="text-xs text-indigo-400">Décrivez votre projet et laissez l'IA remplir les articles pour vous.</p>}
          </section>

          {/* Document Info */}
          <section className="space-y-4">
             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText size={16} /> Infos Générales
             </h2>
             <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Numéro" value={quote.number} onChange={(v) => handleInputChange('number', v)} />
                <InputGroup label="Date" type="date" value={quote.date} onChange={(v) => handleInputChange('date', v)} />
                <InputGroup label="Échéance" type="date" value={quote.dueDate} onChange={(v) => handleInputChange('dueDate', v)} />
                <InputGroup label="Taux TVA (%)" type="number" value={quote.taxRate} onChange={(v) => handleInputChange('taxRate', parseFloat(v))} />
             </div>
          </section>

          {/* Emetteur */}
          <section className="space-y-4">
             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building2 size={16} /> Ma Société
             </h2>
             <InputGroup label="Nom" value={quote.companyName} onChange={(v) => handleInputChange('companyName', v)} />
             <InputGroup label="Adresse" type="textarea" value={quote.companyAddress} onChange={(v) => handleInputChange('companyAddress', v)} />
             <InputGroup label="Email" value={quote.companyEmail} onChange={(v) => handleInputChange('companyEmail', v)} />
          </section>

          {/* Client */}
          <section className="space-y-4">
             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <User size={16} /> Client
             </h2>
             <InputGroup label="Nom" value={quote.clientName} onChange={(v) => handleInputChange('clientName', v)} />
             <InputGroup label="Adresse" type="textarea" value={quote.clientAddress} onChange={(v) => handleInputChange('clientAddress', v)} />
             <InputGroup label="Email" value={quote.clientEmail} onChange={(v) => handleInputChange('clientEmail', v)} />
          </section>

          {/* Items */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Receipt size={16} /> Articles
                </h2>
                <button onClick={addItem} className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors">
                    <Plus size={12} /> Ajouter
                </button>
            </div>
            
            <div className="space-y-3">
                {quote.items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg group animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="flex gap-2 mb-2">
                            <input 
                                className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            />
                            <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-24">
                                <label className="text-[10px] text-slate-400 uppercase font-bold">Qté</label>
                                <input 
                                    type="number"
                                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] text-slate-400 uppercase font-bold">Prix Unit.</label>
                                <input 
                                    type="number"
                                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="w-24 text-right">
                                <label className="text-[10px] text-slate-400 uppercase font-bold">Total</label>
                                <div className="text-sm font-bold text-slate-700 py-1.5">
                                    {(item.quantity * item.unitPrice).toFixed(2)}€
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </section>

          {/* Footer Notes */}
           <section className="space-y-4">
             <div className="flex justify-between items-center">
                 <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Notes & Conditions</h2>
                 <button 
                    onClick={handleImproveNotes} 
                    disabled={aiLoading}
                    className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                    title="Améliorer avec l'IA"
                >
                     <Sparkles size={12} /> Reformuler
                 </button>
             </div>
             <InputGroup label="Notes" type="textarea" value={quote.notes} onChange={(v) => handleInputChange('notes', v)} />
             <InputGroup label="Conditions de paiement" type="textarea" value={quote.terms} onChange={(v) => handleInputChange('terms', v)} />
          </section>
        </div>
      </div>

      {/* RIGHT SIDE - PREVIEW */}
      <div className="flex-1 bg-slate-100/50 overflow-y-auto relative flex flex-col items-center p-4 md:p-8">
         {/* Toolbar */}
         <div className="sticky top-4 z-30 mb-6 flex gap-3 no-print">
            <button 
                onClick={handlePrint}
                className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
            >
                <Printer size={18} />
                <span>Imprimer / PDF</span>
            </button>
         </div>

         {/* A4 Container Wrapper */}
         <div className="w-full max-w-[210mm] shadow-2xl transition-transform duration-300 ease-out origin-top">
             <QuotePreview data={quote} template={template} />
         </div>

         <div className="mt-8 text-slate-400 text-xs no-print">
            Aperçu généré en temps réel
         </div>
      </div>
    </div>
  );
};

// Helper Components
const InputGroup = ({ label, value, onChange, type = 'text' }: { label: string, value: string | number, onChange: (val: string) => void, type?: 'text' | 'textarea' | 'date' | 'number' }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">{label}</label>
        {type === 'textarea' ? (
            <textarea 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <input 
                type={type}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        )}
    </div>
);

const LayoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
);

export default App;