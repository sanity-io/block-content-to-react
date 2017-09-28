/* eslint-disable max-depth, complexity */
function nestLists(blocks) {
  const tree = []
  let currentList

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (!isListBlock(block)) {
      tree.push(block)
      currentList = null
      continue
    }

    // Start of a new list?
    if (!currentList) {
      currentList = listFromBlock(block)
      tree.push(currentList)
      continue
    }

    // New list item within same list?
    if (blockMatchesList(block, currentList)) {
      currentList.children.push(block)
      continue
    }

    // Different list props, are we going deeper?
    if (block.level > currentList.level) {
      const newList = listFromBlock(block)
      lastChild(currentList).children.push(newList)
      currentList = newList
      continue
    }

    // Different list props, are we going back up the tree?
    if (block.level < currentList.level) {
      // Current list has ended, and we need to hook up with a parent of the same level and type
      const match = findListMatching(tree[tree.length - 1], block)
      if (match) {
        currentList = match
        currentList.children.push(block)
        continue
      }

      // Similar parent can't be found, assume new list
      currentList = listFromBlock(block)
      tree.push(currentList)
      continue
    }

    // Different list props, different list style?
    if (block.listItem !== currentList.listItem) {
      const match = findListMatching(tree[tree.length - 1], {level: block.level})
      if (match && match.listItem === block.listItem) {
        currentList = match
        currentList.children.push(block)
        continue
      } else {
        currentList = listFromBlock(block)
        tree.push(currentList)
        continue
      }
    }

    // eslint-disable-next-line no-console
    console.warn('Unknown state encountered for block', block)
    tree.push(block)
  }

  return tree
}

function isListBlock(block) {
  return Boolean(block.level)
}

function blockMatchesList(block, list) {
  return block.level === list.level && block.listItem === list.listItem
}

function listFromBlock(block) {
  return {
    _type: 'list',
    _key: `${block._key}-parent`,
    level: block.level,
    listItem: block.listItem,
    children: [block]
  }
}

function lastChild(block) {
  return block.children && block.children[block.children.length - 1]
}

function findListMatching(rootNode, matching) {
  const filterOnType = typeof matching.listItem === 'string'
  if (
    rootNode._type === 'list' &&
    rootNode.level === matching.level &&
    (filterOnType && rootNode.listItem === matching.listItem)
  ) {
    return rootNode
  }

  const node = lastChild(rootNode)
  if (!node) {
    return false
  }

  return findListMatching(node, matching)
}

module.exports = nestLists
