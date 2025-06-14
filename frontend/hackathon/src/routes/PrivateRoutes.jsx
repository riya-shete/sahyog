import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { userRole } = useAuth()

  return <ProtectedRoute allowedRole={userRole}>{children}</ProtectedRoute>
}

export default PrivateRoute
