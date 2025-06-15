import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>

  return currentUser ? children : <Navigate to="/" />
}

export default PrivateRoute
