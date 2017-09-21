const defaultMarks = ['strong', 'em', 'code', 'underline', 'strike-through']

const buildMarksTree = block => {
  const {children, markDefs} = block
  if (!children || !children.length) {
    return []
  }

  const sortedMarks = children.map(sortMarksByOccurences)
  const rootNode = {children: []}
  let nodeStack = [rootNode]

  children.forEach((span, i) => {
    const marksNeeded = sortedMarks[i]

    let pos = 1

    // Start at position one. Root is always plain and should never be removed. (?)
    if (nodeStack.length > 1) {
      for (pos; pos < nodeStack.length; pos++) {
        const mark = nodeStack[pos].markKey
        // eslint-disable-next-line max-depth
        if (!marksNeeded.includes(mark)) {
          break
        }

        const index = marksNeeded.indexOf(mark)
        marksNeeded.splice(index, 1)
      }
    }

    // Keep from beginning to first miss
    nodeStack = nodeStack.slice(0, pos)

    // Add needed nodes
    let currentNode = nodeStack[nodeStack.length - 1]
    marksNeeded.forEach(mark => {
      const node = {
        _type: 'span',
        _key: span._key,
        children: [],
        mark: markDefs.find(def => def._key === mark) || mark,
        markKey: mark
      }

      currentNode.children.push(node)
      nodeStack.push(node)
      currentNode = node
    })

    currentNode.children.push(span.text)
  })

  return rootNode.children
}

// We want to sort all the marks of all the spans in the following order:
// 1. Marks that are shared amongst the most adjacent siblings
// 2. Non-default marks (links, custom metadata)
// 3. Built-in, plain marks (bold, emphasis, code etc)
function sortMarksByOccurences(span, i, spans) {
  if (!span.marks || span.marks.length === 0) {
    return span.marks
  }

  const markOccurences = span.marks.reduce((occurences, mark) => {
    occurences[mark] = occurences[mark] ? occurences[mark] + 1 : 1

    for (let siblingIndex = i + 1; siblingIndex < spans.length; siblingIndex++) {
      const sibling = spans[siblingIndex]
      if (sibling.marks.includes(mark)) {
        occurences[mark]++
      } else {
        break
      }
    }

    return occurences
  }, {})

  const sortByOccurence = sortMarks.bind(null, markOccurences)
  return span.marks.sort(sortByOccurence)
}

function sortMarks(occurences, markA, markB) {
  const aOccurences = occurences[markA] || 0
  const bOccurences = occurences[markB] || 0

  if (aOccurences !== bOccurences) {
    return bOccurences - aOccurences
  }

  const aDefaultPos = defaultMarks.indexOf(markA)
  const bDefaultPos = defaultMarks.indexOf(markB)

  // Sort default marks last
  if (aDefaultPos !== bDefaultPos) {
    return aDefaultPos - bDefaultPos
  }

  // Sort other marks simply by key
  if (markA < markB) {
    return -1
  } else if (markA > markB) {
    return 1
  }

  return 0
}

module.exports = buildMarksTree
