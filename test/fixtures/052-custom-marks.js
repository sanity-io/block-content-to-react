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
        _type: 'highlight',
        color: '#bf1942'
      }
    ]
  },
  output: '<p><span style="background-color:#bf1942;">Sanity</span></p>'
}
