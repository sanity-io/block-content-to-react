module.exports = {
  input: [
    {
      _type: 'block',
      _key: 'bd73ec5f61a1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text: 'Also, images are pretty common: ',
          marks: []
        },
        {
          _type: 'image',
          _key: 'd234a4fa317a',
          asset: {
            _type: 'reference',
            _ref: 'image-YiOKD0O6AdjKPaK24WtbOEv0-3456x2304-jpg'
          }
        },
        {
          _type: 'span',
          text: ' - as you can see, they can also appear inline!',
          marks: []
        }
      ]
    },
    {
      _type: 'block',
      _key: 'foo',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text: 'Sibling paragraph',
          marks: []
        }
      ]
    }
  ],
  output: [
    '<div>',
    '<p>Also, images are pretty common: ',
    '<img src="https://cdn.sanity.io/images/3do82whm/production/YiOKD0O6AdjKPaK24WtbOEv0-3456x2304.jpg"/>',
    ' - as you can see, they can also appear inline!</p>',
    '<p>Sibling paragraph</p>',
    '</div>'
  ].join('')
}
