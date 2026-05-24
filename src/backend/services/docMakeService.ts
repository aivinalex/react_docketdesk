import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

import { Response } from "../../types/appTypes.js";

function createCell(text: string, bold = false, width = 10): TableCell {
  return new TableCell({
    width: {
      size: width,

      type: WidthType.PERCENTAGE,
    },

    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,

            bold,

            font: "Tahoma",

            size: 18,
          }),
        ],
      }),
    ],
  });
}

function createHeaderRow(): TableRow {
  return new TableRow({
    tableHeader: true,

    children: [
      createCell("Sl. No", true, 5),

      createCell("Case No", true, 15),

      createCell("Case Name", true, 35),

      createCell("Stage", true, 10),

      createCell("Bench", true, 15),

      createCell("Court", true, 10),

      createCell("Item", true, 10),
    ],
  });
}

function createDataRows(data: Response): TableRow[] {
  return data.causelist.map(
    (el, i) =>
      new TableRow({
        children: [
          createCell(String(i + 1), false, 5),

          createCell(el.caseNo || "", false, 15),

          createCell(el.parties || "", false, 35),

          createCell(el.list || "", false, 10),

          createCell(el.benchName || "", false, 15),

          createCell(el.courtHall || "", false, 10),

          createCell(`Item ${el.itemNo}\n ${el.items || ""}`, false, 10),
        ],
      }),
  );
}

export async function createWordDocument(data: Response): Promise<Buffer> {
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

                font: "Tahoma",

                size: 24,
              }),
            ],
          }),

          new Paragraph({
            spacing: {
              after: 200,
            },
          }),

          table,
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
