const React = require('react')
const {getSerializers} = require('@sanity/block-content-to-hyperscript/internals')

const renderNode = React.createElement
const {defaultSerializers, serializeSpan} = getSerializers(renderNode)

module.exports = {
  serializeSpan,
  serializers: defaultSerializers,
  renderProps: {nestMarks: true}
}
