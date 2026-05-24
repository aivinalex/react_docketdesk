import { createPDFv2 } from "../services/pdfMakeService.js";
import { createWordDocument } from "../services/docMakeService.js";
export async function downloadPdf(req, reply) {
    const id = req.params.id;
    const file = req.server.fileStore.get(id);
    if (!file) {
        throw req.server.httpErrors.notFound("Session expired. Please search again.");
    }
    if (!file.data.causelist)
        throw req.server.httpErrors.notFound("Session expired. Please search again.");
    try {
        const pdf = await createPDFv2(file.data);
        reply
            .type("application/pdf")
            .header("Content-Disposition", `attachment; filename=${id}.pdf`)
            .send(pdf);
    }
    catch (error) {
        req.log.error(error);
        throw req.server.httpErrors.internalServerError("Failed to generate PDF");
    }
}
export async function downloadWord(req, reply) {
    const id = req.params.id;
    const file = req.server.fileStore.get(id);
    if (!file) {
        throw req.server.httpErrors.notFound("Session expired. Please search again.");
    }
    if (!file.data.causelist) {
        throw req.server.httpErrors.notFound("Session expired. Please search again.");
    }
    try {
        const wordBuffer = await createWordDocument(file.data);
        reply
            .type("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            .header("Content-Disposition", `attachment; filename=${id}.docx`)
            .send(wordBuffer);
    }
    catch (error) {
        req.log.error(error);
        throw req.server.httpErrors.internalServerError("Failed to generate Word document");
    }
}
