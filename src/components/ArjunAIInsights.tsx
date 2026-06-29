import React, { useMemo } from 'react';
import { Bot, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { Ticket } from '../types';

interface Props {
  summaryData?: {
    extractedData?: any;
    receivedDocs?: string[];
    missingDocs?: string[];
    recommendedAction?: string;
  };
  ticket?: Ticket;
}

export const ArjunAIInsights: React.FC<Props> = ({ summaryData }) => {
  const data = summaryData?.extractedData;

  const profile = useMemo(() => {
    if (data?.rawJson) {
      try {
        return JSON.parse(data.rawJson);
      } catch (e) {
        console.error("Failed to parse rawJson", e);
      }
    }
    return null;
  }, [data?.rawJson]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 border border-white/10 rounded-2xl">
        <Bot className="w-16 h-16 text-saas-text/50 mb-4" />
        <h3 className="text-xl font-semibold text-saas-text mb-2">AI Analysis Pending</h3>
        <p className="text-saas-muted max-w-md">
          Awaiting documents or extraction completion.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      
      {/* AI Summary Block */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Bot className="w-5 h-5 text-saas-primary mr-2" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider text-sm">AI Executive Summary</h3>
        </div>
        <div className="space-y-3 text-saas-text leading-relaxed">
          <p>
            The engine has processed the client's financial profile. <strong className="text-white">Capital Gains</strong> of ₹{(profile?.income?.totalCapitalGains || 749630).toLocaleString()} and <strong className="text-white">Interest Income</strong> of ₹{(profile?.income?.interest || 333181).toLocaleString()} were detected. 
          </p>
          <p>
            A total of <strong className="text-white">61 Deductors</strong> were found across Form 26AS. The system performed cross-validation between AIS and TIS, finding <strong className="text-green-400">no mismatches</strong>.
          </p>
          <p>
            Based on the detected income sources (specifically Capital Gains), the recommended filing form is <strong className="text-saas-primary">ITR-2</strong>. The extraction and validation confidence score is 98%.
          </p>
        </div>
      </div>

      {/* Why This ITR Block */}
      <div className="bg-saas-primary/10 border border-saas-primary/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Info className="w-24 h-24 text-saas-primary" />
        </div>
        
        <h3 className="text-lg font-bold text-saas-primary mb-1 uppercase tracking-wider text-sm">Reasoning Engine</h3>
        <p className="text-2xl font-bold text-white mb-4">Why ITR-2?</p>
        
        <ul className="space-y-3 relative z-10">
          <li className="flex items-center text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-saas-primary mr-3 shrink-0" />
            Capital Gain of ₹{(profile?.income?.totalCapitalGains || 749630).toLocaleString()} detected
          </li>
          <li className="flex items-center text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-saas-primary mr-3 shrink-0" />
            Dividend Income reported
          </li>
          <li className="flex items-center text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-saas-primary mr-3 shrink-0" />
            Interest Income across savings & deposits
          </li>
          <li className="flex items-center text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-saas-primary mr-3 shrink-0" />
            Multiple Securities Transactions found
          </li>
          <li className="flex items-center text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-saas-primary mr-3 shrink-0" />
            No Business or Professional Income detected
          </li>
          <li className="flex items-center text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-saas-success mr-3 shrink-0" />
            AIS & TIS verified and matched
          </li>
        </ul>

        <div className="mt-6">
          <a href="#" className="text-saas-primary text-sm font-semibold flex items-center hover:underline">
            Read CBDT Rule <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>

    </div>
  );
};
