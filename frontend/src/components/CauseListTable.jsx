export default function CauseListTable({ causelist }) {
  return (
    <div id="causelist-table" className="hidden md:block bg-[#fffdf6] border border-[#d8cdb5] rounded-xl overflow-x-auto">
      <table className="w-full table-fixed text-center text-sm">
        <colgroup>
          <col className="w-8" />
          <col className="w-32" />
          <col className="w-48" />
          <col className="w-24" />
          <col className="w-40" />
          <col className="w-20" />
          <col className="w-48" />
        </colgroup>
        <thead className="bg-[#f4ecd8] text-[#5a4a33] text-xs font-semibold">
          <tr>
            <th className="px-4 py-3">Sl. No</th>
            <th className="px-4 py-3">Case No</th>
            <th className="px-4 py-3">Case Name</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3">Bench</th>
            <th className="px-4 py-3">Court</th>
            <th className="px-4 py-3">Item</th>
          </tr>
        </thead>
        <tbody id="tablebody">
          {causelist.map((el, i) => (
            <tr key={i} className="border-b border-[#e5dcc8]">
              <td className="px-4 py-3">{i + 1}</td>
              <td className="px-4 py-3 whitespace-nowrap">{el.caseNo}</td>
              <td className="px-4 py-3">{el.parties}</td>
              <td className="px-4 py-3">{el.list}</td>
              <td className="px-4 py-3">{el.benchName}</td>
              <td className="px-4 py-3">{el.courtHall}</td>
              <td className="px-4 py-3 wrap-break-word">
                item {el.itemNo}<br />
                <span>{el.items || ''}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
