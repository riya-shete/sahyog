import { auth, db } from '../../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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
      uid: userCredential.user.uid,
      createdAt: new Date().toISOString()
    }

    const collectionName = role === 'doctor' ? 'doctors' : 'patients'
    await setDoc(doc(db, collectionName, userCredential.user.uid), userData)

    localStorage.setItem('userSession', JSON.stringify(userData))

    return userCredential
  } catch (error) {
    console.error('Firebase registration error:', error.code, error.message)
    throw error
  }
}

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    let docSnap = await getDoc(doc(db, 'doctors', uid))
    if (!docSnap.exists()) {
      docSnap = await getDoc(doc(db, 'patients', uid))
    }

    if (docSnap.exists()) {
      const userData = docSnap.data()
      localStorage.setItem('userSession', JSON.stringify(userData))
      return userData
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
    localStorage.removeItem('userSession')
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error.code, error.message)
    throw error
  }
}