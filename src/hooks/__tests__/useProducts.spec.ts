import { renderHook, waitFor } from '@testing-library/react'

import type { TermsAggregationSource } from '../../types'
import useProducts from '../useProducts'

const credentials = {
  apiEndpoint: 'http://test-api-endpoint.com',
  apiKey: 'test-api-key',
  siteId: 'test-site-id',
  tenantId: 'test-tenant-id',
}

const queryParams = {
  facets: {
    __FACET_TERM_1__: {
      filter: {
        name: '__FACET_TERM_1_NAME__',
        metadata: {
          type: 'terms',
          isFullySupported: true,
        },
        aggregation: {
          terms: {
            field: '__FACET_TERM_1_FIELD__',
            size: 1,
            min_doc_count: 1,
          },
        },
        id: '__FACET_TERM_1_ID__',
        displayName: '__FACET_TERM_1_DISPLAY_NAME__',
      } as TermsAggregationSource,
      buckets: ['__FACET_TERM_1_BUCKET_1__'],
    },
  },
  size: 10,
}

describe('useProducts', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: {
              indexes: {
                catalog_live: {
                  data: {
                    hits: {
                      total: {
                        relation: 'eq',
                        value: 2,
                      },
                      hits: [
                        {
                          _id: '__PRODUCT_1_ID__',
                          _index: 'catalog_live',
                          _score: 1,
                          _source: {
                            id: '__PRODUCT_1_ID__',
                            name: '__PRODUCT_1_NAME__',
                            type: 'product',
                            fields: {
                              finishSwatch: {
                                value: {
                                  name: '__PRODUCT_1_NAME__',
                                  id: '__PRODUCT_1_ID__',
                                },
                                id: '__PRODUCT_1_ID__',
                              },
                            },
                          },
                          _type: 'product',
                        },
                        {
                          _id: '__PRODUCT_2_ID__',
                          _index: 'catalog_live',
                          _score: 1,
                          _source: {
                            id: '__PRODUCT_2_ID__',
                            name: '__PRODUCT_2_NAME__',
                            type: 'product',
                            fields: {
                              finishSwatch: {
                                value: {
                                  name: '__PRODUCT_2_NAME__',
                                  id: '__PRODUCT_2_ID__',
                                },
                                id: '__PRODUCT_2_ID__',
                              },
                            },
                          },
                          _type: 'product',
                        },
                      ],
                      max_score: 1,
                    },
                    aggregations: {
                      __FACET_TERM_1__: {
                        meta: {
                          source: {
                            name: '__FACET_TERM_1__',
                            metadata: {
                              type: 'terms',
                              isFullySupported: true,
                            },
                            aggregation: {
                              terms: {
                                field: '__FACET_TERM_1_FIELD__',
                                size: 1,
                                min_doc_count: 1,
                              },
                              aggs: {},
                            },
                            id: '__FACET_TERM_1_ID__',
                            displayName: '__FACET_TERM_1_DISPLAY_NAME__',
                          },
                        },
                        doc_count_error_upper_bound: 0,
                        sum_other_doc_count: 0,
                        buckets: [
                          {
                            key: '__FACET_TERM_1_BUCKET_1__',
                            doc_count: 1,
                          },
                          {
                            key: '__FACET_TERM_1_BUCKET_2__',
                            doc_count: 1,
                          },
                        ],
                      },
                    },
                  },
                  type: 'SearchResponseAnswer',
                },
              },
            },
          }),
      })
    )
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches products and sets the data correctly', async () => {
    const { result } = renderHook(() => useProducts(credentials, queryParams))

    expect(result.current.isLoading).toBeTruthy()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    expect(fetch).toHaveBeenCalledWith(
      `${credentials.apiEndpoint}/v1/search/routes/catalog_live/search`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-upstart-api-key': credentials.apiKey,
          'X-Upstart-Site': credentials.siteId,
          'X-Upstart-Tenant': credentials.tenantId,
        }),
      })
    )

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.products).toEqual([
      {
        _id: '__PRODUCT_1_ID__',
        _index: 'catalog_live',
        _score: 1,
        _source: {
          id: '__PRODUCT_1_ID__',
          name: '__PRODUCT_1_NAME__',
          type: 'product',
          fields: {
            finishSwatch: {
              value: {
                name: '__PRODUCT_1_NAME__',
                id: '__PRODUCT_1_ID__',
              },
              id: '__PRODUCT_1_ID__',
            },
          },
        },
        _type: 'product',
      },
      {
        _id: '__PRODUCT_2_ID__',
        _index: 'catalog_live',
        _score: 1,
        _source: {
          id: '__PRODUCT_2_ID__',
          name: '__PRODUCT_2_NAME__',
          type: 'product',
          fields: {
            finishSwatch: {
              value: {
                name: '__PRODUCT_2_NAME__',
                id: '__PRODUCT_2_ID__',
              },
              id: '__PRODUCT_2_ID__',
            },
          },
        },
        _type: 'product',
      },
    ])
  })

  it('sets error and stops loading if the request fails', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Error Message' }),
      })
    )

    const { result } = renderHook(() => useProducts(credentials, queryParams))

    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.error).toBeTruthy()
    expect(result.current.products).toEqual([])
  })
})
