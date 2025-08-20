"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const withAuth = (WrappedComponent, requiredPermission) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
      if (!user) {
        // Si no hay usuario, redirigir a la página de login
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('redirectAfterLogin', currentPath);
        
        router.push('/auth/login');
      } else if (requiredPermission && !user.role.permissions.some((permission) => permission.description == requiredPermission)) {
        // Si el usuario no tiene el permiso requerido, redirigir a la página de no autorizado
        router.push('/admin/unauthorized');
      }
    }, [user, router]);

    // Si el usuario tiene el permiso requerido, renderizar el componente envuelto
    if (user && (!requiredPermission || user.role.permissions.some((permission) => permission.description == requiredPermission))) {
      return <WrappedComponent {...props} />;
    }

    // Mientras se verifica, puedes mostrar un spinner o un mensaje de carga
    return (
      <div className="flex items-center justify-center h-full">
        <span className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  };

  return Wrapper;
};

export default withAuth;