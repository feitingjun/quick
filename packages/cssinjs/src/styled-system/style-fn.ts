import {
  compose,
  color,
  flexbox,
  grid,
  background,
  border,
  position,
  shadow,
  typography
} from 'styled-system'
import { space } from './space'
import { layout } from './layout'
import { animation } from './animation'

const styleFn = compose(
  color,
  space,
  layout,
  flexbox,
  grid,
  background,
  border,
  position,
  shadow,
  typography,
  animation
)

export default styleFn

export const cssPropNames = new Set(styleFn.propNames ?? [])
