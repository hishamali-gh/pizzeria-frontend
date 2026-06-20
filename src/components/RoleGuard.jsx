import { Navigate } from 'react-router-dom';

const RoleGuard = ({ children, minRole }) => {
  const userInfo = JSON.parse(localStorage.getItem('user_info'));

  // If no user is logged in, redirect to login page
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  const userRole = userInfo.role || 'viewer'; // Fallback to viewer role if not specified

  const roleHierarchy = {
    'viewer': 1,
    'worker': 2,
    'admin': 3,
    'superadmin': 4
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[minRole];

  if (userLevel < requiredLevel) {
    console.warn(`Clearance Level ${userLevel} attempted to access Level ${requiredLevel} sector. Ejecting...`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
