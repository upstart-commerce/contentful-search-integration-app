import type { ConfigAppSDK } from '@contentful/app-sdk'
import { Form, Heading } from '@contentful/f36-components'
import { Workbench } from '@contentful/f36-workbench'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useCallback, useEffect, useState } from 'react'

import FormInput from '../components/FormInput'
import type { Credentials, Input } from '../types'
import { validateParameters } from '../utils'

const inputs: Input[] = [
  {
    label: 'API key',
    id: 'apiKey',
    helpText: 'The API key of the Upstart API.',
  },
  {
    label: 'Site ID',
    id: 'siteId',
    helpText: 'The Site ID of the Upstart API.',
  },
  {
    label: 'Tenant ID',
    id: 'tenantId',
    helpText: 'The Tenant ID of the Upstart API.',
  },
]

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<Credentials>({
    apiKey: '',
    siteId: '',
    tenantId: '',
  })

  const sdk = useSDK<ConfigAppSDK>()

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState()

    const error = validateParameters(parameters)
    if (error != null) {
      sdk.notifier.error(error)
      return false
    }

    return {
      parameters,
      targetState: currentState,
    }
  }, [parameters, sdk])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParameters({
      ...parameters,
      [e.currentTarget.id]: e.currentTarget.value,
    })
  }

  useEffect(() => {
    sdk.app.onConfigure(onConfigure)
  }, [sdk, onConfigure])

  useEffect(() => {
    ;(async () => {
      const currentParameters: Credentials | null = await sdk.app.getParameters()

      if (currentParameters) {
        setParameters(currentParameters)
      }

      sdk.app.setReady()
    })()
  }, [sdk])

  return (
    <Workbench.Content>
      <Form>
        <Heading>App configuration</Heading>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            input={input}
            value={parameters[input.id]}
            isInvalid={!parameters[input.id].length}
            onInputChange={onInputChange}
          />
        ))}
      </Form>
    </Workbench.Content>
  )
}

export default ConfigScreen
