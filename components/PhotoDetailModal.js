import React from 'react';
import {
    StyleSheet,
    Modal,
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import PropTypes from 'prop-types';

/**
* @param modalVisible boolean
* @param selectedImage Object
* @param toggleModal Function
*/
export default PhotoDetailModal = ({ modalVisible, selectedImage, toggleModal }) => {
    return (
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={modalVisible}
        >
            <View style={{ marginTop: 22, backgroundColor: 'white', height: 150 }}>
                <TouchableHighlight onPress={() => { toggleModal() }}>
                    <Text>Hide Modal</Text>
                </TouchableHighlight>
                <View>
                    <Text>{selectedImage && JSON.stringify(selectedImage, null, 2)}</Text>
                </View>
            </View>
        </Modal>
    )
}

PhotoDetailModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  selectedImage: PropTypes.object,
  toggleModal: PropTypes.func.isRequired
};