import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/authService'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../../context/AuthContext' 

const MultiStepRegister = ({ role = 'patient', onBack }) => {
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('') 
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { setCurrentUser, setUserRole } = useAuth() 

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!firstName || !lastName || !email || !phone || !password || !rePassword) {
      setError('Please fill in all the fields.')
      return
    }

    if (password !== rePassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await registerUser({ firstName, lastName, email, phone, password, role })
      if (res?.error) {
        setError(res.message)
      } else {
        setSuccess('Account created successfully! Redirecting...')
          setCurrentUser(res.user)
          setUserRole(role)
        setTimeout(() => navigate(`/${role}/dashboard`), 1500) // ✅ delay before redirect
      }
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 p-6 max-w-md w-full mx-auto">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded ${step >= s ? 'bg-red-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold text-center text-red-600">Patient Registration</h2>

      {/* Show error or success message */}
      {error && (
        <div className="text-red-600 bg-red-100 text-sm font-medium px-4 py-2 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 bg-green-100 text-sm font-medium px-4 py-2 rounded">
          {success}
        </div>
      )}

      {step === 1 && (
        <>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <button
            type="button"
            onClick={() => {
              if (!firstName || !lastName) {
                setError('Please fill in your name fields.')
              } else {
                setError('')
                setStep(2)
              }
            }}
            className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="underline text-sm text-gray-600">
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (!email || !phone) {
                  setError('Please enter email and phone.')
                } else {
                  setError('')
                  setStep(3)
                }
              }}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
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

          <div className="relative">
            <input
              type={showRePassword ? 'text' : 'password'}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Re-enter Password"
              className="p-3 border border-gray-300 rounded w-full pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <span
              onClick={() => setShowRePassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
            >
              {showRePassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </span>
          </div>

          {password && rePassword && password !== rePassword && (
            <p className="text-sm text-red-600 mt-[-8px] -mb-2">Passwords do not match</p>
          )}

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="underline text-sm text-gray-600">
              Back
            </button>
            <button
              type="submit"
              className={`bg-red-600 text-white py-2 px-4 rounded transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </>
      )}

      <p className="text-sm text-center mt-2">
        Already have an account?{' '}
        <button type="button" onClick={onBack} className="text-red-600 underline">
          Login
        </button>
      </p>
    </form>
  )
}

export default MultiStepRegister
