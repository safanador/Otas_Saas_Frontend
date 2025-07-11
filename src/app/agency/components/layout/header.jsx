'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut,
  ChevronRight,
  Menu
} from 'lucide-react';

const pathNameMap = {
  '/dashboard': 'Dashboard Principal',
  '/tours': 'Lista de Tours',
  '/tours/create': 'Crear Tour',
  '/tours/categories': 'Categorías de Tours',
  '/channels': 'Canales de Venta',
  '/bookings': 'Reservas',
  '/bookings/calendar': 'Calendario de Reservas',
  '/reports': 'Reportes',
  '/settings': 'Configuración',
  '/notifications': 'Notificaciones',
  '/help': 'Centro de Ayuda',
};

export default function Header({ title, showBreadcrumb = true, sidebarCollapsed }) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [{ name: 'Inicio', href: '/dashboard' }];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const name = pathNameMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        name,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = showBreadcrumb ? generateBreadcrumbs() : [];
  const pageTitle = title || pathNameMap[pathname] || 'Tour Manager';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Title and Breadcrumbs */}
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {pageTitle}
                </h1>
                
                {/*showBreadcrumb && breadcrumbs.length > 1 && (
                  <nav className="flex items-center space-x-2 mt-1">
                    {breadcrumbs.map((breadcrumb, index) => (
                      <div key={breadcrumb.href} className="flex items-center">
                        {index > 0 && (
                          <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                        )}
                        {index === breadcrumbs.length - 1 ? (
                          <span className="text-sm text-gray-500 font-medium">
                            {breadcrumb.name}
                          </span>
                        ) : (
                          <Link
                            href={breadcrumb.href}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {breadcrumb.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>
                )*/}
              </div>
            </div>
          </div>

          {/* Right Side - Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar tours, reservas..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notifications 
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">3</span>
              </span>
            </button>*/}

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Menu 
            <div className="relative">
              <button className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
              </button>
            </div>*/}
          </div>
        </div>
      </div>
    </header>
  );
}