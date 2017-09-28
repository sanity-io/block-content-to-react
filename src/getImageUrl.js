const generateHelpUrl = require('@sanity/generate-help-url')

const enc = encodeURIComponent
const materializeError = `You must either:
  - Pass \`projectId\` and \`dataset\` to the block renderer
  - Materialize images to include the \`url\` field.

For more information, see ${generateHelpUrl('block-content-image-materializing')}`

const getQueryString = options => {
  const query = options.imageOptions
  const keys = Object.keys(query)
  if (!keys.length) {
    return ''
  }

  const params = keys.map(key => `${enc(key)}=${enc(query[key])}`)
  return `?${params.join('&')}`
}

const buildUrl = props => {
  const {node, options} = props
  const asset = node.asset

  if (!asset) {
    throw new Error('Image does not have required `asset` property')
  }

  const qs = getQueryString(options)

  if (asset.url) {
    return asset.url + qs
  }

  const ref = asset._ref
  if (!ref) {
    throw new Error('Invalid image reference in block, no `_ref` found on `asset`')
  }

  const {projectId, dataset} = options
  if (!projectId || !dataset) {
    throw new Error(materializeError)
  }

  const [type, id, dimensions, ext] = ref.split('-')
  const url = `https://cdn.sanity.io/${type}s/${projectId}/${dataset}/${id}-${dimensions}.${ext}${qs}`
  return url
}

module.exports = buildUrl
