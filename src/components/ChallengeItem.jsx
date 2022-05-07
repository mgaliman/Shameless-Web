import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import personIcon from '../assets/svg/personIcon.svg'
import moonIcon from '../assets/svg/moonIcon.svg'

function ChallengeItem({ challenge, id, onEdit, onDelete }) {
  return (
    <li className='categoryChallenge'>
      <Link
        to={`/category/${challenge.type}/${id}`}
        className='categoryChallengeLink'
      >
        <img
          src={challenge.imgUrls}
          alt={challenge.name}
          className='categoryChallengeImg'
        />
        <div className='categoryChallengeDetails'>
          <p className='categoryChallengeLocation'>{challenge.location}</p>
          <p className='categoryChallengeName'>{challenge.name}</p>
          <p className='categoryChallengePoints'>
            {challenge.type === 'points'
              ? challenge.points + ' Points'
              : challenge.ethereum + ' ETH'}
          </p>
          <div className='categoryChallengeInfoDiv'>
            <img src={personIcon} alt='person' />
            <p className='categoryChallengeInfoText'>
              {challenge.people > 1 ? `${challenge.people} People` : '1 Person'}
            </p>
            <img src={moonIcon} alt='moon' />
            <p className='categoryChallengeInfoText'>
              {challenge.days > 1 ? `${challenge.days} Days` : '1 Day'}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          className='removeIcon'
          fill='rgb(231,76,60)'
          onClick={() => onDelete(challenge.id, challenge.name)}
        />
      )}

      {onEdit && <EditIcon className='editIcon' onClick={() => onEdit(id)} />}
    </li>
  )
}

export default ChallengeItem
