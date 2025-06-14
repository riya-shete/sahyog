import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>

  if (!currentUser) return <Navigate to="/" />

  if (userRole !== allowedRole) {
    const redirectPath = userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'
    return <Navigate to={redirectPath} />
  }

  return children
}

export default ProtectedRoute
