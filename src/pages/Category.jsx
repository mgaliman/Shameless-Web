import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ChallengeItem from '../components/ChallengeItem'

function Category() {
  const [challenges, setChallenges] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedChallenge, setLastFetchedChallenge] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // Get reference
        const challengesRef = collection(db, 'challenges')

        // Create a query
        const q = query(
          challengesRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        // Execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedChallenge(lastVisible)

        const challenges = []

        querySnap.forEach((doc) => {
          return challenges.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setChallenges(challenges)
        setLoading(false)
      } catch (error) {
        toast.error('Could not fetch challenges')
      }
    }

    fetchChallenges()
  }, [params.categoryName])

  // Pagination / Load More
  const onFetchMoreChallenges = async () => {
    try {
      // Get reference
      const challengesRef = collection(db, 'challenges')

      // Create a query
      const q = query(
        challengesRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedChallenge),
        limit(10)
      )

      // Execute query
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedChallenge(lastVisible)

      const challenges = []

      querySnap.forEach((doc) => {
        return challenges.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setChallenges((prevState) => [...prevState, ...challenges])
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch challenges')
    }
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>
          {params.categoryName === 'points'
            ? 'Points challenges'
            : 'Crypto challenges'}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : challenges && challenges.length > 0 ? (
        <>
          <main>
            <ul className='categoryChallenges'>
              {challenges.map((challenge) => (
                <ChallengeItem
                  challenge={challenge.data}
                  id={challenge.id}
                  key={challenge.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedChallenge && (
            <p className='loadMore' onClick={onFetchMoreChallenges}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No challenges for {params.categoryName}</p>
      )}
    </div>
  )
}

export default Category
