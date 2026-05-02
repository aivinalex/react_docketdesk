import { Response } from "../../types/appTypes.js";
export function createHtml(data: Response): string {
  const rows = rowCreate(data);
  const html = ` <html>
      <head>
        <style>
    body {
      font-family: Arial;
      margin: 20px;
      color: #000;             
      background: #fff;        
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    th, td {
      border: 1px solid #000;  
      padding: 6px;
      text-align: center;
      color: #000;
      background: #fff;         
    }

    thead {
      background: #fff;         
    }

    th {
      font-weight: bold;        
    }

    tr {
      page-break-inside: avoid;
    }
  </style>
      </head>
      <body>
        <h2 style="text-align:center;">Causelist</h2>

        <table>
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Case No</th>
              <th>Case Name</th>
              <th>Stage</th>
              <th>Bench</th>
              <th>Court</th>
              <th>Item</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>`;
  return html;
}

const rowCreate = function (data: Response): string {
  const rows = data.causelist
    .map((el, i) => {
      return `<tr>
      <td>${i + 1}</td>
      <td style="white-space: nowrap;">${el.caseNo}</td>
      <td>${el.parties}</td>
      <td>${el.list}</td>
      <td>${el.benchName}</td>
      <td>${el.courtHall}</td>
      <td>
        item ${el.itemNo}<br>
        <span>${el.items || ""}</span>
      </td>
    </tr>`;
    })
    .join("");
  return rows;
};
