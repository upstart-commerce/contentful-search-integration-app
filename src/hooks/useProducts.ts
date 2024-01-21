import { set } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

import { API_ENDPOINT } from '../constants'
import type { Credentials, Facets, SearchData, SearchResponse } from '../types'
import { buildFilters } from '../utils/filters'

interface QueryParams {
  facets: Facets
  size: number
}

export default function useProducts(
  { apiKey, siteId, tenantId }: Credentials,
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

        if (res.ok) {
          const data = res.result.indexes.catalog_live.data as SearchData
          setProducts(data.hits.hits)
        }

        // await new Promise((resolve) => setTimeout(resolve, 1000))

        // const items = [
        //   {
        //     _source: {
        //       name: 'Product 1',
        //       media: {
        //         uri: 'https://images.contentful.com/1.jpg',
        //         altText: 'Product 1',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 2',
        //       media: {
        //         uri: 'https://images.contentful.com/2.jpg',
        //         altText: 'Product 2',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 3',
        //       media: {
        //         uri: 'https://images.contentful.com/3.jpg',
        //         altText: 'Product 3',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 4',
        //       media: {
        //         uri: 'https://images.contentful.com/4.jpg',
        //         altText: 'Product 4',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 5',
        //       media: {
        //         uri: 'https://images.contentful.com/5.jpg',
        //         altText: 'Product 5',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 6',
        //       media: {
        //         uri: 'https://images.contentful.com/6.jpg',
        //         altText: 'Product 6',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 7',
        //       media: {
        //         uri: 'https://images.contentful.com/7.jpg',
        //         altText: 'Product 7',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 8',
        //       media: {
        //         uri: 'https://images.contentful.com/8.jpg',
        //         altText: 'Product 8',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 9',
        //       media: {
        //         uri: 'https://images.contentful.com/9.jpg',
        //         altText: 'Product 9',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 10',
        //       media: {
        //         uri: 'https://images.contentful.com/10.jpg',
        //         altText: 'Product 10',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 11',
        //       media: {
        //         uri: 'https://images.contentful.com/11.jpg',
        //         altText: 'Product 11',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 12',
        //       media: {
        //         uri: 'https://images.contentful.com/12.jpg',
        //         altText: 'Product 12',
        //       },
        //     },
        //   },
        //   {
        //     _source: {
        //       name: 'Product 13',
        //       media: {
        //         uri: 'https://images.contentful.com/13.jpg',
        //         altText: 'Product 13',
        //       },
        //     },
        //   },
        // ]

        // const items = [] as any[]
        // const products = items?.slice(0, size) as any
        // setProducts(products)
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
