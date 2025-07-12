import { useMemo } from 'react';
import AuthService from '@services/AuthService'

const useHasPermission = (requiredPermission) => {
  const userData = AuthService.getCurrentUser();
  
  return useMemo(() => {
    if (!userData?.usuario?.permisos) return false;
    
    // Verifica si el usuario tiene el permiso exacto
    return userData.usuario.permisos.includes(requiredPermission);
  }, [userData, requiredPermission]);
};

export default useHasPermission;