const React = require('react')
const PropTypes = require('prop-types')
const objectAssign = require('object-assign')
const buildMarksTree = require('./buildMarksTree')
const {defaultSerializers, serializeSpan} = require('./serializers')

const h = React.createElement

function BlockContent(props) {
  const {blocks, className} = props
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

  return Array.isArray(blocks)
    ? h('div', {className}, blocks.map(serializeBlock))
    : serializeBlock(blocks)
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
