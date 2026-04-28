import { Button } from '@/components'
import type { ActionsProps } from './types'

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
