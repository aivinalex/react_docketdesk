function sortByCalling(causelist, currentItems) {
  return [...causelist].sort((a, b) => {
    const curA = Number(currentItems?.[a.courtHall] ?? 0)
    const curB = Number(currentItems?.[b.courtHall] ?? 0)
    const aDiff = Number(a.itemNo) - curA
    const bDiff = Number(b.itemNo) - curB
    const aIsPast = aDiff < 0
    const bIsPast = bDiff < 0
    const aIsCurrent = aDiff === 0
    const bIsCurrent = bDiff === 0
    const aIsSoon = aDiff > 0 && aDiff <= 4
    const bIsSoon = bDiff > 0 && bDiff <= 4

    // past → bottom
    if (aIsPast && !bIsPast) return 1
    if (bIsPast && !aIsPast) return -1

    // current → top
    if (aIsCurrent && !bIsCurrent) return -1
    if (bIsCurrent && !aIsCurrent) return 1

    // soon (1-4) → after current, before far
    if (aIsSoon && !bIsSoon && !bIsCurrent) return -1
    if (bIsSoon && !aIsSoon && !aIsCurrent) return 1

    // within same priority group: sort by court hall then item no
    if (a.courtHall !== b.courtHall) return a.courtHall.localeCompare(b.courtHall)
    return Number(a.itemNo) - Number(b.itemNo)
  })
}

export default function CauseListCards({ causelist, currentItems, calledItems }) {
  const sorted = sortByCalling(causelist, currentItems)

  return (
    <div id="cause-list-cards" className="grid gap-4 px-2 md:hidden justify-items-center">
      {sorted.map((el, i) => {
        const currentNo = currentItems?.[el.courtHall]
        const hasCurrentNo = currentNo && currentNo !== '----' && currentNo !== ''
        const gap = hasCurrentNo ? Number(el.itemNo) - Number(currentNo) : null
        const isCurrent = gap === 0
        const isPast = gap !== null && gap < 0
        const isSoon = gap !== null && gap > 0 && gap <= 4

        const cardCls = isCurrent
          ? 'bg-green-50 border-green-400 ring-1 ring-green-300'
          : isPast
          ? 'bg-gray-50 border-gray-200 opacity-60'
          : isSoon
          ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-100'
          : 'bg-[#fffdf6] border-[#d8cdb5]'

        const headerCls = isCurrent
          ? 'bg-green-100 border-green-200'
          : isPast
          ? 'bg-gray-100 border-gray-200'
          : isSoon
          ? 'bg-orange-100 border-orange-200'
          : 'bg-[#f4ecd8] border-[#eee7d5]'

        const caseNoCls = isCurrent ? 'text-green-700'
          : isPast ? 'text-gray-400'
          : isSoon ? 'text-orange-700'
          : 'text-[#5a4a33]'

        const textCls = isCurrent ? 'text-green-800'
          : isPast ? 'text-gray-400'
          : isSoon ? 'text-orange-800'
          : 'text-[#5a4a33]'

        const partiesCls = isCurrent ? 'text-green-700'
          : isPast ? 'text-gray-400'
          : isSoon ? 'text-orange-700'
          : 'text-[#8b6f47]'

        const itemBadgeBg = isCurrent ? 'bg-green-100 border-green-300'
          : isPast ? 'bg-gray-100 border-gray-300'
          : isSoon ? 'bg-orange-100 border-orange-300'
          : 'bg-[#f4ecd8] border-[#d8cdb5]'

        const itemLabelCls = isCurrent ? 'text-green-600'
          : isPast ? 'text-gray-400'
          : isSoon ? 'text-orange-600'
          : 'text-[#8b6f47]'

        const itemNumCls = isCurrent ? 'text-green-700'
          : isPast ? 'text-gray-400'
          : isSoon ? 'text-orange-700'
          : 'text-[#5a4a33]'

        return (
          <div key={i} className={`w-90 border rounded-xl shadow-sm overflow-hidden ${cardCls}`}>

            <div className={`flex items-center justify-between px-3 py-2 border-b ${headerCls}`}>
              <div className="flex flex-col gap-1">
                <span className={`text-[15px] font-black leading-none ${caseNoCls}`}>{el.caseNo}</span>
                {isCurrent && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-200 rounded-full px-2 py-0.5 self-start">🟢 Calling Now</span>
                )}
                {isPast && (
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-200 rounded-full px-2 py-0.5 self-start">✓ Called</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {hasCurrentNo && (
                  <div className="flex flex-col items-center rounded-lg px-2 py-0.5 border bg-amber-50 border-amber-300">
                    <span className="text-[8px] uppercase font-bold leading-none tracking-wide text-amber-600">Now</span>
                    <span className="text-[15px] font-black leading-tight text-amber-700">{currentNo}</span>
                  </div>
                )}

                <div className={`flex flex-col items-center rounded-lg px-2 py-0.5 border ${itemBadgeBg}`}>
                  <span className={`text-[8px] uppercase font-bold leading-none tracking-wide ${itemLabelCls}`}>Item No</span>
                  <span className={`text-[15px] font-black leading-tight ${itemNumCls}`}>{el.itemNo}</span>
                </div>
              </div>
            </div>

            <div className="px-3 py-2">
              <span className={`text-[12px] leading-tight wrap-break-word block mb-3 ${partiesCls}`}>{el.parties}</span>

              <div className="grid grid-cols-[70px_1fr] gap-y-1.5 text-[13px] items-baseline">
                <span className="text-gray-400 font-medium uppercase text-[10px]">Court</span>
                <span className={textCls}>{el.courtHall}</span>

                <span className="text-gray-400 font-medium uppercase text-[10px]">Bench</span>
                <span className={`${textCls} leading-snug`}>{el.benchName}</span>

                <span className="text-gray-400 font-medium uppercase text-[10px]">List</span>
                <span className={textCls}>{el.list}</span>

                <span className="text-gray-400 font-medium uppercase text-[10px]">Sub Items</span>
                <span className={`italic text-[11px] leading-tight ${isPast ? 'text-gray-400' : 'text-gray-500'}`}>{el.items}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
