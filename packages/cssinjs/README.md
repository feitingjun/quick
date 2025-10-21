# css-in-js
## 使用方式
```
import { styled } from '@quick/cssinjs'

const Button = styled('button', {
  base: {
    color: 'red',
    bg: 'green'
  }
})

<!-- 顶级css属性 -->
const Component = () => <Box width={10} />

<!-- sx 属性 -->
const Component = () => <Box sx={{ height: 10 }} />
```

styled 接受两个参数  
第一个参数为React组件或者HTML标签字符串(如：'div’)   
第二个参数定义组件样式，接受一个RecipeProps对象或者返回RecipeProps的函数
```
export type RecipeProps<T extends VariantsProps = VariantsProps> = {
  base?: SxProps
  variants?: T
  defaultVariants?: {
    [K in keyof T]?: keyof T[K]
  }
}

// 样式函数参数类型，支持对象或函数形式
export type StyledProps<T extends VariantsProps = VariantsProps> = RecipeProps<T> | ((props: { theme?: Theme }) => RecipeProps<T>)

```
base: 基础样式 
```
const Box = styled('div', {
  base: {
    color: 'red',
    bg: 'green'
  }
})

``` 
variants: 定义变体及其样式，定义后通过
```
const Box = styled('div', {
  variants: {
    size: {
      small: {
        width: 10,
        height: 10
      }
    },
    large: {
      width: 20,
      height: 20
    }
  } 
})

const Component = () => <Box size='large' />

```
defaultVariants: 默认使用的变体  
```
const Box = styled('div', {
  variants: {
    size: {
      small: {
        width: 10,
        height: 10
      }
    },
    large: {
      width: 20,
      height: 20
    }
  },
  defaultVariants: {
    size: 'small'
  }
})
```

## 主题

### 定义主题

```
import { defineTheme } from '@quick/cssinjs'

const theme = defineTheme({
  colors: { primary: 'red', secondary: 'blue' },
  presets: {
    solid: { width: '200px' }
  }
})

type AppTheme = typeof theme

declare module '@quick/cssinjs' {
  interface Theme extends AppTheme {}
}
```
### 使用主题
使用主题有三种方式  

1、简化的主题变量
```
import { styled } from '@quick/cssinjs'

const Button = styled('button', {
  base: {
    color: 'primary',
    bg: 'secondary'
  }
})
```
css属性的值如果在主题对应的命名空间内存在，则会将其自动转换主题内设置的值(命名空间：如颜色类的对应theme内的colors属性，widht等对应theme内的space灯)  

2、模板语法
```
import { styled } from '@quick/cssinjs'

const Button = styled('button', {
  base: {
    color: '{colors.primary}'
  }
})
```
用大括号包裹的值将按层级从thmem中获取具体的值(可以获取theme中定义的任何值，而不限于css属性对应的命名空间)  

3、使用函数
```
const Button = styled('button', ({ theme }) => ({
  base: {
    color: theme?.colors?.primary
  }
}))
```

### 预设样式
在主题内通过presets预设部分样式，然后直接使用
```
const theme = defineTheme({
  colors: { primary: 'red', secondary: 'blue' },
  presets: {
    solid: { width: '200px' }
  }
})

const Box = styled('div')

const Component = () => <Box preset='solid' />
```

## 样式优先级
组件顶级顶层css属性 > sx样式 > 预设样式 > variant样式 > base样式  

组件顶级顶层css属性:
```
const Box = styled('div')

const Component = () => <Box bg='red' />

```
sx样式:  

```
const Box = styled('div')

const Component = () => <Box sx={{ bg:'red' }} />

```