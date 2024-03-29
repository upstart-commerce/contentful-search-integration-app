import { Autocomplete as AutocompleteBase, Box, Flex } from '@contentful/f36-components'
import { DoneIcon } from '@contentful/f36-icons'
import { useCallback, useMemo, useState } from 'react'

import type { BucketProps } from '../types'
import { itemToString } from '../utils/validateParameters'
import { styles } from './Autocomplete.styles'

interface AutocompleteProps {
  items: BucketProps[]
  selected: string[]
  onChange: (items: string[]) => void
}

export default function Autocomplete({ items, onChange, selected }: AutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>(selected)
  const [validSelectedItems, setValidSelectedItems] = useState(
    selected.filter((item) => items.find((bucket) => itemToString(bucket) === item))
  )
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      itemToString(item).toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])

  const hasSelectedItemsPlaceholder = useCallback(() => {
    if (isOpen) {
      return 'Type to search'
    }
    if (!validSelectedItems.length) {
      return 'Select one or more items'
    }

    const itemText =
      validSelectedItems.length > 1
        ? `${validSelectedItems[0]} and ${validSelectedItems.length - 1} more`
        : validSelectedItems[0]
    return `Selected: ${itemText}`
  }, [validSelectedItems, isOpen])

  const handleInputValueChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleSelectItem = useCallback(
    (item: BucketProps) => {
      const itemString = itemToString(item)
      const updatedSelectedItems = selectedItems.includes(itemString)
        ? selectedItems.filter((i) => i !== itemString)
        : [...selectedItems, itemString]

      setSelectedItems(updatedSelectedItems)
      setValidSelectedItems(
        updatedSelectedItems.filter((item) => items.find((bucket) => itemToString(bucket) === item))
      )
      onChange(updatedSelectedItems)
    },
    [selectedItems, onChange, items]
  )

  return (
    <AutocompleteBase
      items={filteredItems}
      className={validSelectedItems.length > 0 ? styles.placeholder : ''}
      listWidth="full"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      placeholder={hasSelectedItemsPlaceholder()}
      onInputValueChange={handleInputValueChange}
      onSelectItem={handleSelectItem}
      itemToString={itemToString}
      renderItem={(item) => (
        <Flex alignItems="center">
          {validSelectedItems.includes(itemToString(item)) ? (
            <DoneIcon size="tiny" className={styles.iconMargin} />
          ) : (
            <div className={styles.emptyDiv}></div>
          )}
          <Box as="span" display="inline">
            {itemToString(item)}
          </Box>
        </Flex>
      )}
      textOnAfterSelect="clear"
      closeAfterSelect={false}
      testId="Autocomplete"
    />
  )
}
