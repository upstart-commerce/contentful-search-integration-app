import type { Facets } from '../../types'
import { buildFilters } from '../filters'

describe('buildFilters', () => {
  it('should build filters for appropriate filter type', () => {
    const facets: Facets = {
      __TERM_FACET__: {
        filter: {
          name: '__TERM_FACET__',
          id: '__TERM_FACET_ID__',
          displayName: '__TERM_FACET_NAME__',
          metadata: {
            type: 'terms',
            isFullySupported: true,
          },
          aggregation: {
            terms: {
              field: '__TERM_FACET_FIELD__',
              size: 500,
              min_doc_count: 1,
            },
          },
          missing: '',
        },
        buckets: ['__BUCKET_1__', '__BUCKET_2__'],
      },
      __TERM_FACET_WITH_MERGED_FIELDS__: {
        filter: {
          name: '__TERM_FACET_WITH_MERGED_FIELDS__',
          id: '__TERM_FACET_WITH_MERGED_FIELDS_ID__',
          displayName: '__TERM_FACET_WITH_MERGED_FIELDS_NAME__',
          metadata: {
            type: 'terms',
            'merged-fields': [
              '__TERM_FACET_WITH_MERGED_FIELDS_1__',
              '__TERM_FACET_WITH_MERGED_FIELDS_2__',
            ],
            isFullySupported: true,
          },
          aggregation: {
            terms: {
              size: 10,
              min_doc_count: 1,
            },
          },
          missing: '',
        },
        buckets: ['__BUCKET_3__', '__BUCKET_4__'],
      },
      __TERM_FACET_WITH_MISSING__: {
        filter: {
          name: '__TERM_FACET_WITH_MISSING__',
          id: '__TERM_FACET_WITH_MISSING_ID__',
          displayName: '__TERM_FACET_WITH_MISSING_NAME__',
          metadata: {
            type: 'terms',
            isFullySupported: true,
          },
          aggregation: {
            terms: {
              field: '__TERM_FACET_FIELD__',
              size: 10,
              min_doc_count: 1,
            },
          },
          missing: '__MISSING__',
        },
        buckets: ['__BUCKET_5__', '__BUCKET_6__'],
      },
      __HISTOGRAM_FACET__: {
        filter: {
          name: '__HISTOGRAM_FACET__',
          id: '__HISTOGRAM_FACET_ID__',
          displayName: '__HISTOGRAM_FACET_NAME__',
          metadata: {
            type: 'histogram',
            isFullySupported: true,
          },
          aggregation: {
            histogram: {
              field: '__HISTOGRAM_FACET_FIELD__',
              interval: 100,
              min_doc_count: 1,
              extended_bounds: {
                max: 1000,
                min: 0,
              },
            },
          },
        },
        buckets: ['1.0', '2.0'],
      },
      __DATE_HISTOGRAM_FACET__: {
        filter: {
          name: '__DATE_HISTOGRAM_FACET__',
          id: '__DATE_HISTOGRAM_FACET_ID__',
          displayName: '__DATE_HISTOGRAM_FACET_NAME__',
          metadata: {
            type: 'date_histogram',
            shoud: 'gt',
            isFullySupported: true,
          },
          aggregation: {
            date_histogram: {
              field: '__DATE_HISTOGRAM_FACET_FIELD__',
              fixed_interval: '1d',
            },
          },
        },
        buckets: ['2020-01-01', '2020-01-02'],
      },
      __RANGE_FACET__: {
        filter: {
          name: '__RANGE_FACET__',
          id: '__RANGE_FACET_ID__',
          displayName: '__RANGE_FACET_NAME__',
          metadata: {
            type: 'range',
            isFullySupported: true,
          },
          aggregation: {
            range: {
              field: '__RANGE_FACET_FIELD__',
              ranges: [
                {
                  from: 2.0,
                  key: '2 and UP',
                },
                {
                  from: 1.0,
                  key: '1 to 5',
                  to: 5.0,
                },
                {
                  from: 4.0,
                  key: '4 to 5',
                  to: 5.0,
                },
              ],
            },
          },
        },
        buckets: ['2 and UP', '4 to 5'],
      },
    }

    const result = buildFilters(facets)
    const expected = [
      {
        bool: {
          must: { terms: { __TERM_FACET_FIELD__: ['__BUCKET_1__', '__BUCKET_2__'] } },
        },
      },
      {
        bool: {
          should: [
            { terms: { __TERM_FACET_WITH_MERGED_FIELDS_1__: ['__BUCKET_3__', '__BUCKET_4__'] } },
            { terms: { __TERM_FACET_WITH_MERGED_FIELDS_2__: ['__BUCKET_3__', '__BUCKET_4__'] } },
          ],
        },
      },
      {
        bool: {
          must: { terms: { __TERM_FACET_FIELD__: ['__BUCKET_5__', '__BUCKET_6__'] } },
        },
      },
      {
        bool: {
          should: [
            {
              range: {
                __HISTOGRAM_FACET_FIELD__: {
                  gte: 1,
                  lt: 101,
                },
              },
            },
            {
              range: {
                __HISTOGRAM_FACET_FIELD__: {
                  gte: 2,
                  lt: 102,
                },
              },
            },
          ],
        },
      },
      {
        bool: {
          should: {
            range: {
              __DATE_HISTOGRAM_FACET_FIELD__: {
                gt: ['2020-01-01', '2020-01-02'],
              },
            },
          },
        },
      },
      {
        bool: {
          should: [
            {
              range: {
                __RANGE_FACET_FIELD__: {
                  gte: 2.0,
                  lte: undefined,
                },
              },
            },
            {
              range: {
                __RANGE_FACET_FIELD__: {
                  gte: 4.0,
                  lte: 5.0,
                },
              },
            },
          ],
        },
      },
    ]

    expect(result).toEqual(expected)
  })

  it('should return empty array when facets is undefined', () => {
    expect(buildFilters(undefined)).toEqual([])
  })
})
