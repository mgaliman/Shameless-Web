import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import Spinner from './Spinner'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchChallenges = async () => {
      const challengesRef = collection(db, 'challenges')
      const q = query(challengesRef, orderBy('timestamp', 'desc'), limit(5))
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

    fetchChallenges()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (challenges.length === 0) {
    return <></>
  }

  return (
    challenges && (
      <>
        <p className='exploreHeading'>Recommended</p>

        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {challenges.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='swiperSlideDiv'
              >
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePoints'>
                  {data.type === 'points'
                    ? data.points + ' Points'
                    : data.ethereum + ' Eth'}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider
