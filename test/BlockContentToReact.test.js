/* eslint-disable id-length, no-empty-function */
const {test} = require('tap')
const React = require('react')
const ReactDOM = require('react-dom/server')
const BlockContent = require('../src')

const h = React.createElement

test.skip = () => {}

const render = props => ReactDOM.renderToStaticMarkup(
  React.createElement(BlockContent, props)
)

const blockTypeHandlers = {
  marks: {em: null},
  listBlock: {
    number: node => h('ol', {key: node.nodeKey, className: 'foo'}, node.children),
    listItem: node => h('li', {key: node.nodeKey, className: `item-style-${node.style}`}, node.children)
  },
  textBlock: {
    normal: node => h('p', {key: node.nodeKey, className: 'foo'}, node.children),
    h2: node => h('div', {key: node.nodeKey, className: 'big-heading', id: node.extra}, node.children)
  },
  span: node => {
    if (node.attributes.author) {
      return h('div', null, node.attributes.author.name)
    }

    if (node.attributes.link) {
      return h('a', {key: node.nodeKey, className: 'foo', href: node.attributes.link.href}, node.children)
    }

    return node.children && node.children.length === 1
      ? node.children[0]
      : h('span', null, node.children)
  }
}

const renderCustom = props => ReactDOM.renderToStaticMarkup(
  React.createElement(BlockContent, Object.assign({}, props, {
    blockTypeHandlers,
    customTypeHandlers: {
      author: node => h('div', null, node.attributes.name),
      block: node => {
        const defaultBlock = BlockContent.getTypeHandlers(blockTypeHandlers).block
        if (!node.parent || node.parent.type !== 'block') {
          return h('div', {className: 'grid', key: node.nodeKey}, node.children, defaultBlock(node))
        }

        return defaultBlock(node)
      }
    }
  }))
)

test('handles a plain string block', t => {
  const input = require('./fixtures/plain-text.json')
  const expected = '<p>Normal string of text.<br/>Another line</p>'
  const result = render({blocks: input})
  t.same(result, expected)
  t.end()
})

test('handles a plain string block with custom adapter', t => {
  const input = require('./fixtures/plain-text.json')
  const expected = '<div class="grid"><p class="foo">Normal string of text.<br/>Another line</p></div>'
  const result = renderCustom({blocks: input})
  t.same(result, expected)
  t.end()
})

test('handles italicized text', t => {
  const input = require('./fixtures/italicized-text.json')
  const expected = '<p>String with an <em>italicized</em> word.</p>'
  const result = render({blocks: input})
  t.same(result, expected)
  t.end()
})

test('handles italicized text with custom adapter and removes the em mark if mapped to null', t => {
  const input = require('./fixtures/italicized-text.json')
  const expected = '<div class="grid"><p class="foo">String with an italicized word.</p></div>'
  const result = renderCustom({blocks: input})
  t.same(result, expected)
  t.end()
})


test('handles underline text', t => {
  const input = require('./fixtures/underlined-text.json')
  const expected = '<p>String with an <underline>underlined</underline> word.</p>'
  t.same(render({blocks: input}), expected)
  t.end()
})

test('handles bold-underline text', t => {
  const input = require('./fixtures/bold-underline-text.json')
  const expected = '<p>Plain<strong>only-bold<underline>bold-and-underline</underline></strong><underline>only-underline</underline>plain</p>'
  t.same(render({blocks: input}), expected)
  t.end()
})

test('does not care about span marks order', t => {
  const orderedInput = require('./fixtures/marks-ordered-text.json')
  const reorderedInput = require('./fixtures/marks-reordered-text.json')
  const expected = '<p>Plain<strong>strong<underline>strong and underline<em>strong and underline and emphasis</em></underline></strong>'
    + '<em><underline>underline and emphasis</underline></em>plain again</p>'
  t.same(render({blocks: orderedInput}), expected)
  t.same(render({blocks: reorderedInput}), expected)
  t.end()
})


test('handles a messy text', t => {
  const input = require('./fixtures/messy-text.json')
  const expected = '<p>Hacking <code>teh &lt;codez&gt;</code> is <strong>all <underline>fun</underline>'
    + ' and <em>games</em> until</strong> someone gets p0wn3d.</p>'
  t.same(render({blocks: input}), expected)
  t.end()
})

test('handles simple link text', t => {
  const input = require('./fixtures/link-simple-text.json')
  const expected = '<p>String before link <a href="http://icanhas.cheezburger.com/">actual link text</a> the rest</p>'
  t.same(render({blocks: input}), expected)
  t.end()
})

test('handles simple link text with custom adapter', t => {
  const input = require('./fixtures/link-simple-text.json')
  const expected = '<div class="grid">'
    + '<p class="foo">String before link <a class="foo" href="http://icanhas.cheezburger.com/">actual link text</a>'
    + ' the rest</p></div>'
  t.same(renderCustom({blocks: input}), expected)
  t.end()
})

test.skip('handles simple link text with several attributes with custom adapter', t => {
  const input = require('./fixtures/link-author-text.json')
  const expected = '<div class="grid"><p class="foo">String before link <div>Test Testesen</div>'
    + '<a class="foo" href="http://icanhas.cheezburger.com/">actual link text</a> the rest</p></div>'
  t.same(renderCustom({blocks: input}), expected)
  t.end()
})


test('handles messy link text', t => {
  const input = require('./fixtures/link-messy-text.json')
  const expected = '<p>String with link to <a href="http://icanhas.cheezburger.com/">internet </a>'
    + '<em><strong><a href="http://icanhas.cheezburger.com/">is very strong and emphasis</a></strong>'
    + '<a href="http://icanhas.cheezburger.com/"> and just emphasis</a></em>.</p>'
  t.same(render({blocks: input}), expected)
  t.end()
})

test('handles a numbered list', t => {
  const input = require('./fixtures/list-numbered-blocks.json')
  const expected = '<ol><li>One</li><li>Two has <strong>bold</strong> word</li>'
    + '<li><a href="http://icanhas.cheezburger.com/">Three</a></li></ol>'
  t.same(render({blocks: input}), expected)
  t.end()
})

test('handles a numbered list with custom content adapter', t => {
  const input = require('./fixtures/list-numbered-blocks.json')
  const expected = '<ol class="foo"><li class="item-style-normal">One</li>'
    + '<li class="item-style-normal">Two has <strong>bold</strong> word</li>'
    + '<li class="item-style-h2"><a class="foo" href="http://icanhas.cheezburger.com/">Three</a></li></ol>'
  t.same(renderCustom({blocks: input}), expected)
  t.end()
})


test('handles a bulleted list', t => {
  const input = require('./fixtures/list-bulleted-blocks.json')
  const expected = '<ul><li>I am the most</li><li>expressive<strong>programmer</strong>you know.</li><li>SAD!</li></ul>'
  t.same(render({blocks: input}), expected)
  t.end()
})

test('handles multiple lists', t => {
  const input = require('./fixtures/list-both-types-blocks.json')
  const expected = '<div><ul><li>A single bulleted item</li></ul>'
    + '<ol><li>First numbered</li><li>Second numbered</li></ol>'
    + '<ul><li>A bullet with<strong>something strong</strong></li></ul></div>'
  t.same(render({blocks: input}), expected)
  t.end()
})

test('handles a plain h2 block', t => {
  const input = require('./fixtures/h2-text.json')
  const expected = '<h2>Such h2 header, much amaze</h2>'
  t.same(render({blocks: input}), expected)
  t.end()
})


test('handles a plain h2 block with custom adapter', t => {
  const input = require('./fixtures/h2-text.json')
  const expected = '<div class="grid"><div class="big-heading" id="header_1234">Such h2 header, much amaze</div></div>'
  t.same(renderCustom({blocks: input}), expected)
  t.end()
})

test('uses default with plain h1 block with custom adapter when no handler registered for h1', t => {
  const input = require('./fixtures/h1-text.json')
  const expected = '<div class="grid"><h1>Such h1 header, much amaze</h1></div>'
  t.same(renderCustom({blocks: input}), expected)
  t.end()
})


test.skip('uses default with plain h1 block with custom adapter when no handler registered for h1', t => {
  const plain = require('./fixtures/plain-text.json')
  const h1 = require('./fixtures/h1-text.json')
  const h2 = require('./fixtures/h2-text.json')
  const custom = require('./fixtures/custom-block.json')
  const expected = '<div><div class="grid"><h1>Such h1 header, much amaze</h1>'
    + '<p class="foo">Normal string of text.<br/>Another line</p>'
    + '<div class="big-heading" id="header_1234">Such h2 header, much amaze</div>'
    + '<p class="foo">Normal string of text.<br/>Another line</p></div>'
    + '<div>Test Person</div>'
    + '<div class="grid"><div class="big-heading" id="header_1234">Such h2 header, much amaze</div>'
    + '<p class="foo">Normal string of text.<br/>Another line</p></div></div>'

  t.same(renderCustom({blocks: [h1, plain, h2, plain, custom, h2, plain]}), expected)
  t.end()
})

test('throws an error on custom block type without a registered handler', t => {
  const input = require('./fixtures/custom-block.json')
  t.throws(() => {
    render({blocks: input})
  }, {message: "Don't know how to handle type 'author'"}, {})
  t.end()
})

test('handles a custom block type with a custom registered handler', t => {
  const input = require('./fixtures/custom-block.json')
  const expected = '<div>Test Person</div>'
  const result = renderCustom({blocks: input})
  t.same(result, expected)
  t.end()
})


test('handles dangerous text', t => {
  const input = require('./fixtures/dangerous-text.json')
  const expected = '<p>I am 1337 &lt;script&gt;alert(&#x27;//haxxor&#x27;);&lt;/script&gt;</p>'
  const result = render({blocks: input})
  t.same(result, expected)
  t.end()
})
