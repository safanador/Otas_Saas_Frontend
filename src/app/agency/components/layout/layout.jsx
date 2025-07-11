'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar';
import Header from './header';
import { SidebarProvider } from '../contexts/sidebar-context';

export default function Layout({ children, title, showBreadcrumb = true }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Recuperar estado del sidebar desde localStorage si existe
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed) {
      setSidebarCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  };

  if (!isMounted) {
    return null; // Evitar hydration mismatch
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar 
          defaultCollapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
        
        {/* Main Content */}
        <div 
          className={`transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}
        >
          {/* Header */}
          <Header 
            title={title}
            showBreadcrumb={showBreadcrumb}
            sidebarCollapsed={sidebarCollapsed}
          />
          
          {/* Page Content */}
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}