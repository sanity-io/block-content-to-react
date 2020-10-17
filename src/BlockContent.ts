import * as React from 'react'
import {mergeSerializers, blocksToNodes} from '@sanity/block-content-to-hyperscript'
import {defaultSerializers, serializeSpan, renderProps} from 'targets/dom'
import {BlockContent} from 'types'

const renderNode = React.createElement

const SanityBlockContent: BlockContent = (props) => {
  const customSerializers = mergeSerializers(defaultSerializers, props.serializers)

  const blockProps = Object.assign({}, renderProps, props, {
    serializers: customSerializers,
    blocks: props.blocks ?? [],
  })

  return blocksToNodes(renderNode, blockProps, defaultSerializers, serializeSpan)
}

SanityBlockContent.defaultSerializers = defaultSerializers

export default SanityBlockContent
