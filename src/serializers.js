const React = require('react')
const objectAssign = require('object-assign')
const getImageUrl = require('./getImageUrl')

const h = React.createElement

// Low-level block serializer
function BlockSerializer(props) {
  const blockType = props.node._type
  const serializer = props.serializers.types[blockType]
  if (!serializer) {
    throw new Error(
      `Unknown block type "${blockType}", please specify a serializer for it in the \`serializers.types\` prop`
    )
  }

  return h(serializer, {node: props.node, options: props.options}, props.children)
}

// Low-level span serializer
function SpanSerializer(props) {
  const {mark, children} = props.node
  const isPlain = typeof mark === 'string'
  const markType = isPlain ? mark : mark._type
  const serializer = props.serializers.marks[markType]
  if (!serializer) {
    throw new Error(
      `Unknown mark type "${markType}", please specify a serializer for it in the \`serializers.marks\` prop`
    )
  }

  return h(serializer, props.node, children)
}

// Low-level list serializer
function ListSerializer(props) {
  const tag = props.type === 'bullet' ? 'ul' : 'ol'
  return h(tag, null, props.children)
}

// Low-level list item serializer
function ListItemSerializer(props) {
  return h('li', null, props.children)
}

// Renderer of an actual block of type `block`. Confusing, we know.
function BlockTypeSerializer(props) {
  const style = props.node.style

  if (/^h\d/.test(style || '')) {
    return React.createElement(style, null, props.children)
  }

  return style === 'blockquote'
    ? h('blockquote', null, props.children)
    : h('p', null, props.children)
}

// Serializers for things that can be directly attributed to a tag without any props
// We use partial application to do this, passing the tag name as the first argument
function RawMarkSerializer(tag, props) {
  return h(tag, null, props.children)
}

function UnderlineSerializer(props) {
  return h('span', {style: {textDecoration: 'underline'}}, props.children)
}

function StrikeThroughSerializer(props) {
  return h('del', null, props.children)
}

function LinkSerializer(props) {
  return h('a', {href: props.mark.href}, props.children)
}

function ImageSerializer(props) {
  return h('figure', null, h('img', {src: getImageUrl(props)}))
}

// Serializer that recursively calls itself, producing a React tree of spans
function serializeSpan(span, serializers) {
  if (typeof span === 'string') {
    return span
  }

  const serializedNode = objectAssign({}, span, {
    children: span.children.map(child => serializeSpan(child, serializers))
  })

  return h(serializers.span, {
    key: span._key,
    node: serializedNode,
    serializers
  })
}

const defaultMarkSerializers = {
  strong: RawMarkSerializer.bind(null, 'strong'),
  em: RawMarkSerializer.bind(null, 'em'),
  code: RawMarkSerializer.bind(null, 'code'),
  underline: UnderlineSerializer,
  'strike-through': StrikeThroughSerializer,
  link: LinkSerializer
}

const defaultSerializers = {
  // Common overrides
  types: {
    block: BlockTypeSerializer,
    image: ImageSerializer
  },
  marks: defaultMarkSerializers,

  // Less common overrides
  list: ListSerializer,
  listItem: ListItemSerializer,

  block: BlockSerializer,
  span: SpanSerializer
}

module.exports = {
  defaultSerializers,
  serializeSpan
}
