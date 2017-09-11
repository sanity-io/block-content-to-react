/* eslint-disable id-length, max-len */
const React = require('react')
const ReactDOM = require('react-dom/server')
const BlockContent = require('../src')

const h = React.createElement

const render = props => ReactDOM.renderToStaticMarkup(h(BlockContent, props))

const blockTypeHandlers = {
  marks: {em: null},
  listBlock: {
    number: node =>
      h('ol', {key: node.nodeKey, className: 'foo'}, node.children),
    listItem: node =>
      h(
        'li',
        {key: node.nodeKey, className: `item-style-${node.style}`},
        node.children
      )
  },
  textBlock: {
    normal: node =>
      h('p', {key: node.nodeKey, className: 'foo'}, node.children),
    h2: node =>
      h(
        'div',
        {key: node.nodeKey, className: 'big-heading', id: node.extra},
        node.children
      )
  },
  span: node => {
    if (node.mark && node.mark._type === 'author') {
      return h('div', null, node.mark.name)
    }

    if (node.mark && node.mark._type === 'link') {
      return h(
        'a',
        {key: node.nodeKey, className: 'foo', href: node.mark.href},
        node.children
      )
    }

    return node.children && node.children.length === 1
      ? node.children[0]
      : h('span', null, node.children)
  }
}

const renderCustom = props => {
  const customTypeHandlers = {
    author: node => {
      return h('div', null, node.attributes.name)
    },
    block: node => {
      const defaultBlock = BlockContent.getTypeHandlers(blockTypeHandlers).block
      if (!node.parent || node.parent.type !== 'block') {
        return h(
          'div',
          {className: 'grid', key: node.nodeKey},
          node.content,
          defaultBlock(node)
        )
      }

      return defaultBlock(node)
    }
  }

  return ReactDOM.renderToStaticMarkup(
    h(
      BlockContent,
      Object.assign({}, props, {
        blockTypeHandlers,
        customTypeHandlers
      })
    )
  )
}

test('handles a plain string block', () => {
  const input = require('./fixtures/plain-text.json')
  const expected = '<p>Normal string of text.<br/>Another line</p>'
  const result = render({blocks: input})
  expect(result).toEqual(expected)
})

test('handles a plain string block with custom adapter', () => {
  const input = require('./fixtures/plain-text.json')
  const expected =
    '<div class="grid"><p class="foo">Normal string of text.<br/>Another line</p></div>'
  const result = renderCustom({blocks: input})
  expect(result).toEqual(expected)
})

test('handles italicized text', () => {
  const input = require('./fixtures/italicized-text.json')
  const expected = '<p>String with an <em>italicized</em> word.</p>'
  const result = render({blocks: input})
  expect(result).toEqual(expected)
})

test('handles italicized text with custom adapter and removes the em mark if mapped to null', () => {
  const input = require('./fixtures/italicized-text.json')
  const expected =
    '<div class="grid"><p class="foo">String with an italicized word.</p></div>'
  const result = renderCustom({blocks: input})
  expect(result).toEqual(expected)
})

test('handles underline text', () => {
  const input = require('./fixtures/underlined-text.json')
  const expected =
    '<p>String with an <underline>underlined</underline> word.</p>'
  expect(render({blocks: input})).toEqual(expected)
})

test('handles bold-underline text', () => {
  const input = require('./fixtures/bold-underline-text.json')
  const expected =
    '<p>Plain<strong>only-bold<underline>bold-and-underline</underline></strong><underline>only-underline</underline>plain</p>'
  expect(render({blocks: input})).toEqual(expected)
})

test('does not care about span marks order', () => {
  const orderedInput = require('./fixtures/marks-ordered-text.json')
  const reorderedInput = require('./fixtures/marks-reordered-text.json')
  const expected =
    '<p>Plain<strong>strong<underline>strong and underline<em>strong and underline and emphasis</em></underline></strong>' +
    '<em><underline>underline and emphasis</underline></em>plain again</p>'
  expect(render({blocks: orderedInput})).toEqual(expected)
  expect(render({blocks: reorderedInput})).toEqual(expected)
})

test('handles a messy text', () => {
  const input = require('./fixtures/messy-text.json')
  const expected =
    '<p>Hacking <code>teh &lt;codez&gt;</code> is <strong>all <underline>fun</underline>' +
    ' and <em>games</em> until</strong> someone gets p0wn3d.</p>'
  expect(render({blocks: input})).toEqual(expected)
})

test('handles simple link text', () => {
  const input = require('./fixtures/link-simple-text.json')
  const expected =
    '<p>String before link <a href="http://icanhas.cheezburger.com/">actual link text</a> the rest</p>'
  expect(render({blocks: input})).toEqual(expected)
})

test('handles simple link text with custom adapter', () => {
  const input = require('./fixtures/link-simple-text.json')
  const expected =
    '<div class="grid">' +
    '<p class="foo">String before link <a class="foo" href="http://icanhas.cheezburger.com/">actual link text</a>' +
    ' the rest</p></div>'
  expect(renderCustom({blocks: input})).toEqual(expected)
})

test.skip(
  'handles simple link text with several attributes with custom adapter',
  () => {
    const input = require('./fixtures/link-author-text.json')
    const expected =
      '<div class="grid"><p class="foo">String before link <div>Test Testesen</div>' +
      '<a class="foo" href="http://icanhas.cheezburger.com/">actual link text</a> the rest</p></div>'
    expect(renderCustom({blocks: input})).toEqual(expected)
  }
)

test('handles messy link text', () => {
  const input = require('./fixtures/link-messy-text.json')
  const expected =
    '<p>String with link to <a href="http://icanhas.cheezburger.com/">internet <em><strong>is very strong and emphasis</strong> and just emphasis</em></a>.</p>'

  expect(render({blocks: input})).toEqual(expected)
})

test('handles a numbered list', () => {
  const input = require('./fixtures/list-numbered-blocks.json')
  const expected =
    '<ol><li>One</li><li>Two has <strong>bold</strong> word</li>' +
    '<li><a href="http://icanhas.cheezburger.com/">Three</a></li></ol>'
  expect(render({blocks: input})).toEqual(expected)
})

test('handles a numbered list with custom content adapter', () => {
  const input = require('./fixtures/list-numbered-blocks.json')
  const expected =
    '<ol class="foo"><li class="item-style-normal">One</li>' +
    '<li class="item-style-normal">Two has <strong>bold</strong> word</li>' +
    '<li class="item-style-h2"><a class="foo" href="http://icanhas.cheezburger.com/">Three</a></li></ol>'
  expect(renderCustom({blocks: input})).toEqual(expected)
})

test('handles a bulleted list', () => {
  const input = require('./fixtures/list-bulleted-blocks.json')
  const expected =
    '<ul><li>I am the most</li><li>expressive<strong>programmer</strong>you know.</li><li>SAD!</li></ul>'
  expect(render({blocks: input})).toEqual(expected)
})

test('handles multiple lists', () => {
  const input = require('./fixtures/list-both-types-blocks.json')
  const expected =
    '<div><ul><li>A single bulleted item</li></ul>' +
    '<ol><li>First numbered</li><li>Second numbered</li></ol>' +
    '<ul><li>A bullet with<strong>something strong</strong></li></ul></div>'
  expect(render({blocks: input})).toEqual(expected)
})

test('handles a plain h2 block', () => {
  const input = require('./fixtures/h2-text.json')
  const expected = '<h2>Such h2 header, much amaze</h2>'
  expect(render({blocks: input})).toEqual(expected)
})

test('handles a plain h2 block with custom adapter', () => {
  const input = require('./fixtures/h2-text.json')
  const expected =
    '<div class="grid"><div class="big-heading" id="header_1234">Such h2 header, much amaze</div></div>'
  expect(renderCustom({blocks: input})).toEqual(expected)
})

test('uses default with plain h1 block with custom adapter when no handler registered for h1', () => {
  const input = require('./fixtures/h1-text.json')
  const expected = '<div class="grid"><h1>Such h1 header, much amaze</h1></div>'
  expect(renderCustom({blocks: input})).toEqual(expected)
})

test.skip(
  'uses default with plain h1 block with custom adapter when no handler registered for h1',
  () => {
    const plain = require('./fixtures/plain-text.json')
    const h1 = require('./fixtures/h1-text.json')
    const h2 = require('./fixtures/h2-text.json')
    const custom = require('./fixtures/custom-block.json')
    const expected =
      '<div><div class="grid"><h1>Such h1 header, much amaze</h1>' +
      '<p class="foo">Normal string of text.<br/>Another line</p>' +
      '<div class="big-heading" id="header_1234">Such h2 header, much amaze</div>' +
      '<p class="foo">Normal string of text.<br/>Another line</p></div>' +
      '<div>Test Person</div>' +
      '<div class="grid"><div class="big-heading" id="header_1234">Such h2 header, much amaze</div>' +
      '<p class="foo">Normal string of text.<br/>Another line</p></div></div>'

    expect(
      renderCustom({blocks: [h1, plain, h2, plain, custom, h2, plain]}),
      expected
    )
  }
)

test('throws an error on custom block type without a registered handler', () => {
  const input = require('./fixtures/custom-block.json')
  expect(() => render({blocks: input})).toThrow(
    "Don't know how to handle type 'author'"
  )
})

test('handles a custom block type with a custom registered handler', () => {
  const input = require('./fixtures/custom-block.json')
  const expected = '<div>Test Person</div>'
  const result = renderCustom({blocks: input})
  expect(result).toEqual(expected)
})

test('handles dangerous text', () => {
  const input = require('./fixtures/dangerous-text.json')
  const expected =
    '<p>I am 1337 &lt;script&gt;alert(&#x27;//haxxor&#x27;);&lt;/script&gt;</p>'
  const result = render({blocks: input})
  expect(result).toEqual(expected)
})
