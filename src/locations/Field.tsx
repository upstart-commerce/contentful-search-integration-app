import type { FieldAppSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Paragraph,
  SkeletonContainer,
  SkeletonDisplayText,
  TextInput,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ProductsList from '../components/ProductsList'
import { MAX_VISIBLE_PRODUCTS, PRODUCTS_QUANTITY } from '../constants'
import useProducts from '../hooks/useProducts'
import type { Credentials, DialogInvocationParameters } from '../types'
import { styles } from './Field.styles'

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
  const { isLoading, error, products } = useProducts(credentials, {
    size: fieldValues.quantity,
    facets: fieldValues.selected,
  })

  const numberOfLines = Math.min(products.length || 1, fieldValues.quantity, MAX_VISIBLE_PRODUCTS)

  const handleDialogOpen = useCallback(async () => {
    const result = await sdk.dialogs.openCurrentApp({
      position: 'center',
      title: 'Select facets',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      width: styles.dialogWidth,
      minHeight: styles.dialogMinHeight,
      parameters: fieldValues,
    })

    if (result) {
      sdk.field.setValue(result)
    }
  }, [sdk.dialogs, sdk.field, fieldValues])

  const handleFacetsReset = async () => {
    setFieldValues((prevValues) => ({ ...prevValues, selected: defaultValues.selected }))
    try {
      await sdk.field.setValue({ ...fieldValues, selected: defaultValues.selected })
    } catch (error) {
      console.error('Failed to reset the selected facets:', error)
    }
  }

  const handleTitleChange = useMemo(
    () =>
      debounce((value: string) => {
        const updatedValues = { ...fieldValues, title: value }
        setFieldValues(updatedValues)
        sdk.field.setValue(updatedValues)
      }, 100),
    [fieldValues, sdk]
  )

  const handleQuantityChange = useMemo(
    () =>
      debounce((value: number) => {
        const updatedValues = { ...fieldValues, quantity: value }
        setFieldValues(updatedValues)
        sdk.field.setValue(updatedValues)
      }, 100),
    [fieldValues, sdk]
  )

  useEffect(() => {
    sdk.field.onValueChanged((val) => {
      if (val) {
        setFieldValues(val)
      }
    })
  }, [sdk])

  useEffect(() => {
    if (products) {
      sdk.window.updateHeight(styles.fieldHeight(numberOfLines))
    }
  }, [products, sdk])

  if (sdk.field.type !== 'Object') {
    return <Paragraph>Expected field type: Object</Paragraph>
  }

  if (error) {
    return <Paragraph>Connection to API failed</Paragraph>
  }

  return (
    <>
      <Box className={styles.selectFacetsButtonContainer}>
        <Box className={styles.selectFacetsButton}>
          <ButtonGroup variant="spaced" spacing="spacingM">
            <Button variant="secondary" size="small" onClick={handleDialogOpen}>
              Select facets
            </Button>
            <Button variant="negative" size="small" onClick={handleFacetsReset}>
              Reset
            </Button>
          </ButtonGroup>
        </Box>
        <Box className={styles.inputsContainer}>
          <FormControl className={styles.titleInputFormControl}>
            <FormControl.Label>Title</FormControl.Label>
            <TextInput
              value={fieldValues.title}
              type="text"
              name="title"
              onChange={(e) => handleTitleChange(e.target.value)}
              testId="title"
            />
            <FormControl.HelpText>
              Title that will be displayed with list of products
            </FormControl.HelpText>
          </FormControl>
          <FormControl isRequired className={styles.quantityInputFormControl}>
            <FormControl.Label>Products quantity</FormControl.Label>
            <TextInput
              value={fieldValues.quantity?.toString()}
              type="number"
              min={1}
              name="quantity"
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              testId="quantity"
            />
            <FormControl.HelpText>Quantity of the products to display</FormControl.HelpText>
          </FormControl>
        </Box>
      </Box>
      <Box className={styles.skeleton(numberOfLines)}>
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
          <ProductsList products={products} />
        )}
      </Box>
    </>
  )
}

export default Field
