import { useState } from 'react'
import CauseListTable from './CauseListTable'
import CauseListCards from './CauseListCards'
import { useCurrentItem } from '../hooks/useCurrentItem'

async function triggerDownload(url, fallbackName) {
  const res = await fetch(url)
  if (!res.ok) {
    let message = 'Download failed'
    try { const d = await res.json(); message = d.message || message }
    catch { message = (await res.text()) || message }
    throw new Error(message)
  }
  const blob = await res.blob()
  const disposition = res.headers.get('Content-Disposition')
  const fileName = disposition?.split('filename=')[1]?.replace(/"/g, '') || fallbackName
  const url2 = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url2; a.download = fileName; a.click()
  window.URL.revokeObjectURL(url2)
}

export default function CauseListSection({ causelist, downloadId, onError, date }) {
  const [bannerVisible, setBannerVisible] = useState(true)
  const { currentItems, calledItems } = useCurrentItem(date)

  const handleDownload = async (type) => {
    try {
      await triggerDownload(
        `/${type}/${encodeURIComponent(downloadId)}`,
        type === 'download/pdf' ? 'causelist.pdf' : 'causelist.docx'
      )
    } catch (err) {
      onError({ message: err.message, messageType: 'error', title: '' })
    }
  }

  return (
    <section id="cause-list-section" className="max-w-4xl mx-auto transition-all duration-500 ease-in-out">
      {bannerVisible && (
        <div id="stage-warning-banner" className="mx-4 md:mx-0 mb-4 flex items-start justify-between rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="pr-4">
            ⚠️ "Stage information is currently unavailable due to changes in the High Court data source. Users are advised to verify Admission/Hearing status and other stage-related details from the official daily cause list PDF.".
          </span>
          <button
            id="close-banner-btn"
            className="cursor-pointer text-xl leading-none hover:text-amber-950"
            type="button"
            aria-label="Close banner"
            onClick={() => setBannerVisible(false)}
          >×</button>
        </div>
      )}

      <h2 className="mb-4 text-center text-lg font-semibold text-[#5a4a33]">Cause List</h2>

      <CauseListTable causelist={causelist} />
      <CauseListCards causelist={causelist} currentItems={currentItems} calledItems={calledItems} />

      <div className="flex items-center justify-center gap-3 p-6">
        <button
          id="pdf-download"
          type="button"
          onClick={() => handleDownload('download/pdf')}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white shadow-md transition hover:bg-blue-700 active:scale-95"
        >Download PDF</button>
        <button
          id="word-download"
          type="button"
          onClick={() => handleDownload('download/word')}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-green-700 active:scale-95"
        >Download Word</button>
      </div>
    </section>
  )
}
