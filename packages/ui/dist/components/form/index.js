import { Form } from 'antd';
import { styled } from '@quick/cssinjs';

// src/components/form/index.tsx
var StyledItem = styled(Form.Item);
var Item = StyledItem;
Item.useStatus = Form.Item.useStatus;
var item_default = Item;
var ErrorList = styled(Form.ErrorList);
var error_list_default = ErrorList;
var Provider = styled(Form.Provider);
var provider_default = Provider;

// src/components/form/index.tsx
var { useForm, useFormInstance, useWatch } = Form;
var StyledForm = styled(Form);
var Form4 = StyledForm;
Form4.Item = item_default;
Form4.List = Form.List;
Form4.ErrorList = error_list_default;
Form4.Provider = provider_default;
Form4.useForm = useForm;
Form4.useFormInstance = useFormInstance;
Form4.useWatch = useWatch;
var form_default = Form4;

export { form_default as default };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map