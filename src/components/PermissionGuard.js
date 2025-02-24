import { useSelector } from "react-redux";

const PermissionGuard = ({ requiredPermission, children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user || !user.role.permissions.some((permission) => permission.description === requiredPermission)) {
    return null;
  }

  return children;
};

export default PermissionGuard;