import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PatientSidebar from './PatientSidebar'

const PatientDashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      const sessionData = sessionStorage.getItem('userSession')
      if (!sessionData) navigate('/')
    }
  }, [currentUser, navigate])

  return (
    <div className="flex min-h-screen bg-white">
      <PatientSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default PatientDashboard