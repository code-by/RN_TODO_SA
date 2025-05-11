import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { formatDateTime } from './utils/datetime.ts';
import { ModalViewContainer } from './ModalView.tsx';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (
    title: string,
    description: string,
    location: string,
    executionDateTime: string,
  ) => void;
}

const isIOS = Platform.OS === 'ios';

const PRIMARY_BUTTON_COLOR = '#007BFF'; // same as + FAB in main screen
const SECONDARY_BUTTON_COLOR = '#6c757d'; // neutral grey for date/time selection buttons

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showAlert = (message: string): void => {
    Alert.alert('Error:', message);
  };

  const handleAddTask = () => {
    // validation
    if (!title.trim()) {
      showAlert('Title can\'t be empty.');
      return;
    }
    if (date < new Date()) {
      showAlert('The selected date and time can\'t be in the past.');
      return;
    }
    onAddTask(title, description, location, date.toISOString());
    // reset form and close
    setTitle('');
    setDescription('');
    setLocation('');
    setDate(new Date());
    onClose();
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(isIOS); // for iOS should be open until user confirms
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(isIOS);
    if (selectedTime) {
      const newDateTime = new Date(date); // use currently selected date
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      newDateTime.setSeconds(0); // ignore seconds
      newDateTime.setMilliseconds(0);
      setDate(newDateTime);
    }
  };

  return (
    <ModalViewContainer
      visible={visible}
      onClose={onClose}
      title="Add New Task"
      disableBackdropPress={true} // prevent closing on backdrop press
    >
      <>
        <TextInput
          placeholder="Title"
          maxLength={255}
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Description (Optional)"
          maxLength={1000}
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />
        <TextInput
          maxLength={255}
          placeholder="Location (Optional)"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        {/* date/time pickers */}
        <Text>
          {'Date/Time of Execution:'}
        </Text>

        <View style={styles.dateRow}>
          <Button
            onPress={() => setShowDatePicker(true)}
            title="Select Date"
            color={SECONDARY_BUTTON_COLOR}
          />
          <Button
            onPress={() => setShowTimePicker(true)}
            title="Select Time"
            color={SECONDARY_BUTTON_COLOR}
          />
        </View>
 
        <Text>
          Selected: {formatDateTime(date.toISOString())}
        </Text>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}

        <View style={styles.buttonRow}>
          <Button
            title="Add Task"
            onPress={handleAddTask}
            color={PRIMARY_BUTTON_COLOR}
          />
        </View>
      </>
    </ModalViewContainer>
  );

};

const styles = StyleSheet.create({
  input: {
    minHeight: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
});
