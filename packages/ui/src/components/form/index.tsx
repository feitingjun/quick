import { Form as AntdForm, type FormInstance } from 'antd'
import { styled } from '@quick/cssinjs'
import Item from './item'
import ErrorList from './error-list'
import Provider from './provider'

const { useForm, useFormInstance, useWatch } = AntdForm

// 不能推断泛型默认值，所以要手动传入泛型any
const StyledForm = styled<typeof AntdForm<any>>(AntdForm)

type CompoundedComponent = typeof StyledForm & {
  Item: typeof Item
  List: typeof AntdForm.List
  ErrorList: typeof ErrorList
  Provider: typeof Provider
  useForm: typeof useForm
  useFormInstance: typeof useFormInstance
  useWatch: typeof useWatch
}

const Form = StyledForm as CompoundedComponent
Form.Item = Item
Form.List = AntdForm.List
Form.ErrorList = ErrorList
Form.Provider = Provider
Form.useForm = useForm
Form.useFormInstance = useFormInstance
Form.useWatch = useWatch

export type FormProps = React.ComponentProps<typeof StyledForm>
export type FormItemProps = React.ComponentProps<typeof Item>
export type FormListProps = React.ComponentProps<typeof AntdForm.List>
export type FormErrorListProps = React.ComponentProps<typeof ErrorList>
export type FormProviderProps = React.ComponentProps<typeof Provider>
export type { FormInstance }

export default Form
