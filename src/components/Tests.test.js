import React from 'react'
import { render } from '@testing-library/react'
import { default as Spinner } from '../components/Spinner'

describe('Spinner component tests:', () => {
  test('pass if loadingSpinner exists', () => {
    const { queryByTestId } = render(<Spinner />)
    expect(queryByTestId(/loadingSpinnerTest/i)).toBeTruthy()
  })

  test('pass if spinnerContainer exists', () => {
    const { queryByTestId } = render(<Spinner />)
    expect(queryByTestId(/spinnerContainerTest/i)).toBeTruthy()
  })
})