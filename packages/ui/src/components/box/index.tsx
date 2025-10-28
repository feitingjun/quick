import { ComponentProps } from 'react'
import { styled } from '@quick/cssinjs'

const StyledBox = styled('div')

export type BoxProps = ComponentProps<typeof StyledBox> & {
  as?: keyof React.JSX.IntrinsicElements
}

export const Box = (props: BoxProps) => <StyledBox as={props.as} {...props} />
