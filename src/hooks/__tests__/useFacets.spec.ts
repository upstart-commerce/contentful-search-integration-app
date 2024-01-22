import { renderHook, waitFor } from '@testing-library/react'

import useFacets from '../useFacets'

const credentials = {
  apiEndpoint: 'test-api-endpoint',
  apiKey: 'test-api-key',
  siteId: 'test-site-id',
  tenantId: 'test-tenant-id',
}

const queryParams = {
  size: 10,
}

describe('useFacets', () => {
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

  it('fetches facets and sets the data correctly', async () => {
    const { result } = renderHook(() => useFacets(credentials, queryParams))

    expect(result.current.isLoading).toBeTruthy()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    expect(result.current.facets).toEqual({
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
    })
  })

  it('sets error and stops loading if the request fails', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Error Message' }),
      })
    )

    const { result } = renderHook(() => useFacets(credentials, queryParams))

    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.error).toBeTruthy()
    expect(result.current.facets).toEqual({})
  })
})
