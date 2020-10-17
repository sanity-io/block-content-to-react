import {Serializers} from '@sanity/block-content-to-hyperscript/dist/types'

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
export interface BlockContent extends BlockContentFn {
  defaultSerializers: Serializers
}
