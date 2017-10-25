/* eslint-disable id-length, max-len */
const React = require('react')
const ReactDOM = require('react-dom/server')
const BlockContent = require('../src/BlockContent')

const h = React.createElement

const render = props => ReactDOM.renderToStaticMarkup(h(BlockContent, props))

test('builds empty tree on empty block', () => {
  const {input, output} = require('./fixtures/001-empty-block')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds simple one-node tree on single, markless span', () => {
  const {input, output} = require('./fixtures/002-single-span')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds simple multi-node tree on markless spans', () => {
  const {input, output} = require('./fixtures/003-multiple-spans')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds annotated span on simple mark', () => {
  const {input, output} = require('./fixtures/004-basic-mark-single-span')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds annotated, joined span on adjacent, equal marks', () => {
  const {input, output} = require('./fixtures/005-basic-mark-multiple-adjacent-spans')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds annotated, nested spans in tree format', () => {
  const {input, output} = require('./fixtures/006-basic-mark-nested-marks')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds annotated spans with expanded marks on object-style marks', () => {
  const {input, output} = require('./fixtures/007-link-mark-def')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds correct structure from advanced, nested mark structure', () => {
  const {input, output} = require('./fixtures/009-messy-link-text')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds bullet lists in parent container', () => {
  const {input, output} = require('./fixtures/010-basic-bullet-list')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds numbered lists in parent container', () => {
  const {input, output} = require('./fixtures/011-basic-numbered-list')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds images with passed projectId/dataset', () => {
  const {input, output} = require('./fixtures/012-image-support')
  const result = render({blocks: input, projectId: '3do82whm', dataset: 'production'})
  expect(result).toEqual(output)
})

test('builds images with passed query params', () => {
  const {input} = require('./fixtures/013-materialized-image-support')
  const result = render({blocks: input, imageOptions: {w: 320, h: 240}})
  expect(result).toContain('5748x3832.jpg?w=320&amp;h=240')
})

test('builds nested lists', () => {
  const {input, output} = require('./fixtures/014-nested-lists')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds all basic marks as expected', () => {
  const {input, output} = require('./fixtures/015-all-basic-marks')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('builds weirdly complex lists without any issues', () => {
  const {input, output} = require('./fixtures/016-deep-weird-lists')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('renders all default block styles', () => {
  const {input, output} = require('./fixtures/017-all-default-block-styles')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('sorts marks correctly on equal number of occurences', () => {
  const {input, output} = require('./fixtures/018-marks-all-the-way-down')
  const marks = {
    highlight: ({mark, children}) => h('span', {style: {backgroundColor: mark.color}}, children)
  }
  const result = render({blocks: input, serializers: {marks}})
  expect(result).toEqual(output)
})

test('handles keyless blocks/spans', () => {
  const {input, output} = require('./fixtures/019-keyless')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('handles empty arrays', () => {
  const {input, output} = require('./fixtures/020-empty-array')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('handles lists without level', () => {
  const {input, output} = require('./fixtures/021-list-without-level')
  const result = render({blocks: input})
  expect(result).toEqual(output)
})

test('handles inline non-span nodes', () => {
  const {input, output} = require('./fixtures/022-inline-nodes')
  const result = render({blocks: input, projectId: '3do82whm', dataset: 'production'})
  expect(result).toEqual(output)
})

test('can specify custom serializer for custom block types', () => {
  const {input, output} = require('./fixtures/050-custom-block-type')
  const CodeRenderer = props => {
    expect(props).toMatchObject({
      children: [],
      node: {_key: '9a15ea2ed8a2', _type: 'code', code: input[0].code, language: 'javascript'},
      options: {imageOptions: {}}
    })
    return h('pre', {'data-language': props.node.language}, h('code', null, props.node.code))
  }
  const types = {code: CodeRenderer}
  const result = render({blocks: input, serializers: {types}})
  expect(result).toEqual(output)
})

test('can override default serializers', () => {
  const {input, output} = require('./fixtures/051-override-defaults')
  const ImageRenderer = props => h('img', {alt: 'Such image', src: BlockContent.getImageUrl(props)})
  const types = {image: ImageRenderer}
  const result = render({
    blocks: input,
    serializers: {types},
    projectId: '3do82whm',
    dataset: 'production'
  })
  expect(result).toEqual(output)
})

test('can specify custom serializers for custom marks', () => {
  const {input, output} = require('./fixtures/052-custom-marks')
  const highlight = ({mark, children}) =>
    h('span', {style: {backgroundColor: mark.color}}, children)

  const result = render({blocks: input, serializers: {marks: {highlight}}})
  expect(result).toEqual(output)
})

test('can specify custom serializers for defaults marks', () => {
  const {input, output} = require('./fixtures/053-override-default-marks')
  const link = ({mark, children}) => h('a', {className: 'mahlink', href: mark.href}, children)

  const result = render({blocks: input, serializers: {marks: {link}}})
  expect(result).toEqual(output)
})

test('can specify custom class name for container', () => {
  const input = [
    {_key: 'a', _type: 'block', children: [{_type: 'span', marks: [], text: 'Hei'}]},
    {_key: 'b', _type: 'block', children: [{_type: 'span', marks: [], text: 'Der'}]}
  ]
  const result = render({blocks: input, className: 'blockContent'})
  expect(result).toEqual('<div class="blockContent"><p>Hei</p><p>Der</p></div>')
})
