import { useEffect, useMemo, useState } from 'react'

import type { Credentials, Facets, SearchData, SearchResponse } from '../types'
import { buildFilters } from '../utils/filters'

interface QueryParams {
  facets: Facets
  size: number
}

export default function useProducts(
  { apiEndpoint, apiKey, siteId, tenantId }: Credentials,
  { facets, size }: QueryParams
) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [products, setProducts] = useState<SearchResponse[]>([])
  const filters = useMemo(() => buildFilters(facets), [facets, buildFilters])

  useEffect(() => {
    setIsLoading(true)

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/v1/search/routes/catalog_live/search`, {
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
                    ...filters,
                  ],
                },
              },
              from: 0,
              size,
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
          setProducts(data.hits.hits)
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

    fetchProducts()
  }, [apiKey, siteId, tenantId, filters, size])

  return { isLoading, error, products }
}
