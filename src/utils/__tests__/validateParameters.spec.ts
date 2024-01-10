import { itemToString, validateParameters } from '../validateParameters'

describe('validateParameters', () => {
  it('should return the API key error if no API key is provided', () => {
    const parameters = {
      apiKey: '',
      siteId: 'mysiteid',
      tenantId: 'mytenantid',
    }
    expect(validateParameters(parameters)).toEqual('Provide your Upstart API key.')
  })

  it('should return the Site ID error if no Site ID is provided', () => {
    const parameters = {
      apiKey: 'myapikey',
      siteId: '',
      tenantId: 'mytenantid',
    }
    expect(validateParameters(parameters)).toEqual('Provide your Upstart Site ID.')
  })

  it('should return the Tenant ID error if no Tenant ID is provided', () => {
    const parameters = {
      apiKey: 'myapikey',
      siteId: 'mysiteid',
      tenantId: '',
    }
    expect(validateParameters(parameters)).toEqual('Provide your Upstart Tenant ID.')
  })

  it('should return null if all parameters are provided', () => {
    const parameters = {
      apiKey: 'myapikey',
      siteId: 'mysiteid',
      tenantId: 'mytenantid',
    }
    expect(validateParameters(parameters)).toEqual(null)
  })
})

describe('itemToString', () => {
  it('should return key_as_string if provided', () => {
    const item = {
      key_as_string: 'myKeyAsString',
      key: 123,
      doc_count: 1,
    }
    expect(itemToString(item)).toEqual('myKeyAsString')
  })

  it('should return the stringified version of key if key_as_string is not provided', () => {
    const item = { key: 123, doc_count: 1 }
    expect(itemToString(item)).toEqual('123')
  })
})
