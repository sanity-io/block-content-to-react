const buildMarksTree = require('../src/buildMarksTree')

test('builds empty tree on empty block', () => {
  const {input} = require('./fixtures/001-empty-block')
  expect(buildMarksTree(input)).toMatchSnapshot()
})

test('builds simple one-node tree on single, markless span', () => {
  const {input} = require('./fixtures/002-single-span')
  expect(buildMarksTree(input)).toMatchSnapshot()
})

test('builds simple multi-node tree on markless spans', () => {
  const {input} = require('./fixtures/003-multiple-spans')
  expect(buildMarksTree(input)).toMatchSnapshot()
})

test('builds annotated span on simple mark', () => {
  const {input} = require('./fixtures/004-basic-mark-single-span')
  expect(buildMarksTree(input)).toMatchSnapshot()
})

test('builds annotated, joined span on adjacent, equal marks', () => {
  const {input} = require('./fixtures/005-basic-mark-multiple-adjacent-spans')
  expect(buildMarksTree(input)).toMatchSnapshot()
})

test('builds annotated, nested spans in tree format', () => {
  const {input} = require('./fixtures/006-basic-mark-nested-marks')
  expect(buildMarksTree(input)).toMatchSnapshot()
})

test('builds annotated spans with expanded marks on object-style marks', () => {
  const {input} = require('./fixtures/007-link-mark-def')
  expect(buildMarksTree(input)).toMatchSnapshot()
})

test('builds correct structure from advanced, nested mark structure', () => {
  const {input} = require('./fixtures/009-messy-link-text')
  expect(buildMarksTree(input)).toMatchSnapshot()
})
