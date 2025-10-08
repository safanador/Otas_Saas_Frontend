"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  MapPin,
  CreditCard,
  Globe,
  FileText,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '@/services/api';
import endpoints from '@/lib/endpoints';
import { clearUser } from '@/app/GlobalRedux/Features/auth/authSlice';
import Image from 'next/image';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/agency/dashboard',
    icon: Home,
  },
  {
    name: 'Gestión de Tours',
    icon: MapPin,
    subItems: [
      { name: 'Lista de Tours', href: '/agency/tours/list' },
      { name: 'Crear Tour', href: '/agency/tours/create' },
    ],
  },
  {
    name: 'Canales de Venta',
    icon: Globe,
    subItems: [
      { name: 'Configuración de Canales', href: '/agency/channels' },
      { name: 'Integrar tu sistema', href: '/agency/integrations' },
      //{ name: 'Sincronización', href: '/channels/sync' },
    ],
  },
  {
    name: 'Reservas',
    icon: Calendar,
    subItems: [
      { name: 'Calendario', href: '/agency/bookings/calendar' },
      { name: 'Lista de Reservas', href: '/agency/bookings/list' },
      { name: 'Crear Reserva', href: '/agency/bookings/create' },
      //{ name: 'Reservas Pendientes', href: '/bookings/pending', icon: Bell },
    ],
    //badge: '3',
  },
  {
    name: 'Reportes',
    icon: BarChart3,
    subItems: [
      { name: 'Ventas', href: '/agency/reports/sales' },
      //{ name: 'Ocupación', href: '/agency/reports/occupancy' },
      //{ name: 'Análisis de Canales', href: '/agency/reports/channels' },
    ],
  },
  {
    name: 'Configuración',
    icon: Settings,
    href: '/agency/settings',
  },
];

const supportItems = [
  //{
    //name: 'Notificaciones',
    //href: '/agency/notifications',
    //icon: Bell,
    //badge: '5',
  //},
  {
    name: 'Centro de Ayuda',
    href: '/agency/help',
    icon: HelpCircle,
  },
];

export default function Sidebar() {
  const user = useSelector((state) => state.auth.user);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState(['Gestión de Tours']);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const logout = async () => {
    try {

      const response = await fetchData(endpoints.auth_logout(), {
        method: 'POST',
      });
      
      if(response.error) {
        console.log(response.error)
        return
      }
      
      dispatch(clearUser());
      window.location.href = '/auth/login';

    } catch (error) {
      console.log('Error during logout:', error);
    }
  }

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href);
  };

  const isParentActive = (subItems) => {
    return subItems.some(item => isActive(item.href));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              { user && user.role.agency.logo ? (
                <img
                  src={user.role.agency.logo}
                  alt="Logo"
                  className="w-8 h-8 rounded-lg"
                />
              ) : (
                <MapPin className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold">{ user.role.agency.name }</h1>
              <p className="text-xs text-gray-400">Channel Manager</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors hidden lg:block"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isParentActive(item.subItems)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                      {expandedItems.includes(item.name) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </button>
                {expandedItems.includes(item.name) && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={`${subItem.href}/${user.role.agency.id}`}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(subItem.href)
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {subItem.icon && <subItem.icon className="w-4 h-4" />}
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`${item.href}/${user.role.agency.id}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}

        {/* Divider */}
        <div className="border-t border-gray-700 my-4"></div>

        {/* Support Items */}
        {supportItems.map((item) => (
          <Link
            key={item.name}
            href={`${item.href}/${user.role.agency.id}`}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </div>
            {!isCollapsed && item.badge && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            { user && user.image ? (
                <Image
                  src={user.image}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  width={32}
                  height={32}
                />
              ) : (
                <Users className="w-4 h-4 text-gray-300" />
              )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                { user.name }
              </p>
              <p className="text-xs text-gray-400 truncate">
                { user.role.name }
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button onClick={() => logout()} className="p-1 rounded hover:bg-gray-800 transition-colors">
              <LogOut className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-64 bg-gray-900">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}