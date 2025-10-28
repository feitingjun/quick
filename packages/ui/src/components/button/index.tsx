import { ComponentProps } from 'react'
import { styled } from '@quick/cssinjs'
import { Button as AntdButton } from 'antd'

export const Button = styled(AntdButton)

export type ButtonProps = ComponentProps<typeof Button>
