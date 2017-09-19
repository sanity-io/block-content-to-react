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
  const markName = mark._type || mark
  if (marksMapping && typeof marksMapping[markName] !== 'undefined') {
    return marksMapping[markName]
  }

  return markName
}

const defaultMarkHandlers = {
  link: props => {
    return h('a', {key: props.nodeKey, href: props.href}, props.children)
  }
}

const defaultHandlers = {
  normal: node => h('p', {key: node.nodeKey}, node.children)
}

module.exports = function(blockTypeHandlers = {}, customBlockHandler) {
  const blockHandlers = objectAssign(
    {},
    defaultHandlers,
    blockTypeHandlers.textBlock || {},
    blockTypeHandlers.customBlock || {}
  )

  blockHandlers.marks = objectAssign(
    {},
    defaultMarkHandlers,
    blockTypeHandlers.marks
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
      let wrap = children => children
      if (node.mark) {
        const mark = mapMark(node.mark, blockHandlers.marks)
        wrap = mark
          ? children =>
              h(mark, objectAssign({key: node.nodeKey}, node.mark), children)
          : wrap
      }

      node.children = getChildren(node.children, typeHandlers, node)

      if (blockTypeHandlers.span) {
        return wrap(blockTypeHandlers.span(node))
      }

      return wrap(node.children)
    }
  }

  return typeHandlers
}
