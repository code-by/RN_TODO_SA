export enum TaskStatus {
	Created = 'Created',
	InProgress = 'In Progress',
	Completed = 'Completed',
	Cancelled = 'Cancelled',
}

export const statusOrder = {
	[TaskStatus.Cancelled]: 0,
	[TaskStatus.Created]: 1,
	[TaskStatus.InProgress]: 2,
	[TaskStatus.Completed]: 3,
};

export interface Task {
	id: string; // unique id
	title: string;
	description: string;
	createdAt: string;
	executionDateTime: string;
	location: string;
	status: TaskStatus;
}
