import BlockContent from 'index'

export type DefaultMarks = 'strong' | 'em' | 'code' | 'underline' | 'strike-through'

export type SerializerType<T> = {[K in keyof T]: {_type: K} & T[K]}
export type SerializerTypes<T> = SerializerType<T>[keyof SerializerType<T>]

export type MarkDef<M> = {[K in keyof M]: {_key: K} & M[K]}
export type MarkDefs<M> = MarkDef<M>[keyof MarkDef<M>][]
export interface SpanType<M> {
  _type: 'span'
  marks?: (keyof M | DefaultMarks)[]
  text: string
}
export type BlockChildren<T = undefined, M = undefined> = Block<T, M>[]
export interface DefaultBlockType<T, M> {
  _type: 'block'
  markDefs?: MarkDefs<M>
  children: Block<T, M>[] | BlockChildren<T, M>
}

type Block<T = undefined, M = undefined> =
  | SerializerTypes<T>
  | (DefaultBlockType<T, M> | SpanType<M>)

export type Blocks<T = undefined, M = undefined> = Block<T, M> | Block<T, M>[]

export type MarkProps<K, P> = {
  _type: 'span'
  _key: undefined
  mark: P
  markKey: K
}

export type TypeProps<K, P> = {
  node: P
  _type: K
  options: {imageOptions: any}
  isInline: boolean
}

export type Serializers<T = undefined, M = undefined> = {
  /**
   * Serializers for block types
   * @example
   * ```jsx
   * const input = [{
   *   _type: 'block',
   *   children: [{
   *     _key: 'a1ph4',
   *     _type: 'span',
   *     marks: ['s0m3k3y'],
   *     text: 'Sanity'
   *   }],
   *   markDefs: [{
   *     _key: 's0m3k3y',
   *     _type: 'highlight',
   *     color: '#E4FC5B'
   *   }]
   * }]
   *
   * const highlight = props => {
   *   return (
   *     <span style={{backgroundColor: props.mark.color}}>
   *       {props.children}
   *     </span>
   *   )
   * }
   *
   * <BlockContent
   *   blocks={input}
   *   serializers={{marks: {highlight}}}
   * />
   * ```
   */
  types?: T extends undefined ? never : {[K in keyof T]: React.FC<TypeProps<K, T[K]>>}
  /**
   * Serializers for marks - data that annotates a text child of a block.
   * @example
   * ```jsx
   * const input = [{
   *   _type: 'block',
   *   children: [{
   *     _key: 'a1ph4',
   *     _type: 'span',
   *     marks: ['s0m3k3y'],
   *     text: 'Sanity'
   *   }],
   *   markDefs: [{
   *     _key: 's0m3k3y',
   *     _type: 'highlight',
   *     color: '#E4FC5B'
   *   }]
   * }]
   *
   * const highlight = props => {
   *   return (
   *     <span style={{backgroundColor: props.mark.color}}>
   *       {props.children}
   *     </span>
   *   )
   * }
   *
   * <BlockContent
   *   blocks={input}
   *   serializers={{marks: {highlight}}}
   * />
   * ```
   */
  marks?: M extends undefined ? never : {[K in keyof M]: React.FC<MarkProps<K, M[K]>>}
  /** React component to use when rendering a list node */
  list?: React.Component
  /** React component to use when rendering a list item node */
  listItem?: React.Component
  /**
   * React component to use when transforming newline characters
   * to a hard break (<br/> by default, pass false to render newline character)
   */
  hardBreak?: React.Component
  /** Serializer for the container wrapping the blocks */
  container?: React.Component
}

export interface BlockContentProps<T = undefined, M = undefined> {
  /**
   * Pass in either an array or a single object of [Portable Text](https://github.com/portabletext/portabletext)
   *
   * *This is the only required prop*
   */
  blocks: Blocks<T, M>
  /**
   * When more than one block is given, a container node has to be created. Passing a className will pass it on to the container.
   * @note see `renderContainerOnSingleChild`
   */
  className?: string
  /**
   * When a single block is given as input, the default behavior is to not render any container.
   * If you always want to render the container, pass `true`.
   */
  renderContainerOnSingleChild?: boolean
  /**  Define custom serializers */
  serializers?: Serializers<T, M>
  /**
   * When encountering image blocks,
   * this defines which query parameters to apply in order to control size/crop mode etc.
   */
  imageOptions?: object
  /** The ID of your Sanity project. */
  projectId?: string
  /** Name of the Sanity dataset containing the document that is being rendered. */
  dataset?: string
}

export interface BlockContent {
  <T = undefined, M = undefined>(props: BlockContentProps<T, M>): JSX.Element
  defaultSerializers: Serializers
}
