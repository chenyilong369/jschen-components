import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  value?: string;
  component: string;
  text?: string;
  extraProps?: {[key: string]: any};
}

export type PropToForms = {
  [P in keyof TextComponentProps]? : PropToForm
}

export const mapPropsToForms: PropToForms = {
  text: {
    text: '文本',
    component: 'a-input', 
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number'
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    }
  }
}
