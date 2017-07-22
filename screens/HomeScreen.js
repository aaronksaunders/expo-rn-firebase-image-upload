import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  View,
  NativeModules,
  ProgressViewIOS,
  Dimensions
} from 'react-native';

import { MonoText } from '../components/StyledText';

import base64 from 'base-64'

import Exponent, {
  Constants,
  ImagePicker,
  registerRootComponent,
} from 'expo';

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCnAlHHFQBNnAwAIy0DMh712MCpC2kY8I8",
  authDomain: "communitycurator-1552c.firebaseapp.com",
  databaseURL: "https://communitycurator-1552c.firebaseio.com",
  projectId: "communitycurator-1552c",
  storageBucket: "communitycurator-1552c.appspot.com",
  messagingSenderId: "410400297017"
};

firebase.initializeApp(firebaseConfig);

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  state = {
    progress: 1,
    avatarSource: null
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    let w = Dimensions.get('window').width
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          {this.state.avatarSource == null ? null :
            <Image
              source={{ uri: this.state.avatarSource }}
              style={{
                alignSelf: 'center',
                height: w * .80,
                width: w * .80,
                borderWidth: 1,
              }}
              resizeMode="contain"
            />}
          <View style={styles.helpContainer}>
            <TouchableOpacity
              onPress={() => this._pickImage(false)}
              style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                Pick Image
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity
              onPress={() => this._pickImage(true)}
              style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                Take Photo
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {
          this.state.progress === 1 ? null :
            <ProgressViewIOS
              progress={this.state.progress}
              style={{ padding: 20, height: 6 }} />
        }
      </View>
    );
  }


  /**
   * 
   * @memberof HomeScreen
   */
  _uploadAsByteArray = async (pickerResultAsByteArray, progressCallback) => {

    try {

      var metadata = {
        contentType: 'image/jpeg',
      };

      var storageRef = firebase.storage().ref();
      var ref = storageRef.child('images/mountains.jpg')
      let uploadTask = ref.put(pickerResultAsByteArray, metadata)

      uploadTask.on('state_changed', function (snapshot) {

        progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)

        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

      }, function (error) {
        console.log("in _uploadAsByteArray ", error)
      }, function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log("_uploadAsByteArray ", uploadTask.snapshot.downloadURL)
      });


    } catch (ee) {
      console.log("when trying to load _uploadAsByteArray ", ee)
    }
  }

  atob = (input) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }

  _pickImage = async (useCamera) => {
    var pickerResult
    if (useCamera) {
      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: .8,
        base64: true,
      });
    } else {
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: .8,
        base64: true
      });
    }

    if (pickerResult.cancelled) return;

    this.setState({ avatarSource: 'data:image/png;base64,' + pickerResult.base64 })

    this._uploadAsByteArray(this.convertToByteArray(pickerResult.base64), (progress) => {
      console.log(progress)
      this.setState({ progress })
    })

  }

  convertToByteArray = (input) => {

    var binary_string = base64.encode(input)   //this.atob(input);
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentContainer: {
    paddingTop: 80,
  },

  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
