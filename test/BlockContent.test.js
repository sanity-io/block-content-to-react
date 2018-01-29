/* eslint-disable id-length, max-len */
const React = require('react')
const ReactDOM = require('react-dom/server')
const runTests = require('@sanity/block-content-tests')
const BlockContent = require('../src/BlockContent')

const h = React.createElement
const getImageUrl = BlockContent.getImageUrl
const render = props => ReactDOM.renderToStaticMarkup(h(BlockContent, props))
const normalize = html =>
  html.replace(/ style="(.*?)"/g, (match, styleProps) => {
    const style = styleProps.replace(/;$/g, '')
    return ` style="${style}"`
  })

runTests({render, h, normalize, getImageUrl})

test('renders empty block with react proptype error', () => {
  expect(h(BlockContent, {})).toMatchSnapshot()
})
