const mockSdk: any = {
  app: {
    onConfigure: jest.fn(),
    getParameters: jest.fn().mockReturnValueOnce({}),
    setReady: jest.fn(),
    getCurrentState: jest.fn(),
  },
  field: {
    getValue: jest.fn(),
    setValue: jest.fn(),
    onValueChanged: jest.fn(),
  },
  dialogs: {
    openCurrentApp: jest.fn(),
  },
  ids: {
    app: 'test-app',
  },
  parameters: {
    installation: {},
    invocation: {},
  },
  notifier: {
    error: jest.fn(),
  },
}

export { mockSdk }
