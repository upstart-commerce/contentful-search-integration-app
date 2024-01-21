import tokens from '@contentful/f36-tokens'
import { css } from 'emotion'

export const styles = {
  placeholder: css`
    input::placeholder {
      color: ${tokens.gray900};
    }
  `,
  iconMargin: css({ marginRight: '10px' }),
  emptyDiv: css({ marginRight: '10px', width: tokens.spacingM, height: tokens.spacingM }),
}
