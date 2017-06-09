/* eslint-disable react/no-multi-comp, react/display-name */
const React = require('react')

// eslint-disable-next-line id-length
const h = React.createElement

function newlinify(text, node) {
  return text
    .split('\n')
    .reduce((target, chunk, i) => target.concat(
      [chunk, h('br', {key: `${node.nodeKey}+${i}`})]
    ), [])
    .slice(0, -1)
}

function getContent(content, typeHandlers) {
  let nodes = []
  content.forEach((item, index) => {
    if (typeof item === 'string') {
      nodes = nodes.concat(newlinify(item, item))
    } else {
      const handler = typeHandlers[item.type] || typeHandlers.text
      nodes = nodes.concat(handler(item))
    }
  })

  return nodes
}

function getListItems(items, listHandlers, typeHandlers) {
  const nodes = []
  items.forEach((item, index) => {
    if (typeof item === 'string') {
      nodes.push(item)
    } else {
      item.attributes = item.attributes || {}
      item.children = getContent(item.content, typeHandlers)
      nodes.push(listHandlers.listItem(item))
    }
  })

  return nodes
}

function mapMark(mark, marksMapping) {
  if (marksMapping && typeof marksMapping[mark] !== 'undefined') {
    return marksMapping[mark]
  }

  return mark
}

module.exports = function (blockTypeHandlers = {}, customBlockHandler) {
  const defaultHandlers = {normal: node => h('p', {key: node.nodeKey}, node.children)}
  const blockHandlers = Object.assign(
    defaultHandlers,
    blockTypeHandlers.textBlock || {},
    blockTypeHandlers.customBlock || {}
  )

  const listHandlers = Object.assign({
    number: node => h('ol', {key: node.nodeKey}, node.children),
    bullet: node => h('ul', {key: node.nodeKey}, node.children),
    listItem: node => h('li', {key: node.nodeKey}, node.children)
  }, blockTypeHandlers.listBlock || {})

  const typeHandlers = {
    block: node => {
      const handler = customBlockHandler || typeHandlers.defaultBlock
      return handler(node)
    },

    defaultBlock: node => {
      const style = node.style || 'normal'
      if (blockHandlers[style]) {
        node.children = getContent(node.content, typeHandlers)
        return blockHandlers[style](node)
      }

      return h(style, {key: node.nodeKey}, getContent(node.content, typeHandlers))
    },

    list: node => {
      if (listHandlers[node.itemStyle]) {
        node.children = getListItems(node.items, listHandlers, typeHandlers)
        return listHandlers[node.itemStyle](node)
      }

      return h('ul', {key: node.nodeKey}, getListItems(node.items, listHandlers, typeHandlers))
    },

    span: node => {
      let wrap = input => input
      if (node.mark) {
        const mark = mapMark(node.mark, blockTypeHandlers.marks)
        wrap = mark ? input => h(mark, {key: node.nodeKey}, input) : wrap
      }

      node.children = getContent(node.content, typeHandlers)

      if (blockTypeHandlers.span) {
        return wrap(blockTypeHandlers.span(node))
      }

      if (node.attributes && node.attributes.link) {
        // Deal with the default block editor setup 'link' attribute
        return wrap(h('a', {href: node.attributes.link.href, key: node.nodeKey}, node.children))
      }

      return wrap(node.children)
    }
  }

  return typeHandlers
}
