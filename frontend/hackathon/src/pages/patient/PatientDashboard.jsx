import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../components/services/authService'


const PatientDashboard = () => {
  const { currentUser } = useAuth()

  if (!currentUser) return <div className="p-4 text-black">Loading user info...</div>

    const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 gap-4">
      <h1 className="text-3xl font-bold text-black">Welcome to Patient Dashboard</h1>
      <p><strong>Name:</strong> {currentUser.fullName}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Phone:</strong> {currentUser.phone}</p>
      <p><strong>Role:</strong> {currentUser.role}</p>
      <Link
        to="/patinet/dashboard/test"
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded"
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

export default PatientDashboard