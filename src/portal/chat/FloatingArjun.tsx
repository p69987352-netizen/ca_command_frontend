import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export const FloatingArjun: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'arjun', text: 'Namaste! I am ARJUN, your AI Tax Assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      let replyText = "I'm analyzing your request. For specific ITR calculations, please check the 'AI Tax Insights' tab.";
      const query = inputValue.toLowerCase();
      
      if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        replyText = "Greetings! Hope you are having a productive day. How can I assist you with your taxes or documents?";
      } else if (query.includes('itr') || query.includes('tax return')) {
        replyText = "Based on your capital gains and salary profile, I recommend filing ITR-2. You can view the full break-down in the AI Tax Insights panel.";
      } else if (query.includes('refund')) {
        replyText = "Your expected refund for FY 2025-26 is ₹14,500. This is currently undergoing CA review and will be filed soon.";
      } else if (query.includes('document') || query.includes('upload') || query.includes('vault')) {
        replyText = "You can upload files directly in the 'Document Vault' tab. Files uploaded there will instantly sync with our CA team and send a WhatsApp alert.";
      } else if (query.includes('gita') || query.includes('shlok') || query.includes('quote')) {
        replyText = "Here is a wisdom from the Bhagavad Gita:\n\n'Perform your prescribed duty, for action is better than inaction.' (Chapter 3, Verse 8)";
      }

      setMessages((prev) => [...prev, { sender: 'arjun', text: replyText }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="w-96 h-[480px] bg-[#0B0F19]/90 backdrop-blur-[24px] border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col overflow-hidden mb-4"
          >
            <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#F5B942]/10 border border-[#F5B942]/30 flex items-center justify-center text-[#F5B942]">
                  <Sparkles size={16} className="animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Ask Arjun</h4>
                  <p className="text-[10px] text-[#34D399] flex items-center">
                    <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-1 animate-pulse" /> Online Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#F5B942] text-black rounded-tr-none font-medium'
                        : 'bg-white/[0.04] text-gray-200 border border-white/[0.06] rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/[0.01] border-t border-white/[0.08] flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your ITR, refund, or documents..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-[#F5B942]/50 outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#F5B942] hover:bg-[#F5B942]/80 text-black p-2.5 rounded-xl transition-all flex items-center justify-center shadow-lg"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-[#F5B942] to-[#B45309] text-black px-5 py-3 rounded-full flex items-center space-x-2.5 shadow-2xl font-semibold transition-all"
      >
        <MessageSquare size={18} />
        <span>Ask Arjun</span>
      </motion.button>
    </div>
  );
};
