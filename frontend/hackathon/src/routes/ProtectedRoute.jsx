import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userRole } = useAuth()

  if (!currentUser) return <Navigate to="/" />

  if (allowedRole && userRole !== allowedRole) {
    const redirectPath = userRole === 'doctor' ? '/doctor/dashboard' : '/patinet/dashboard'
    return <Navigate to={redirectPath} />
  }

  return children
}

export default ProtectedRoute
