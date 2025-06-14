import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../../components/services/authService'
import { useAuth } from '../../context/AuthContext'

const DoctorSidebar = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    sessionStorage.removeItem('userSession')
    navigate('/')
  }

  return (
    <div className="w-64 min-h-screen bg-blue-700 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Doctor Panel</h2>
      <nav className="flex flex-col gap-4">
        <NavLink to="/doctor/dashboard/profile" className={({ isActive }) => `${isActive ? 'text-blue-200' : ''} hover:underline`}>
          Profile
        </NavLink>
        <NavLink to="/doctor/dashboard/test" className={({ isActive }) => `${isActive ? 'text-blue-200' : ''} hover:underline`}>
          Test
        </NavLink>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-black text-white py-2 rounded"
        >
          Logout
        </button>
      </nav>
    </div>
  )
}

export default DoctorSidebar