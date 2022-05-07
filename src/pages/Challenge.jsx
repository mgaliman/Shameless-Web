import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Challenge() {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchChallenge = async () => {
      const docRef = doc(db, 'challenges', params.challengeId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setChallenge(docSnap.data())
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [navigate, params.challengeId])

  if (loading) {
    return <Spinner />
  }

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {challenge.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${challenge.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)
          }, 2000)
        }}
      >
        <img src={shareIcon} alt='' />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

      <div className='challengeDetails'>
        <p className='challengeName'>
          {challenge.name} -{' '}
          {challenge.type === 'points'
            ? challenge.points + ' Points'
            : challenge.ethereum + ' Eth'}
        </p>
        <p className='challengeLocation'>{challenge.location}</p>
        <p className='challengeType'>
          {challenge.type === 'points' ? 'Points' : 'Crypto'} Challenge
        </p>

        <ul className='challengeDetailsList'>
          <li>
            {challenge.people > 1 ? `${challenge.people} People` : '1 Person'}
          </li>
          <li>{challenge.days > 1 ? `${challenge.days} Days` : '1 Day'}</li>
        </ul>
        <p className='challengeLocationTitle'>Location</p>

        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[challenge.geolocation.lat, challenge.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[challenge.geolocation.lat, challenge.geolocation.lng]}
            >
              <Popup>{challenge.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== challenge.userRef && (
          <Link
            to={`/contact/${challenge.userRef}?challengeName=${challenge.name}`}
            className='primaryButton'
          >
            Contact Challenge Creator
          </Link>
        )}
      </div>
    </main>
  )
}

export default Challenge
