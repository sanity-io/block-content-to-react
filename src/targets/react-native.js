const React = require('react')
const {View, Linking, Dimensions, Image, Text} = require('react-native')
const internals = require('@sanity/block-content-to-hyperscript/internals')
const {styles, textStyles} = require('./react-native-styles')

const {getImageUrl, getSerializers, mergeSerializers} = internals
const h = React.createElement

class DynamicImage extends React.PureComponent {
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
  constrainDimensions(img) {
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
      h(Text, {style: styles.listItem}, children)
    )
  }

  if (type === 'number') {
    return h(
      View,
      {key: props.node._key, style: styles.listItemWrapper},
      h(Text, {style: styles.bulletlistIcon}, `${props.index + 1}. `),
      h(Text, {style: styles.listItem}, children)
    )
  }

  return h(View, {key: props.node._key, style: styles.listItem}, children)
}

const HardBreakSerializer = () => h(Text, null, '\n')

const ContainerSerializer = ({children}) => h(View, {style: {maxWidth: "100%"}}, children)

const {defaultSerializers, serializeSpan} = getSerializers(h)
const serializers = mergeSerializers(defaultSerializers, {
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
  container: ContainerSerializer,
  markFallback: Text,
  text: Text,
  empty: View
})

module.exports = {
  serializers,
  serializeSpan,
  renderProps: {listNestMode: 'normal'}
}
