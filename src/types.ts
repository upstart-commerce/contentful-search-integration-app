import type { KeyValueMap } from 'contentful-management'

export interface Credentials {
  apiEndpoint: string
  apiKey: string
  siteId: string
  tenantId: string
}

export interface Input {
  label: string
  id: keyof Credentials
  helpText: string
}

export interface FormInputProps {
  input: Input
  value: string
  isInvalid: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface BucketProps {
  doc_count: number
  key: number
  key_as_string?: string
}

export interface FacetProps {
  terms: {
    [key: string]: string[]
  }
}

interface Weight {
  value: number
  unit: string
}

interface Dimensions {
  width: number
  length: number
  height: number
  unit: string
}

interface Seo {
  pageTitle: string
  description: string
  metaKeywords: string[]
}

export interface ProductItem {
  skuId: string
  name: string
  tags: string[]
  dynamicProperties: {
    [key: string]: string
  }
  shippingMethodIds: string[]
  ignoreInventory: boolean
  weight: Weight
  numPieces: number
  shippingPackages: {
    dimensions: Dimensions
    weight: Weight
  }[]
  purchasable: boolean
  disabled: boolean
  feeMultiplier: number
  skuDimensions: {
    name: string
    description: string
    width: number
    length: number
    height: number
    unit: string
  }[]
  type: string
}

export interface SearchResponse {
  _index: string
  _id: string
  score: string
  _source: {
    id: string
    siteIds: string[]
    typeId: string
    type: string
    typeName: string
    name: string
    brandName: string
    media?: {
      [key: string]: {
        uri?: string
        altText?: string
      }
    }
    tags: string[]
    dynamicProperties: {
      [key: string]: string
    }[]
    productItems: ProductItem[]
    relatedIds: string[]
    shippingMethodIds: string[]
    activationDate: string
    deactivationDate: string
    taxCode: string
    ignoreInventory: boolean
    hidden: boolean
    numReviews: number
    version: number
    subVersion: number
    seo: Seo
    liveDate: string
    archived: boolean
  }
}

type AggregationSourceType = 'terms' | 'histogram' | 'date_histogram' | 'range'

export type AggregationSource =
  | TermsAggregationSource
  | HistogramAggregationSource
  | DateHistogramAggregationSource
  | RangeAggregationSource

interface BaseAggregationSource {
  name: string
  id: string
  displayName: string
  metadata?: {
    type: AggregationSourceType
  }
}

export interface TermsAggregationSource extends BaseAggregationSource {
  aggregation: {
    terms: {
      field?: string
      size: number
      min_doc_count: number
    }
  }
  metadata: {
    type: 'terms'
    isFullySupported: boolean
    ['merged-fields']?: string[]
  }
  missing?: string
}

export interface HistogramAggregationSource extends BaseAggregationSource {
  aggregation: {
    histogram: {
      field: string
      interval: number
      min_doc_count: number
      extended_bounds: {
        max: number
        min: number
      }
    }
  }
  metadata: {
    type: 'histogram'
    isFullySupported: boolean
  }
}

export interface DateHistogramAggregationSource extends BaseAggregationSource {
  aggregation: {
    date_histogram: {
      field: string
      fixed_interval: string
    }
  }
  metadata: {
    type: 'date_histogram'
    shoud: string
    isFullySupported: boolean
  }
}

export interface RangeAggregationSource extends BaseAggregationSource {
  aggregation: {
    range: {
      field: string
      ranges?: {
        key: string
        from: number
        to?: number
      }[]
    }
  }
  metadata: {
    type: 'range'
    isFullySupported: boolean
  }
}

export interface Aggregation {
  meta: {
    source: AggregationSource
  }
  buckets: {
    doc_count: number
    key: number
    key_as_string?: string
  }[]
}

export interface SearchData {
  hits: {
    total: {
      relation: string
      value: number
    }
    hits: SearchResponse[]
    max_score: number
  }
  aggregations: {
    [key: string]: Aggregation
  }
}

export interface Facets {
  [key: string]: {
    filter: AggregationSource
    buckets: string[]
  }
}

export interface DialogInvocationParameters extends KeyValueMap {
  selected: Facets
  quantity: number
  title: string
}
