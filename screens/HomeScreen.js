import React from 'react';
import {
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  ProgressViewIOS
} from 'react-native';

import {
  Container,
  Button,
  Text,
  Icon,
  List,
  ListItem,
  Header,
  ActionSheet
} from "native-base";

import PhotoContainer from '../components/PhotoContainer'

import base64 from 'base-64'

import Exponent, { Constants, ImagePicker, registerRootComponent } from 'expo';

import * as api from '../api/firebaseService'

const HeaderBtn = ({ navigation }) => {

  const {
    params = {}
  } = navigation.state

  return (
    <Button transparent large onPress={() => params.pickImgeSource()}>
      <Icon name='ios-camera' large />
    </Button>
  )
}

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { headerRight: <HeaderBtn navigation={navigation} /> }
  };

  state = {
    progress: 1,
    avatarSource: null
  }

  componentDidMount() {
    this
      .props
      .navigation
      .setParams({
        pickImgeSource: () => {
          this._pickImageSource()
        }
      })

    api
      .getImagesFromFirebase()
      .then((_results) => {
        this.setState({ assets: _results })
      })
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  _pickImageSource() {
    try {
      ActionSheet.show({
        options: [
          "Take Photo", "Pick From Album", "Cancel"
        ],
        cancelButtonIndex: 2,
        title: "Testing ActionSheet"
      }, buttonIndex => {
        // this 'buttonIndex value is a string on android and number on ios :-(
        console.log(buttonIndex)
        if (buttonIndex + "" === '0') {
          this._pickImage(true)
        } else if (buttonIndex + "" === '1') {
          this._pickImage(false)
        } else {
          console.log('nothing')
        }
      })
    } catch (ee) {
      console.log(ee)
    }
  }

  render() {

    return (
      <Container>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <List>
            {this.state.assets
              ? this
                .state
                .assets
                .map((a) => {
                  return (
                    <ListItem key={a.id}>
                      <PhotoContainer _avatarSource={a.URL} />
                    </ListItem>
                  )
                })
              : null}
          </List>

        </ScrollView>

        {this.state.progress === 1
          ? null
          : <ProgressViewIOS
            progress={this.state.progress}
            style={{
              padding: 20,
              height: 6
            }} />
        }
      </Container>
    );
  }

  /**
   * 
   * @memberof HomeScreen
   */
  _pickImage = async (useCamera) => {

    console.log('in pick image')
    var pickerResult
    if (useCamera) {
      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: .8,
        base64: true
      });
    } else {
      pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: .8, base64: true });
    }

    if (pickerResult.cancelled)
      return;

    this.setState({
      avatarSource: 'data:image/png;base64,' + pickerResult.base64
    })
    let byteArray = this.convertToByteArray(pickerResult.base64);

    api.uploadAsByteArray(byteArray, (progress) => {
      console.log(progress)
      this.setState({ progress })
    })

  }

  atob = (input) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    let str = input
      .replace(/=+$/, '')
      .replace(/^data:image\/‌​(png|jpg);base64,/, '‌​');
    let output = '';

    // if (str.length % 4 == 1) {   throw new Error("'atob' failed: The string to be
    // decoded is not correctly encoded."); }
    for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4
      ? bs * 64 + buffer
      : buffer, bc++ % 4)
      ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6))
      : 0) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }

  convertToByteArray = (input) => {

    var binary_string = this.atob(input);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes
  }

};

//
// styles for the screen
//
const styles = StyleSheet.create({

  viewContent: {
    flex: 1,
    alignItems: 'center'
  },

  spacer10: {
    paddingVertical: 10
  },

  container: {
    backgroundColor: '#fff'
  },

  contentContainer: {
    paddingTop: 20,
    alignItems: 'center'
  }
});
