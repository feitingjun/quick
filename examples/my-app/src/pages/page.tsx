import { styled } from '@quick/cssinjs'

const Button = styled('div')<{ size?: 'sm' | 'md' }>(
  props => {
    return {
      backgroundColor: 'red',
      py: 1
    }
  },
  {
    mt: 2
  }
)

export default function Home() {
  return (
    <>
      <div sx={{ color: 'red' }}>111111</div>
      <Button size='sm' sx={{ backgroundColor: 'blue', ml: 2 }}>
        Home
      </Button>
    </>
  )
}
