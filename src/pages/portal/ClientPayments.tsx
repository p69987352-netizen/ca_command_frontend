import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, FileText, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ClientPayments: React.FC = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = () => {
    // Simulate successful payment action
    setTimeout(() => {
      setPaymentSuccess(true);
      alert("Payment settled successfully via portal checkout gateway!");
    }, 800);
  };

  const invoiceItems = [
    { label: 'Professional Consultation & ITR Filing Fee', amount: '₹4,500' },
    { label: 'Complexity charge (Equity Capital Gains computation)', amount: '₹1,200' },
    { label: 'Portal Early Bird Discount', amount: '-₹500', isDiscount: true }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <CreditCard className="mr-2 text-[#F5B942]" /> Payments & Billing
        </h1>
        <p className="text-sm text-gray-400 mt-1">Review active invoices, retrieve PDF receipts, and complete portal settlements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Receipt / Invoice Details Card (Left Column) */}
        <div className="lg:col-span-8">
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-[#F5B942]">
                  <Receipt size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Invoice #INV-2026-0701</h3>
                  <span className="text-[10px] text-gray-500 block">Issued on 2026-07-08</span>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${
                paymentSuccess 
                  ? 'bg-[#34D399]/15 text-[#34D399]' 
                  : 'bg-[#F5B942]/15 text-[#F5B942]'
              }`}>
                {paymentSuccess ? 'Paid' : 'Payment Pending'}
              </span>
            </div>

            {/* List items */}
            <div className="space-y-4">
              {invoiceItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-400 max-w-sm sm:max-w-md">{item.label}</span>
                  <span className={`font-semibold font-mono ${
                    item.isDiscount ? 'text-[#34D399]' : 'text-white'
                  }`}>{item.amount}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/[0.08]" />

            {/* Total Row */}
            <div className="flex justify-between items-center text-base font-bold">
              <span className="text-white">Amount Due</span>
              <span className="text-2xl text-[#F5B942] font-mono">₹5,200</span>
            </div>

            {/* Pay Button / Completed alert */}
            <div className="pt-4">
              {paymentSuccess ? (
                <div className="flex items-center justify-center space-x-2 bg-[#34D399]/10 border border-[#34D399]/20 p-4 rounded-xl text-[#34D399]">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-semibold">Payment settled successfully. Receipt generated.</span>
                </div>
              ) : (
                <button
                  onClick={handlePayment}
                  className="w-full bg-[#F5B942] hover:bg-[#F5B942]/80 text-black py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg transition-all"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Column (Right Side) */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-base font-semibold text-white tracking-wide">Locker Details</h2>
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl space-y-4 text-xs shadow-md">
            <div className="flex items-start space-x-3 text-gray-400">
              <ShieldCheck size={16} className="text-[#34D399] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Transactions are processed securely via Stripe and razorpay gateway integrations. Your credentials are never stored.
              </p>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="space-y-2">
              <span className="text-gray-500 block">Related Downloads</span>
              <button className="w-full flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] p-2.5 rounded-xl transition-all text-gray-300">
                <span className="flex items-center"><FileText size={14} className="mr-2" /> Download Bill receipt</span>
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
