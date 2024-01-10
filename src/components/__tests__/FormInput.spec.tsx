import { FormControl, TextInput } from '@contentful/f36-components'
import { fireEvent, render, screen } from '@testing-library/react'

const item = {
  input: {
    id: '__ID__',
    label: '__LABEL__',
    helpText: '__HELP_TEXT__',
  },
  value: '__VALUE__',
}

describe('FormInput', () => {
  const onChangeMock = jest.fn()
  const isInvalid = false

  beforeEach(() => {
    jest.clearAllMocks()

    render(
      <FormControl isRequired isInvalid={isInvalid}>
        <FormControl.Label aria-label={item.input.id} htmlFor={item.input.id}>
          {item.input.label}
        </FormControl.Label>
        <TextInput
          id={item.input.id}
          name={item.input.id}
          testId={item.input.id}
          size="small"
          value={item.value}
          onChange={onChangeMock}
        />
        {!!isInvalid && (
          <FormControl.ValidationMessage>
            {item.input.label} is required.
          </FormControl.ValidationMessage>
        )}
        <FormControl.HelpText>{item.input.helpText}</FormControl.HelpText>
      </FormControl>
    )
  })

  it('displays the ID', () => {
    expect(screen.getByLabelText('__ID__')).toBeInTheDocument()
  })

  it('displays the label', () => {
    expect(screen.getByText('__LABEL__')).toBeInTheDocument()
  })

  it('displays the help text', () => {
    expect(screen.getByText('__HELP_TEXT__')).toBeInTheDocument()
  })

  it('displays the value', () => {
    expect(screen.getByDisplayValue('__VALUE__')).toBeInTheDocument()
  })

  it('handles onChange behaviour', () => {
    fireEvent.change(screen.getByTestId('__ID__'), {
      target: {
        value: '__NEW_VALUE__',
      },
    })

    expect(onChangeMock).toHaveBeenCalled()
  })
})
