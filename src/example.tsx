import {PortableText, TypeSerializer, MarkSerializers} from 'types'
import BlockContent from './BlockContent'
type CustomTypes = {
  note: {
    title: string
    content: PortableText<CustomTypes>
  }
  button: {color: 'red' | 'blue' | 'white'}
}
type CustomMarks = {
  highlight: {
    color: 'yellow' | 'orange'
  }
}
const PortableText = () => (
  <BlockContent<CustomTypes, CustomMarks>
    serializers={{
      types: {
        button: Button,
        note(props) {
          console.log(props)
          return null
        },
      },
      marks,
    }}
    blocks={[
      {
        _type: 'button',
        color: 'blue',
      },
      {
        _type: 'block',
        markDefs: [
          {
            _key: 'highlight',
            color: 'orange',
          },
        ],
        children: [
          {
            _type: 'span',
            text: '',
            marks: ['highlight'],
          },
        ],
      },
    ]}
  />
)
export default PortableText

const Button: TypeSerializer<CustomTypes, 'button'> = (props) => {
  console.log(props)

  return null
}

const marks: MarkSerializers<CustomMarks> = {
  highlight(props) {
    console.log(props)

    return null
  },
}
