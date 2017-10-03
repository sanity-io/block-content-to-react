module.exports = {
  input: [
    {
      style: 'normal',
      _type: 'block',
      _key: 'bd73ec5f61a1',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text: 'Also, images are pretty common.',
          marks: []
        }
      ]
    },
    {
      _type: 'image',
      _key: 'd234a4fa317a',
      asset: {
        _type: 'reference',
        _ref: 'image-YiOKD0O6AdjKPaK24WtbOEv0-3456x2304-jpg'
      }
    }
  ],
  output: [
    '<div>',
    '<p>Also, images are pretty common.</p>',
    '<figure><img src="https://cdn.sanity.io/images/3do82whm/production/YiOKD0O6AdjKPaK24WtbOEv0-3456x2304.jpg"/></figure>',
    '</div>'
  ].join('')
}
