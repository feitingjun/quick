import type { SxProps } from '@quick/cssinjs'
import Box from '@/components/box'
import Button, { type ButtonProps } from '@/components/button'

export interface Action extends Omit<ButtonProps, keyof SxProps | 'title'> {
  title?: React.ReactNode
}

interface ActionsProps {
  actions?: Action[]
  size?: 'small' | 'middle' | 'large'
}

export default function Actions({ actions, size }: ActionsProps) {
  return (
    <Box>
      {actions?.map(({ title, ...props }, i) => {
        return (
          <Button key={i} size={size} {...props}>
            {title}
          </Button>
        )
      })}
    </Box>
  )
}
