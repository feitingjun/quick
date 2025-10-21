import { system, type Config } from 'styled-system'

export const isNumber = (n: any): n is number => typeof n === 'number' && !isNaN(n)

const getMargin = (n: string | number, scale: any) => {
  if (isNumber(n) && isNumber(scale)) {
    return n * scale
  }
  return n
}

const configs: Config = {
  margin: {
    property: 'margin',
    scale: 'space',
    transform: getMargin
  },
  marginTop: {
    property: 'marginTop',
    scale: 'space',
    transform: getMargin
  },
  marginRight: {
    property: 'marginRight',
    scale: 'space',
    transform: getMargin
  },
  marginBottom: {
    property: 'marginBottom',
    scale: 'space',
    transform: getMargin
  },
  marginLeft: {
    property: 'marginLeft',
    scale: 'space',
    transform: getMargin
  },
  marginX: {
    properties: ['marginLeft', 'marginRight'],
    scale: 'space',
    transform: getMargin
  },
  marginY: {
    properties: ['marginTop', 'marginBottom'],
    scale: 'space',
    transform: getMargin
  },
  padding: {
    property: 'padding',
    scale: 'space',
    transform: getMargin
  },
  paddingTop: {
    property: 'paddingTop',
    scale: 'space',
    transform: getMargin
  },
  paddingRight: {
    property: 'paddingRight',
    scale: 'space',
    transform: getMargin
  },
  paddingBottom: {
    property: 'paddingBottom',
    scale: 'space',
    transform: getMargin
  },
  paddingLeft: {
    property: 'paddingLeft',
    scale: 'space',
    transform: getMargin
  },
  paddingX: {
    properties: ['paddingLeft', 'paddingRight'],
    scale: 'space',
    transform: getMargin
  },
  paddingY: {
    properties: ['paddingTop', 'paddingBottom'],
    scale: 'space',
    transform: getMargin
  },
  gap: {
    property: 'gap',
    scale: 'space',
    transform: getMargin
  },
  rowGap: {
    property: 'rowGap',
    scale: 'space',
    transform: getMargin
  },
  columnGap: {
    property: 'columnGap',
    scale: 'space',
    transform: getMargin
  }
}
configs.m = configs.margin
configs.mt = configs.marginTop
configs.mr = configs.marginRight
configs.mb = configs.marginBottom
configs.ml = configs.marginLeft
configs.mx = configs.marginX
configs.my = configs.marginY

configs.p = configs.padding
configs.pt = configs.paddingTop
configs.pr = configs.paddingRight
configs.pb = configs.paddingBottom
configs.pl = configs.paddingLeft
configs.px = configs.paddingX
configs.py = configs.paddingY

export const space = system(configs)
