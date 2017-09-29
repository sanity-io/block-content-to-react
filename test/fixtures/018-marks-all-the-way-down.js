module.exports = {
  input: {
    _type: 'block',
    children: [
      {
        _key: 'a1ph4',
        _type: 'span',
        marks: ['mark1', 'em', 'mark2'],
        text: 'Sanity'
      },
      {
        _key: 'b374',
        _type: 'span',
        marks: ['mark2', 'mark1', 'em'],
        text: ' FTW'
      }
    ],
    markDefs: [
      {
        _key: 'mark1',
        _type: 'highlight',
        color: '#bf1942'
      },
      {
        _key: 'mark2',
        _type: 'highlight',
        color: '#f00baa'
      }
    ]
  },
  output: [
    '<p>',
    '<span style="background-color:#bf1942;">',
    '<span style="background-color:#f00baa;">',
    '<em>Sanity FTW</em>',
    '</span>',
    '</span>',
    '</p>'
  ].join('')
}
