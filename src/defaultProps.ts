import { mapValues, without } from "lodash-es"

export const commonDefaultProps = {
  // action
  actionType: '',
  url: '',

  // size
  height: '',
  width: '318px',
  paddingLeft: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  paddingRight: '0px',

  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',

  // shadow and opacity
  boxShadow: '0 0 0 #000000',
  opacity: 1,
  
  // position and x,y
  position: 'absolute',
  left: '0',
  right: '0',
  top: '0'
}

export const textDefaultProps = {
  text: '正文内容',
  fontSize: '14px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'left',
  color: '#000000',
  backgroundColor: '',
  ...commonDefaultProps
}

export const textStylePropsName = without(Object.keys(textDefaultProps), 'text', 'actionType', 'url')

export const transformToComponentProps = (props: {[key: string]: any }) => {
  return mapValues(props, (item) => {
    return {
      type: item.constructor,
      default: item
    }
  })
}