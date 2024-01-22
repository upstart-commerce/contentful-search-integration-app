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

  it('renders the page heading', () => {
    const { getByText } = render(<ConfigScreen />)

    expect(getByText('Upstart search app configuration')).toBeInTheDocument()
  })

  it('renders inputs for API Key, Site ID, and Tenant ID', () => {
    const { getByTestId } = render(<ConfigScreen />)

    expect(getByTestId('apiEndpoint')).toBeInTheDocument()
    expect(getByTestId('apiKey')).toBeInTheDocument()
    expect(getByTestId('siteId')).toBeInTheDocument()
    expect(getByTestId('tenantId')).toBeInTheDocument()
  })

  it.each([
    ['apiEndpoint', 'new-api-endpoint'],
    ['apiKey', 'new-api-key'],
    ['siteId', 'new-site-id'],
    ['tenantId', 'new-tenant-id'],
  ])('updates %s when its respective input changes', async (inputID, newValue) => {
    const { getByTestId } = render(<ConfigScreen />)
    fireEvent.change(getByTestId(inputID), { target: { value: newValue } })
    await waitFor(() => {
      expect((getByTestId(inputID) as HTMLInputElement).value).toBe(newValue)
    })
  })

  it.each([
    ['apiEndpoint', ''],
    ['apiKey', ''],
    ['siteId', ''],
    ['tenantId', ''],
  ])('calls the notifier error when %s is empty', async (inputID, newValue) => {
    render(<ConfigScreen />)

    expect(mockSdk.app.onConfigure).toHaveBeenCalled()

    const onConfigure = mockSdk.app.onConfigure.mock.calls[0][0]
    const parameters = {
      apiEndpoint: 'test-value',
      apiKey: 'test-value',
      siteId: 'test-value',
      tenantId: 'test-value',
    }

    mockSdk.app.getParameters.mockResolvedValueOnce({ ...parameters, [inputID]: newValue })

    const result = await onConfigure()

    expect(result).toBe(false)
    expect(mockSdk.notifier.error).toHaveBeenCalled()
  })
})
