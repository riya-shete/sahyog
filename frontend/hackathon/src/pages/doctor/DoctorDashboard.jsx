import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { logoutUser } from '../../components/services/authService'
import { useEffect } from 'react'

const DoctorsDashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      const sessionData = sessionStorage.getItem('userSession')
      if (!sessionData) navigate('/')
    }
  }, [currentUser, navigate])

  const handleLogout = async () => {
    await logoutUser()
    navigate('/')
  }

  if (!currentUser) return <div className="p-4 text-black">Loading user info...</div>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-100 gap-4">
      <h1 className="text-3xl font-bold text-black">Welcome to Doctor Dashboard</h1>
      <p><strong>Name:</strong> {currentUser.fullName}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Phone:</strong> {currentUser.phone}</p>
      <p><strong>Role:</strong> {currentUser.role}</p>

      <Link
        to="/doctor/dashboard/test"
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
      >
        Go to Test Component
      </Link>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  )
}

export default DoctorsDashboard
