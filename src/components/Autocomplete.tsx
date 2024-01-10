import { Autocomplete as AutocompleteBase, Box, Flex } from '@contentful/f36-components'
import { DoneIcon } from '@contentful/f36-icons'
import { useCallback, useMemo, useState } from 'react'

import type { BucketProps } from '../types'
import { itemToString } from '../utils'

interface AutocompleteProps {
  items: BucketProps[]
  selected: string[]
  onChange: (items: string[]) => void
}

export default function Autocomplete({ items, onChange, selected }: AutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>(selected)
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
    if (!selectedItems.length) {
      return 'Select one or more items'
    }

    const itemText =
      selectedItems.length > 1
        ? `${selectedItems[0]} and ${selectedItems.length - 1} more`
        : selectedItems[0]
    return `Selected: ${itemText}`
  }, [selectedItems, isOpen])

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
      onChange(updatedSelectedItems)
    },
    [selectedItems, onChange]
  )

  return (
    <AutocompleteBase
      items={filteredItems}
      listWidth="full"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      placeholder={hasSelectedItemsPlaceholder()}
      onInputValueChange={handleInputValueChange}
      onSelectItem={handleSelectItem}
      itemToString={itemToString}
      renderItem={(item) => (
        <Flex alignItems="center">
          {selectedItems.includes(itemToString(item)) ? (
            <DoneIcon size="tiny" style={{ marginRight: '10px' }} />
          ) : (
            <div style={{ marginRight: '10px', width: '16px', height: '16px' }}></div>
          )}
          <Box as="span" display="inline">
            {itemToString(item)}
          </Box>
        </Flex>
      )}
      textOnAfterSelect="clear"
      closeAfterSelect={false}
    />
  )
}
