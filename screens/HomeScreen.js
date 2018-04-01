import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  ProgressViewIOS,
  Platform,
  View,
  TouchableHighlight
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
import PhotoDetailModal from '../components/PhotoDetailModal'

import Exponent, {
  Constants,
  ImagePicker,
  registerRootComponent
} from 'expo';

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
    avatarSource: null,
    modalVisible: false,
    selectedImage: null
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


  _toggleModal(_selectedImage) {
    this.setState((prev) => {
      return {
        modalVisible: !prev.modalVisible,
        selectedImage: _selectedImage
      }
    })

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

    // get values...
    let {
      modalVisible,
      selectedImage,
      assets
    } = this.state;

    //render...
    return (
      <Container>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <List>

            <PhotoDetailModal
              modalVisible={modalVisible}
              selectedImage={selectedImage}
              toggleModal={() => { this._toggleModal(null) }}
            />

            {assets ? assets.map((a) => {
              return (
                <ListItem key={a.id}>
                  <PhotoContainer
                    avatarSource={a.URL}
                    toggleModal={() => this._toggleModal(a)} />
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
            progressViewStyle="bar"
            style={{
              padding: 20,
              height: 10
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
        allowsEditing: (Platform.OS === 'ios'),
        quality: .8,
        aspect: [1, 1],
        base64: true
      });
    } else {
      pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: .8, base64: false });
    }

    if (pickerResult.cancelled)
      return;

    let finalImage = await api.uploadAsFile(pickerResult.uri, (progress) => {
      console.log(progress)
      this.setState({ progress })
    })

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
