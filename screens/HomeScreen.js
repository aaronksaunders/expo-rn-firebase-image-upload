import React from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  View,
  NativeModules,
  ProgressViewIOS,
  Dimensions
} from 'react-native';

import {
  Container, Button, Text, Icon, List, ListItem,
  Header, ActionSheet
} from "native-base";

import PhotoContainer from '../components/PhotoContainer'

import base64 from 'base-64'

import Exponent, {
  Constants,
  ImagePicker,
  registerRootComponent,
} from 'expo';

import * as api from '../api/firebaseService'

const HeaderBtn = ({ navigation }) => {

  const { params = {} } = navigation.state

  return (
    <Button transparent large onPress={() => params.pickImgeSource()}>
      <Icon name='ios-camera' large />
    </Button>
  )
}





export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <HeaderBtn navigation={navigation} />
    }
  };


  state = {
    progress: 1,
    avatarSource: null
  }

  componentDidMount() {
    this.props.navigation.setParams({
      pickImgeSource: () => { this._pickImageSource() }
    })

    api.getImagesFromFirebase().then((_results) => {
      this.setState({ assets: _results })
    })
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  _pickImageSource() {
    ActionSheet.show(
      {
        options: ["Take Photo", "Pick From Album", "Cancel"],
        cancelButtonIndex: 2,
        title: "Testing ActionSheet"
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this._pickImage(true)
        } else if (buttonIndex === 1) {
          this._pickImage(false)
        }
      }
    )
  }

  render() {

    return (
      <Container>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <List>
            {this.state.assets ? this.state.assets.map((a) => {
              return (
                <ListItem key={a.id}>
                  <PhotoContainer _avatarSource={a.URL} />
                </ListItem>
              )
            }) : null}
          </List>

        </ScrollView>

        {
          this.state.progress === 1 ? null :
            <ProgressViewIOS
              progress={this.state.progress}
              style={{ padding: 20, height: 6 }} />
        }
      </Container>
    );
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
    let byteArray = this.convertToByteArray(pickerResult.base64);

    api.uploadAsByteArray(byteArray, (progress) => {
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

  viewContent: {
    flex: 1,
    alignItems: 'center'
  },

  spacer10: {
    paddingVertical: 10,
  },

  container: {
    backgroundColor: '#fff',
  },

  contentContainer: {
    paddingTop: 20,
    alignItems: 'center'
  },

});
