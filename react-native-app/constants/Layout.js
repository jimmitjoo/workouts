import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },

  form: {
    paddingLeft: 30,
    paddingRight: 30
  },
  textInputs: {
    height: 40,
    marginTop: 5,
    borderWidth: 1,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#ddd',
    borderRadius: 3
  },
  textAreaInputs: {
    height: 140,
    marginTop: 5,
    borderWidth: 1,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#ddd',
    borderRadius: 3
  },

  errorMessage: {
    margin: 5,
    padding: 10,
    backgroundColor: '#ff0000',
    color: '#ffffff',
  },

  helpLinkContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },

  textContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  text: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    paddingTop: 12,
  },
};
