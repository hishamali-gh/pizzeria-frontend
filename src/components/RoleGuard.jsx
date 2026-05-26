import { Navigate } from 'react-router-dom';


const RoleGuard = ({ children, minRole }) => {
  const userRole = JSON.parse(localStorage.getItem('user_info'))/* .role */; // 'viewer', 'worker', or 'admin'

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
    
    // return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
