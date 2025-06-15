import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MultiStepRegister from './MultiStepRegister'
import { loginUser } from '../../services/authService'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const PatientLoginRegisterForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(email, password)
      if (res) {
        setMessage('Login successful! Redirecting...')
        setTimeout(() => {
          navigate('/patient/dashboard')
        }, 1500)
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-300 to-red-500 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {isLogin ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center mb-2 text-red-600">Patient Login</h2>

            {error && <div className="text-red-600 bg-red-100 px-4 py-2 rounded text-sm">{error}</div>}
            {message && <div className="text-green-700 bg-green-100 px-4 py-2 rounded text-sm">{message}</div>}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-3 border border-gray-300 rounded w-full pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </span>
            </div>

            <button
              type="submit"
              className={`bg-red-600 text-white py-2 rounded transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-sm text-center">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false)
                  setError('')
                  setMessage('')
                }}
                className="text-red-600 underline"
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <MultiStepRegister role="patient" onBack={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}

export default PatientLoginRegisterForm
