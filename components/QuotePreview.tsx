import React, { useMemo } from 'react';
import { QuoteData, TemplateStyle } from '../types';

interface QuotePreviewProps {
  data: QuoteData;
  template: TemplateStyle;
}

const QuotePreview: React.FC<QuotePreviewProps> = ({ data, template }) => {
  const subtotal = useMemo(() => {
    return data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  }, [data.items]);

  const taxAmount = (subtotal * data.taxRate) / 100;
  const total = subtotal + taxAmount;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // ----------------------------------------------------------------------
  // MODERN TEMPLATE
  // ----------------------------------------------------------------------
  if (template === TemplateStyle.MODERN) {
    return (
      <div className="w-full h-full bg-white p-8 md:p-12 text-slate-800 print-full shadow-lg max-w-[210mm] mx-auto min-h-[297mm]">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-blue-600 tracking-tight mb-2">DEVIS</h1>
            <p className="text-slate-500 font-medium">#{data.number}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg">{data.companyName}</h3>
            <p className="text-slate-500 text-sm whitespace-pre-line">{data.companyAddress}</p>
            <p className="text-slate-500 text-sm mt-1">{data.companyEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Facturer à</h4>
            <h3 className="font-bold text-lg">{data.clientName}</h3>
            <p className="text-slate-600 text-sm whitespace-pre-line">{data.clientAddress}</p>
            <p className="text-slate-600 text-sm mt-1">{data.clientEmail}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="text-slate-500 text-sm">Date:</span>
              <span className="font-semibold ml-2">{data.date}</span>
            </div>
            <div>
              <span className="text-slate-500 text-sm">Validité:</span>
              <span className="font-semibold ml-2">{data.dueDate}</span>
            </div>
          </div>
        </div>

        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="text-left py-3 text-sm font-bold text-slate-600 uppercase tracking-wide">Description</th>
              <th className="text-center py-3 text-sm font-bold text-slate-600 uppercase tracking-wide w-24">Qté</th>
              <th className="text-right py-3 text-sm font-bold text-slate-600 uppercase tracking-wide w-32">Prix Unit.</th>
              <th className="text-right py-3 text-sm font-bold text-slate-600 uppercase tracking-wide w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-50 group hover:bg-slate-50 transition-colors">
                <td className="py-4 pr-4">
                  <p className="font-medium text-slate-800">{item.description}</p>
                </td>
                <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                <td className="py-4 text-right text-slate-600">{formatPrice(item.unitPrice)}</td>
                <td className="py-4 text-right font-semibold text-slate-800">{formatPrice(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-12">
          <div className="w-1/2 md:w-1/3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Sous-total</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">TVA ({data.taxRate}%)</span>
              <span className="font-medium">{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-lg font-bold text-slate-800">Total TTC</span>
              <span className="text-lg font-bold text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {(data.notes || data.terms) && (
          <div className="border-t border-slate-100 pt-8">
            {data.notes && (
              <div className="mb-6">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Notes</h4>
                <p className="text-sm text-slate-600">{data.notes}</p>
              </div>
            )}
            {data.terms && (
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-2">Conditions</h4>
                <p className="text-sm text-slate-600">{data.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // MINIMALIST TEMPLATE
  // ----------------------------------------------------------------------
  if (template === TemplateStyle.MINIMALIST) {
    return (
      <div className="w-full h-full bg-white p-8 md:p-16 text-black print-full shadow-lg max-w-[210mm] mx-auto min-h-[297mm] font-serif">
        <div className="border-b border-black pb-8 mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl italic font-light">Devis</h1>
            <p className="text-sm mt-2">No. {data.number}</p>
          </div>
          <div className="text-right text-sm">
            <p>{data.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-16 text-sm">
          <div>
            <p className="font-bold mb-1">De :</p>
            <p>{data.companyName}</p>
            <p className="whitespace-pre-line opacity-70">{data.companyAddress}</p>
          </div>
          <div>
            <p className="font-bold mb-1">Pour :</p>
            <p>{data.clientName}</p>
            <p className="whitespace-pre-line opacity-70">{data.clientAddress}</p>
          </div>
        </div>

        <table className="w-full mb-12 text-sm">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-2 font-normal opacity-60">Description</th>
              <th className="text-center py-2 font-normal opacity-60 w-20">Qté</th>
              <th className="text-right py-2 font-normal opacity-60 w-28">Prix</th>
              <th className="text-right py-2 font-normal opacity-60 w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} className="border-b border-dotted border-gray-300">
                <td className="py-4 pr-4">{item.description}</td>
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">{formatPrice(item.unitPrice)}</td>
                <td className="py-4 text-right">{formatPrice(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-16 text-sm">
          <div className="w-48 space-y-2">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>TVA {data.taxRate}%</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-black font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="text-xs opacity-60 mt-auto">
          {data.terms}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // CLASSIC TEMPLATE
  // ----------------------------------------------------------------------
  if (template === TemplateStyle.CLASSIC) {
    return (
      <div className="w-full h-full bg-white p-10 text-slate-900 print-full shadow-lg max-w-[210mm] mx-auto min-h-[297mm]">
        <div className="bg-emerald-700 text-white -mx-10 -mt-10 p-10 mb-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold uppercase tracking-widest">Devis</h1>
                <div className="text-right opacity-90">
                    <p className="font-bold">{data.companyName}</p>
                    <p className="text-sm">{data.companyEmail}</p>
                </div>
            </div>
        </div>

        <div className="flex justify-between mb-8">
            <div className="w-1/2">
                <h3 className="text-emerald-700 font-bold uppercase text-xs mb-2">Destinataire</h3>
                <div className="border-l-4 border-emerald-100 pl-4 py-1">
                    <p className="font-bold">{data.clientName}</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.clientAddress}</p>
                </div>
            </div>
            <div className="w-1/3 text-right">
                <div className="grid grid-cols-2 gap-y-1">
                    <span className="text-sm text-gray-500">Numéro:</span>
                    <span className="font-medium">{data.number}</span>
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="font-medium">{data.date}</span>
                    <span className="text-sm text-gray-500">Échéance:</span>
                    <span className="font-medium">{data.dueDate}</span>
                </div>
            </div>
        </div>

        <table className="w-full mb-8">
            <thead>
                <tr className="bg-gray-100 text-gray-600 text-xs uppercase">
                    <th className="py-3 px-4 text-left rounded-l">Item</th>
                    <th className="py-3 px-4 text-center">Quantité</th>
                    <th className="py-3 px-4 text-right">Prix</th>
                    <th className="py-3 px-4 text-right rounded-r">Montant</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {data.items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4 font-medium">{item.description}</td>
                        <td className="py-3 px-4 text-center text-gray-500">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-gray-500">{formatPrice(item.unitPrice)}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatPrice(item.quantity * item.unitPrice)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="flex justify-end">
            <div className="bg-emerald-50 p-6 rounded-lg w-1/2">
                <div className="flex justify-between mb-2 text-sm">
                    <span className="text-emerald-800">Total HT</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                    <span className="text-emerald-800">TVA ({data.taxRate}%)</span>
                    <span className="font-medium">{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-emerald-200 text-lg font-bold text-emerald-900">
                    <span>Total TTC</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center">
             <p>{data.companyName} - {data.companyAddress}</p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // BOLD TEMPLATE (Default fallback)
  // ----------------------------------------------------------------------
  return (
    <div className="w-full h-full bg-white p-12 text-slate-900 print-full shadow-lg max-w-[210mm] mx-auto min-h-[297mm] font-sans border-t-[20px] border-indigo-600">
        <h1 className="text-6xl font-black text-slate-900 mb-8 tracking-tighter">DEVIS.</h1>
        
        <div className="grid grid-cols-2 gap-12 mb-16">
            <div>
                <p className="text-indigo-600 font-bold mb-1">FACTURER À</p>
                <p className="text-2xl font-bold mb-2">{data.clientName}</p>
                <p className="text-slate-500 leading-relaxed">{data.clientAddress}</p>
            </div>
            <div className="text-right">
                <p className="text-indigo-600 font-bold mb-1">DÉTAILS</p>
                <p className="font-bold">#{data.number}</p>
                <p className="text-slate-500">{data.date}</p>
            </div>
        </div>

        <div className="mb-4">
            {data.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline py-4 border-b-2 border-slate-100 last:border-0">
                    <div className="flex-1 pr-8">
                        <p className="text-xl font-bold text-slate-800">{item.description}</p>
                        <p className="text-sm text-slate-400 mt-1">Qté: {item.quantity} x {formatPrice(item.unitPrice)}</p>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {formatPrice(item.quantity * item.unitPrice)}
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end mt-12">
            <div className="text-right">
                <p className="text-slate-400 font-medium mb-1">Total HT <span className="text-slate-900 ml-4 font-bold">{formatPrice(subtotal)}</span></p>
                <p className="text-slate-400 font-medium mb-4">TVA <span className="text-slate-900 ml-4 font-bold">{formatPrice(taxAmount)}</span></p>
                <p className="text-5xl font-black text-indigo-600 tracking-tight">{formatPrice(total)}</p>
            </div>
        </div>

         <div className="mt-20">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-4 border-b border-slate-200 pb-2">Conditions</h4>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">{data.terms}</p>
        </div>
    </div>
  );
};

export default QuotePreview;