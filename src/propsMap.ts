import { VNode, h } from "vue";
import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  component: string;
  subComponent?: string;
  text?: string | VNode;
  extraProps?: {[key: string]: any};
  options?: { text: string | VNode; value: any }[];
  initalTransform?: (v: any) => any;
  afterTransform?: (v: any) => any;
  valueProp?: string;
  eventName?: string;
}

export type PropToForms = {
  [P in keyof TextComponentProps]? : PropToForm
}
const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' }, 
]

const pxToNumberComponent = (text: string) => {
  return {
    text,
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => typeof e === 'number' ? `${e}px` : ''
  }
}

const fontFamilyOptions = fontFamilyArr.map(item => {
  return {
    value: item.value,
    text: h('span', {style: {fontFamily: item.value}}, item.text)
  }
})

export const mapPropsToForms: PropToForms = {
  text: {
    text: '文本',
    component: 'a-textarea', 
    extraProps: {
      rows: 3
    },
    afterTransform: (e: any) => e.target.value
  },
  fontSize: pxToNumberComponent('字号'),
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString()
  },
  textAlign: {
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    text: '对齐',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [
      { text: '无', value: ''},
      ...fontFamilyOptions,
    ],
    extraProps: {
      style: "width: 80%"
    }
  },
  color: {
    component: 'color-picker',
    text: '字体颜色'
  },
  width: pxToNumberComponent('宽度'),
  height: pxToNumberComponent('高度'),
  paddingLeft: pxToNumberComponent('左边距'),
  paddingRight: pxToNumberComponent('右边距'),
  paddingTop: pxToNumberComponent('上边距'),
  paddingBottom: pxToNumberComponent('下边距'),
  borderStyle: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '边框类型',
    extraProps: {
      style: "width: 80%"
    },
    options: [
      { value: 'none', text: '无' },
      { value: 'solid', text: '实线' },
      { value: 'dashed', text: '破折线' },
      { value: 'dotted', text: '点状线' }
    ]
  },
  borderWidth: {
    ...pxToNumberComponent('边框宽度'),
    component: 'a-slider',
    extraProps:{
      min: 0,
      max: 20
    }
  },
  borderRadius: {
    ...pxToNumberComponent('边框圆角'),
    component: 'a-slider',
    extraProps:{
      min: 0,
      max: 200
    }
  },
  opacity: {
    component: 'a-slider',
    initalTransform: (v: number) => v ? v * 100 : 100,
    afterTransform: (e: number) => (e / 100),
    extraProps: {
      min: 0,
      max: 100,
      reverse: true
    } 
  },
  left: pxToNumberComponent('X轴坐标'),
  top: pxToNumberComponent('Y轴坐标')
}
