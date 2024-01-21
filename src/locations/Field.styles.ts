import tokens from '@contentful/f36-tokens'
import { css } from 'emotion'

const INPUTS_HEIGHT = 198
const PRODUCT_CARD_HEIGHT = 64

const calculateHeight = (numberOfLines: number) => numberOfLines * PRODUCT_CARD_HEIGHT + 1

export const styles = {
  card: css({
    padding: tokens.spacingL,
    border: `1px dashed ${tokens.gray500}`,
  }),
  selectFacetsButton: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingM,
    border: `1px dashed ${tokens.gray500}`,
    marginBottom: tokens.spacingS,
  }),
  selectFacetsButtonContainer: css({
    display: 'flex',
    flexDirection: 'column',
    paddingTop: tokens.spacingXs,
    paddingBottom: tokens.spacingXs,
    backgroundColor: tokens.colorWhite,
  }),
  inputsContainer: css({
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingS,
    justifyContent: 'space-between',
  }),
  titleInputFormControl: css({ flex: 2, marginBottom: 0 }),
  quantityInputFormControl: css({ flex: 1, marginBottom: 0 }),
  fieldHeight: (numberOfLines: number) => INPUTS_HEIGHT + calculateHeight(numberOfLines),
  skeleton: (numberOfLines: number) =>
    css({
      overflowY: 'auto',
      height: calculateHeight(numberOfLines),
    }),
  dialogWidth: 640,
  dialogMinHeight: '70vh',
}
