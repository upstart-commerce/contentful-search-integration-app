import type { FieldAppSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  Card,
  EntityList,
  Paragraph,
  SkeletonBodyText,
  SkeletonContainer,
  SkeletonImage,
  Stack,
  Text,
} from '@contentful/f36-components'
import tokens from '@contentful/f36-tokens'
import { useSDK } from '@contentful/react-apps-toolkit'
import { css } from 'emotion'
import { useCallback, useEffect, useState } from 'react'

import { PRODUCTS_QUANTITY } from '../constants'
import useProducts from '../hooks/useProducts'
import type { Credentials, DialogInvocationParameters } from '../types'

const Field = () => {
  const sdk = useSDK<FieldAppSDK>()
  const defaultValues = {
    selected: undefined,
    quantity: PRODUCTS_QUANTITY,
    title: '',
  }
  const [fieldValues, setFieldValues] = useState<DialogInvocationParameters>({
    ...defaultValues,
    ...(sdk.field.getValue() as DialogInvocationParameters),
  })

  const credentials = sdk.parameters.installation as Credentials
  const { isLoading, products } = useProducts(credentials, {
    size: fieldValues.quantity,
    facets: fieldValues.selected,
  })

  const handleDialogOpen = useCallback(async () => {
    const result = await sdk.dialogs.openCurrentApp({
      position: 'center',
      title: 'App Title',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      width: 640,
      minHeight: 'calc(100vh - 200px)',
      parameters: fieldValues,
    })

    if (result) {
      sdk.field.setValue(result)
    }
  }, [sdk.dialogs, sdk.field])

  useEffect(() => {
    sdk.field.onValueChanged((val) => {
      if (val) {
        setFieldValues(val)
      }
    })
  }, [sdk])

  if (sdk.field.type !== 'Object') {
    return <Paragraph>Expected field type: Object</Paragraph>
  }

  return (
    <Box>
      {isLoading && (
        <div className={css({ position: 'relative', maxHeight: '50px' })}>
          <SkeletonContainer>
            <SkeletonImage height={50} width={50} />
            <SkeletonBodyText offsetLeft={55} />
          </SkeletonContainer>
        </div>
      )}
      {!isLoading && fieldValues.selected === undefined && (
        <Card
          style={{
            padding: tokens.spacingXl,
            border: `1px dashed ${tokens.gray500}`,
          }}
        >
          <Stack
            style={{ zIndex: tokens.zIndexNotification }}
            flexDirection="column"
            alignItems="center"
          >
            <Button onClick={handleDialogOpen}>
              <Stack>
                <Text fontWeight="fontWeightDemiBold">Select facets</Text>
              </Stack>
            </Button>
          </Stack>
        </Card>
      )}
      {!isLoading && !fieldValues.selected === undefined && Boolean(products.length) && (
        <Box>
          <EntityList>
            {products.map(({ _source }, i) => {
              const { uri = '', altText = '' } = _source.media
                ? Object.values(_source.media)[0]
                : {}
              return (
                <EntityList.Item
                  key={i}
                  title={_source.name}
                  thumbnailUrl={uri}
                  thumbnailAltText={altText}
                />
              )
            })}
          </EntityList>
          <Button
            onClick={handleDialogOpen}
            style={{
              marginTop: tokens.spacingXs,
            }}
          >
            Select facets
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Field
