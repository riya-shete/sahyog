import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedData = localStorage.getItem('userSession')
    if (storedData) {
      const user = JSON.parse(storedData)
      setCurrentUser(user)
      setUserRole(user.role)
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, userRole, setCurrentUser, setUserRole, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
