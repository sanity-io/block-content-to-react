/* eslint-disable react/no-multi-comp, react/display-name */
const React = require('react')
const objectAssign = require('object-assign')

// eslint-disable-next-line id-length
const h = React.createElement

function newlinify(text, parent, index) {
  return text
    .split('\n')
    .reduce(
      (target, chunk, i) =>
        target.concat([
          chunk,
          h('br', {key: `${parent.nodeKey}+${index + i}`})
        ]),
      []
    )
    .slice(0, -1)
}

function getChildren(children, typeHandlers, parent) {
  let nodes = []
  children.forEach((item, index) => {
    if (typeof item === 'string') {
      nodes = nodes.concat(newlinify(item, parent, index))
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
      item.children = getChildren(item.children, typeHandlers, item)
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

module.exports = function(blockTypeHandlers = {}, customBlockHandler) {
  const defaultHandlers = {
    normal: node => h('p', {key: node.nodeKey}, node.children)
  }
  const blockHandlers = objectAssign(
    defaultHandlers,
    blockTypeHandlers.textBlock || {},
    blockTypeHandlers.customBlock || {}
  )

  const listHandlers = objectAssign(
    {
      number: node => h('ol', {key: node.nodeKey}, node.children),
      bullet: node => h('ul', {key: node.nodeKey}, node.children),
      listItem: node => h('li', {key: node.nodeKey}, node.children)
    },
    blockTypeHandlers.listBlock || {}
  )

  const typeHandlers = {
    block: node => {
      const handler = customBlockHandler || typeHandlers.defaultBlock
      return handler(node)
    },

    defaultBlock: node => {
      const style = node.style || 'normal'
      if (blockHandlers[style]) {
        node.children = getChildren(node.children, typeHandlers, node)
        return blockHandlers[style](node)
      }

      return h(
        style,
        {key: node.nodeKey},
        getChildren(node.children, typeHandlers, node)
      )
    },

    list: node => {
      if (listHandlers[node.itemStyle]) {
        node.children = getListItems(node.items, listHandlers, typeHandlers)
        return listHandlers[node.itemStyle](node)
      }

      return h(
        'ul',
        {key: node.nodeKey},
        getListItems(node.items, listHandlers, typeHandlers)
      )
    },

    span: node => {
      let wrap = input => input
      if (typeof node.mark === 'string') {
        const mark = mapMark(node.mark, blockTypeHandlers.marks)
        wrap = mark ? input => h(mark, {key: node.nodeKey}, input) : wrap
      }

      node.children = getChildren(node.children, typeHandlers, node)

      if (blockTypeHandlers.span) {
        return wrap(blockTypeHandlers.span(node))
      }

      if (node.mark && node.mark._type === 'link') {
        // Deal with the default block editor setup 'link' attribute
        return wrap(
          h('a', {href: node.mark.href, key: node.nodeKey}, node.children)
        )
      }

      return wrap(node.children)
    }
  }

  return typeHandlers
}
