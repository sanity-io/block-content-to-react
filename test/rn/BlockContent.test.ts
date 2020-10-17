/* eslint-disable id-length, max-len, no-sync */
import fs from 'fs'
import path from 'path'
import * as React from 'react'
import {Text} from 'react-native'
import renderer from 'react-test-renderer'
import BlockContent from 'BlockContent'
import {serializers} from 'targets/react-native'

const testFolder = path.dirname(require.resolve('@sanity/block-content-tests'))
const fixturesDir = path.join(testFolder, 'fixtures')
const fixtures = fs
  .readdirSync(fixturesDir)
  .filter((filename) => filename.endsWith('.js'))
  .map((filename) => ({
    name: filename.replace(/^(.*?)\.js$/, '$1'),
    input: require(path.join(fixturesDir, filename)).input,
  }))

const h = React.createElement

function Highlight(props) {
  return h(Text, {style: {backgroundColor: 'yellow'}}, props.children)
}

function CodeSerializer(props) {
  return h(
    Text,
    {
      style: {
        backgroundColor: 'gray',
        fontFamily: 'monospace',
        padding: 16,
      },
    },
    props.node.code
  )
}

function ButtonSerializer(props) {
  return h(Text, {style: {borderColor: '#000'}}, props.node.text)
}

const commonProps = {
  projectId: '3do82whm',
  dataset: 'production',
  serializers: {
    types: {code: CodeSerializer, button: ButtonSerializer},
    marks: {highlight: Highlight},
  },
}

BlockContent.defaultSerializers = serializers

fixtures.forEach((fixture) => {
  test(fixture.name, () => {
    const tree = renderer
      .create(h(BlockContent, Object.assign({blocks: fixture.input}, commonProps)))
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
