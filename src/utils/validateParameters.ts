import type { BucketProps, Credentials } from '../types'

export const validateParameters = (parameters: Credentials) => {
  if (!parameters?.apiKey || parameters?.apiKey.length < 1) {
    return 'Provide your Upstart API key.'
  }
  if (!parameters?.siteId || parameters?.siteId.length < 1) {
    return 'Provide your Upstart Site ID.'
  }
  if (!parameters?.tenantId || parameters?.tenantId.length < 1) {
    return 'Provide your Upstart Tenant ID.'
  }
  return null
}

export const itemToString = (item: BucketProps) => item.key_as_string || String(item.key)
