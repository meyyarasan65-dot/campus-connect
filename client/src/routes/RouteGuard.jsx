import { Navigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';

export const RouteGuard = ({ permission, children }) => {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    // If they lack permission, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};
