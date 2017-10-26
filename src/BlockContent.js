const React = require('react')
const PropTypes = require('prop-types')
const {
  getSerializers,
  getImageUrl,
  blocksToNodes
} = require('@sanity/block-content-to-hyperscript/internals')

const renderNode = React.createElement
const {defaultSerializers} = getSerializers(renderNode)
const BlockContent = blocksToNodes.bind(null, renderNode)

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
