import React, { useCallback, useEffect, useState } from 'react';
import { Paragraph, Accordion, Text, Checkbox, Button, Autocomplete, FormControl, AutocompleteProps, Flex, Box, } from '@contentful/f36-components';
import { DoneIcon } from '@contentful/f36-icons';

interface BucketProps {
  doc_count: number;
  key: number;
  key_as_string?: string;
}
export interface CustomAutocompleteProps {
  items: BucketProps[];
  onChange: (items: string[]) => void;
}

function CustomAutocomplete(props: CustomAutocompleteProps) {
  const [filteredItems, setFilteredItems] = useState(props.items);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpenPlaceholder = 'Type to search';
  const noSelectedItemsPlaceholder = 'Select one or more items';
  const hasSelectedItemsPlaceholder = useCallback(() => {
    if (isOpen) {
      return onOpenPlaceholder;
    }
    if (selectedItems.length === 0) {
      return noSelectedItemsPlaceholder;
    }

    const leftoverCount = selectedItems.length - 1;
    if (leftoverCount === 0) {
      return `Selected: ${selectedItems[0]}`
    }
    return `Selected: ${selectedItems[0]} and ${leftoverCount} more`;
  }, [selectedItems, isOpen])

  const handleInputValueChange = (value: string) => {
    const newFilteredItems = props.items.filter((item) =>
      (item.key_as_string || String(item.key)).toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredItems(newFilteredItems);
  };

  const handleSelectItem = (item: BucketProps) => {
    let updatedSelectedItems = [];
    if (selectedItems.includes(item.key_as_string || String(item.key))) {
      updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem !== (item.key_as_string || String(item.key)));
    }
    updatedSelectedItems = [...selectedItems, (item.key_as_string || String(item.key))];
    
    setSelectedItems(updatedSelectedItems);

    if (typeof props.onChange === 'function') {
      props.onChange(updatedSelectedItems);
    }
  };

  return (
    <Autocomplete
      items={filteredItems}
      listWidth="full"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      placeholder={hasSelectedItemsPlaceholder()}
      onInputValueChange={handleInputValueChange}
      onSelectItem={handleSelectItem}
      itemToString={(item) => item.key_as_string || String(item.key)}
      renderItem={(b) => {
        return (
          <Flex alignItems="center">
            {selectedItems.includes(b.key_as_string || String(b.key)) ? <DoneIcon size="tiny" style={{marginRight: '10px'}} /> : <div style={{marginRight: '10px', width: '16px', height: '16px'}}></div>}
            <Box as="span" display="inline">{b.key_as_string || String(b.key)}</Box>
          </Flex>
        )
      }}
      textOnAfterSelect="clear"
      closeAfterSelect={false}
    />
  )
}

export default CustomAutocomplete;