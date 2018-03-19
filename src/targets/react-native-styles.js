const {StyleSheet} = require('react-native')

const styles = StyleSheet.create({
  blockquote: {
    paddingHorizontal: 14,
    borderLeftWidth: 3.5,
    borderLeftColor: '#dfe2e5',
    marginBottom: 16
  },

  h1: {marginVertical: 22},
  h2: {marginVertical: 20},
  h3: {marginVertical: 18},
  h4: {marginVertical: 18},
  h5: {marginVertical: 18},
  h6: {marginVertical: 18},
  normal: {marginBottom: 16},
  list: {marginVertical: 16},

  listItem: {
    flex: 1,
    flexWrap: 'wrap'
  },

  bulletlistIcon: {
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold'
  },

  listItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
})

const textStyles = StyleSheet.create({
  h1: {
    fontWeight: 'bold',
    fontSize: 32
  },

  h2: {
    fontWeight: 'bold',
    fontSize: 24
  },

  h3: {
    fontWeight: 'bold',
    fontSize: 18
  },

  h4: {
    fontWeight: 'bold',
    fontSize: 16
  },

  h5: {
    fontWeight: 'bold',
    fontSize: 14
  },

  h6: {
    fontWeight: 'bold',
    fontSize: 10
  },

  strong: {fontWeight: 'bold'},
  em: {fontStyle: 'italic'},
  link: {textDecorationLine: 'underline'},
  underline: {textDecorationLine: 'underline'},
  'strike-through': {textDecorationLine: 'line-through'},

  code: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(27, 31, 35, 0.05)',
    color: '#24292e'
  }
})

module.exports = {
  textStyles,
  styles
}
