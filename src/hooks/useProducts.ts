import { useEffect, useMemo, useState } from 'react'

import { API_ENDPOINT } from '../constants'
import type { Credentials, Facets, SearchData, SearchResponse } from '../types'
import { buildFilters } from '../utils'

interface QueryParams {
  facets: Facets
  size: number
}

export default function useProducts(
  { apiKey, siteId, tenantId }: Credentials,
  { facets, size }: QueryParams
) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<SearchResponse[]>([])
  const filters = useMemo(() => buildFilters(facets), [facets, buildFilters])

  useEffect(() => {
    setIsLoading(true)

    const fetchProducts = async () => {
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
                  ...filters,
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
      const data = res.result.indexes.catalog_live.data as SearchData

      setProducts(data.hits.hits)
      setIsLoading(false)
    }

    fetchProducts()
  }, [apiKey, siteId, tenantId, filters, setProducts])

  return { isLoading, products }
}
