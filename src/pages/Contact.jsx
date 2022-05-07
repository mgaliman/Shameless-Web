import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

function Contact() {
  const [message, setMessage] = useState('')
  const [challengeCreator, setChallengeCreator] = useState(null)
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getChallengeCreator = async () => {
      const docRef = doc(db, 'users', params.challengeCreatorId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setChallengeCreator(docSnap.data())
      } else {
        toast.error('Could not get challengeCreator data')
      }
    }

    getChallengeCreator()
  }, [params.challengeCreatorId])

  const onChange = (e) => setMessage(e.target.value)

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Challenge Creator</p>
      </header>

      {challengeCreator !== null && (
        <main>
          <div className='contactChallengeCreator'>
            <p className='challengeCreatorName'>Contact {challengeCreator?.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${challengeCreator.email}?Subject=${searchParams.get(
                'challengeName'
              )}&body=${message}`}
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}

export default Contact