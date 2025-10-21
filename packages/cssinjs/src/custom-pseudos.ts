export const customPseudos = {
  _hover: ':hover',
  _active: ':active',
  _focus: ':focus',
  _focusVisible: ':focus-visible',
  _focusWithin: ':focus-within',
  _visited: ':visited',
  _link: ':link',
  _checked: ':checked',
  _readonly: ':readonly',
  _readWrite: ':read-write',
  _disabled: ':disabled',
  _before: '::before',
  _after: '::after'
} as const

export type CustomPseudos = keyof typeof customPseudos
export const isCustomPseudo = (key: string): key is CustomPseudos => key in customPseudos
