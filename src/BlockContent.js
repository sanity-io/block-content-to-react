const React = require('react')
const PropTypes = require('prop-types')
const objectAssign = require('object-assign')
const buildMarksTree = require('./buildMarksTree')
const {defaultSerializers, serializeSpan} = require('./serializers')

const h = React.createElement

function BlockContent(props) {
  const blocks = Array.isArray(props.blocks) ? props.blocks : [props.blocks]
  const serializers = getSerializers(props.serializers)

  const serializeBlock = block => {
    const tree = buildMarksTree(block)
    const children = tree.map(span => serializeSpan(span, serializers))
    const blockProps = {
      key: block._key,
      node: block,
      serializers
    }

    return h(serializers.block, blockProps, children)
  }

  const serializeListItem = block => {
    const key = block._key
    const tree = buildMarksTree(block)
    const children = tree.map(span => serializeSpan(span, serializers))
    return h(serializers.listItem, {node: block, key}, children)
  }

  const serializeList = listBlocks => {
    const first = listBlocks[0]
    const type = first.listItem
    const key = first._key
    const children = listBlocks.map(serializeListItem)
    return h(serializers.list, {key, type}, children)
  }

  const {nodes} = blocks.reduce(
    (acc, block, index) => {
      // Non-list blocks are simple enough that we can just call the serializer directly
      if (!isList(block)) {
        acc.nodes.push(serializeBlock(block))
        return acc
      }

      // Lists on the other hand, are simply a series of adjacent siblings blocks,
      // and thus need to be accumualted in order to be nested into a tree structure
      acc.listBlocks.push(block)

      // The only way we can see if a list is completed is if the next block is not
      // of the same list item type, or obviously if there are no more blocks
      const nextBlock = blocks[index + 1]
      const nextBlockType = nextBlock && nextBlock.listItem

      if (nextBlockType !== block.listItem) {
        acc.nodes.push(serializeList(acc.listBlocks))
        acc.listBlocks = []
      }

      return acc
    },
    {nodes: [], listBlocks: []}
  )

  return nodes.length > 1 ? h('div', {className: props.className}, nodes) : nodes[0]
}

function isList(data) {
  return data._type === 'block' && data.listItem
}

// Recursively merge/replace default serializers with user-specified serializers
function getSerializers(userSerializers) {
  return Object.keys(defaultSerializers).reduce((acc, key) => {
    if (typeof defaultSerializers[key] === 'function') {
      acc[key] = userSerializers[key] || defaultSerializers[key]
    } else {
      acc[key] = objectAssign({}, defaultSerializers[key], userSerializers[key])
    }
    return acc
  }, {})
}

// Expose default serializers to the user
BlockContent.defaultSerializers = defaultSerializers

BlockContent.propTypes = {
  className: PropTypes.string,

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
  serializers: BlockContent.defaultSerializers
}

module.exports = BlockContent
