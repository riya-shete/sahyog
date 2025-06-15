import { useAuth } from '../../context/AuthContext'

const DoctorProfile = () => {
  const { currentUser } = useAuth()

  if (!currentUser) return <div className="text-black">Loading profile...</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto text-black">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Doctor Profile</h1>
      <p><strong>Name:</strong> {currentUser.fullName}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Phone:</strong> {currentUser.phone}</p>
      <p><strong>Role:</strong> {currentUser.role}</p>

      <button
        onClick={() => {
          sessionStorage.removeItem('userSession')
          window.location.href = '/'
        }}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default DoctorProfile