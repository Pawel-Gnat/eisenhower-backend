import express from "express";

import {
  createTask,
  deleteTaskById,
  deleteTasks,
  getTaskById,
  getTaskByTitle,
  getTasks,
  updateTaskById,
} from "../db/tasks";

import { createResponseHelpers } from "../helpers";

import { Status } from "../types";

export const getAllTasks = async (
  req: express.Request,
  res: express.Response
) => {
  const responseHelpers = createResponseHelpers(res);

  try {
    const userId = req.identity;
    const tasks = await getTasks(userId);

    responseHelpers.sendFulfilledResponseWithData(
      tasks,
      200,
      "Tasks fetched",
      Status.SUCCESS
    );
  } catch (error) {
    console.log(error);

    responseHelpers.sendRejectedResponse(
      500,
      "Internal server error",
      Status.DANGER
    );
  }
};

export const createNewTask = async (
  req: express.Request,
  res: express.Response
) => {
  const responseHelpers = createResponseHelpers(res);

  try {
    const userId = req.identity;
    const { title } = req.body;

    if (!title) {
      return responseHelpers.sendRejectedResponse(
        400,
        "Title is required",
        Status.WARNING
      );
    }

    const existingTask = await getTaskByTitle(userId, title);

    if (existingTask) {
      return responseHelpers.sendRejectedResponse(
        400,
        "Title already exists",
        Status.WARNING
      );
    }

    const task = await createTask({
      title,
      urgency: null,
      importance: null,
      userId,
    });

    responseHelpers.sendFulfilledResponseWithData(
      task,
      200,
      "Task created",
      Status.SUCCESS
    );
  } catch (error) {
    console.log(error);

    responseHelpers.sendRejectedResponse(
      500,
      "Internal server error",
      Status.DANGER
    );
  }
};

export const deleteTask = async (
  req: express.Request,
  res: express.Response
) => {
  const responseHelpers = createResponseHelpers(res);

  try {
    const userId = req.identity;
    const { id } = req.params;

    await deleteTaskById(id, userId);

    return responseHelpers.sendFulfilledResponseWithoutData(
      204,
      "Client deleted",
      Status.SUCCESS
    );
  } catch (error) {
    console.log(error);

    responseHelpers.sendRejectedResponse(
      500,
      "Internal server error",
      Status.DANGER
    );
  }
};

export const deleteAllTasks = async (
  req: express.Request,
  res: express.Response
) => {
  const responseHelpers = createResponseHelpers(res);

  try {
    const userId = req.identity;
    await deleteTasks(userId);

    responseHelpers.sendFulfilledResponseWithoutData(
      204,
      "Tasks deleted",
      Status.SUCCESS
    );
  } catch (error) {
    console.log(error);

    responseHelpers.sendRejectedResponse(
      500,
      "Internal server error",
      Status.DANGER
    );
  }
};

export const updateTask = async (
  req: express.Request,
  res: express.Response
) => {
  const responseHelpers = createResponseHelpers(res);

  try {
    const userId = req.identity;
    const { id } = req.params;
    const { title, urgency, importance } = req.body;

    const existingTask = await getTaskById(id, userId);

    if (!existingTask) {
      return responseHelpers.sendRejectedResponse(
        404,
        "Task not found",
        Status.WARNING
      );
    }

    const task = await updateTaskById(userId, id, {
      title: title || existingTask.title,
      urgency: urgency || existingTask.urgency,
      importance: importance || existingTask.importance,
      userId: userId,
    });

    responseHelpers.sendFulfilledResponseWithData(
      task,
      200,
      "Task updated",
      Status.SUCCESS
    );
  } catch (error) {
    console.log(error);

    responseHelpers.sendRejectedResponse(
      500,
      "Internal server error",
      Status.DANGER
    );
  }
};
