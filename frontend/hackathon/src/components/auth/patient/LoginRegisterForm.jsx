import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MultiStepRegister from './MultiStepRegister'
import { loginUser } from '../../services/authService'

const PatientLoginRegisterForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await loginUser(email, password)
      if (res) navigate('/patinet/dashboard')
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 to-pink-500 text-black">
      <div className="w-full max-w-md p-6">
        {isLogin ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-center">Patient Login</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-2 border rounded"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="p-2 border rounded"
              required
            />
            <button type="submit" className="bg-black text-white py-2 rounded">
              Login
            </button>
            <p className="text-sm text-center">
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsLogin(false)} className="underline">
                Register
              </button>
            </p>
          </form>
        ) : (
          <MultiStepRegister role="patinet" onBack={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}

export default PatientLoginRegisterForm
