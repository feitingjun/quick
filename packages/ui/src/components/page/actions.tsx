import { Button, type ButtonProps } from '@/components'

export interface Action extends Omit<ButtonProps, 'title'> {
  title?: React.ReactNode
}

interface ActionsProps {
  actions?: Action[]
  size?: 'small' | 'medium' | 'large'
}

export default function Actions({ actions, size }: ActionsProps) {
  return (
    <div>
      {actions?.map(({ title, ...props }, i) => {
        return (
          <Button key={i} size={size} {...props}>
            {title}
          </Button>
        )
      })}
    </div>
  )
}
