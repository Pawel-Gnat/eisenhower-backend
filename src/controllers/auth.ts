import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createResponseHelpers,
  generateAccessToken,
  verifyToken,
} from "../helpers";

import { getUserByEmail, createUser } from "../db/users";
import {
  createSession,
  getSessionByUserId,
  updateSession,
} from "../db/sessions";

import { Status } from "../types";

export let refreshTokens: string[] = [];

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  const responseHelpers = createResponseHelpers(res);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return responseHelpers.sendRejectedResponse(
        400,
        "All fields are required",
        Status.WARNING
      );
    }

    const user = await getUserByEmail(email).select("+password");

    if (!user) {
      return responseHelpers.sendRejectedResponse(
        400,
        "Invalid email or password",
        Status.WARNING
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return responseHelpers.sendRejectedResponse(
        400,
        "Invalid email or password",
        Status.WARNING
      );
    }

    let token;
    const session = await getSessionByUserId(user.id);

    if (!session) {
      token = generateAccessToken({ id: user.id });
      await createSession(token, user.id);
    } else {
      try {
        verifyToken(session.sessionToken);
        token = session.sessionToken;
      } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
          token = generateAccessToken({ id: user.id });
          await updateSession(token, user.id);

          responseHelpers.sendFulfilledResponseWithCookie(
            token,
            200,
            "Login successful",
            Status.SUCCESS
          );
        } else {
          console.error("Invalid token:", error);

          return responseHelpers.sendRejectedResponse(
            400,
            "Invalid session token",
            Status.DANGER
          );
        }
      }
    }

    responseHelpers.sendFulfilledResponseWithCookie(
      token,
      200,
      "Login successful",
      Status.SUCCESS
    );
  } catch (error) {
    console.log(error);

    return responseHelpers.sendRejectedResponse(
      500,
      "Internal server error",
      Status.DANGER
    );
  }
};

export const logoutUser = async (
  req: express.Request,
  res: express.Response
) => {
  res.clearCookie("authorization", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  const responseHelpers = createResponseHelpers(res);

  responseHelpers.sendFulfilledResponseWithoutData(
    204,
    "Logged out",
    Status.SUCCESS
  );
};

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  const responseHelpers = createResponseHelpers(res);

  try {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      return responseHelpers.sendRejectedResponse(
        400,
        "All fields are required",
        Status.WARNING
      );
    }

    if (!emailRegex.test(email)) {
      return responseHelpers.sendRejectedResponse(
        400,
        "Invalid email format",
        Status.WARNING
      );
    }

    if (password.length < 4 || /\s/.test(password)) {
      return responseHelpers.sendRejectedResponse(
        400,
        "Password must be at least 4 characters long and cannot contain spaces",
        Status.WARNING
      );
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return responseHelpers.sendRejectedResponse(
        400,
        "User already exists",
        Status.WARNING
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await createUser({
      email,
      password: hashedPassword,
    });

    responseHelpers.sendFulfilledResponseWithoutData(
      200,
      "User registered successfully",
      Status.SUCCESS
    );
  } catch (error) {
    console.log(error);

    return responseHelpers.sendRejectedResponse(
      500,
      "Internal server error",
      Status.DANGER
    );
  }
};
