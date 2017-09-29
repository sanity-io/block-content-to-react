module.exports = {
  input: {
    _type: 'block',
    children: [
      {
        _key: 'a1ph4',
        _type: 'span',
        marks: ['mark1'],
        text: 'Sanity'
      }
    ],
    markDefs: [
      {
        _key: 'mark1',
        _type: 'link',
        href: 'https://sanity.io'
      }
    ]
  },
  output: '<p><a class="mahlink" href="https://sanity.io">Sanity</a></p>'
}
