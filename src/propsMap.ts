import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  value?: string;
  component: string;
  subComponent?: string;
  text?: string;
  extraProps?: {[key: string]: any};
  options?: { text: string; value: any }[];
  initalTransform?: (v: any) => any;
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
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v)
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    initalTransform: (v: string) => parseFloat(v)
  },
  textAlign: {
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    text: '对齐',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' }
    ]
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [
      { text: '无', value: ''},
      { text: '宋体', value: '"SimSun","STSong"' },
      { text: '黑体', value: '"SimHei","STHeiti"' },
      { text: '楷体', value: '"KaiTi","STKaiti"' },
      { text: '仿宋', value: '"FangSong","STFangsong"' },
    ],
    extraProps: {
      style: "width: 100%"
    }
  }
}
