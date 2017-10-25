const React = require('react')
const PropTypes = require('prop-types')
const objectAssign = require('object-assign')
const buildMarksTree = require('./buildMarksTree')
const nestLists = require('./nestLists')
const getImageUrl = require('./getImageUrl')
const {defaultSerializers, serializeSpan} = require('./serializers')

// Properties to extract from props and pass to serializers as options
const optionProps = ['projectId', 'dataset', 'imageOptions']
const isDefined = val => typeof val !== 'undefined'
const h = React.createElement

function BlockContent(props) {
  const blocks = nestLists(Array.isArray(props.blocks) ? props.blocks : [props.blocks])
  const serializers = getSerializers(props.serializers)
  const options = optionProps.reduce((opts, key) => {
    const value = props[key]
    if (isDefined(value)) {
      opts[key] = value
    }
    return opts
  }, {})

  function serializeNode(node, index, siblings, isInline) {
    if (isList(node)) {
      return serializeList(node)
    }

    if (isListItem(node)) {
      return serializeListItem(node)
    }

    if (isSpan(node)) {
      return serializeSpan(node, serializers, index)
    }

    return serializeBlock(node, index, isInline)
  }

  function serializeBlock(block, index, isInline) {
    const tree = buildMarksTree(block)
    const children = tree.map((node, i, siblings) => serializeNode(node, i, siblings, true))
    const blockProps = {
      key: block._key || `block-${index}`,
      node: block,
      isInline,
      serializers,
      options
    }

    return h(serializers.block, blockProps, children)
  }

  function serializeListItem(block) {
    const key = block._key
    const tree = buildMarksTree(block)
    const children = tree.map(serializeNode)
    return h(serializers.listItem, {node: block, key, options}, children)
  }

  function serializeList(list) {
    const type = list.listItem
    const key = list._key
    const children = list.children.map(serializeNode)
    return h(serializers.list, {key, type, options}, children)
  }

  const nodes = blocks.map(serializeNode)
  if (nodes.length > 1) {
    return h('div', {className: props.className}, nodes)
  }

  return nodes[0] || null
}

function isList(block) {
  return block._type === 'list' && block.listItem
}

function isListItem(block) {
  return block._type === 'block' && block.listItem
}

function isSpan(block) {
  return typeof block === 'string' || block.marks || block._type === 'span'
}

// Recursively merge/replace default serializers with user-specified serializers
function getSerializers(userSerializers) {
  return Object.keys(defaultSerializers).reduce((acc, key) => {
    if (typeof defaultSerializers[key] === 'function') {
      acc[key] = isDefined(userSerializers[key]) ? userSerializers[key] : defaultSerializers[key]
    } else {
      acc[key] = objectAssign({}, defaultSerializers[key], userSerializers[key])
    }
    return acc
  }, {})
}

// Expose default serializers to the user
BlockContent.defaultSerializers = defaultSerializers

// Expose logic for building image URLs from an image reference/node
BlockContent.getImageUrl = getImageUrl

BlockContent.propTypes = {
  className: PropTypes.string,

  // When rendering images, we need project id and dataset, unless images are materialized
  projectId: PropTypes.string,
  dataset: PropTypes.string,
  imageOptions: PropTypes.object,

  serializers: PropTypes.shape({
    // Common overrides
    types: PropTypes.object,
    marks: PropTypes.object,

    // Less common overrides
    list: PropTypes.func,
    listItem: PropTypes.func,

    // Low-level serializers
    block: PropTypes.func,
    span: PropTypes.func
  }),

  blocks: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        _type: PropTypes.string.isRequired
      })
    ),
    PropTypes.shape({
      _type: PropTypes.string.isRequired
    })
  ]).isRequired
}

BlockContent.defaultProps = {
  serializers: BlockContent.defaultSerializers,
  imageOptions: {}
}

module.exports = BlockContent
