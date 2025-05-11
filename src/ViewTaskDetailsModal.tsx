import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Task, TaskStatus } from './types/task';
import { formatDateTime } from './utils/datetime';

import { ModalViewContainer } from './ModalView.tsx';

// import { formatDateTime } from '../utils/datetime'; // TODO: move formatDateTime to utils

interface ViewTaskDetailsModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
}

// tasks status color
const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Completed:
      return '#4CAF50';
    case TaskStatus.InProgress:
      return '#2196F3';
    case TaskStatus.Cancelled:
      return '#757575';
    default:
      return '#000';
  }
};

export const ViewTaskDetailsModal: React.FC<ViewTaskDetailsModalProps> = ({
  visible,
  task,
  onClose,
}) => {
  // if task is null, just in case
  if (!task) {
    return null;
  }

  const statusColor = getStatusColor(task.status);

  return (
    <ModalViewContainer
      title="Task Info"
      visible={visible}
      onClose={onClose}
      scrollable
    >
      <View style={styles.itemRow}>
        <Text style={[styles.label, styles.bigText]}>Title:</Text>
        <Text style={[styles.modalText, styles.bigText]} numberOfLines={3}>
          {task.title}
        </Text>
      </View>

      <View style={styles.itemRow}>
        <Text style={styles.label}>Description:</Text>
        <ScrollView style={styles.descriptionScrollView}>
            <Text style={styles.modalText}>{task.description || 'No description'}</Text>
        </ScrollView>
      </View>

      <View style={styles.itemRow}>
        <Text style={styles.label}>Location:</Text>
        <View style={styles.row}>
            <Text numberOfLines={3} style={styles.modalText}>{task.location}</Text>
        </View>
      </View>

      <View style={[styles.itemRow, styles.rowInLine]}>
        <Text style={styles.label}>Created: </Text>
        <Text style={styles.modalText}>{formatDateTime(task.createdAt)}</Text>
      </View>

      <View style={[styles.itemRow, styles.rowInLine]}>
        <Text style={styles.label}>Execution: </Text>
        <Text style={styles.modalText}>{formatDateTime(task.executionDateTime)}</Text>
      </View>

      <View style={[styles.itemRow, styles.rowInLine]}>
        <Text style={styles.label}>Status: </Text>
        <Text style={[styles.modalText, { color: statusColor }]}>
          {task.status}
        </Text>
      </View>

    </ModalViewContainer>
  );
};


const styles = StyleSheet.create({
  smallText: {
    fontSize: 14,
  },
  bigText: {
    fontSize: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  descriptionScrollView: {
    maxHeight: 150,
  },
  locationScrollView: {
    maxHeight: 100,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  itemRow: {
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowInLine: {
    flexDirection: 'row',
  },
});
