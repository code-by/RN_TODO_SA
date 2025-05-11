import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ModalViewContainer {
  visible: boolean;
  onClose: () => void;
  title: string,
  children: React.ReactNode,
  scrollable?: boolean, // will be scrollable in case large text not fit in screen
  disableBackdropPress?: boolean; // disable background touch dismiss modal
}

export const ModalViewContainer: React.FC<ModalViewContainer> = ({
  visible,
  onClose,
  title,
  children,
  scrollable,
  disableBackdropPress,
}) => (

  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose} // close via back button (android) or backdrop tap
  >
    <TouchableOpacity
      style={styles.modalContainer}
      activeOpacity={1}
      onPressOut={disableBackdropPress ? undefined : onClose}
    >
      {/* prevent background tap from closing when tapping content */}
      <TouchableOpacity style={[styles.modalView, scrollable ? styles.scrollable : {}] } activeOpacity={1} onPress={() => {}}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={24} color="#555" />
        </TouchableOpacity>
        {children}
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalViewCustom: {
    maxHeight: '75%',
    overflow: 'scroll',
  },
  scrollable: {
    maxHeight: '75%',
    overflow: 'scroll',
  },
  closeButton: {
    position: 'absolute',
    top: 25,
    right: 15,
    paddingRight: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});
