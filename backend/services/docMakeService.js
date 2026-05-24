import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, } from "docx";
function createCell(text, bold = false) {
    return new TableCell({
        children: [
            new Paragraph({
                children: [
                    new TextRun({
                        text,
                        bold,
                        font: "Times New Roman",
                        size: 18,
                    }),
                ],
            }),
        ],
    });
}
function createHeaderRow() {
    return new TableRow({
        tableHeader: true,
        children: [
            createCell("Sl. No", true),
            createCell("Case No", true),
            createCell("Case Name", true),
            createCell("Stage", true),
            createCell("Bench", true),
            createCell("Court", true),
            createCell("Item", true),
        ],
    });
}
function createDataRows(data) {
    return data.causelist.map((el, i) => new TableRow({
        children: [
            createCell(String(i + 1)),
            createCell(el.caseNo || ""),
            createCell(el.parties || ""),
            createCell(el.list || ""),
            createCell(el.benchName || ""),
            createCell(el.courtHall || ""),
            createCell(`Item ${el.itemNo}\n${el.items || ""}`),
        ],
    }));
}
export async function createWordDocument(data) {
    const table = new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: [createHeaderRow(), ...createDataRows(data)],
    });
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Causelist",
                                bold: true,
                                font: "Times New Roman",
                                size: 24,
                            }),
                        ],
                    }),
                    table,
                ],
            },
        ],
    });
    return await Packer.toBuffer(doc);
}
