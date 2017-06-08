const React = require('react')
const BlockContentToTree = require('@sanity/block-content-to-tree')
const builtInHandlers = require('./typeHandlers')

// eslint-disable-next-line id-length
const h = React.createElement
const blockContentToTree = new BlockContentToTree()

function getKey(node, fallback) {
  return (node && node.attributes && node.attributes._key) || fallback
}

function applyTreeProps(nodes, prevKey = -1, depth = 0, parent = null) {
  let currentKey = prevKey

  if (!Array.isArray(nodes)) {
    return applyTreeProps([nodes], prevKey, depth)[0]
  }

  return nodes.map(node => {
    if (typeof node === 'string') {
      return node
    }

    node.nodeKey = getKey(node, `${depth}-${++currentKey}`)
    node.parent = parent
    node.content = node.content && applyTreeProps(node.content, currentKey, depth + 1, node)
    node.items = node.items && applyTreeProps(node.items, currentKey, depth + 1, node)
    return node
  })
}

const BlockContent = props => {
  const rootTag = props.tagName || 'div'
  const base = applyTreeProps(blockContentToTree.convert(props.blocks))

  const custom = props.customTypeHandlers || {}
  const builtIn = builtInHandlers(props.blockTypeHandlers || {}, custom.block)
  delete custom.block // Is called from builtIn

  const typeHandlers = Object.assign({}, builtIn, custom)

  if (!Array.isArray(base)) {
    return parseSingle(base)
  }

  const children = base.map((single, index) => parseSingle(single))
  return children.length === 1 ? children[0] : h(rootTag, null, children)

  function parseSingle(data) {
    if (typeHandlers[data.type]) {
      return typeHandlers[data.type](data)
    }

    throw new Error(`Don't know how to handle type '${data.type}'`)
  }
}

BlockContent.getTypeHandlers = builtInHandlers

module.exports = BlockContent
