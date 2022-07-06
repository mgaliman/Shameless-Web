import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ChallengeItem from '../components/ChallengeItem'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserChallenges = async () => {
      const challengesRef = collection(db, 'challenges')

      const q = query(
        challengesRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let challenges = []

      querySnap.forEach((doc) => {
        return challenges.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setChallenges(challenges)
      setLoading(false)
    }

    fetchUserChallenges()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        //Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onDelete = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'challenges', challengeId))
      const updatedChallenges = challenges.filter(
        (challenge) => challenge.id !== challengeId
      )
      setChallenges(updatedChallenges)
      toast.success('Successfully deleted challenge')
    }
  }

  const onEdit = (challengeId) => navigate(`/edit-challenge/${challengeId}`)

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' className='logOut' onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className='profileCard'>
          <form>           
            <input
              type='text'
              id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
          
        </div>

        
        {!loading && challenges?.length > 0 && (
          <>
            <p className='challengesText'>Your Challenges</p>
            <ul className='challengesList'>
              {challenges.map((challenge) => (
                <ChallengeItem
                  key={challenge.id}
                  challenge={challenge.data}
                  id={challenge.id}
                  onDelete={() => onDelete(challenge.id)}
                  onEdit={() => onEdit(challenge.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile
