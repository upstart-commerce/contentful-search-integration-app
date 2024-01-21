import tokens from '@contentful/f36-tokens'
import { css } from 'emotion'

export const styles = {
  facetsContainer: css({
    position: 'relative',
    height: 'calc(100vh - 72px)',
    overflow: 'auto',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '20px',
  }),
  buttonsContainer: css({
    padding: tokens.spacingM,
    justifyContent: 'flex-end',
  }),
}
