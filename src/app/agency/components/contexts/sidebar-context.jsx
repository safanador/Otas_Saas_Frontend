'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext(undefined);

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState(['Gestión de Tours']);

  // Cargar estado del sidebar desde localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    const savedExpanded = localStorage.getItem('sidebar-expanded-items');
    
    if (savedCollapsed) {
      setIsCollapsed(JSON.parse(savedCollapsed));
    }
    
    if (savedExpanded) {
      setExpandedItems(JSON.parse(savedExpanded));
    }
  }, []);

  // Guardar estado cuando cambie
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(expandedItems));
  }, [expandedItems]);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  // Cerrar sidebar móvil cuando se redimensiona la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value = {
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    closeMobile,
    expandedItems,
    toggleExpanded,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}