import React from 'react'

function Spinner() {
  return (
    <div className='loadingSpinnerContainer' data-testid='spinnerContainerTest'>
      <div className='loadingSpinner' data-testid='loadingSpinnerTest'></div>
    </div>
  )
}

export default Spinner
