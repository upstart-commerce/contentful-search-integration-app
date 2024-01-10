import { act, renderHook } from '@testing-library/react-hooks'

import useFacets from '../useFacets'

const credentials = {
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
    const { result, waitForNextUpdate } = renderHook(() => useFacets(credentials, queryParams))

    expect(result.current.isLoading).toBeTruthy()
    await act(() => waitForNextUpdate())

    expect(result.current.isLoading).toBeFalsy()
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
})
