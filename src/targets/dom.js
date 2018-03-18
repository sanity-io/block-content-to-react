const React = require('react')
const {getSerializers} = require('@sanity/block-content-to-hyperscript/internals')

const renderNode = React.createElement
const {defaultSerializers} = getSerializers(renderNode)

module.exports = {
  serializers: defaultSerializers,
  renderProps: {nestMarks: true}
}
