import { TextColorProps } from './packages/cssinjs/src/styled-system/style-define'

// 检查不传泛型时的 TVal 推断
type TValDefault = TextColorProps extends { color?: infer T } ? T : never

// 检查传入自定义主题时的 TVal 推断
type TValCustom = TextColorProps<{ colors: { primary: string } }> extends {
  color?: infer T
}
  ? T
  : never

// 检查具体的类型
type ColorTypeDefault = TextColorProps['color']
type ColorTypeCustom = TextColorProps<{ colors: { primary: string } }>['color']

// 测试实际使用
const test1: TextColorProps = {
  color: 'red' // 这里应该显示类型提示
}

const test2: TextColorProps<{ colors: { primary: string } }> = {
  color: 'primary' // 这里应该显示类型提示
}

console.log('Debug TVal completed')

