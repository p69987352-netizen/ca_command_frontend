import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-saas-bg text-saas-text overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        {/* Deep, glowing background blobs for premium aesthetic */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-saas-primary/10 blur-[120px] mix-blend-screen pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-saas-bronze/10 blur-[120px] mix-blend-screen pointer-events-none -z-10" />
        
        <Header />
        <main className="flex-1 overflow-y-auto p-8 hide-scrollbar relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
