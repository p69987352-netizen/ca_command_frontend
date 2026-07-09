import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const ClientAITaxInsights: React.FC = () => {
  const incomes = [
    { source: 'Salary Income', amount: '₹12,40,000', note: 'Form 16 verified' },
    { source: 'Interest Income', amount: '₹52,000', note: 'Savings & FD interest' },
    { source: 'Capital Gains', amount: '₹3,80,000', note: 'Equity & mutual fund gains' },
    { source: 'Dividend Income', amount: '₹17,000', note: 'Form 26AS matching' },
    { source: 'Rental Income', amount: '₹0', note: 'No property details found' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-slate-800">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Sparkles className="mr-2 text-[#B45309] animate-pulse" /> AI Tax Insights
        </h1>
        <p className="text-sm text-slate-500 mt-1">Cross-referencing your AIS, TIS, and banking transactions using LLM analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assessment Status</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Capital Gains</h3>
        </div>
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Audit Risk Level</span>
          <h3 className="text-lg font-bold text-[#166534] mt-1 flex items-center">
            <ShieldCheck size={16} className="mr-1.5" /> LOW RISK
          </h3>
        </div>
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Model Confidence</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">98% Accuracy</h3>
        </div>
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Recommended Form</span>
          <h3 className="text-lg font-bold text-[#B45309] mt-1">ITR-2</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 tracking-wide">Filing Income Classification</h2>
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 bg-slate-50">
                  <th className="p-4 font-semibold uppercase tracking-wider">Income Source</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-right">Computed Amount</th>
                  <th className="p-4 font-semibold uppercase tracking-wider hidden sm:table-cell">Source Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incomes.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-800">{item.source}</td>
                    <td className="p-4 text-sm font-bold text-right text-slate-900 font-mono">{item.amount}</td>
                    <td className="p-4 text-xs text-slate-500 hidden sm:table-cell">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-base font-semibold text-slate-900 tracking-wide">Form Recommendation Rationale</h2>
          
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="p-3 bg-[#F5B942]/10 border border-[#F5B942]/20 rounded-xl">
                <h4 className="text-sm font-bold text-[#B45309] uppercase tracking-wide">Use ITR-2</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                  <span>✔ Capital Gains (Equity / Mutual Funds)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                  <span>✔ Salary income detected</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                  <span>✔ Savings/FD interest verified</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
                <h4 className="text-sm font-bold text-[#EF4444] uppercase tracking-wide">Cannot Use ITR-1</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                ITR-1 (Sahaj) cannot be filed by individuals having capital gains or income exceeding ₹50 Lakhs. Since equity capital gains are registered, model recommends upgrading to ITR-2.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
