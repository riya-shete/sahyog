import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import DoctorLoginRegisterForm from './components/auth/doctors/LoginRegisterForm'
import PatientLoginRegisterForm from './components/auth/patient/LoginRegisterForm'
import DoctorsDashboard from './pages/doctor/DoctorDashboard'
import PatientDashboard from './pages/patient/PatientDashboard'
import DoctorProfile from './pages/doctor/DoctorProfile'
import PatientProfile from './pages/patient/PatientProfile'
import TestComponentD from './pages/doctor/TestComponentD'
import TestComponentP from './pages/patient/TestComponentP'
import PageNotFound from './pages/PageNotFound'
import PrivateRoute from './routes/PrivateRoutes'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  useEffect(() => {
    console.log(
      "%cStop!",
      "color: red; font-size: 50px; font-weight: bold;"
    )
    console.log(
      "%cThis is a browser feature intended for developers...",
      "font-size: 16px;"
    )
  }, [])

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/doctor/auth" element={<DoctorLoginRegisterForm />} />
          <Route path="/patinet/auth" element={<PatientLoginRegisterForm />} />
          <Route path="*" element={<PageNotFound />} />

          <Route
            path="/doctor/dashboard"
            element={
              <PrivateRoute>
                <DoctorsDashboard />
              </PrivateRoute>
            }
          >
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="test" element={<TestComponentD />} />
          </Route>

          <Route
            path="/patient/dashboard"
            element={
              <PrivateRoute>
                <PatientDashboard />
              </PrivateRoute>
            }
          >
            <Route path="profile" element={<PatientProfile />} />
            <Route path="test" element={<TestComponentP />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
