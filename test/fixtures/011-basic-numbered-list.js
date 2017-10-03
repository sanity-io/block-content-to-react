module.exports = {
  input: [
    {
      style: 'normal',
      _type: 'block',
      _key: 'f94596b05b41',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text: "Let's test some of these lists!",
          marks: []
        }
      ]
    },
    {
      listItem: 'number',
      style: 'normal',
      level: 1,
      _type: 'block',
      _key: '937effb1cd06',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text: 'Number 1',
          marks: []
        }
      ]
    },
    {
      listItem: 'number',
      style: 'normal',
      level: 1,
      _type: 'block',
      _key: 'bd2d22278b88',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text: 'Number 2',
          marks: []
        }
      ]
    },
    {
      listItem: 'number',
      style: 'normal',
      level: 1,
      _type: 'block',
      _key: 'a97d32e9f747',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text: 'Number 3',
          marks: []
        }
      ]
    }
  ],
  output: [
    '<div>',
    '<p>Let&#x27;s test some of these lists!</p>',
    '<ol>',
    '<li>Number 1</li>',
    '<li>Number 2</li>',
    '<li>Number 3</li>',
    '</ol>',
    '</div>'
  ].join('')
}
