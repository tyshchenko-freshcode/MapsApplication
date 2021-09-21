import React, {useRef, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
// import {ReactNativeModal} from 'react-native-modal';
import Modal from 'react-native-modal';

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    modalRef.current.close;
  };

  return (
    <View style={styles.main}>
      <Text>Home Screen</Text>
      <Button title={'Show modal'} onPress={toggleModal} />
      <Modal
        ref={modalRef}
        isVisible={modalVisible}
        style={styles.modal}
        onSwipeComplete={toggleModal}
        swipeDirection={['down']}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <Text>Modal window</Text>
          <Button title={'Close'} onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
});

export default HomeScreen;
