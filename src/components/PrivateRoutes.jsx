import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const PrivateRoutes = () => {
    const { isLoggedIn } = useAuthContext();

    return (
        isLoggedIn ? <Outlet /> : <Navigate to='/' />
    )
}

export default PrivateRoutes;