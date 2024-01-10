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
      return {
        bool: {
          should: Object.entries(rangeFilter.aggregation.range.ranges || {}).map(
            ([rangeKey, rangeValues]) => {
              const rangeObj: {
                [key: string]: { key: string; from: number; to?: number }
              } = {}

              rangeObj[rangeKey] = {
                key: rangeValues.key,
                from: rangeValues.from,
              }

              if (rangeValues.to !== undefined) {
                rangeObj[rangeKey].to = rangeValues.to
              }

              return {
                range: rangeObj,
              }
            }
          ),
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
