import { useEffect, useState } from 'react'

import { API_ENDPOINT } from '../constants'
import type { Credentials, SearchData } from '../types'

interface QueryParams {
  size: number
}

export default function useFacets(
  { apiKey, siteId, tenantId }: Credentials,
  { size }: QueryParams
) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [facets, setFacets] = useState<SearchData['aggregations']>({})

  useEffect(() => {
    setIsLoading(true)

    const fetchFacets = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({
            search: {
              query: {
                bool: {
                  filter: null,
                  must: [
                    {
                      bool: {
                        should: [{ query_string: { query: '*', boost: 1 } }],
                      },
                    },
                    { bool: { should: [{ term: { archived: 'false' } }] } },
                  ],
                },
              },
              from: 0,
              size: size,
              sort: [],
              aggs: {},
            },
            tracking: 'slow',
            parentQueryId: null,
          }),
          headers: {
            'x-upstart-api-key': apiKey,
            'X-Upstart-Site': siteId,
            'X-Upstart-Tenant': tenantId,
          },
        })
        const res = await response.json()
        if (response.ok) {
          const data = res.result.indexes.catalog_live.data as SearchData
          setFacets(data.aggregations)
        } else {
          throw new Error(res.message.response.error.reason)
        }
      } catch (error) {
        setError(true)
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFacets()
  }, [apiKey, siteId, tenantId, setFacets])

  return { isLoading, error, facets }
}
