import { auth, db } from '../../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const registerUser = async ({ firstName, lastName, email, phone, password, role }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const fullName = `${firstName} ${lastName}`

    await updateProfile(userCredential.user, { displayName: fullName })

    const userData = {
      fullName,
      email,
      phone,
      role,
      createdAt: new Date().toISOString()
    }

    await setDoc(doc(db, 'users', userCredential.user.uid), userData)
    sessionStorage.setItem('userSession', JSON.stringify(userData))

    return userCredential
  } catch (error) {
    console.error('Firebase registration error:', error.code, error.message)
    throw error
  }
}

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const docSnap = await getDoc(doc(db, 'users', userCredential.user.uid))

    if (docSnap.exists()) {
      const userData = docSnap.data()
      sessionStorage.setItem('userSession', JSON.stringify(userData))
      return userCredential
    } else {
      throw new Error('User data not found in Firestore')
    }
  } catch (error) {
    console.error('Firebase login error:', error.code, error.message)
    throw error
  }
}

export const logoutUser = async () => {
  try {
    sessionStorage.removeItem('userSession')
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error.code, error.message)
    throw error
  }
}
