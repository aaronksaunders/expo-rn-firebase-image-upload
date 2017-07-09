import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  ProgressViewIOS
} from 'react-native';

import { MonoText } from '../components/StyledText';

import Exponent, {
  Constants,
  ImagePicker,
  registerRootComponent,
} from 'expo';


import * as firebase from 'firebase';

const firebaseConfig = {

};

firebase.initializeApp(firebaseConfig);

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  state = {
    progress: 1
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>


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



  _uploadAsByteArray = async (pickerResult, cb) => {

    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', pickerResult.uri, true);

      xhr.responseType = 'arraybuffer';

      xhr.onload = function (e) {
        if (this.status == 200) {
          var uInt8Array = new Uint8Array(this.response);

          var metadata = {
            contentType: 'image/jpeg',
          };

          var storageRef = firebase.storage().ref();
          var ref = storageRef.child('images/mountains.jpg')
          let uploadTask = ref.put(uInt8Array, metadata)

          uploadTask.on('state_changed', function (snapshot) {

            cb(snapshot.bytesTransferred / snapshot.totalBytes)

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function (error) {
            // Handle unsuccessful uploads
            console.log(error)
          }, function () {
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log(uploadTask.snapshot.downloadURL)
          });
        }
      };

      xhr.onerror = function (e) {
        alert("Error " + e.target.status + " occurred while receiving the document.");
      };

      xhr.send();
    } catch (ee) {
      console.log(ee)
    }
  }
  
  _pickImage = async (useCamera) => {
    let pickerResult = null
    if (useCamera) {
      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    } else {
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
    }

    this._uploadAsByteArray(pickerResult, (progress) => {
      console.log(progress)
      this.setState({ progress })
    })

  };
}

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
