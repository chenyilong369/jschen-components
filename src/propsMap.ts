import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  value?: string;
  component: string;
}

export type PropToForms = {
  [P in keyof TextComponentProps]? : PropToForm
}

export const mapPropsToForms: PropToForms = {
  text: {
    component: 'a-input', 
  }
}
