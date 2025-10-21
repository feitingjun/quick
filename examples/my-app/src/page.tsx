import { styled, ThemeProvider, defineTheme } from '@quick/cssinjs'
import { Button } from '@quick/ui'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'

const theme = defineTheme({
  colors: { primary: 'red', secondary: '#ff0' },
  presets: {
    solid: { width: '200px' }
  },
  breakpoints: {
    sm: '768px',
    md: '1024px',
    lg: '1280px'
  },
  space: 4
})

type AppTheme = typeof theme

declare module '@quick/cssinjs' {
  interface Theme extends AppTheme {}
}

export default function Index() {
  return (
    <StyleProvider layer>
      <ConfigProvider>
        <ThemeProvider theme={theme}>
          <Button color='red' _hover={{ color: 'green' }}>
            按钮
          </Button>
        </ThemeProvider>
      </ConfigProvider>
    </StyleProvider>
  )
}
