import type {
  AggregationSource,
  DateHistogramAggregationSource,
  Facets,
  HistogramAggregationSource,
  RangeAggregationSource,
  TermsAggregationSource,
} from '../types'

const buildFilter = (filter: AggregationSource, buckets?: string[]) => {
  switch (filter.metadata.type) {
    case 'terms': {
      const termsFilter = filter as TermsAggregationSource

      if (!buckets || buckets.length === 0) {
        return null
      }

      if (termsFilter.metadata['merged-fields']) {
        return {
          bool: {
            should: termsFilter.metadata['merged-fields'].map((facet) => ({
              terms: { [facet]: buckets },
            })),
          },
        }
      }

      if (!termsFilter.aggregation.terms.field) {
        console.error('Field name is missing for facet', termsFilter)
        return null
      }

      return termsFilter.missing === '' && buckets && buckets[0] === ''
        ? {
            bool: {
              should: [
                { terms: { [termsFilter.aggregation.terms.field]: buckets } },
                {
                  bool: {
                    must_not: [{ exists: { field: termsFilter.aggregation.terms.field } }],
                  },
                },
              ],
            },
          }
        : { bool: { must: { terms: { [termsFilter.aggregation.terms.field]: buckets } } } }
    }

    case 'histogram': {
      const histogramFilter = filter as HistogramAggregationSource
      return {
        bool: {
          should: (buckets ?? []).map((value: string) => {
            const numericalValue = parseInt(value)
            return numericalValue
              ? {
                  range: {
                    [histogramFilter.aggregation.histogram.field]: {
                      gte: numericalValue,
                      lt: numericalValue + histogramFilter.aggregation.histogram.interval,
                    },
                  },
                }
              : null
          }),
        },
      }
    }
    case 'date_histogram': {
      const dateHistogramFilter = filter as DateHistogramAggregationSource

      if (!buckets || buckets.length === 0) {
        return null
      }

      return {
        bool: {
          should: {
            range: {
              [dateHistogramFilter.aggregation.date_histogram.field]: {
                [dateHistogramFilter.metadata.shoud]: buckets ?? '',
              },
            },
          },
        },
      }
    }

    case 'range': {
      const rangeFilter = filter as RangeAggregationSource

      if (!buckets || buckets.length === 0) {
        return null
      }

      const selectedRanges = rangeFilter.aggregation.range.ranges.filter((range) =>
        buckets.includes(range.key)
      )

      return {
        bool: {
          should: selectedRanges.map((range) => ({
            range: {
              [rangeFilter.aggregation.range.field]: {
                gte: range.from,
                lte: range.to ?? undefined,
              },
            },
          })),
        },
      }
    }

    default:
      return null
  }
}

export const buildFilters = (facets?: Facets) => {
  return Object.values(facets ?? {})
    .map(({ filter, buckets }) => buildFilter(filter, buckets))
    .filter(Boolean)
}
