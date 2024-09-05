import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const BootomSheet = ({isModalVisible,toggleModal, animValue, children, modalContainerStyle}) => {
//   const [isModalVisible, setModalVisible] = useState(false);

//   // Animation state
//   const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

//   const toggleModal = () => {
//     if (isModalVisible) {
//       // Hide modal
//       Animated.timing(animValue, {
//         toValue: 1000,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setModalVisible(false));
//     } else {
//       // Show modal
//       setModalVisible(true);
//       Animated.timing(animValue, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

  return (
    
    <View style={styles.container}>
      {/* <Button title="Show Modal" onPress={toggleModal} /> */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={toggleModal}
        >
          <Animated.View style={[modalContainerStyle ? modalContainerStyle : styles.modalContainer, { transform: [{ translateY: animValue }] }]}>
            {children}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
 
});

export default BootomSheet;
