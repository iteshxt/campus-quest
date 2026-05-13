import { createStartHandler } from "@tanstack/react-start/server-handler";
import { getRouter } from "./router";
import { startInstance } from "./start";

export default createStartHandler({
  createRouter: getRouter,
  getStartInstance: () => startInstance,
});
