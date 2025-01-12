import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole: 'ROLE_PASSENGER' | 'ROLE_DRIVER';
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const userRole = useSelector((state: RootState) => state.auth.role);
    
    if (!userRole) {
        return <Navigate to="/" />;
    }

    if (userRole !== allowedRole) {
        return <Navigate to={userRole === 'ROLE_PASSENGER' ? '/passenger-home' : '/driver-home'} />;
    }

    return <>{children}</>;
}; 