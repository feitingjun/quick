import * as CSS from 'csstype'

interface Theme {}
type ChainablePath<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? ChainablePath<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`
}[keyof T]
type ObjectOrArray<T, K extends keyof any = keyof any> = T[] | Record<K, T | Record<K, T> | T[]>
type TLengthStyledSystem = string | 0 | number
interface ThemeDefine<TLength = TLengthStyledSystem> {
  breakpoints?: ObjectOrArray<number | string>
  mediaQueries?: {
    [size: string]: string
  }
  /**间距(margin, padding, gap等属性)值为number时，会乘以这个值 */
  space?: number
  fontSizes?: ObjectOrArray<CSS.Property.FontSize<number>>
  colors?: ObjectOrArray<CSS.Property.Color>
  fonts?: ObjectOrArray<CSS.Property.FontFamily>
  fontWeights?: ObjectOrArray<CSS.Property.FontWeight>
  lineHeights?: ObjectOrArray<CSS.Property.LineHeight<TLength>>
  letterSpacings?: ObjectOrArray<CSS.Property.LetterSpacing<TLength>>
  sizes?: ObjectOrArray<CSS.Property.Height<{}> | CSS.Property.Width<{}>>
  borders?: ObjectOrArray<CSS.Property.Border<{}>>
  borderStyles?: ObjectOrArray<CSS.Property.Border<{}>>
  borderWidths?: ObjectOrArray<CSS.Property.BorderWidth<TLength>>
  radii?: ObjectOrArray<CSS.Property.BorderRadius<TLength>>
  shadows?: ObjectOrArray<CSS.Property.BoxShadow>
  zIndices?: ObjectOrArray<CSS.Property.ZIndex>
  presets?: {
    [key: string]: SxProps<Theme>
  }
}
type RequiredTheme = Required<ThemeDefine>
type ResponsiveValue<T, ThemeType extends ThemeDefine = Theme> =
  | T
  | null
  | Array<T | null>
  | `{${ChainablePath<Theme>}}`
  | {
      [key in (ThemeValue<'breakpoints', ThemeType> & string) | number]?:
        | T
        | `{${ChainablePath<Theme>}}`
    }
type ThemeValue<K extends keyof ThemeType, ThemeType, TVal = any> = NonNullable<
  ThemeType[K]
> extends TVal[]
  ? number
  : NonNullable<ThemeType[K]> extends Record<infer E, TVal>
  ? E
  : NonNullable<ThemeType[K]> extends ObjectOrArray<infer F>
  ? F
  : never
/**
 * ResponsiveValue<TVal, ThemeType>
 * 使用为当前传入主题泛型中的实际类型，并且可以传入数组或者按照breakpoints设置
 */
interface SpaceProps<ThemeType extends ThemeDefine = Theme, TVal = number> {
  /** Margin on top, left, bottom and right */
  m?: ResponsiveValue<TVal | CSS.Property.Margin, ThemeType> | undefined
  /** Margin on top, left, bottom and right */
  margin?: ResponsiveValue<TVal | CSS.Property.Margin, ThemeType> | undefined
  /** Margin on top */
  mt?: ResponsiveValue<TVal | CSS.Property.MarginTop, ThemeType> | undefined
  /** Margin on top */
  marginTop?: ResponsiveValue<TVal | CSS.Property.MarginTop, ThemeType> | undefined
  /** Margin on right */
  mr?: ResponsiveValue<TVal | CSS.Property.MarginRight, ThemeType> | undefined
  /** Margin on right */
  marginRight?: ResponsiveValue<TVal | CSS.Property.MarginRight, ThemeType> | undefined
  /** Margin on bottom */
  mb?: ResponsiveValue<TVal | CSS.Property.MarginBottom, ThemeType> | undefined
  /** Margin on bottom */
  marginBottom?: ResponsiveValue<TVal | CSS.Property.MarginBottom, ThemeType> | undefined
  /** Margin on left */
  ml?: ResponsiveValue<TVal | CSS.Property.MarginLeft, ThemeType> | undefined
  /** Margin on left */
  marginLeft?: ResponsiveValue<TVal | CSS.Property.MarginLeft, ThemeType> | undefined
  /** Margin on left and right */
  mx?: ResponsiveValue<TVal | CSS.Property.MarginLeft, ThemeType> | undefined
  /** Margin on left and right */
  marginX?: ResponsiveValue<TVal | CSS.Property.MarginLeft, ThemeType> | undefined
  /** Margin on top and bottom */
  my?: ResponsiveValue<TVal | CSS.Property.MarginTop, ThemeType> | undefined
  /** Margin on top and bottom */
  marginY?: ResponsiveValue<TVal | CSS.Property.MarginTop, ThemeType> | undefined
  /** Padding on top, left, bottom and right */
  p?: ResponsiveValue<TVal | CSS.Property.Padding, ThemeType> | undefined
  /** Padding on top, left, bottom and right */
  padding?: ResponsiveValue<TVal | CSS.Property.Padding, ThemeType> | undefined
  /** Padding on top */
  pt?: ResponsiveValue<TVal | CSS.Property.PaddingTop, ThemeType> | undefined
  /** Padding on top */
  paddingTop?: ResponsiveValue<TVal | CSS.Property.PaddingTop, ThemeType> | undefined
  /** Padding on right */
  pr?: ResponsiveValue<TVal | CSS.Property.PaddingRight, ThemeType> | undefined
  /** Padding on right */
  paddingRight?: ResponsiveValue<TVal | CSS.Property.PaddingRight, ThemeType> | undefined
  /** Padding on bottom */
  pb?: ResponsiveValue<TVal | CSS.Property.PaddingBottom, ThemeType> | undefined
  /** Padding on bottom */
  paddingBottom?: ResponsiveValue<TVal | CSS.Property.PaddingBottom, ThemeType> | undefined
  /** Padding on left */
  pl?: ResponsiveValue<TVal | CSS.Property.PaddingLeft, ThemeType> | undefined
  /** Padding on left */
  paddingLeft?: ResponsiveValue<TVal | CSS.Property.PaddingLeft, ThemeType> | undefined
  /** Padding on left and right */
  px?: ResponsiveValue<TVal | CSS.Property.PaddingLeft, ThemeType> | undefined
  /** Padding on left and right */
  paddingX?: ResponsiveValue<TVal | CSS.Property.PaddingLeft, ThemeType> | undefined
  /** Padding on top and bottom */
  py?: ResponsiveValue<TVal | CSS.Property.PaddingTop, ThemeType> | undefined
  /** Padding on top and bottom */
  paddingY?: ResponsiveValue<TVal | CSS.Property.PaddingTop, ThemeType> | undefined
}
/**
 * Color
 */
interface TextColorProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'colors', ThemeType>
> {
  /**
   * The color utility parses a component's `color` and `bg` props and converts them into CSS declarations.
   * By default the raw value of the prop is returned.
   *
   * Color palettes can be configured with the ThemeProvider to use keys as prop values, with support for dot notation.
   * Array values are converted into responsive values.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/color)
   */
  color?: ResponsiveValue<TVal | CSS.Property.Color, ThemeType> | undefined
}
interface BackgroundColorProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'colors', ThemeType>
> {
  /**
   * The color utility parses a component's `color` and `bg` props and converts them into CSS declarations.
   * By default the raw value of the prop is returned.
   *
   * Color palettes can be configured with the ThemeProvider to use keys as prop values, with support for dot notation.
   * Array values are converted into responsive values.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color)
   */
  bg?: ResponsiveValue<TVal | CSS.Property.Color, ThemeType> | undefined
  backgroundColor?: ResponsiveValue<TVal | CSS.Property.Color, ThemeType> | undefined
}
interface ColorProps<ThemeType extends ThemeDefine = Theme, TVal = ThemeValue<'colors', ThemeType>>
  extends TextColorProps<ThemeType, TVal>,
    BackgroundColorProps<ThemeType, TVal>,
    OpacityProps {}
/**
 * Typography
 */
interface FontSizeProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'fontSizes', ThemeType>
> {
  /**
   * The fontSize utility parses a component's `fontSize` prop and converts it into a CSS font-size declaration.
   *
   * - Numbers from 0-8 (or `theme.fontSizes.length`) are converted to values on the [font size scale](#default-theme).
   * - Numbers greater than `theme.fontSizes.length` are converted to raw pixel values.
   * - String values are passed as raw CSS values.
   * - And array values are converted into responsive values.
   */
  fontSize?: ResponsiveValue<TVal | CSS.Property.FontSize, ThemeType> | undefined
}
interface FontFamilyProps<ThemeType extends ThemeDefine = Theme> {
  fontFamily?: ResponsiveValue<CSS.Property.FontFamily, ThemeType> | undefined
}
interface FontWeightProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'fontWeights', ThemeType>
> {
  fontWeight?: ResponsiveValue<TVal | CSS.Property.FontWeight, ThemeType> | undefined
}
interface LineHeightProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'lineHeights', ThemeType>
> {
  /**
   * The line-height CSS property sets the amount of space used for lines, such as in text. On block-level elements,
   * it specifies the minimum height of line boxes within the element.
   *
   * On non-replaced inline elements, it specifies the height that is used to calculate line box height.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height)
   */
  lineHeight?: ResponsiveValue<TVal | CSS.Property.LineHeight, ThemeType> | undefined
}
interface TextAlignProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The text-align CSS property specifies the horizontal alignment of an inline or table-cell box.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)
   */
  textAlign?: ResponsiveValue<CSS.Property.TextAlign, ThemeType> | undefined
}
interface FontStyleProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The font-style CSS property specifies whether a font should be styled with a normal, italic,
   * or oblique face from its font-family.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style)
   */
  fontStyle?: ResponsiveValue<CSS.Property.FontStyle, ThemeType> | undefined
}
interface LetterSpacingProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'letterSpacings', ThemeType>
> {
  /**
   * The letter-spacing CSS property sets the spacing behavior between text characters.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing)
   */
  letterSpacing?: ResponsiveValue<TVal | CSS.Property.LetterSpacing, ThemeType> | undefined
}
/**
 * A convenience style group containing props related to typography such as fontFamily, fontSize, fontWeight, etc.
 *
 * - String values are passed as raw CSS values.
 * - Array values are converted into responsive values.
 */
interface TypographyProps<ThemeType extends ThemeDefine = Theme>
  extends FontFamilyProps<ThemeType>,
    FontSizeProps<ThemeType>,
    FontWeightProps<ThemeType>,
    LineHeightProps<ThemeType>,
    LetterSpacingProps<ThemeType>,
    FontStyleProps<ThemeType>,
    TextAlignProps<ThemeType> {}
/**
 * Layout
 */
interface DisplayProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The display CSS property defines the display type of an element, which consists of the two basic qualities
   * of how an element generates boxes — the outer display type defining how the box participates in flow layout,
   * and the inner display type defining how the children of the box are laid out.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
   */
  display?: ResponsiveValue<CSS.Property.Display, ThemeType> | undefined
}
interface WidthProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Width<number>> {
  /**
   *   The width utility parses a component's `width` prop and converts it into a CSS width declaration.
   *
   *   - Numbers from 0-1 are converted to percentage widths.
   *   - Numbers greater than 1 are converted to pixel values.
   *   - String values are passed as raw CSS values.
   *   - And arrays are converted to responsive width styles.
   */
  width?: ResponsiveValue<TVal, ThemeType> | undefined
  w?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface MaxWidthProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.MaxWidth<number>
> {
  /**
   * The max-width CSS property sets the maximum width of an element.
   * It prevents the used value of the width property from becoming larger than the value specified by max-width.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)
   */
  maxWidth?: ResponsiveValue<TVal, ThemeType> | undefined
  maxW?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface MinWidthProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.MinWidth<number>
> {
  /**
   * The min-width CSS property sets the minimum width of an element.
   * It prevents the used value of the width property from becoming smaller than the value specified for min-width.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)
   */
  minWidth?: ResponsiveValue<TVal, ThemeType> | undefined
  minW?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface HeightProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Height<number>> {
  /**
   * The height CSS property specifies the height of an element. By default, the property defines the height of the
   * content area. If box-sizing is set to border-box, however, it instead determines the height of the border area.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/height)
   */
  height?: ResponsiveValue<TVal, ThemeType> | undefined
  h?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface MaxHeightProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.MaxHeight<number>
> {
  /**
   * The max-height CSS property sets the maximum height of an element. It prevents the used value of the height
   * property from becoming larger than the value specified for max-height.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height)
   */
  maxHeight?: ResponsiveValue<TVal, ThemeType> | undefined
  maxH?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface MinHeightProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.MinHeight<number>
> {
  /**
   * The min-height CSS property sets the minimum height of an element. It prevents the used value of the height
   * property from becoming smaller than the value specified for min-height.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
   */
  minHeight?: ResponsiveValue<TVal, ThemeType> | undefined
  minH?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface SizeProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Height<number>> {
  sizes?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface VerticalAlignProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.VerticalAlign
> {
  /**
   * The vertical-align CSS property specifies sets vertical alignment of an inline or table-cell box.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align)
   */
  verticalAlign?: ResponsiveValue<TVal, ThemeType> | undefined
}
/**
 * Flexbox
 */
interface AlignItemsProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The CSS align-items property sets the align-self value on all direct children as a group. The align-self
   * property sets the alignment of an item within its containing block.
   *
   * In Flexbox it controls the alignment of items on the Cross Axis, in Grid Layout it controls the alignment
   * of items on the Block Axis within their grid area.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)
   */
  alignItems?: ResponsiveValue<CSS.Property.AlignItems, ThemeType> | undefined
}
interface AlignContentProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The CSS align-content property sets how the browser distributes space between and around content items
   * along the cross-axis of a flexbox container, and the main-axis of a grid container.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)
   */
  alignContent?: ResponsiveValue<CSS.Property.AlignContent, ThemeType> | undefined
}
interface JustifyItemsProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The CSS justify-items property defines the default justify-self for all items of the box, giving them all
   * a default way of justifying each box along the appropriate axis.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-items)
   */
  justifyItems?: ResponsiveValue<CSS.Property.JustifyItems, ThemeType> | undefined
}
interface JustifyContentProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The CSS justify-content property defines how the browser distributes space between and around content items
   * along the main-axis of a flex container, and the inline axis of a grid container.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)
   */
  justifyContent?: ResponsiveValue<CSS.Property.JustifyContent, ThemeType> | undefined
}
interface FlexWrapProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The flex-wrap CSS property sets whether flex items are forced onto one line or can wrap onto multiple lines.
   * If wrapping is allowed, it sets the direction that lines are stacked.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)
   */
  flexWrap?: ResponsiveValue<CSS.Property.FlexWrap, ThemeType> | undefined
}
interface FlexBasisProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.FlexBasis> {
  flexBasis?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface FlexDirectionProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The flex-direction CSS property specifies how flex items are placed in the flex container defining the main
   * axis and the direction (normal or reversed).
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction)
   */
  flexDirection?: ResponsiveValue<CSS.Property.FlexDirection, ThemeType> | undefined
}
interface FlexProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Flex> {
  /**
   * The flex CSS property specifies how a flex item will grow or shrink so as to fit the space available in
   * its flex container. This is a shorthand property that sets flex-grow, flex-shrink, and flex-basis.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)
   */
  flex?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface JustifySelfProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The CSS justify-self property set the way a box is justified inside its alignment container along
   * the appropriate axis.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self)
   */
  justifySelf?: ResponsiveValue<CSS.Property.JustifySelf, ThemeType> | undefined
}
interface AlignSelfProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The align-self CSS property aligns flex items of the current flex line overriding the align-items value.
   *
   * If any of the item's cross-axis margin is set to auto, then align-self is ignored. In Grid layout align-self
   * aligns the item inside the grid area.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self)
   */
  alignSelf?: ResponsiveValue<CSS.Property.AlignSelf, ThemeType> | undefined
}
interface OrderProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The order CSS property sets the order to lay out an item in a flex or grid container. Items in a container
   * are sorted by ascending order value and then by their source code order.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/order)
   */
  order?: ResponsiveValue<CSS.Property.Order, ThemeType> | undefined
}
interface FlexGrowProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The flex-grow CSS property sets the flex grow factor of a flex item main size. It specifies how much of the
   * remaining space in the flex container should be assigned to the item (the flex grow factor).
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow)
   */
  flexGrow?: ResponsiveValue<CSS.Property.FlexGrow, ThemeType> | undefined
}
interface FlexShrinkProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The flex-shrink CSS property sets the flex shrink factor of a flex item. If the size of all flex items is larger
   * than the flex container, items shrink to fit according to flex-shrink.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink)
   */
  flexShrink?: ResponsiveValue<CSS.Property.FlexShrink, ThemeType> | undefined
}
/**
 * A convenience style group containing props related to flexbox.
 *
 * - String values are passed as raw CSS values.
 * - Array values are converted into responsive values.
 */
interface FlexboxProps<ThemeType extends ThemeDefine = Theme>
  extends AlignItemsProps<ThemeType>,
    AlignContentProps<ThemeType>,
    JustifyItemsProps<ThemeType>,
    JustifyContentProps<ThemeType>,
    FlexWrapProps<ThemeType>,
    FlexDirectionProps<ThemeType>,
    FlexProps<ThemeType>,
    FlexGrowProps<ThemeType>,
    FlexShrinkProps<ThemeType>,
    FlexBasisProps<ThemeType>,
    JustifySelfProps<ThemeType>,
    AlignSelfProps<ThemeType>,
    OrderProps<ThemeType> {}
/**
 * Grid Layout
 */
interface GridGapProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Gap<number>> {
  /**
   * The gap CSS property sets the gaps (gutters) between rows and columns. It is a shorthand for row-gap
   * and column-gap.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)
   */
  gap?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface GridColumnGapProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.ColumnGap<number>
> {
  /**
   * The column-gap CSS property sets the size of the gap (gutter) between an element's columns.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)
   */
  columnGap?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface GridRowGapProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.RowGap<number>
> {
  /**
   * The row-gap CSS property sets the size of the gap (gutter) between an element's rows.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap)
   */
  rowGap?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface GridColumnProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The grid-column CSS property is a shorthand property for grid-column-start and grid-column-end specifying
   * a grid item's size and location within the grid column by contributing a line, a span, or nothing (automatic)
   * to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column)
   */
  gridColumn?: ResponsiveValue<CSS.Property.GridColumn, ThemeType> | undefined
}
interface GridRowProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The grid-row CSS property is a shorthand property for grid-row-start and grid-row-end specifying a grid item’s
   * size and location within the grid row by contributing a line, a span, or nothing (automatic) to its grid
   * placement, thereby specifying the inline-start and inline-end edge of its grid area.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row)
   */
  gridRow?: ResponsiveValue<CSS.Property.GridRow, ThemeType> | undefined
}
interface GridAutoFlowProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The grid-auto-flow CSS property controls how the auto-placement algorithm works, specifying exactly
   * how auto-placed items get flowed into the grid.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow)
   */
  gridAutoFlow?: ResponsiveValue<CSS.Property.GridAutoFlow, ThemeType> | undefined
}
interface GridAutoColumnsProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.GridAutoColumns<number>
> {
  /**
   * The grid-auto-columns CSS property specifies the size of an implicitly-created grid column track.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns)
   */
  gridAutoColumns?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface GridAutoRowsProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.GridAutoRows<number>
> {
  /**
   * The grid-auto-rows CSS property specifies the size of an implicitly-created grid row track.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows)
   */
  gridAutoRows?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface GridTemplateColumnsProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.GridTemplateColumns<number>
> {
  /**
   * The grid-template-columns CSS property defines the line names and track sizing functions of the grid columns.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)
   */
  gridTemplateColumns?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface GridTemplateRowsProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.GridTemplateRows<number>
> {
  /**
   * The grid-template-rows CSS property defines the line names and track sizing functions of the grid rows.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/row-template-rows)
   */
  gridTemplateRows?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface GridTemplateAreasProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The grid-template-areas CSS property specifies named grid areas.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)
   */
  gridTemplateAreas?: ResponsiveValue<CSS.Property.GridTemplateAreas, ThemeType> | undefined
}
interface GridAreaProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The grid-area CSS property is a shorthand property for grid-row-start, grid-column-start, grid-row-end
   * and grid-column-end, specifying a grid item’s size and location within the grid row by contributing a line,
   * a span, or nothing (automatic) to its grid placement, thereby specifying the edges of its grid area.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area)
   */
  gridArea?: ResponsiveValue<CSS.Property.GridArea, ThemeType> | undefined
}
/**
 * A convenience style group containing props related to grid.
 *
 * - String values are passed as raw CSS values.
 * - Array values are converted into responsive values.
 */
interface GridProps<ThemeType extends ThemeDefine = Theme>
  extends GridGapProps<ThemeType>,
    GridColumnGapProps<ThemeType>,
    GridRowGapProps<ThemeType>,
    GridColumnProps<ThemeType>,
    GridRowProps<ThemeType>,
    GridAutoFlowProps<ThemeType>,
    GridAutoColumnsProps<ThemeType>,
    GridAutoRowsProps<ThemeType>,
    GridTemplateColumnsProps<ThemeType>,
    GridTemplateRowsProps<ThemeType>,
    GridTemplateAreasProps<ThemeType>,
    GridAreaProps<ThemeType> {}
/**
 * A convenience style group containing props related to layout such as width, height, and display.
 *
 * - For length props, Numbers from 0-4 (or the length of theme.sizes) are converted to values on the spacing scale.
 * - For length props, Numbers greater than the length of the theme.sizes array are converted to raw pixel values.
 * - String values are passed as raw CSS values.
 * - Array values are converted into responsive values.
 */
interface LayoutProps<ThemeType extends ThemeDefine = Theme>
  extends WidthProps<ThemeType>,
    HeightProps<ThemeType>,
    MinWidthProps<ThemeType>,
    MinHeightProps<ThemeType>,
    MaxWidthProps<ThemeType>,
    MaxHeightProps<ThemeType>,
    DisplayProps<ThemeType>,
    VerticalAlignProps<ThemeType>,
    SizeProps<ThemeType>,
    OverflowProps<ThemeType> {}
/**
 * Borders
 */
interface BorderWidthProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'borderWidths', ThemeType>
> {
  /**
   * The border-width shorthand CSS property sets the width of all sides of an element's border.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)
   */
  borderWidth?: ResponsiveValue<TVal | CSS.Property.BorderWidth, ThemeType> | undefined
  /**
   * The border-top-width CSS property sets the width of the top border of an element.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width)
   */
  borderTopWidth?: ResponsiveValue<TVal | CSS.Property.BorderTopWidth, ThemeType> | undefined
  /**
   * The border-bottom-width CSS property sets the width of the bottom border of an element.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width)
   */
  borderBottomWidth?: ResponsiveValue<TVal | CSS.Property.BorderBottomWidth, ThemeType> | undefined
  /**
   * The border-left-width CSS property sets the width of the left border of an element.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width)
   */
  borderLeftWidth?: ResponsiveValue<TVal | CSS.Property.BorderLeftWidth, ThemeType> | undefined
  /**
   * The border-right-width CSS property sets the width of the right border of an element.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width)
   */
  borderRightWidth?: ResponsiveValue<TVal | CSS.Property.BorderRightWidth, ThemeType> | undefined
}
interface BorderStyleProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'borderStyles', ThemeType>
> {
  /**
   * The border-style shorthand CSS property sets the style of all sides of an element's border.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style)
   */
  borderStyle?: ResponsiveValue<TVal | CSS.Property.BorderStyle, ThemeType> | undefined
  /**
   * The border-top-style CSS property sets the line style of an element's top border.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-style)
   */
  borderTopStyle?: ResponsiveValue<TVal | CSS.Property.BorderTopStyle, ThemeType> | undefined
  /**
   * The border-bottom-style CSS property sets the line style of an element's bottom border.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-style)
   */
  borderBottomStyle?: ResponsiveValue<TVal | CSS.Property.BorderBottomStyle, ThemeType> | undefined
  /**
   * The border-left-style CSS property sets the line style of an element's left border.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-style)
   */
  borderLeftStyle?: ResponsiveValue<TVal | CSS.Property.BorderLeftStyle, ThemeType> | undefined
  /**
   * The border-right-style CSS property sets the line style of an element's right border.
   *
   * [MDN * reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-style)
   */
  borderRightStyle?: ResponsiveValue<TVal | CSS.Property.BorderRightStyle, ThemeType> | undefined
}
interface BorderColorProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'colors', ThemeType>
> {
  /**
   * The border-color shorthand CSS property sets the color of all sides of an element's border.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color)
   */
  borderColor?: ResponsiveValue<TVal | CSS.Property.BorderColor, ThemeType> | undefined
  /**
   * The border-top-color CSS property sets the color of an element's top border. It can also be set with the shorthand CSS properties border-color or border-top.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-color)
   */
  borderTopColor?: ResponsiveValue<TVal | CSS.Property.BorderTopColor, ThemeType> | undefined
  /**
   * The border-bottom-color CSS property sets the color of an element's bottom border. It can also be set with the shorthand CSS properties border-color or border-bottom.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-color)
   */
  borderBottomColor?: ResponsiveValue<TVal | CSS.Property.BorderBottomColor, ThemeType> | undefined
  /**
   * The border-left-color CSS property sets the color of an element's left border. It can also be set with the shorthand CSS properties border-color or border-left.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-color)
   */
  borderLeftColor?: ResponsiveValue<TVal | CSS.Property.BorderLeftColor, ThemeType> | undefined
  /**
   * The border-right-color CSS property sets the color of an element's right border. It can also be set with the shorthand CSS properties border-color or border-right.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-color)
   */
  borderRightColor?: ResponsiveValue<TVal | CSS.Property.BorderRightColor, ThemeType> | undefined
}
interface BorderTopProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.BorderTop<number>
> {
  /**
   * The border-top CSS property is a shorthand that sets the values of border-top-width, border-top-style,
   * and border-top-color. These properties describe an element's top border.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top)
   */
  borderTop?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface BorderRightProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.BorderRight<number>
> {
  /**
   * The border-right CSS property is a shorthand that sets border-right-width, border-right-style,
   * and border-right-color. These properties set an element's right border.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right)
   */
  borderRight?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface BorderBottomProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.BorderBottom<number>
> {
  /**
   * The border-bottom CSS property sets an element's bottom border. It's a shorthand for
   * border-bottom-width, border-bottom-style and border-bottom-color.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom)
   */
  borderBottom?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface BorderLeftProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.BorderLeft<number>
> {
  /**
   * The border-left CSS property is a shorthand that sets the values of border-left-width,
   * border-left-style, and border-left-color. These properties describe an element's left border.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left)
   */
  borderLeft?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface BorderRadiusProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'radii', ThemeType>
> {
  /**
   * The border-radius CSS property rounds the corners of an element's outer border edge. You can set a single
   * radius to make circular corners, or two radii to make elliptical corners.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)
   */
  borderRadius?: ResponsiveValue<TVal | CSS.Property.BorderRadius, ThemeType> | undefined
  /**
   * The border-top-left-radius CSS property rounds the top-left corner of an element.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-left-radius)
   */
  borderTopLeftRadius?:
    | ResponsiveValue<TVal | CSS.Property.BorderTopLeftRadius, ThemeType>
    | undefined
  /**
   * The border-top-right-radius CSS property rounds the top-right corner of an element.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-right-radius)
   */
  borderTopRightRadius?:
    | ResponsiveValue<TVal | CSS.Property.BorderTopRightRadius, ThemeType>
    | undefined
  /**
   * The border-bottom-left-radius CSS property rounds the bottom-left corner of an element.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-left-radius)
   */
  borderBottomLeftRadius?:
    | ResponsiveValue<TVal | CSS.Property.BorderBottomLeftRadius, ThemeType>
    | undefined
  /**
   * The border-bottom-right-radius CSS property rounds the bottom-right corner of an element.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-right-radius)
   */
  borderBottomRightRadius?:
    | ResponsiveValue<TVal | CSS.Property.BorderBottomRightRadius, ThemeType>
    | undefined
}
interface BordersProps<ThemeType extends ThemeDefine = Theme>
  extends BorderProps<ThemeType>,
    BorderTopProps<ThemeType>,
    BorderRightProps<ThemeType>,
    BorderBottomProps<ThemeType>,
    BorderLeftProps<ThemeType>,
    BorderWidthProps<ThemeType>,
    BorderColorProps<ThemeType>,
    BorderStyleProps<ThemeType>,
    BorderRadiusProps<ThemeType> {}
interface BorderProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Border<number>>
  extends BorderWidthProps<ThemeType>,
    BorderStyleProps<ThemeType>,
    BorderColorProps<ThemeType>,
    BorderRadiusProps<ThemeType>,
    BorderTopProps<ThemeType>,
    BorderRightProps<ThemeType>,
    BorderBottomProps<ThemeType>,
    BorderLeftProps<ThemeType> {
  /**
   * The border CSS property sets an element's border. It's a shorthand for border-width, border-style,
   * and border-color.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/border)
   */
  border?: ResponsiveValue<TVal, ThemeType> | undefined
  borderX?: ResponsiveValue<TVal, ThemeType> | undefined
  borderY?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface BoxShadowProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'shadows', ThemeType>
> {
  /**
   * The box-shadow CSS property adds shadow effects around an element's frame. You can set multiple effects separated
   * by commas. A box shadow is described by X and Y offsets relative to the element, blur and spread radii and color.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
   */
  boxShadow?: ResponsiveValue<TVal | CSS.Property.BoxShadow | number, ThemeType> | undefined
}
interface TextShadowProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'shadows', ThemeType>
> {
  /**
   * The `text-shadow` CSS property adds shadows to text. It accepts a comma-separated list of shadows to be applied
   * to the text and any of its `decorations`. Each shadow is described by some combination of X and Y offsets from
   * the element, blur radius, and color.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)
   */
  textShadow?: ResponsiveValue<TVal | CSS.Property.TextShadow | number, ThemeType> | undefined
}
interface ShadowProps<ThemeType extends ThemeDefine = Theme>
  extends BoxShadowProps<ThemeType>,
    TextShadowProps<ThemeType> {}
interface OpacityProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The opacity CSS property sets the transparency of an element or the degree to which content
   * behind an element is visible.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)
   */
  opacity?: ResponsiveValue<CSS.Property.Opacity, ThemeType> | undefined
}
interface OverflowProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The overflow CSS property sets what to do when an element's content is too big to fit in its block
   * formatting context. It is a shorthand for overflow-x and overflow-y.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
   */
  overflow?: ResponsiveValue<CSS.Property.Overflow, ThemeType> | undefined
  /**
   * The overflow-x CSS property sets what shows when content overflows a block-level element's left
   * and right edges. This may be nothing, a scroll bar, or the overflow content.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x)
   */
  overflowX?: ResponsiveValue<CSS.Property.OverflowX, ThemeType> | undefined
  /**
   * The overflow-y CSS property sets what shows when content overflows a block-level element's top
   * and bottom edges. This may be nothing, a scroll bar, or the overflow content.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-y)
   */
  overflowY?: ResponsiveValue<CSS.Property.OverflowY, ThemeType> | undefined
}
/**
 * Background
 */
interface BackgroundImageProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The background-image CSS property sets one or more background images on an element.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image)
   */
  backgroundImage?: ResponsiveValue<CSS.Property.BackgroundImage, ThemeType> | undefined
}
interface BackgroundSizeProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.BackgroundSize<number>
> {
  /**
   * The background-size CSS property sets the size of the element's background image. The
   * image can be left to its natural size, stretched, or constrained to fit the available space.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size)
   */
  backgroundSize?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface BackgroundPositionProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.BackgroundPosition<number>
> {
  /**
   * The background-position CSS property sets the initial position for each background image. The
   * position is relative to the position layer set by background-origin.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position)
   */
  backgroundPosition?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface BackgroundRepeatProps<ThemeType extends ThemeDefine = Theme> {
  /**
   * The background-repeat CSS property sets how background images are repeated. A background
   * image can be repeated along the horizontal and vertical axes, or not repeated at all.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat)
   */
  backgroundRepeat?: ResponsiveValue<CSS.Property.BackgroundRepeat, ThemeType> | undefined
}
interface BackgroundProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = CSS.Property.Background<number>
> extends BackgroundImageProps<ThemeType>,
    BackgroundSizeProps<ThemeType>,
    BackgroundPositionProps<ThemeType>,
    BackgroundRepeatProps<ThemeType> {
  /**
   * The background shorthand CSS property sets all background style properties at once,
   * such as color, image, origin and size, repeat method, and others.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/background)
   */
  background?: ResponsiveValue<TVal, ThemeType> | undefined
}
/**
 * Position
 */
interface ZIndexProps<
  ThemeType extends ThemeDefine = Theme,
  TVal = ThemeValue<'zIndices', ThemeType>
> {
  /**
   * The z-index CSS property sets the z-order of a positioned element and its descendants or
   * flex items. Overlapping elements with a larger z-index cover those with a smaller one.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
   */
  zIndex?: ResponsiveValue<TVal | CSS.Property.ZIndex, ThemeType> | undefined
}
interface TopProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Top<number>> {
  /**
   * The top CSS property participates in specifying the vertical position of a
   * positioned element. It has no effect on non-positioned elements.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/top)
   */
  top?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface RightProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Right<number>> {
  /**
   * The right CSS property participates in specifying the horizontal position of a
   * positioned element. It has no effect on non-positioned elements.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/right)
   */
  right?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface BottomProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Bottom<number>> {
  /**
   * The bottom CSS property participates in specifying the vertical position of a
   * positioned element. It has no effect on non-positioned elements.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/top)
   */
  bottom?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface LeftProps<ThemeType extends ThemeDefine = Theme, TVal = CSS.Property.Left<number>> {
  /**
   * The left CSS property participates in specifying the horizontal position
   * of a positioned element. It has no effect on non-positioned elements.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/left)
   */
  left?: ResponsiveValue<TVal, ThemeType> | undefined
}
interface PositionProps<ThemeType extends ThemeDefine = Theme>
  extends ZIndexProps<ThemeType>,
    TopProps<ThemeType>,
    RightProps<ThemeType>,
    BottomProps<ThemeType>,
    LeftProps<ThemeType> {
  /**
   * The position CSS property specifies how an element is positioned in a document.
   * The top, right, bottom, and left properties determine the final location of positioned elements.
   *
   * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
   */
  position?: ResponsiveValue<CSS.Property.Position, ThemeType> | undefined
}

declare const customPseudos: {
  readonly _hover: ':hover'
  readonly _active: ':active'
  readonly _focus: ':focus'
  readonly _focusVisible: ':focus-visible'
  readonly _focusWithin: ':focus-within'
  readonly _visited: ':visited'
  readonly _link: ':link'
  readonly _checked: ':checked'
  readonly _readonly: ':readonly'
  readonly _readWrite: ':read-write'
  readonly _disabled: ':disabled'
  readonly _before: '::before'
  readonly _after: '::after'
}
type CustomPseudos = keyof typeof customPseudos

declare const defineTheme: <T extends ThemeDefine>(theme: T) => T
type ValueOf<T> = T[keyof T]
type CSSProperties<T extends Theme = Theme> = ColorProps<T> &
  SpaceProps<T> &
  LayoutProps<T> &
  FlexboxProps<T> &
  BorderProps<T> &
  PositionProps<T> &
  ShadowProps<T> &
  TypographyProps<T> &
  BackgroundProps<T> &
  GridProps<T> &
  OpacityProps<T>
type CSSVars<T extends Theme = Theme> = {
  [key: `--${string}`]: ValueOf<CSSProperties<T>>
}
type KnownPseudos = CSS.Pseudos | CustomPseudos
type CSSPseudos<T extends Theme = Theme> = {
  [K in KnownPseudos]?: CSSProperties<T> &
    CSSVars<T> & {
      content: `"${string}"`
    }
} & {
  [K: `${string}${KnownPseudos}`]: CSSProperties<T> &
    CSSVars<T> & {
      content: `"${string}"`
    }
}
type CSSOthersObject<T extends Theme = Theme> = {
  [propertiesName: string]: SxProps<T> | string | number | null
}
type SxProps<T extends Theme = Theme> =
  | Partial<CSSProperties<T> & CSSVars<T> & CSSPseudos<T>>
  | CSSOthersObject<T>

export {
  type GridColumnProps as $,
  type AlignItemsProps as A,
  type BackgroundColorProps as B,
  type CSSProperties as C,
  type DisplayProps as D,
  type FlexBasisProps as E,
  type FontSizeProps as F,
  type FlexDirectionProps as G,
  type HeightProps as H,
  type FlexProps as I,
  type JustifyItemsProps as J,
  type JustifySelfProps as K,
  type LineHeightProps as L,
  type MaxWidthProps as M,
  type AlignSelfProps as N,
  type ObjectOrArray as O,
  type OrderProps as P,
  type FlexGrowProps as Q,
  type RequiredTheme as R,
  type SxProps as S,
  type Theme as T,
  type FlexShrinkProps as U,
  type ValueOf as V,
  type WidthProps as W,
  type FlexboxProps as X,
  type GridGapProps as Y,
  type GridColumnGapProps as Z,
  type GridRowGapProps as _,
  type CSSVars as a,
  type GridRowProps as a0,
  type GridAutoFlowProps as a1,
  type GridAutoColumnsProps as a2,
  type GridAutoRowsProps as a3,
  type GridTemplateColumnsProps as a4,
  type GridTemplateRowsProps as a5,
  type GridTemplateAreasProps as a6,
  type GridAreaProps as a7,
  type GridProps as a8,
  type LayoutProps as a9,
  type BorderWidthProps as aa,
  type BorderStyleProps as ab,
  type BorderColorProps as ac,
  type BorderTopProps as ad,
  type BorderRightProps as ae,
  type BorderBottomProps as af,
  type BorderLeftProps as ag,
  type BorderRadiusProps as ah,
  type BordersProps as ai,
  type BorderProps as aj,
  type BoxShadowProps as ak,
  type TextShadowProps as al,
  type ShadowProps as am,
  type OpacityProps as an,
  type OverflowProps as ao,
  type BackgroundImageProps as ap,
  type BackgroundSizeProps as aq,
  type BackgroundPositionProps as ar,
  type BackgroundRepeatProps as as,
  type BackgroundProps as at,
  type ZIndexProps as au,
  type TopProps as av,
  type RightProps as aw,
  type BottomProps as ax,
  type LeftProps as ay,
  type PositionProps as az,
  type CSSPseudos as b,
  type CSSOthersObject as c,
  defineTheme as d,
  type ChainablePath as e,
  type TLengthStyledSystem as f,
  type ThemeDefine as g,
  type ResponsiveValue as h,
  type ThemeValue as i,
  type SpaceProps as j,
  type TextColorProps as k,
  type ColorProps as l,
  type FontFamilyProps as m,
  type FontWeightProps as n,
  type TextAlignProps as o,
  type FontStyleProps as p,
  type LetterSpacingProps as q,
  type TypographyProps as r,
  type MinWidthProps as s,
  type MaxHeightProps as t,
  type MinHeightProps as u,
  type SizeProps as v,
  type VerticalAlignProps as w,
  type AlignContentProps as x,
  type JustifyContentProps as y,
  type FlexWrapProps as z
}
