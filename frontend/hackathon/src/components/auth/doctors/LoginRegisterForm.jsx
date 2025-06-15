import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MultiStepRegister from './MultiStepRegister'
import { loginUser } from '../../services/authService'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../../context/AuthContext' 

const DoctorLoginRegisterForm = () => {
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
          navigate('/doctor/dashboard')
        }, 1500)
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-black px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        {isLogin ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center text-blue-700">Doctor Login</h2>

            {error && <div className="text-red-600 bg-red-100 px-4 py-2 rounded text-sm">{error}</div>}
            {message && <div className="text-green-700 bg-green-100 px-4 py-2 rounded text-sm">{message}</div>}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-sm text-center text-gray-700">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false)
                  setMessage({ type: '', text: '' })
                }}
                className="text-blue-700 font-semibold underline"
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <MultiStepRegister role="doctor" onBack={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}

export default DoctorLoginRegisterForm
