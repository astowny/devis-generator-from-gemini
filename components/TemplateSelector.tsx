import React from 'react';
import { TemplateStyle } from '../types';
import { Layout, Feather, Box, Type } from 'lucide-react';

interface TemplateSelectorProps {
  currentTemplate: TemplateStyle;
  onSelect: (template: TemplateStyle) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplate, onSelect }) => {
  const templates = [
    { id: TemplateStyle.MODERN, name: 'Moderne', icon: <Layout size={20} />, color: 'bg-blue-500' },
    { id: TemplateStyle.MINIMALIST, name: 'Minimaliste', icon: <Feather size={20} />, color: 'bg-slate-500' },
    { id: TemplateStyle.CLASSIC, name: 'Classique', icon: <Box size={20} />, color: 'bg-emerald-600' },
    { id: TemplateStyle.BOLD, name: 'Bold', icon: <Type size={20} />, color: 'bg-indigo-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`
            relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200
            ${currentTemplate === t.id 
              ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50' 
              : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'}
          `}
        >
          <div className={`
            inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 text-white
            ${t.color}
          `}>
            {t.icon}
          </div>
          <div className="font-medium text-slate-800 text-sm">{t.name}</div>
        </button>
      ))}
    </div>
  );
};

export default TemplateSelector;