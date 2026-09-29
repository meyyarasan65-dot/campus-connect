import { useAuthStore } from '../store/authStore';
import { ROLE_PERMISSIONS, PERMISSIONS, ROLES } from '../constants/roles';

export const usePermission = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    if (user.role === ROLES.SYSTEM_ADMIN) return true;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    if (userPermissions.includes(PERMISSIONS.ALL)) return true;

    if (Array.isArray(permission)) {
      return permission.some(p => userPermissions.includes(p));
    }
    return userPermissions.includes(permission);
  };

  const isSystemAdmin = () => user?.role === ROLES.SYSTEM_ADMIN;

  return { hasPermission, isSystemAdmin, userRole: user?.role };
};
