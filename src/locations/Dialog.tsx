import type { DialogAppSDK } from '@contentful/app-sdk'
import {
  Button,
  FormControl,
  Paragraph,
  SkeletonBodyText,
  SkeletonContainer,
  Stack,
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
  const { isLoading, error, facets } = useFacets(credentials, { size: QUERY_SIZE })

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

  if (error) {
    return <Paragraph>Connection to API failed</Paragraph>
  }

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
