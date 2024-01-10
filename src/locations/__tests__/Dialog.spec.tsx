import { fireEvent, render } from '@testing-library/react'
import { useState } from 'react'

import { mockCma, mockSdk } from '../../../test/mocks'
import useFacets from '../../hooks/useFacets'
import Dialog from '../Dialog'

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}))

jest.mock('../../hooks/useFacets')

describe('Dialog', () => {
  const mockUseState = useState as jest.Mock
  const mockUseFacets = useFacets as jest.Mock
  const mockSetFieldValues = jest.fn()

  beforeEach(() => {
    mockUseState.mockImplementation(jest.requireActual('react').useState)
    mockUseFacets.mockReturnValue({ isLoading: false, facets: {} })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    mockUseState.mockReturnValue([
      {
        quantity: 10,
        title: '',
        selected: {},
      },
      mockSetFieldValues,
    ])
    render(<Dialog />)
  })

  it('should call setFieldValues when quantity is changed', () => {
    const initialFieldValues = {
      quantity: 10,
      title: '',
      selected: {},
    }

    mockUseState.mockReturnValue([initialFieldValues, mockSetFieldValues])

    const { getByTestId } = render(<Dialog />)
    const input = getByTestId('quantity')
    fireEvent.change(input, { target: { value: 20 } })
    expect(mockSetFieldValues).toHaveBeenCalledWith({
      ...initialFieldValues,
      quantity: 20,
    })
  })
})
