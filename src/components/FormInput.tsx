import { FormControl, TextInput } from '@contentful/f36-components'

import type { FormInputProps } from '../types'

const FormInput = ({ input, value, isInvalid, onInputChange }: FormInputProps) => (
  <FormControl isRequired isInvalid={isInvalid}>
    <FormControl.Label aria-label={input.id} htmlFor={input.id}>
      {input.label}
    </FormControl.Label>
    <TextInput
      id={input.id}
      name={input.id}
      testId={input.id}
      size="small"
      value={value}
      onChange={onInputChange}
    />
    {!!isInvalid && (
      <FormControl.ValidationMessage>{input.label} is required.</FormControl.ValidationMessage>
    )}
    <FormControl.HelpText>{input.helpText}</FormControl.HelpText>
  </FormControl>
)

export default FormInput
