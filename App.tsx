import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  ViewStyle,
  StyleProp,
  SafeAreaView,
  Alert,
  ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { statusOrder, Task, TaskStatus } from './src/types/task';
import { readTasks, saveTasks } from './src/utils/storage';
import { SwipeRow } from 'react-native-swipe-list-view';

import { AddTaskModal } from './src/AddTaskModal';
import { ViewTaskDetailsModal } from './src/ViewTaskDetailsModal';
import { TaskSortOption, TaskSortOrder } from './src/types/sort';

import { formatDateTime } from './src/utils/datetime';

const SWIPE_LIST_BUTTON_WITH = 60;
const SWIPE_LIST_ICON_SIZE = 32;
const ICON_STATUS = 'rule';

interface TaskItemActionSetInProgressProps {
  item: Task;
  handleSetTaskItemInProgress: (id: string) => Promise<void>;
  closeRow: () => void;
}

const TaskItemActionSetInProgress: React.FC<TaskItemActionSetInProgressProps> = ({
  item,
  handleSetTaskItemInProgress,
  closeRow,
}) => (
  <TouchableOpacity
    style={[styles.backBtn, styles.backBtnInProgressColor, styles.backBtnPositionLeftZero]}
    onPress={async () => {
      await handleSetTaskItemInProgress(item.id);
      closeRow();
    }}
  >
    <Icon name={'hourglass-top'} size={SWIPE_LIST_ICON_SIZE} color="#FFF" />
  </TouchableOpacity>
);


interface TaskItemActionSetCompletedProps {
  item: Task;
  handleSetTaskItemComplete: (id: string) => Promise<void>;
  closeRow: () => void;
  style: StyleProp<ViewStyle>;
}

const TaskItemActionSetCompleted: React.FC<TaskItemActionSetCompletedProps> = ({
  item,
  handleSetTaskItemComplete,
  closeRow,
  style,
}) => (
  <TouchableOpacity
    style={[styles.backBtn, styles.backBtnCompletedColor, style]}
    onPress={async () => {
      await handleSetTaskItemComplete(item.id);
      closeRow();
    }}
  >
    <Icon name={'check-circle'} size={SWIPE_LIST_ICON_SIZE} color="#FFF" />
  </TouchableOpacity>
);

interface TaskItemActionCancelledProps {
  item: Task;
  closeRow: () => void;
  handleSetTaskStatusCanceled: (id: string) => Promise<void>;
}

const TaskItemActionSetCancelled: React.FC<TaskItemActionCancelledProps> = ({
  item,
  handleSetTaskStatusCanceled,
  closeRow,
}) => (
  <TouchableOpacity
    style={[styles.backBtn, styles.backBtnCancelColor, styles.backBtnPositionRightZero]}
    onPress={async () => {
      await handleSetTaskStatusCanceled(item.id);
      closeRow();
    }}
  >
    <Icon name={'cancel'} size={SWIPE_LIST_ICON_SIZE} color="#FFF" />
  </TouchableOpacity>
);

interface TaskItemActionSetDeleteProps {
  item: Task;
  closeRow: () => void;
  handleTaskDelete: (id: string) => Promise<void>;
  style: StyleProp<ViewStyle>;
}

const TaskItemActionDelete: React.FC<TaskItemActionSetDeleteProps> = ({
  item,
  handleTaskDelete,
  closeRow,
  style,
}) => (
  <TouchableOpacity
    style={[styles.backBtn, styles.backBtnDeleteColor, style]} // Use styles.backBtn as base
    onPress={async () => {
      await handleTaskDelete(item.id);
      closeRow();
    }}
  >
    <Icon name="delete" size={SWIPE_LIST_ICON_SIZE} color="#FFF" />
  </TouchableOpacity>
);


const renderTaskItemContent = (data: ListRenderItemInfo<Task>, onOpenTaskDetails: (task: Task) => void): React.JSX.Element => (
  <Pressable
    onPress={() => onOpenTaskDetails(data.item)}
    style={[styles.rowFrontTouchable, styles.fullWidthRow]} // Added fullWidthRow
  >
    <View style={styles.fullWidthRow}>
      <View style={styles.rowFrontContainer}>
        <View style={[styles.taskRowMargins, styles.taskRowtitle]}>
          <View style={[styles.taskRowDataContainer, styles.taskRowTitleContainer]}>
            <Icon name="wysiwyg" size={16} color="#555" style={[styles.rowTaskIcon, styles.rowTaskTitleIcon]} />
            <View style={styles.taskRowDataContainer}>
              <Text numberOfLines={3} style={styles.rowTextWrap}>{data.item.title}</Text>
            </View>
          </View>
        </View>
        <View style={styles.taskRowMargins}>
          <View style={styles.taskRowDataContainer}>
            <Icon name="event-available" size={16} color="#555" style={styles.rowTaskIcon} />
            <Text numberOfLines={1}>{formatDateTime(data.item.executionDateTime)}</Text>
          </View>
        </View>
        <View style={[styles.taskRowMargins, styles.taskRowStatus]}>
          <View style={styles.taskRowDataContainer}>
            <Icon name={ICON_STATUS} size={16} color="#555" style={styles.rowTaskIcon} />
            <Text numberOfLines={1}>{data.item.status}</Text>
          </View>
        </View>
      </View>
    </View>
  </Pressable>
);


interface HiddenTaskItemsWithActionsProps {
  item: Task,
  closeRow: () => void,
  handleSetTaskInProgress: (id: string) => Promise<void>,
  handleSetTaskCancelled: (id: string) => Promise<void>,
  handleSetTaskComplete: (id: string) => Promise<void>,
  handleTaskDelete: (id: string) => Promise<void>,
};

const HiddenTaskItemsWithActions : React.FC<HiddenTaskItemsWithActionsProps> = ({
  item,
  closeRow,
  handleSetTaskInProgress,
  handleSetTaskCancelled,
  handleSetTaskComplete,
  handleTaskDelete,
}) => {
  // is "set completed" button should be shown
  const showSetInProgressButton =
    item.status === TaskStatus.Created;

  // is "set completed" button should be shown
  const showSetCompletedButton =
    item.status === TaskStatus.Created ||
    item.status === TaskStatus.InProgress;

    // is "set cancelled" button should be shown
  const showSetCancelledButton =
    item.status === TaskStatus.Created ||
    item.status === TaskStatus.InProgress;

  const setCompletedButtonStyle = showSetInProgressButton ? styles.backBtnPositionLeftSwipeWidth : styles.backBtnPositionLeftZero;
  const setDeleteButtonStyle = showSetCancelledButton ? styles.backBtnPositionRightSwipeWidth : styles.backBtnPositionRightZero;

  return (
    <View style={styles.rowBack}>
      {showSetInProgressButton && (
        <TaskItemActionSetInProgress
          item={item}
          closeRow={closeRow}
          handleSetTaskItemInProgress={handleSetTaskInProgress}
        />
      )}
      {showSetCompletedButton && (
        <TaskItemActionSetCompleted
          item={item}
          closeRow={closeRow}
          handleSetTaskItemComplete={handleSetTaskComplete}
          style={setCompletedButtonStyle}
        />
      )}
      <TaskItemActionDelete
        item={item}
        closeRow={closeRow}
        handleTaskDelete={handleTaskDelete}
        style={setDeleteButtonStyle}
      />
      {showSetCancelledButton && (
        <TaskItemActionSetCancelled
          item={item}
          closeRow={closeRow}
          handleSetTaskStatusCanceled={handleSetTaskCancelled}
        />
      )}
    </View>
  );
};

interface TaskRowProps {
  item: Task;
  onViewTaskModalOpen: (task: Task) => void;
  handleSetTaskInProgress: (id: string) => Promise<void>;
  handleSetTaskCancelled: (id: string) => Promise<void>;
  handleSetTaskComplete: (id: string) => Promise<void>;
  handleTaskDelete: (id: string) => Promise<void>;
}

const TaskRow: React.FC<TaskRowProps> = ({
  item, onViewTaskModalOpen,
  handleSetTaskInProgress,
  handleSetTaskCancelled,
  handleSetTaskComplete,
  handleTaskDelete,
}) => {
  const swipeRowRef = React.useRef<SwipeRow<Task>>(null);

  // show "Cancel" option only for tasks with status "Created" and "In Progress"
  const showSetCancelledButton = item.status === TaskStatus.Created || item.status === TaskStatus.InProgress;

  // calculate dynamic open values for the current row
  const currentRowLeftOpenValue = (() => {
    // for In Progress + Completed
    if (item.status === TaskStatus.Created) {
      return SWIPE_LIST_BUTTON_WITH * 2;
    }
    // only Completed
    if (item.status === TaskStatus.InProgress) {
      return SWIPE_LIST_BUTTON_WITH;
    }
    return 0;
  })();

  const currentRowRightOpenValue = (() => {
    let count = 1; // delete button visible always
    if (showSetCancelledButton) {count++;}
    return -count * SWIPE_LIST_BUTTON_WITH;
  })();

  return (
    // @ts-ignore fix SwipeRow type
     <SwipeRow
      ref={swipeRowRef}
      leftOpenValue={currentRowLeftOpenValue}
      rightOpenValue={currentRowRightOpenValue}
      stopLeftSwipe={currentRowLeftOpenValue}
      stopRightSwipe={currentRowRightOpenValue}
      closeOnRowPress
      closeOnRowOpen
      closeOnRowBeginSwipe={true}
      // disable swipe to left (from right) if right open value is 0
      disableLeftSwipe={currentRowRightOpenValue === 0}
      // same for swipe to right
      disableRightSwipe={currentRowLeftOpenValue === 0}
    >
      <HiddenTaskItemsWithActions
        item={item}
        //rowMap={rowMap}
        handleSetTaskInProgress={handleSetTaskInProgress}
        handleSetTaskCancelled={handleSetTaskCancelled}
        handleSetTaskComplete={handleSetTaskComplete}
        handleTaskDelete={handleTaskDelete}
        closeRow={() => {
          if (swipeRowRef.current) {
            swipeRowRef.current.closeRow();
          }
        }}
    />
      {
        renderTaskItemContent({ item } as ListRenderItemInfo<Task>, onViewTaskModalOpen)
      }
    </SwipeRow>
  );
};

interface NoTasksViewProps {
  isLoading: boolean;
  tasks: Task[] | null; // array or null
}

const NoTasksView: React.FC<NoTasksViewProps> = ({ isLoading, tasks }) => (
  <View
    style={styles.noTasksContainer}
  >
    <Text style={styles.noTasksBaseText}>
      <Text style={styles.noTasksPrimaryText}>
        {tasks === null ? 'Welcome to TODO tasks app!' : 'Tasks list is empty'}
        {'\n'}
      </Text>
      {isLoading ? (
        <Text style={styles.noTasksSecondaryText}>Loading...</Text>
      ) : (
        <Text style={styles.noTasksSecondaryText}>
          {'Please press '}
          <Text style={styles.noTasksPlusIcon}>+</Text>
          {' button to add your first task'}
        </Text>
      )}
    </Text>
  </View>
);


function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true); // indicate tha app is loading data from storage
  const [tasks, setTasks] = useState<Task[] | null>(null); // holding all tasks array, can be null
  const [selectedTaskForView, setSelectedTaskForView] = useState<Task | null>(null); // store task data for display it in modal
  const [isModalAddTaskVisible, setIsModalAddTaskVisible] = useState(false); // state for modal 'Add task' visibile
  const [isModalViewTaskVisible, setIsModalViewTaskVisible] = useState(false); // state for modal 'View task' visibile
  const [sortTasksOption, setTasksSortOption] = useState<TaskSortOption>(TaskSortOption.DATE_CREATED);
  const [sortTasksDir, setTasksSortDir] = useState<TaskSortOrder>(TaskSortOrder.DESC);


  const handleViewTaskModalClose = () => {
    setIsModalViewTaskVisible(false);
    setSelectedTaskForView(null); // clear task data just in case
  };

  const handleViewTaskModalOpen = (task: Task) => {
    setIsModalViewTaskVisible(true);
    setSelectedTaskForView(task);
  };

  const setTaskStatus = useCallback(
    async (id: string, status: TaskStatus) : Promise<void> => {
      if (!tasks) {
        return;
      }
      const newTasks = tasks.map(task => {
        if (task.id === id) {
          return {...task, status};
        }
        return task;
      });
      setTasks(newTasks);
      await saveTasks(newTasks);
    }, [tasks]
  );

  const addTask = useCallback(
    async (
      title: string,
      description: string,
      location: string,
      executionDateTime: string,
    ) => {
      try {
      const newTask: Task = {
        id: uuidv4(),
        title,
        description,
        createdAt: new Date().toISOString(),
        status: TaskStatus.Created,
        executionDateTime,
        location,
      };
      const currentTasks = tasks || []; // empty array for the first added task
      const allTasks = [...currentTasks, newTask]; // add new task immutably
      setTasks(allTasks);
      await saveTasks(allTasks);
      // TODO: implement for iOS with lib / custom componet
      ToastAndroid.showWithGravity('Task added successfully', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } catch (e) {
      console.error('Error adding task:', e);
      Alert.alert('Error adding task', 'Please try again.');
    }
  }, [tasks]); // useCallback to prevent unnecessary re-renders

  // clearStorage(); // *** for test purposes only !

  useEffect(() => {
    async function getTasks () {
      setIsLoading(true);
      // read tasks (localstorage)
      const loadedTasks = await readTasks();
      setTasks(loadedTasks);
      setIsLoading(false);
      /*
      await addTask(
        'ABC 123 hello',
        'hello world',
        'polo alto usa',
        new Date().toISOString(),
      );
      */
      // await removeTask(tasks[0].id);
    }
    getTasks();
  }, []);

  const handleSetTaskInProgress = useCallback(
    async (id : string) => {
      await setTaskStatus(id, TaskStatus.InProgress);
    }, [setTaskStatus]
  );

  const handleSetTaskCompleted = useCallback(
    async (id : string) => {
      await setTaskStatus(id, TaskStatus.Completed);
    }, [setTaskStatus]
  );

  const handleSetTaskCancelled = useCallback(
    async (id: string) => {
      await setTaskStatus(id, TaskStatus.Cancelled);
    }, [setTaskStatus]
  );

  const handleTaskDelete = useCallback(
    async (id: string) => {
      if (!tasks) {
        return;
      }
      const taskToDelete = tasks.find(task => task.id === id);
      if (taskToDelete) {
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks);
        await saveTasks(newTasks);
      } else {
        console.warn('task not found');
      }
    }, [tasks]
  );

  // sorting tasks function
  const sortedTasks = React.useMemo(() => {
    if (!tasks) {
      return []; // in case no tasks - flatList expects array
    }
    const tasksCurrent = [...tasks]; // check to be array here
    switch (sortTasksOption) {
      case TaskSortOption.DATE_CREATED:
        return tasksCurrent.sort((a, b) => sortTasksDir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
     case TaskSortOption.STATUS:
        return tasksCurrent.sort((a, b) => sortTasksDir * (statusOrder[a.status] - statusOrder[b.status]));
      default:
        return tasksCurrent;
    }
  }, [tasks, sortTasksOption, sortTasksDir]);

   // mirror and rotate 'Sort order' icon for Desc sort order
  const rotateSortIconStyle = sortTasksDir === TaskSortOrder.DESC ? '0deg' : '180deg';
  const mirrorSortIconStyle = -sortTasksDir;

  return (
    <SafeAreaView style={styles.container}>
      {(tasks && tasks.length > 0) ? (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitleText}>My ToDo list</Text>
            <View style={styles.sortControlsContainer}>
              <View style={[styles.sortDirectionIconContainer, {transform: [{ translateY: sortTasksDir * 5}, {rotate: rotateSortIconStyle}, {scaleX: mirrorSortIconStyle}]}]}>
                <TouchableOpacity onPress={() => setTasksSortDir(prevDir => prevDir === TaskSortOrder.ASC ? TaskSortOrder.DESC : TaskSortOrder.ASC)} style={styles.sortButton}>
                  <Icon name="sort" size={24} color={styles.activeSortIcon.color} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setTasksSortOption(TaskSortOption.DATE_CREATED)} style={[styles.sortButtonBase, sortTasksOption === TaskSortOption.DATE_CREATED ? styles.activeSortButton : styles.inactiveSortButton]}>
                <Icon name={'event-note'} size={24} style={ sortTasksOption === TaskSortOption.DATE_CREATED ? styles.activeSortIcon : styles.inactiveSortIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTasksSortOption(TaskSortOption.STATUS)} style={[styles.sortButtonBase, sortTasksOption === TaskSortOption.STATUS ? styles.activeSortButton : styles.inactiveSortButton]}>
                <Icon name={ICON_STATUS} size={24} style={ sortTasksOption === TaskSortOption.STATUS ? styles.activeSortIcon : styles.inactiveSortIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={sortedTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TaskRow
                item={item}
                onViewTaskModalOpen={handleViewTaskModalOpen}
                handleSetTaskInProgress={handleSetTaskInProgress}
                handleSetTaskCancelled={handleSetTaskCancelled}
                handleSetTaskComplete={handleSetTaskCompleted}
                handleTaskDelete={handleTaskDelete}
              />
            )}
          />
        </>
      ) : (
        <NoTasksView
          isLoading={isLoading}
          tasks={tasks}
        />
      )}

      {!isLoading && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsModalAddTaskVisible(true)}
          activeOpacity={0.7}
        >
          <Icon name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      )}

      <AddTaskModal
        visible={isModalAddTaskVisible}
        onClose={() => setIsModalAddTaskVisible(false)}
        onAddTask={addTask}
      />

      <ViewTaskDetailsModal
        visible={isModalViewTaskVisible}
        onClose={handleViewTaskModalClose}
        task={selectedTaskForView}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  rowFrontTouchable: {
    backgroundColor: '#FFF',
  },
  rowFrontContainer: {
    // alignItems: 'center',
    width: '100%',
    // justifyContent: 'space-between',
    backgroundColor: '#FFF',
    // backgroundColor: 'yellow',
    paddingHorizontal: '2.5%',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 80,
    maxWidth: '100%',
  },
  taskRowtitle: {
    marginTop: 7,
  },
  taskRowMargins: {
    marginVertical: 5,
    maxWidth: '100%',
  },
  taskRowStatus: {
    marginBottom: 10,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  backBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: SWIPE_LIST_BUTTON_WITH,
  },
  backBtnInProgressColor: {
    backgroundColor: '#2196F3',
  },
  backBtnCompletedColor: {
    backgroundColor: '#4CAF50',
  },
  backBtnCancelColor: {
    backgroundColor: '#757575',
  },
  backBtnDeleteColor: {
    backgroundColor: '#F44336',
  },
  // swipe button positioning
  backBtnPositionLeftZero: {
    left: 0,
  },
  backBtnPositionRightZero: {
    right: 0,
  },
  backBtnPositionLeftSwipeWidth: {
    left: SWIPE_LIST_BUTTON_WITH,
  },
  backBtnPositionRightSwipeWidth: {
    right: SWIPE_LIST_BUTTON_WITH,
  },
  // + icon button
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: '#007BFF',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rowTaskTitleIcon: {
    marginTop: 3,
  },
  rowTaskIcon: {
    marginRight: 10,
  },
  taskRowDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskRowTitleContainer: {
    alignItems: 'flex-start',
  },
  rowTextWrap:{
    flexWrap: 'wrap',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sortButton: {
    padding: 5,
  },
  sortButtonBase: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSortButton: {
    backgroundColor: '#E0EFFF',
  },
  inactiveSortButton: {
    backgroundColor: 'transparent',
  },
  activeSortIcon: {
    color: '#007BFF',
  },
  inactiveSortIcon: {
    color: '#888888',
    opacity: 0.75,
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noTasksBaseText: {
    textAlign: 'center',
    color: '#333333',
  },
  noTasksPrimaryText: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 30,
    marginBottom: 8,
  },
  noTasksSecondaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
  noTasksPlusIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  fullWidthRow: {
    flexDirection: 'row',
    width: '100%',
  },
  sortControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortDirectionIconContainer: {
    height: 30,
    alignSelf: 'center',
  },
});

export default App;
