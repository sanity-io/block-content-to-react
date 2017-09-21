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
