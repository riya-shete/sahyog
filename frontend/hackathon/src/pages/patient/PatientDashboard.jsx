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
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Patient Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Manage your health information and appointments.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* View Prescriptions Card */}
            <div 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/patient/prescriptions')}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">View Prescriptions</h3>
                  <p className="text-gray-600 text-sm">Check prescriptions uploaded by doctors</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View All →
                </span>
              </div>
            </div>

            {/* Take Health Test Card */}
            <div 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/patient/health-test')}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Take Health Test</h3>
                  <p className="text-gray-600 text-sm">Complete health assessments and screenings</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-600 text-sm font-medium hover:text-green-700">
                  Start Test →
                </span>
              </div>
            </div>

            {/* Upload Health Info Card */}
            <div 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/patient/health-info')}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upload Health Info</h3>
                  <p className="text-gray-600 text-sm">Add health records and family disease history</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-purple-600 text-sm font-medium hover:text-purple-700">
                  Upload →
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">New prescription uploaded by Dr. Smith</span>
                </div>
                <span className="text-gray-500 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Health test completed successfully</span>
                </div>
                <span className="text-gray-500 text-sm">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Health information updated</span>
                </div>
                <span className="text-gray-500 text-sm">3 days ago</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-gray-600 text-sm">Total Prescriptions</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">8</div>
              <div className="text-gray-600 text-sm">Tests Completed</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">5</div>
              <div className="text-gray-600 text-sm">Health Records</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">3</div>
              <div className="text-gray-600 text-sm">Upcoming Appointments</div>
            </div>
          </div>

          {/* Outlet for nested routes */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PatientDashboard