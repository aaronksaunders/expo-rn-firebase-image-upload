import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableHighlight
} from 'react-native';

import { Container, Thumbnail } from 'native-base';

export default PhotoContainer = ({ avatarSource, toggleModal }) => {

  let w = Dimensions.get('window').width

  return (
    <View>
      {avatarSource == null ? null :
        <TouchableHighlight onPress={() => {toggleModal()}}>
          <Thumbnail square small source={{ uri: avatarSource }}
            style={{
              alignSelf: 'center',
              height: w * .80,
              width: w * .80,
              borderWidth: 1,
            }}
            resizeMode="contain"
          />
        </TouchableHighlight>
      }
    </View>
  )

}