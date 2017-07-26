import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { Container, Button, Text } from 'native-base';

export default PhotoButton = ({ _onPress, title, textColor }) => {
    return (
        <Button
            onPress={_onPress}
            style={styles.helpLink}>
            <Text style={styles.helpLinkText} color={textColor}>
                {title}
            </Text>
        </Button>
    )
}

//
// styles for the screen
//
const styles = StyleSheet.create({
    helpContainer: {
        paddingTop: 15,
        alignItems: 'center',
    },
});
