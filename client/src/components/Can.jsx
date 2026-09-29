import { usePermission } from '../hooks/usePermission';

export const Can = ({ permission, children, fallback = null }) => {
  const { hasPermission } = usePermission();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
};
