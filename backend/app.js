/* eslint-disable no-undef */
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import {
  advocateRoutes,
  causeListRoute,
  downloadRoute,
  statusCheckRoute,
} from "./routes/apiRoutes.js";
import sensible from "@fastify/sensible";
import errorHandler from "./helpers/errorHandler.js";

export default function buildApp() {
  const _filename = fileURLToPath(import.meta.url);
  const _dirname = path.dirname(_filename);
  const app = Fastify({
    logger: process.env.NODE_ENV === "production" ? "warn" : "info",
  });

  app.decorate("fileStore", new Map());
  app.server.keepAliveTimeout = 0;
  app.server.headersTimeout = 0;
  app.register(sensible);
  app.register(fastifyStatic, {
    root: path.join(_dirname, "../public"),
  });

  app.register(advocateRoutes, { prefix: "/api" });
  app.register(causeListRoute, { prefix: "/api" });
  app.register(statusCheckRoute);
  app.register(downloadRoute, { prefix: "/download" });

  app.setErrorHandler(errorHandler);

  return app;
}
