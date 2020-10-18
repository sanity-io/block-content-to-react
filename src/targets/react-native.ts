import * as React from 'react'
import {View, Linking, Dimensions, Image, Text} from 'react-native'
import {getImageUrl, getSerializers, mergeSerializers} from '@sanity/block-content-to-hyperscript'
import {styles, textStyles} from 'targets/react-native-styles'

const h = React.createElement

export interface ConstrainDimensions {
  width: number
  height: number
  maxWidth?: string
}

export interface DynamicImageState {
  size: null | ConstrainDimensions
}

class DynamicImage extends React.PureComponent<any, DynamicImageState> {
  constructor(props) {
    super(props)

    this.state = {size: null}

    const {imgWidth, imgHeight} = props
    if (imgWidth) {
      this.state = {size: this.constrainDimensions({width: imgWidth, height: imgHeight})}
    } else {
      Image.getSize(props.source.uri, this.handleSizeFetched.bind(this))
    }
  }

  // eslint-disable-next-line class-methods-use-this
  constrainDimensions(img): ConstrainDimensions {
    const windowDimensions = Dimensions.get('window')
    const maxWidth = windowDimensions.width
    const maxHeight = windowDimensions.height
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)

    return {
      width: img.width * ratio,
      height: img.height * ratio
    }
  }

  handleSizeFetched(width, height) {
    const size = this.constrainDimensions({width, height})
    size.maxWidth = '100%'
    this.setState({size})
  }

  render() {
    return this.state.size
      ? h(Image, Object.assign({}, this.props, {style: this.state.size}))
      : h(View)
  }
}

const BlockTypeSerializer = props => {
  const style = props.node.style || 'normal'
  // Wrap in a text element to make children display inline
  return h(View, {style: styles[style]}, h(Text, {style: textStyles[style]}, props.children))
}

const RnImageSerializer = props => {
  const docId = props.node.asset._ref || ''
  const [imgWidth, imgHeight] = docId
    .replace(/.*?-(\d+x\d+)-[a-z]+$/, '$1')
    .split('x')
    .map(num => parseInt(num, 10))

  return h(DynamicImage, {
    source: {uri: getImageUrl(props)},
    imgWidth,
    imgHeight
  })
}

const markSerializer = (style, props) => {
  return h(Text, {style: textStyles[style]}, props.children)
}

const LinkSerializer = props => {
  const onPress = () => Linking.openURL(props.mark.href)
  return h(Text, {onPress, style: textStyles.link}, props.children)
}

const ListSerializer = props => {
  const marginStyles = props.level > 1 ? {marginVertical: 0} : {}
  return h(
    View,
    {style: [styles.list, {paddingLeft: 16 * props.level}, marginStyles]},
    props.children
  )
}

const ListItemSerializer = props => {
  const type = props.node.listItem
  const children =
    !props.node.style || props.node.style === 'normal'
      ? // Don't wrap plain text in paragraphs inside of a list item
        props.children
      : // But wrap any other style in whatever the block serializer says to use
        h(props.serializers.types.block, props, props.children)

  if (type === 'bullet') {
    return h(
      View,
      {key: props.node._key, style: styles.listItemWrapper},
      h(Text, {style: styles.bulletlistIcon}, '\u00B7'),
      h(View, {style: styles.listItem}, children)
    )
  }

  if (type === 'number') {
    return h(
      View,
      {key: props.node._key, style: styles.listItemWrapper},
      h(Text, {style: styles.numberlistIcon}, `${props.index + 1}. `),
      h(View, {style: styles.listItem}, children)
    )
  }

  return h(View, {key: props.node._key, style: styles.listItem}, children)
}

const HardBreakSerializer = () => h(Text, null, '\n')

const {defaultSerializers: _defaultSerializers, serializeSpan} = getSerializers(h)
export {serializeSpan}
export const defaultSerializers = mergeSerializers(_defaultSerializers, {
  // Common overrides
  types: {
    block: BlockTypeSerializer,
    image: RnImageSerializer
  },

  marks: {
    strong: markSerializer.bind(null, 'strong'),
    em: markSerializer.bind(null, 'em'),
    code: markSerializer.bind(null, 'code'),
    underline: markSerializer.bind(null, 'underline'),
    'strike-through': markSerializer.bind(null, 'strike-through'),
    link: LinkSerializer
  },

  list: ListSerializer,
  listItem: ListItemSerializer,
  hardBreak: HardBreakSerializer,
  container: View,
  markFallback: Text,
  text: Text,
  empty: View
})

export const renderProps = {listNestMode: 'normal'}
