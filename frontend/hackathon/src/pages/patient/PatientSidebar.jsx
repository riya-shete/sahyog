// PatientSidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../../components/services/authService'
import { useAuth } from '../../context/AuthContext'

const PatientSidebar = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    sessionStorage.removeItem('userSession')
    navigate('/')
  }

  return (
    <div className="w-64 min-h-screen bg-red-700 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Patient Panel</h2>
      <nav className="flex flex-col gap-4">
        <NavLink to="/patient/dashboard/profile" className={({ isActive }) => `${isActive ? 'text-red-200' : ''} hover:underline`}>
          Profile
        </NavLink>
        <NavLink to="/patient/dashboard/test" className={({ isActive }) => `${isActive ? 'text-red-200' : ''} hover:underline`}>
          Test
        </NavLink>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>
      </nav>
    </div>
  )
}

export default PatientSidebar