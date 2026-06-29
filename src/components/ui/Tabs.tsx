import React, { useState } from 'react';

interface TabProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabProps[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultValue, onValueChange, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex space-x-1 border-b border-white/10 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabClick(tab.value)}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-saas-primary text-saas-primary'
                  : 'border-transparent text-saas-muted hover:text-saas-text hover:border-white/20'
              }`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
