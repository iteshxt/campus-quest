import { createStartHandler } from "@tanstack/start/server";
import { getRouter } from "./router";
import { startInstance } from "./start";

export default createStartHandler({
  createRouter: getRouter,
  getStartInstance: () => startInstance,
});
