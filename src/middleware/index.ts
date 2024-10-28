import express from "express";
import jwt from "jsonwebtoken";
import { merge, get } from "lodash";

import { getSessionByToken } from "../db/sessions";

import { createResponseHelpers, verifyToken } from "../helpers";

import { Status } from "../types";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const responseHelpers = createResponseHelpers(res);

  try {
    const token = req.cookies["authorization"];

    if (!token) {
      return responseHelpers.sendRejectedResponse(
        401,
        "Token not present",
        Status.DANGER
      );
    }

    try {
      verifyToken(token);
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        console.error(error);

        return responseHelpers.sendRejectedResponse(
          401,
          "Token expired",
          Status.DANGER
        );
      } else {
        console.error("Invalid token:", error);

        return responseHelpers.sendRejectedResponse(
          401,
          "Invalid token",
          Status.DANGER
        );
      }
    }

    const session = await getSessionByToken(token);

    if (!session) {
      return responseHelpers.sendRejectedResponse(
        404,
        "Session not found",
        Status.DANGER
      );
    }

    merge(req, { identity: session.userId });

    return next();
  } catch (error) {
    console.log(error);

    responseHelpers.sendRejectedResponse(
      500,
      "Internal server error",
      Status.DANGER
    );
  }
};
