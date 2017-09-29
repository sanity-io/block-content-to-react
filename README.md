# block-content-to-react

Render an array of [block text](https://sanity.io/docs/schema-types/block-text-type) from Sanity with React.

## Installing

```
npm install --save @sanity/block-content-to-react
```

## Usage

```js
const React = require('react')
const ReactDOM = require('react-dom')
const BlockContent = require('@sanity/block-content-to-react')
const client = require('@sanity/client')({
  projectId: '<your project id>',
  dataset: '<some dataset>',
  useCdn: true
})

const serializers = {
  types: {
    code: props => (
      <pre data-language={props.node.language}>
        <code>{props.node.code}</code>
      </pre>
    )
  }
}

client.fetch('*[_type == "article"][0]').then(article => {
  ReactDOM.render(
    <BlockContent blocks={article.body} serializers={serializers} />,
    document.getElementById('root')
  )
})
```

## PropTypes

- `className` - When more than one block is given, a container node has to be created. Passing a `className` will pass it on to the container. Note that if only a single block is given as input, the container node will be skipped.
- `serializers` - Specifies the React components to use for rendering content. Merged with default serializers.
- `serializers.types` - Serializers for block types, see example above
- `serializers.marks` - Serializers for marks - data that annotates a text child of a block. See example usage below.
- `serializers.list` - React component to use when rendering a list node
- `serializers.listItem` - React component to use when rendering a list item node
- `imageOptions` - When encountering image blocks, this defines which query parameters to apply in order to control size/crop mode etc.

In addition, in order to render images without materializing the asset documents, you should also specify:

- `projectId` - To render images without materializing the asset documents, specify `projectId` and `dataset`.
- `dataset` - To render images without materializing the asset documents, specify `projectId` and `dataset`.

## Examples

### Rendering custom marks

```js
const input = [{
  _type: 'block',
  children: [{
    _key: 'a1ph4',
    _type: 'span',
    marks: ['s0m3k3y'],
    text: 'Sanity'
  }],
  markDefs: [{
    _key: 's0m3k3y',
    _type: 'highlight',
    color: '#E4FC5B'
  }]
}]

const highlight = props => {
  return (
    <span style={{backgroundColor: props.mark.color}}>
      {props.children}
    </span>
  )
}

<BlockContent
  blocks={input}
  serializers={{marks: {highlight}}}
/>
```

### Specifying image options

```js
<BlockContent
  blocks={input}
  imageOptions={{w: 320, h: 240, fit: 'max'}}
  projectId="myprojectid"
  dataset="mydataset"
/>
```

## License

MIT-licensed. See LICENSE.
