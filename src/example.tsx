import {Block} from 'types'
import BlockContent from './BlockContent'
type CustomTypes = {
  note: {
    title: string
    content: Block
  }
  button: {color: 'red' | 'blue' | 'white'}
}
const PortableText = () => (
  <BlockContent<CustomTypes>
    serializers={{
      types: {
        note(props) {
          console.log(props.node.title, props.node.content)
          return null
        },
        button(props) {
          console.log(props.node.color)
          return null
        },
      },
    }}
    blocks={[
      {
        _type: 'note',
        content: {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Some text',
            },
          ],
        },
        title: 'Note title',
      },
    ]}
  />
)
export default PortableText
