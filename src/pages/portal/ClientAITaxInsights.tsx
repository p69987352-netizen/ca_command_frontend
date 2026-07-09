import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, HelpCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

export const ClientAITaxInsights: React.FC = () => {
  const incomes = [
    { source: 'Salary Income', amount: '₹12,40,000', note: 'Form 16 verified' },
    { source: 'Interest Income', amount: '₹52,000', note: 'Savings & FD interest' },
    { source: 'Capital Gains', amount: '₹3,80,000', note: 'Equity & mutual fund gains' },
    { source: 'Dividend Income', amount: '₹17,000', note: 'Form 26AS matching' },
    { source: 'Rental Income', amount: '₹0', note: 'No property details found' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <Sparkles className="mr-2 text-[#F5B942] animate-pulse" /> AI Tax Insights
        </h1>
        <p className="text-sm text-gray-400 mt-1">Cross-referencing your AIS, TIS, and banking transactions using LLM analysis.</p>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Assessment Status</span>
          <h3 className="text-lg font-bold text-white mt-1">Capital Gains Detected</h3>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Audit Risk Level</span>
          <h3 className="text-lg font-bold text-[#34D399] mt-1 flex items-center">
            <ShieldCheck size={16} className="mr-1.5" /> LOW RISK
          </h3>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Model Confidence</span>
          <h3 className="text-lg font-bold text-white mt-1">98% Accuracy</h3>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Recommended Form</span>
          <h3 className="text-lg font-bold text-[#F5B942] mt-1">ITR-2</h3>
        </div>
      </div>

      {/* Main insights columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Stripe-like Income Table (Left Column) */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-semibold text-white tracking-wide">Filing Income Classification</h2>
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs text-gray-400 bg-white/[0.01]">
                  <th className="p-4 font-semibold uppercase tracking-wider">Income Source</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-right">Computed Amount</th>
                  <th className="p-4 font-semibold uppercase tracking-wider hidden sm:table-cell">Source Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {incomes.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-sm font-medium text-white">{item.source}</td>
                    <td className="p-4 text-sm font-semibold text-right text-white font-mono">{item.amount}</td>
                    <td className="p-4 text-xs text-gray-400 hidden sm:table-cell">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended ITR Details (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-base font-semibold text-white tracking-wide">Form Recommendation Rationale</h2>
          
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl space-y-6 shadow-md">
            <div className="space-y-4">
              <div className="p-3 bg-[#F5B942]/10 border border-[#F5B942]/20 rounded-xl">
                <h4 className="text-sm font-bold text-[#F5B942] uppercase tracking-wide">Use ITR-2</h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
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

            <div className="space-y-3 border-t border-white/[0.06] pt-4">
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
                <h4 className="text-sm font-bold text-[#EF4444] uppercase tracking-wide">Cannot Use ITR-1</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                ITR-1 (Sahaj) cannot be filed by individuals having capital gains or income exceeding ₹50 Lakhs. Since equity capital gains are registered, model recommends upgrading to ITR-2.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
