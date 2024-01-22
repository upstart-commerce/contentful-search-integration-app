import tokens from '@contentful/f36-tokens'
import { css } from 'emotion'

const FACET_HEIGHT = 92

const calculateHeight = (numberOfLines: number) => numberOfLines * FACET_HEIGHT + 1

export const styles = {
  dialogContainer: css({
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
  skeleton: (numberOfLines: number) =>
    css({
      overflowY: 'auto',
      height: calculateHeight(numberOfLines),
    }),
}
