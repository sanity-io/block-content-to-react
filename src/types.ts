export interface SpanType {
  _type: 'span'
  _key?: string
  marks?: string[]
  text: string
}

export type CustomType<T> = {_type: keyof T} & T[keyof T]

export type BlockChild = SpanType

export interface MarkDef {
  _key: string
  [key: string]: any
}

export interface DefaultBlockType {
  _type: 'block'
  markDefs?: MarkDef[]
  children: BlockChild[]
}

export type Block<T = never> =
  | (DefaultBlockType | SpanType | CustomType<T>)
  | (DefaultBlockType | SpanType | CustomType<T>[])

export interface BlockContentProps<T extends Record<string, unknown>> {
  /**
   * Pass in either an array or a single object of [Portable Text](https://github.com/portabletext/portabletext)
   *
   * *This is the only required prop*
   */
  blocks: Block<T>
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
  serializers?: {
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
    types?: {
      [K in keyof T]: (props: {node: T[K]}) => JSX.Element | null
    }
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
    marks?: Record<string, (props: any) => JSX.Element | null>
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

export type BlockContent = <T extends Record<string, unknown>>(
  props: BlockContentProps<T>
) => JSX.Element
// export interface BlockContent extends BlockContentFn {
//   defaultSerializers: BlockContentProps['serializers']
// }
