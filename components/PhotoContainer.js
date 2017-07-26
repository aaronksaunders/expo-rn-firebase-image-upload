import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions
} from 'react-native';

import { Container, Thumbnail } from 'native-base';

export default PhotoContainer = ({ _avatarSource }) => {

  let w = Dimensions.get('window').width

  return (
    <View>
      {_avatarSource == null ? null :

        <Thumbnail square small source={{ uri: _avatarSource }}
          style={{
            alignSelf: 'center',
            height: w * .80,
            width: w * .80,
            borderWidth: 1,
          }}
          resizeMode="contain"
        />
      }
    </View>
  )

}