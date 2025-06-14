import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const sessionData = sessionStorage.getItem('userSession')
    if (sessionData) {
      const user = JSON.parse(sessionData)
      setCurrentUser(user)
      setUserRole(user.role)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, userRole, setCurrentUser, setUserRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
