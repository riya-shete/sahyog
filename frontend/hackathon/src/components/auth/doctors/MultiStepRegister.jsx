import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/authService'

const MultiStepRegister = ({ role, onBack }) => {
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== rePassword) return
    try {
      const res = await registerUser({ firstName, lastName, email, phone, password, role })
      if (res) navigate(`/${role}/dashboard`)
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">Doctor Register</h2>
      {step === 1 && (
        <>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="p-2 border rounded"
            required
          />
          <button type="button" onClick={() => setStep(2)} className="bg-black text-white py-2 rounded">
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
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="p-2 border rounded"
            required
          />
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="underline">
              Back
            </button>
            <button type="button" onClick={() => setStep(3)} className="bg-black text-white py-2 px-4 rounded">
              Next
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create Password"
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            placeholder="Re-enter Password"
            className="p-2 border rounded"
            required
          />
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="underline">
              Back
            </button>
            <button type="submit" className="bg-black text-white py-2 px-4 rounded">
              Register
            </button>
          </div>
        </>
      )}
      <p className="text-sm text-center">
        Already have an account?{' '}
        <button type="button" onClick={onBack} className="underline">
          Login
        </button>
      </p>
    </form>
  )
}

export default MultiStepRegister