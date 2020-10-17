import * as React from 'react'
import {Serializers, mergeSerializers, blocksToNodes} from '@sanity/block-content-to-hyperscript'
import {defaultSerializers, serializeSpan, renderProps} from 'targets/dom'
export * from '@sanity/block-content-to-hyperscript'
export {defaultSerializers}

const renderNode = React.createElement

export interface Block {
  _type: string
}

export interface BlockContentProps {
  className?: string
  renderContainerOnSingleChild?: boolean
  // When rendering images, we need project id and dataset, unless images are materialized
  projectId?: string
  dataset?: string
  imageOptions?: object
  serializers?: Serializers
  blocks?: Block | Block[] | null
}

export type BlockContentFn = (props: BlockContentProps) => JSX.Element
interface BlockContent extends BlockContentFn {
  defaultSerializers: Serializers
}

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
