import { fireEvent, render, waitFor } from '@testing-library/react'

import { mockCma, mockSdk } from '../../../test/mocks'
import ConfigScreen from '../ConfigScreen'

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}))

describe('ConfigScreen Component', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders properly', () => {
    const { container } = render(<ConfigScreen />)

    expect(container).toBeInTheDocument()
  })

  it('renders the page heading', () => {
    const { getByText } = render(<ConfigScreen />)

    expect(getByText('Upstart search app configuration')).toBeInTheDocument()
  })

  it('renders inputs for API Key, Site ID, and Tenant ID', () => {
    const { getByTestId } = render(<ConfigScreen />)

    expect(getByTestId('apiKey')).toBeInTheDocument()
    expect(getByTestId('siteId')).toBeInTheDocument()
    expect(getByTestId('tenantId')).toBeInTheDocument()
  })

  it('updates parameters state when an input changes', async () => {
    const { getByTestId } = render(<ConfigScreen />)

    fireEvent.change(getByTestId('apiKey'), { target: { value: 'new-api-key' } })

    await waitFor(() => {
      expect((getByTestId('apiKey') as HTMLInputElement).value).toBe('new-api-key')
    })
  })

  it('calls the notifier error when configurations are incorrect', async () => {
    const { getByTestId } = render(<ConfigScreen />)

    fireEvent.change(getByTestId('apiKey'), { target: { value: '' } })

    await mockSdk.app.onConfigure.mock.calls[0][0]()

    expect(mockSdk.notifier.error).toHaveBeenCalled()
  })
})
