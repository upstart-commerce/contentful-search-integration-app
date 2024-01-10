import { fireEvent, render, waitFor } from '@testing-library/react'

import Autocomplete from '../Autocomplete'

const items = [
  { key: 1, key_as_string: 'Item1', doc_count: 10 },
  { key: 2, key_as_string: 'Item2', doc_count: 20 },
]

describe('Autocomplete Component', () => {
  let mockOnChange: jest.Mock

  beforeEach(() => {
    mockOnChange = jest.fn()
  })

  it('selects items', () => {
    const { getByText, getByRole } = render(
      <Autocomplete items={items} selected={[]} onChange={mockOnChange} />
    )

    fireEvent.click(getByRole('textbox'))
    fireEvent.click(getByText('Item1'))

    expect(mockOnChange).toHaveBeenCalledWith(['Item1'])
  })

  it('calls onChange when an item is selected', () => {
    const { getByText, getByRole } = render(
      <Autocomplete items={items} selected={[]} onChange={mockOnChange} />
    )

    fireEvent.click(getByRole('textbox'))
    fireEvent.click(getByText('Item1'))
    expect(mockOnChange).toHaveBeenCalledWith(['Item1'])
  })

  it('filters items based on input value', async () => {
    const { getByRole, getByText, queryByText } = render(
      <Autocomplete items={items} selected={[]} onChange={mockOnChange} />
    )

    fireEvent.click(getByRole('textbox'))
    fireEvent.change(getByRole('textbox'), { target: { value: 'Item2' } })

    await waitFor(() => {
      expect(queryByText('Item1')).not.toBeInTheDocument()
      expect(getByText('Item2')).toBeInTheDocument()
    })
  })
})
