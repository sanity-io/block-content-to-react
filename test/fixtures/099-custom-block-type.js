module.exports = {
  input: [
    {
      _type: 'code',
      _key: '9a15ea2ed8a2',
      language: 'javascript',
      code:
        "const foo = require('foo')\n\nfoo('hi there', (err, thing) => {\n  console.log(err)\n})\n"
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
