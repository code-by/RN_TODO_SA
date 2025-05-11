import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';
import { Alert } from 'react-native';

const cacheKey = 'todos';

export const readTasks = async (): Promise<Task[] | null> => {
    const data = await AsyncStorage.getItem(cacheKey);
    if (!data) {
        return null;
    }
    try {
        const tasks = await JSON.parse(data);
        return tasks;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const saveTasks = async (tasks: Task[]) => {
    try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(tasks));
    } catch (e) {
        console.log(e);
        Alert.alert('Error', 'Error occured saving tasks list');
    }
};

// for debug-test purposes
export const clearStorage = async () => {
    console.warn('* clearStorage *');
    try {
        await AsyncStorage.removeItem(cacheKey);
    } catch (e) {
        console.log(e);
    }
};
