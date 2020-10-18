/* eslint-disable id-length, max-len */
import * as React from 'react'
import ReactDOM from 'react-dom/server'
import runTests from '@sanity/block-content-tests'
import reactTestRenderer from 'react-test-renderer'
import BlockContent, {getImageUrl, defaultSerializers, ReactSerializers} from 'index'

// eslint-disable-next-line no-console
console.warn = jest.fn() // silences the console.watn calls when running tests
// REVIEW: could we somehow test when console.warn have been called?
// it('console.warn have been called', () => {
//   expect(console.warn).toBeCalledWith(/** */)
// })

const h = React.createElement
const render = (props) => ReactDOM.renderToStaticMarkup(h(BlockContent, props))
const normalize = (html) =>
  html.replace(/ style="(.*?)"/g, (_, styleProps) => {
    const style = styleProps.replace(/;$/g, '')
    return ` style="${style}"`
  })

runTests({render, h, normalize, getImageUrl})

test('renders empty block with react proptype error', () => {
  expect(render({})).toMatchSnapshot()
})

test('renders uses empty array instead of undefined/null blocks prop', () => {
  expect(render({blocks: undefined})).toMatchSnapshot()
  expect(render({blocks: null})).toMatchSnapshot()
})

test('can reuse default serializers', () => {
  const input = [
    {
      _key: 'meh',
      _type: 'block',
      markDefs: [],
      style: 'normal',
      children: [
        {
          _key: 'zing',
          _type: 'span',
          marks: ['em'],
          text: 'Plain text.'
        }
      ]
    },
    {
      _key: 'blah',
      _type: 'block',
      markDefs: [],
      style: 'blockquote',
      children: [
        {
          _key: 'moop',
          _type: 'span',
          marks: [],
          text: 'Some quote'
        }
      ]
    }
  ]

  const block = props => {
    if (props.node.style !== 'blockquote') {
      return defaultSerializers.types.block(props)
    }

    return React.createElement(
      'blockquote',
      {className: 'my-quote'},
      props.node.children.map(child => child.text)
    )
  }

  expect(render({blocks: input, serializers: {types: {block}}})).toMatchSnapshot()
})

test('should reuse serializers', () => {
  const block = {
    _key: '58cf8aa1fc74',
    _type: 'sometype',
    something: {someProperty: 'someValue'}
  }

  let numMounts = 0
  class RootComponent extends React.Component {
    serializers: ReactSerializers
    constructor(props) {
      super(props)
      this.serializers = {
        types: {
          //@ts-ignore
          sometype: class SometypeComponent extends React.Component {
            // eslint-disable-next-line class-methods-use-this
            componentDidMount() {
              numMounts += 1
            }

            render() {
              //@ts-ignore
              return React.createElement('div', {}, `Hello ${this.props.msg}`)
            }
          }
        }
      }
    }

    render() {
      return React.createElement(BlockContent, {
        serializers: this.serializers,
        blocks: [block],
        //@ts-ignore
        msg: this.props.msg
      })
    }
  }

  const element = React.createElement(RootComponent, {msg: 'there'}, null)
  const renderer = reactTestRenderer.create(element)
  renderer.update(React.createElement(RootComponent, {msg: 'you'}, null))
  expect(numMounts).toBe(1)
})
