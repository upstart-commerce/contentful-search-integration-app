import type { FieldAppSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  Card,
  FormControl,
  Paragraph,
  SkeletonBodyText,
  SkeletonContainer,
  SkeletonDisplayText,
  SkeletonImage,
  SkeletonRow,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import tokens from '@contentful/f36-tokens'
import { useSDK } from '@contentful/react-apps-toolkit'
import { css } from 'emotion'
import isEmpty from 'lodash/isEmpty'
import { Fragment, useCallback, useEffect, useState } from 'react'

import FacetsList from '../components/FacetsList'
import { MAX_VISIBLE_PRODUCTS, PRODUCTS_QUANTITY } from '../constants'
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

  const numberOfLines = Math.min(fieldValues.quantity, MAX_VISIBLE_PRODUCTS)
  const height = numberOfLines * 64 + 1

  const handleDialogOpen = useCallback(async () => {
    const result = await sdk.dialogs.openCurrentApp({
      position: 'center',
      title: 'Select facets',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      width: 640,
      parameters: fieldValues,
    })

    if (result) {
      sdk.field.setValue(result)
    }
  }, [sdk.dialogs, sdk.field, fieldValues])

  useEffect(() => {
    sdk.field.onValueChanged((val) => {
      if (val) {
        console.log('val', val)
        setFieldValues(val)
      }
    })
  }, [sdk])

  useEffect(() => {
    if (products) {
      const inputsHeight = 198
      sdk.window.updateHeight(height + inputsHeight)
    }
  }, [products, sdk])

  if (sdk.field.type !== 'Object') {
    return <Paragraph>Expected field type: Object</Paragraph>
  }

  return (
    <Box>
      {sdk.field.type !== 'Object' ? (
        <Paragraph>Expected field type: Object</Paragraph>
      ) : isEmpty(fieldValues.selected) ? (
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
      ) : (
        <>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: tokens.spacingXs,
              paddingBottom: tokens.spacingXs,
              backgroundColor: tokens.colorWhite,
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: tokens.spacingM,
                border: `1px dashed ${tokens.gray500}`,

                marginBottom: tokens.spacingS,
              }}
            >
              <Button onClick={handleDialogOpen}>Select facets</Button>
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: tokens.spacingS,
                justifyContent: 'space-between',
              }}
            >
              <FormControl style={{ flex: 2, marginBottom: 0 }}>
                <FormControl.Label>Title</FormControl.Label>
                <TextInput
                  value={fieldValues.title}
                  type="text"
                  name="title"
                  onChange={(e) => setFieldValues({ ...fieldValues, title: e.target.value })}
                  testId="title"
                />
                <FormControl.HelpText>
                  Title that will be displayed with list of products
                </FormControl.HelpText>
              </FormControl>
              <FormControl isRequired style={{ flex: 1, marginBottom: 0 }}>
                <FormControl.Label>Products quantity</FormControl.Label>
                <TextInput
                  value={fieldValues.quantity?.toString()}
                  type="number"
                  min={1}
                  name="quantity"
                  onChange={(e) =>
                    setFieldValues({ ...fieldValues, quantity: Number(e.target.value) })
                  }
                  testId="quantity"
                />
                <FormControl.HelpText>Quantity of the products to display</FormControl.HelpText>
              </FormControl>
            </Box>
          </Box>
          <Box style={{ overflowY: 'auto', height }}>
            {isLoading ? (
              <SkeletonContainer testId="loading-skeleton">
                <SkeletonDisplayText
                  numberOfLines={numberOfLines}
                  width="100%"
                  lineHeight={56}
                  marginBottom={8}
                  offsetTop={8}
                />
              </SkeletonContainer>
            ) : (
              <FacetsList products={products} />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default Field
