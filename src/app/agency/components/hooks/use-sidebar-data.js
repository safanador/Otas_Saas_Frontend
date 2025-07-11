import { useState, useEffect } from 'react';
import { mainMenuItems, supportMenuItems, getBadgeCount, filterMenuByPermissions } from '../config/sidebar-config';

export function useSidebarData({ userRole = 'admin' } = {}) {
  const [menuItems, setMenuItems] = useState([]);
  const [supportItems, setSupportItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        // Filtrar menús por permisos de usuario
        let filteredMainItems = filterMenuByPermissions(mainMenuItems, userRole);
        let filteredSupportItems = filterMenuByPermissions(supportMenuItems, userRole);

        // Cargar badges dinámicos
        const itemsWithBadges = await Promise.all(
          filteredMainItems.map(async (item) => {
            const badge = await getBadgeCount(item.name);
            return { ...item, badge: badge || item.badge };
          })
        );

        const supportWithBadges = await Promise.all(
          filteredSupportItems.map(async (item) => {
            const badge = await getBadgeCount(item.name);
            return { ...item, badge: badge || item.badge };
          })
        );

        setMenuItems(itemsWithBadges);
        setSupportItems(supportWithBadges);
      } catch (error) {
        console.error('Error loading sidebar data:', error);
        // Fallback a datos estáticos si hay error
        setMenuItems(filterMenuByPermissions(mainMenuItems, userRole));
        setSupportItems(filterMenuByPermissions(supportMenuItems, userRole));
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [userRole]);

  // Función para refrescar badges
  const refreshBadges = async () => {
    const itemsWithBadges = await Promise.all(
      menuItems.map(async (item) => {
        const badge = await getBadgeCount(item.name);
        return { ...item, badge: badge || item.badge };
      })
    );
    setMenuItems(itemsWithBadges);
  };

  return {
    menuItems,
    supportItems,
    loading,
    refreshBadges,
  };
}

// Hook para obtener información del usuario actual
export function useUserProfile() {
  const [userProfile, setUserProfile] = useState({
    name: 'Juan Pérez',
    email: 'juan@agencia.com',
    role: 'Administrador',
    agency: 'Agencia Premium',
    avatar: null,
  });

  // En una aplicación real, esto vendría de una API o contexto de autenticación
  useEffect(() => {
    // Simular carga de perfil de usuario
    const loadUserProfile = async () => {
      // const profile = await fetchUserProfile();
      // setUserProfile(profile);
    };

    loadUserProfile();
  }, []);

  return userProfile;
}

// Hook para detectar rutas activas
export function useActiveRoute() {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isParentActive = (subItems) => {
    return subItems.some(item => isActive(item.href));
  };

  return { isActive, isParentActive, pathname };
}