import express from "express";

import { loginUser, logoutUser, registerUser } from "../controllers/auth";

export default (router: express.Router) => {
  router.post("/auth/login", loginUser);
  router.get("/auth/logout", logoutUser);
  router.post("/auth/register", registerUser);
};
