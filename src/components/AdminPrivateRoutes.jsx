import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const AdminPrivateRoutes = () => {
    const { loggedUser } = useAuthContext();

    return (
        loggedUser.isAdmin ? <Outlet /> : <Navigate to='/' />
    )
}

export default AdminPrivateRoutes;