import type { DialogAppSDK } from '@contentful/app-sdk'
import {
  Button,
  FormControl,
  SkeletonBodyText,
  SkeletonContainer,
  Stack,
  TextInput,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useState } from 'react'

import Autocomplete from '../components/Autocomplete'
import { QUERY_SIZE } from '../constants'
import useFacets from '../hooks/useFacets'
import type { Aggregation, Credentials, DialogInvocationParameters } from '../types'
import { styles } from './Dialog.styles'

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>()
  const credentials = sdk.parameters.installation as Credentials
  const [fieldValues, setFieldValues] = useState<DialogInvocationParameters>(
    sdk.parameters.invocation as DialogInvocationParameters
  )
  // const { isLoading, facets } = useFacets(credentials, { size: QUERY_SIZE })

  const isLoading = false
  const facets = {
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
    __FACET_TERM_2__: {
      meta: {
        source: {
          name: '__FACET_TERM_2__',
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
        },
      },
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: '__FACET_TERM_2_BUCKET_1__',
          doc_count: 1,
        },
        {
          key: '__FACET_TERM_2_BUCKET_2__',
          doc_count: 1,
        },
      ],
    },
    __FACET_TERM_3__: {
      meta: {
        source: {
          name: '__FACET_TERM_3__',
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
        },
      },
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: '__FACET_TERM_3_BUCKET_1__',
          doc_count: 1,
        },
        {
          key: '__FACET_TERM_3_BUCKET_2__',
          doc_count: 1,
        },
      ],
    },
    __FACET_TERM_4__: {
      meta: {
        source: {
          name: '__FACET_TERM_4__',
          metadata: {
            type: 'terms',
            isFullySupported: true,
          },
          aggregation: {
            terms: {
              field: '__FACET_TERM_4_FIELD__',
              size: 1,
              min_doc_count: 1,
            },
            aggs: {},
          },
          id: '__FACET_TERM_4_ID__',
          displayName: '__FACET_TERM_4_DISPLAY_NAME__',
        },
      },
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: '__FACET_TERM_4_BUCKET_1__',
          doc_count: 1,
        },
        {
          key: '__FACET_TERM_4_BUCKET_2__',
          doc_count: 1,
        },
      ],
    },
    __FACET_TERM_5__: {
      meta: {
        source: {
          name: '__FACET_TERM_5__',
          metadata: {
            type: 'terms',
            isFullySupported: true,
          },
          aggregation: {
            terms: {
              field: '__FACET_TERM_5_FIELD__',
              size: 1,
              min_doc_count: 1,
            },
            aggs: {},
          },
          id: '__FACET_TERM_5_ID__',
          displayName: '__FACET_TERM_5_DISPLAY_NAME__',
        },
      },
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: '__FACET_TERM_5_BUCKET_1__',
          doc_count: 1,
        },
        {
          key: '__FACET_TERM_5_BUCKET_2__',
          doc_count: 1,
        },
      ],
    },
    __FACET_TERM_6__: {
      meta: {
        source: {
          name: '__FACET_TERM_6__',
          metadata: {
            type: 'terms',
            isFullySupported: true,
          },
          aggregation: {
            terms: {
              field: '__FACET_TERM_6_FIELD__',
              size: 1,
              min_doc_count: 1,
            },
            aggs: {},
          },
          id: '__FACET_TERM_6_ID__',
          displayName: '__FACET_TERM_6_DISPLAY_NAME__',
        },
      },
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: '__FACET_TERM_6_BUCKET_1__',
          doc_count: 1,
        },
        {
          key: '__FACET_TERM_6_BUCKET_2__',
          doc_count: 1,
        },
      ],
    },
    __FACET_TERM_7__: {
      meta: {
        source: {
          name: '__FACET_TERM_7__',
          metadata: {
            type: 'terms',
            isFullySupported: true,
          },
          aggregation: {
            terms: {
              field: '__FACET_TERM_7_FIELD__',
              size: 1,
              min_doc_count: 1,
            },
            aggs: {},
          },
          id: '__FACET_TERM_7_ID__',
          displayName: '__FACET_TERM_7_DISPLAY_NAME__',
        },
      },
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: '__FACET_TERM_7_BUCKET_1__',
          doc_count: 1,
        },
        {
          key: '__FACET_TERM_7_BUCKET_2__',
          doc_count: 1,
        },
      ],
    },
  } as any as { [key: string]: Aggregation }

  const handleSelectItem = (selectedFacet: Aggregation, selectedBuckets: string[]) => {
    const updatedFieldValues = { ...fieldValues }

    if (selectedBuckets.length) {
      updatedFieldValues.selected = {
        ...updatedFieldValues.selected,
        [selectedFacet.meta.source.name]: {
          filter: selectedFacet.meta.source,
          buckets: selectedBuckets,
        },
      }
    } else {
      const { [selectedFacet.meta.source.name]: ignored, ...rest } = updatedFieldValues.selected
      updatedFieldValues.selected = rest
    }

    setFieldValues(updatedFieldValues)
  }

  const getSelectedBuckets = ({ meta }: Aggregation): string[] => {
    const name = meta.source.name
    return fieldValues.selected &&
      name in fieldValues.selected &&
      fieldValues.selected[name].buckets
      ? fieldValues.selected[name].buckets
      : []
  }

  const facetsList = Object.values(facets).filter((facet) => facet.buckets.length > 0)

  return isLoading ? (
    <SkeletonContainer>
      <SkeletonBodyText numberOfLines={5} />
    </SkeletonContainer>
  ) : (
    <>
      <div className={styles.facetsContainer}>
        {facetsList.map((facet) => {
          return (
            <div key={facet.meta.source.id}>
              <FormControl>
                <FormControl.Label>{facet.meta.source.displayName}</FormControl.Label>
                <Autocomplete
                  items={facet.buckets}
                  onChange={(items) => handleSelectItem(facet, items)}
                  selected={getSelectedBuckets(facet)}
                />
              </FormControl>
            </div>
          )
        })}
      </div>
      <Stack className={styles.buttonsContainer}>
        <Button variant="secondary" onClick={() => sdk.close(sdk.parameters.invocation?.valueOf())}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => sdk.close(fieldValues)}>
          Save
        </Button>
      </Stack>
    </>
  )
}

export default Dialog
