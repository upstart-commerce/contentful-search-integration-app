import { fireEvent, render } from '@testing-library/react'
import { useState } from 'react'

import { mockCma, mockSdk } from '../../../test/mocks'
import useProducts from '../../hooks/useProducts'
import Field from '../Field'

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}))

jest.mock('../../hooks/useProducts')

describe('Field', () => {
  const mockUseState = useState as jest.Mock
  const mockUseProducts = useProducts as jest.Mock

  beforeEach(() => {
    mockUseState.mockImplementation(jest.requireActual('react').useState)
    mockUseProducts.mockReturnValue({ isLoading: false, products: {} })
  })

  it('should render without crashing', () => {
    render(<Field />)
  })

  it('should render the field not of Object type scenario', () => {
    mockSdk.field.type = 'Text'
    const { queryByText } = render(<Field />)
    expect(queryByText('Expected field type: Object')).toBeInTheDocument()
  })

  it('should render loading state correctly', () => {
    mockSdk.field.type = 'Object'
    mockUseProducts.mockReturnValue({ isLoading: true, products: [] })
    const { queryByTestId } = render(<Field />)
    expect(queryByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('should render field type of Object', () => {
    mockSdk.field.type = 'Object'
    mockUseProducts.mockReturnValue({ isLoading: false, products: [] })
    mockUseState.mockReturnValue([{ selected: 'facet' }])
    const { queryByText } = render(<Field />)
    expect(queryByText('Select facets')).toBeInTheDocument()
  })

  it('should call handleDialogOpen when select facets button is clicked', () => {
    const { getByText } = render(<Field />)
    const selectFacetsButton = getByText('Select facets')
    fireEvent.click(selectFacetsButton)

    expect(mockSdk.dialogs.openCurrentApp).toHaveBeenCalled()
  })
})
