import React from 'react'
import { Link } from 'react-router-dom'
import Slider from '../components/Slider'
import sadPepe from '../assets/jpg/sadPepe.jpg'
import angryPepe from '../assets/jpg/angryPepe.jpg'

function Explore() {
  return (
    <div className='explore'>
      <header>
        <p className='pageHeader'>Explore</p>
      </header>
      <main>
        <Slider />

        <p className='exploreCategoryHeading'>Categories</p>
        <div className='exploreCategories'>
          <Link to='/category/points'>
            <img src={sadPepe} alt='points' className='exploreCategoryImg' />
            <p className='exploreCategoryName'>Points challenges</p>
          </Link>
          <Link to='/category/crypto'>
            <img src={angryPepe} alt='crypto' className='exploreCategoryImg' />
            <p className='exploreCategoryName'>Crypto challenges</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore
