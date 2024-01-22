import type { DialogAppSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  Paragraph,
  SkeletonContainer,
  SkeletonDisplayText,
  Stack,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useState } from 'react'

import FacetsList from '../components/FacetsList'
import { MAX_VISIBLE_FACETS, QUERY_SIZE } from '../constants'
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

  const numberOfLines = Math.min(
    Object.keys(facets || {}).length || MAX_VISIBLE_FACETS,
    MAX_VISIBLE_FACETS
  )

  const handleSelectItem = (selectedFacet: Aggregation, selectedBuckets: string[]) => {
    const updatedFieldValues = { ...fieldValues }

    if (selectedBuckets.length) {
      updatedFieldValues.selected = {
        ...(updatedFieldValues.selected || {}),
        [selectedFacet.meta.source.name]: {
          filter: selectedFacet.meta.source,
          buckets: selectedBuckets,
        },
      }
    } else if (updatedFieldValues.selected) {
      const { [selectedFacet.meta.source.name]: ignored, ...rest } = updatedFieldValues.selected
      updatedFieldValues.selected = rest
    }

    setFieldValues(updatedFieldValues)
  }

  const facetsList = Object.values(facets || {}).filter((facet) => facet.buckets.length > 0)

  if (error) {
    return <Paragraph>Connection to API failed</Paragraph>
  }

  return isLoading ? (
    <Box className={styles.skeleton(numberOfLines)}>
      <SkeletonContainer testId="loading-skeleton">
        <SkeletonDisplayText
          numberOfLines={numberOfLines}
          width="100%"
          lineHeight={68}
          marginBottom={24}
          offsetTop={8}
        />
      </SkeletonContainer>
    </Box>
  ) : (
    <>
      <div className={styles.dialogContainer}>
        <FacetsList
          facets={facetsList}
          fieldValues={fieldValues}
          handleSelectItem={handleSelectItem}
        />
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
