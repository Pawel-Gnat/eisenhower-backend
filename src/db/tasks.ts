import { Schema, model } from 'mongoose'

import { Task as TaskType } from '../types'

const TaskSchema = new Schema<TaskType>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		urgency: {
			type: String,
			enum: ['urgent', 'not urgent', null],
		},
		importance: {
			type: String,
			enum: ['important', 'not important', null],
		},
		userId: { type: String, ref: 'User' },
	},
	{ timestamps: true }
)

export const Task = model<TaskType>('Task', TaskSchema)

export const getTasks = (userId: string) => Task.find({ userId })
export const getTaskById = (id: string, userId: string) => Task.find({ userId }).findOne({ _id: id })
export const getTaskByTitle = (userId: string, title: string) => Task.find({ userId }).findOne({ title })
export const createTask = async (values: TaskType) => {
	const task = new Task(values)
	return task.validate().then(() => task.save())
}
export const deleteTaskById = (id: string, userId: string) =>
	Task.find({ userId }).findOneAndDelete({ _id: id, runValidators: true })
export const updateTaskById = (userId: string, id: string, values: TaskType) =>
	Task.find({ userId }).findOneAndUpdate({ _id: id }, values, {
		new: true,
		runValidators: true,
	})
export const deleteTasks = (userId: string) => Task.deleteMany({ userId })
