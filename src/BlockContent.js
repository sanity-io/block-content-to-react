const React = require('react')
const PropTypes = require('prop-types')
const internals = require('@sanity/block-content-to-hyperscript/internals')
const {serializers, renderProps} = require('./targets/dom')

const {getImageUrl, blocksToNodes, mergeSerializers} = internals

const renderNode = React.createElement
const defaultProps = Object.assign({blocks: []}, renderProps)

const SanityBlockContent = props => {
  const customSerializers = mergeSerializers(
    SanityBlockContent.defaultSerializers,
    props.serializers
  )

  return blocksToNodes(
    renderNode,
    Object.assign({}, defaultProps, props, {serializers: customSerializers})
  )
}

// Expose default serializers to the user
SanityBlockContent.defaultSerializers = serializers

// Expose logic for building image URLs from an image reference/node
SanityBlockContent.getImageUrl = getImageUrl

SanityBlockContent.propTypes = {
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

SanityBlockContent.defaultProps = {
  serializers: {},
  imageOptions: {}
}

module.exports = SanityBlockContent
