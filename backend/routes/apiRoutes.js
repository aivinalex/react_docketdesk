"use strict";
import advocateSearchSchema from "../schemas/advocateSchema.js";
import advocateController from "../controller/advocateController.js";
import causelistController from "../controller/causelistContoller.js";
import { downloadPdf ,downloadWord} from "../controller/downloadController.js";

export async function advocateRoutes(app) {
  app.get("/advocates", advocateSearchSchema, advocateController);
}

export async function causeListRoute(app) {
  app.post("/causelist", causelistController);
}
export async function statusCheckRoute(app) {
  app.get("/status", async (req, reply) => {
    return reply.send({
      status: "ok",
      // eslint-disable-next-line no-undef
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });
}
export async function downloadRoute(app) {
  app.get("/pdf/:id", downloadPdf);
  app.get("/word/:id", downloadWord);
}
