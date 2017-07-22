import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default PhotoButton = ({ _onPress, title }) => {
    return (
        <View style={styles.helpContainer}>
            <TouchableOpacity
                onPress={_onPress}
                style={styles.helpLink}>
                <Text style={styles.helpLinkText}>
                    {title}
                </Text>
            </TouchableOpacity>
        </View>
    )
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
