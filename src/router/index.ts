import express from "express";

import auth from "./auth";
import tasks from "./tasks";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  tasks(router);

  return router;
};
