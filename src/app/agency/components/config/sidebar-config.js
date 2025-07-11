import {
  Home,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  MapPin,
  Globe,
  FileText,
  Shield,
  CreditCard,
  Clock,
  Image,
  Filter,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  PieChart,
  Download,
  UserCheck,
  Coins,
  Link as LinkIcon,
  Sync
} from 'lucide-react';

export const mainMenuItems = [
  {
    name: 'Dashboard Principal',
    href: '/dashboard',
    icon: Home,
    permission: ['admin', 'operator', 'readonly'],
  },
  {
    name: 'Gestión de Tours',
    icon: MapPin,
    permission: ['admin', 'operator'],
    subItems: [
      { 
        name: 'Lista de Tours', 
        href: '/tours',
        icon: FileText,
        description: 'Ver y gestionar todos los tours'
      },
      { 
        name: 'Crear Tour', 
        href: '/tours/create',
        icon: Plus,
        description: 'Agregar nuevo tour al catálogo'
      },
      { 
        name: 'Categorías', 
        href: '/tours/categories',
        icon: Filter,
        description: 'Organizar tours por categorías'
      },
      { 
        name: 'Horarios y Capacidad', 
        href: '/tours/schedules',
        icon: Clock,
        description: 'Gestionar disponibilidad de tours'
      },
      { 
        name: 'Galería de Imágenes', 
        href: '/tours/gallery',
        icon: Image,
        description: 'Administrar imágenes de tours'
      },
    ],
  },
  {
    name: 'Canales de Venta',
    icon: Globe,
    permission: ['admin', 'operator'],
    subItems: [
      { 
        name: 'Canales Conectados', 
        href: '/channels',
        icon: LinkIcon,
        description: 'Ver estado de integraciones'
      },
      { 
        name: 'Configurar Viator', 
        href: '/channels/viator',
        icon: Settings,
        description: 'Configuración de Viator'
      },
      { 
        name: 'Configurar GetYourGuide', 
        href: '/channels/getyourguide',
        icon: Settings,
        description: 'Configuración de GetYourGuide'
      },
      { 
        name: 'Airbnb Experiences', 
        href: '/channels/airbnb',
        icon: Settings,
        description: 'Configuración de Airbnb'
      },
      { 
        name: 'Sincronización', 
        href: '/channels/sync',
        icon: Sync,
        description: 'Sincronizar datos con canales'
      },
    ],
  },
  {
    name: 'Gestión de Reservas',
    icon: Calendar,
    permission: ['admin', 'operator', 'readonly'],
    badge: '12', // Ejemplo: reservas pendientes
    subItems: [
      { 
        name: 'Calendario de Reservas', 
        href: '/bookings/calendar',
        icon: Calendar,
        description: 'Vista de calendario con reservas'
      },
      { 
        name: 'Lista de Reservas', 
        href: '/bookings',
        icon: FileText,
        description: 'Todas las reservas del sistema'
      },
      { 
        name: 'Reservas Pendientes', 
        href: '/bookings/pending',
        icon: Bell,
        badge: '3',
        description: 'Reservas que requieren atención'
      },
      { 
        name: 'Reservas Confirmadas', 
        href: '/bookings/confirmed',
        icon: UserCheck,
        description: 'Reservas confirmadas para hoy'
      },
      { 
        name: 'Historial de Cancelaciones', 
        href: '/bookings/cancelled',
        icon: Eye,
        description: 'Reservas canceladas'
      },
    ],
  },
  {
    name: 'Reportes y Análisis',
    icon: BarChart3,
    permission: ['admin', 'operator', 'readonly'],
    subItems: [
      { 
        name: 'Reporte de Ventas', 
        href: '/reports/sales',
        icon: TrendingUp,
        description: 'Análisis de ingresos y ventas'
      },
      { 
        name: 'Reporte de Ocupación', 
        href: '/reports/occupancy',
        icon: PieChart,
        description: 'Análisis de ocupación de tours'
      },
      { 
        name: 'Análisis por Canal', 
        href: '/reports/channels',
        icon: Globe,
        description: 'Performance por canal de venta'
      },
      { 
        name: 'Tours Más Populares', 
        href: '/reports/popular-tours',
        icon: TrendingUp,
        description: 'Rankings de tours más vendidos'
      },
      { 
        name: 'Exportar Datos', 
        href: '/reports/export',
        icon: Download,
        description: 'Descargar reportes en Excel/PDF'
      },
    ],
  },
  {
    name: 'Configuración',
    icon: Settings,
    permission: ['admin'],
    subItems: [
      { 
        name: 'Perfil de Agencia', 
        href: '/settings/profile',
        icon: Shield,
        description: 'Información de la empresa'
      },
      { 
        name: 'Usuarios y Permisos', 
        href: '/settings/users',
        icon: Users,
        description: 'Gestionar usuarios del sistema'
      },
      { 
        name: 'Monedas y Precios', 
        href: '/settings/pricing',
        icon: Coins,
        description: 'Configuración de monedas y precios'
      },
      { 
        name: 'Métodos de Pago', 
        href: '/settings/payments',
        icon: CreditCard,
        description: 'Configurar pasarelas de pago'
      },
      { 
        name: 'Notificaciones', 
        href: '/settings/notifications',
        icon: Bell,
        description: 'Configurar alertas del sistema'
      },
    ],
  },
];

export const supportMenuItems = [
  {
    name: 'Notificaciones',
    href: '/notifications',
    icon: Bell,
    badge: '5',
    permission: ['admin', 'operator', 'readonly'],
  },
  {
    name: 'Centro de Ayuda',
    href: '/help',
    icon: HelpCircle,
    permission: ['admin', 'operator', 'readonly'],
  },
];

// Configuración de badges dinámicos
export const getBadgeCount = async (menuItemName) => {
  // Esta función puede ser llamada para obtener badges dinámicos desde APIs
  switch (menuItemName) {
    case 'Gestión de Reservas':
      // Simular llamada a API para obtener reservas pendientes
      return '12';
    case 'Reservas Pendientes':
      return '3';
    case 'Notificaciones':
      return '5';
    default:
      return undefined;
  }
};

// Función para filtrar menús por permisos de usuario
export const filterMenuByPermissions = (
  menuItems, 
  userRole
) => {
  return menuItems.filter(item => {
    if (!item.permission || item.permission.includes(userRole)) {
      if (item.subItems) {
        item.subItems = item.subItems.filter(subItem => 
          !subItem.permission || subItem.permission.includes(userRole)
        );
      }
      return true;
    }
    return false;
  });
};