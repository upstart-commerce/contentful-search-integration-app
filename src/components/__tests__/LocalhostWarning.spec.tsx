import { render, screen } from '@testing-library/react'

import LocalhostWarning from '../LocalhostWarning'

describe('LocalhostWarning', () => {
  it('renders correctly', () => {
    render(<LocalhostWarning />)

    expect(screen.getByRole('link', { name: 'available locations' })).toHaveAttribute(
      'href',
      'https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#locations'
    )
    expect(screen.getByRole('link', { name: 'our guide' })).toHaveAttribute(
      'href',
      'https://www.contentful.com/developers/docs/extensibility/app-framework/tutorial/#embed-your-app-in-the-contentful-web-app'
    )
    expect(screen.getByRole('link', { name: 'open Contentful' })).toHaveAttribute(
      'href',
      'https://app.contentful.com/deeplink?link=apps'
    )
  })
})
