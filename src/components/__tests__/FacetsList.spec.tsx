import { render, screen } from '@testing-library/react'

import type { Aggregation, DialogInvocationParameters, TermsAggregationSource } from '../../types'
import FacetsList from '../FacetsList'

const mockFacets: Aggregation[] = [
  {
    meta: {
      source: {
        name: 'facet1',
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
      } as unknown as TermsAggregationSource,
    },
    buckets: [
      { doc_count: 10, key: '__FACET_TERM_1_BUCKET_1__' },
      { doc_count: 20, key: '__FACET_TERM_1_BUCKET_2__' },
    ],
  },
  {
    meta: {
      source: {
        name: 'facet2',
        metadata: {
          type: 'terms',
          isFullySupported: true,
        },
        aggregation: {
          terms: {
            field: '__FACET_TERM_2_FIELD__',
            size: 1,
            min_doc_count: 1,
          },
          aggs: {},
        },
        id: '__FACET_TERM_2_ID__',
        displayName: '__FACET_TERM_2_DISPLAY_NAME__',
      } as unknown as TermsAggregationSource,
    },
    buckets: [
      { doc_count: 10, key: '__FACET_TERM_2_BUCKET_1__' },
      { doc_count: 20, key: '__FACET_TERM_2_BUCKET_2__' },
    ],
  },
  {
    meta: {
      source: {
        name: 'facet3',
        metadata: {
          type: 'terms',
          isFullySupported: true,
        },
        aggregation: {
          terms: {
            field: '__FACET_TERM_3_FIELD__',
            size: 1,
            min_doc_count: 1,
          },
          aggs: {},
        },
        id: '__FACET_TERM_3_ID__',
        displayName: '__FACET_TERM_3_DISPLAY_NAME__',
      } as unknown as TermsAggregationSource,
    },
    buckets: [
      { doc_count: 10, key: '__FACET_TERM_3_BUCKET_1__' },
      { doc_count: 20, key: '__FACET_TERM_3_BUCKET_2__' },
    ],
  },
]

describe('FacetsList', () => {
  it('Renders appropriate facet labels and Autocomplete components', () => {
    const mockValues: DialogInvocationParameters = {
      selected: {
        facet1: {
          filter: {
            name: 'facet1',
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
          buckets: ['__FACET_TERM_1_BUCKET_1__', '__FACET_TERM_1_BUCKET_2__'],
        },
        facet2: {
          filter: {
            name: 'facet2',
            metadata: {
              type: 'terms',
              isFullySupported: true,
            },
            aggregation: {
              terms: {
                field: '__FACET_TERM_2_FIELD__',
                size: 1,
                min_doc_count: 1,
              },
            },
            id: '__FACET_TERM_2_ID__',
            displayName: '__FACET_TERM_2_DISPLAY_NAME__',
          } as TermsAggregationSource,
          buckets: ['__FACET_TERM_2_BUCKET_1__', '__FACET_TERM_2_BUCKET_2__'],
        },
      },
      quantity: 1,
      title: '',
    }

    const mockSelectItem = jest.fn()

    render(
      <FacetsList facets={mockFacets} fieldValues={mockValues} handleSelectItem={mockSelectItem} />
    )

    expect(screen.getByText('__FACET_TERM_1_DISPLAY_NAME__')).toBeInTheDocument()
    expect(screen.getByText('__FACET_TERM_2_DISPLAY_NAME__')).toBeInTheDocument()
    expect(screen.getByText('__FACET_TERM_3_DISPLAY_NAME__')).toBeInTheDocument()
  })
})
