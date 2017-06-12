# block-content-to-react

**NOTE:** Experimental, WIP. API will most likely change slightly in an upcoming 1.0

## Installation

`npm install --save @sanity/block-content-to-react`

## Usage

```js
const React = require('react')
const ReactDOM = require('react-dom')
const BlockContent = require('@sanity/block-content-to-react')
const client = require('@sanity/client')({
  projectId: '<your project id>',
  dataset: '<some dataset>'
})

const renderers = {
  myCustomType: props => (
    <div key={props.nodeKey}>
      {props.attributes.myCustomData}
    </div>
  )
}

client.fetch('*[_type == "article"][0]').then(article => {
  const content = article
    ? <BlockContent blocks={article.body} customTypeHandlers={renderers} />,
    : <ArticleNotFound />

  ReactDOM.render(content document.getElementById('root'))
})
```

## License

MIT-licensed. See LICENSE.
