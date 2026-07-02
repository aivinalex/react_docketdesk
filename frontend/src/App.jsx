import { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import CauseListSection from "./components/CauseListSection";
import ErrorModal from "./components/ErrorModal";
import Toast from "./components/Toast";
import PinHintModal from "./components/PinHintModal";
import { useCauseList } from "./hooks/useCauseList";
import { usePinnedAdvocates } from "./hooks/usePinnedAdvocates";

export default function App() {
  const {
    causeList,
    downloadId,
    loading,
    fetchCauseList,
    clearCauseList: resetCauseList,
    removeAdvocateCases,
  } = useCauseList();

  const { pinned, pin, unpin } = usePinnedAdvocates();

  const [modal, setModal] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [causeListVisible, setCauseListVisible] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPinHint, setShowPinHint] = useState(false);
  const [searchDate, setSearchDate] = useState(null);

  // Keep loader visible until we know whether to auto-load or not
  const [isAutoLoading, setIsAutoLoading] = useState(true);

  // One-time pin hint
  useEffect(() => {
    if (pinned.size === 0 && !localStorage.getItem("pinHintShown")) {
      setShowPinHint(true);
      localStorage.setItem("pinHintShown", "1");
    }
  }, [pinned]);

  // Auto-load today's cause list
  useEffect(() => {
    const run = async () => {
      // Wait until pinned advocates are hydrated
      if (pinned.size === 0) {
        setIsAutoLoading(false);
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      try {
        setSearchActive(false);
        setCauseListVisible(false);

        await fetchCauseList(today, pinned);

        setSearchDate(today);
        setSearchActive(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAutoLoading(false);
      }
    };

    run();
  }, [pinned]);

  useEffect(() => {
    if (causeList) {
      setCauseListVisible(true);
    }
  }, [causeList]);

  const clearCauseList = (advoCode, advocateName) => {
    if (advoCode) {
      removeAdvocateCases(advoCode);

      if (causeList) {
        setToast(`Cause list updated — ${advocateName}'s cases removed`);
      }
    } else {
      setSearchActive(false);
      setCauseListVisible(false);

      setTimeout(() => {
        resetCauseList();
      }, 400);
    }
  };

  const handleSearch = async (date, selectedAdvocates) => {
    setSearchActive(false);
    setCauseListVisible(false);

    try {
      await fetchCauseList(date, selectedAdvocates);

      setSearchDate(date);
      setSearchActive(true);
    } catch (err) {
      setModal({
        message: err.message,
        messageType: "warning",
        title: "",
      });
    }
  };

  return (
    <div
      id="searchbody"
      className={`min-h-screen flex flex-col bg-linear-to-br from-[#fdfaf2] via-[#f9f5e9] to-[#fdfaf2] text-[#3b2f2a] ${
        searchActive ? "search-active" : ""
      }`}
    >
      <header className="bg-[#3b2f2a] py-6 text-center relative shadow-md">
        <img
          src="/images/logo.png"
          alt="DocketDesk"
          className="mx-auto h-12 md:h-14 w-auto"
        />

        <p className="text-[#e8dccf] text-sm md:text-base mt-2">
          Kerala High Court Cause List Generator
        </p>
      </header>

      <main className="flex-1 space-y-10 py-10 min-h-[60vh] transition-all duration-500 ease-in-out">
        <SearchForm
          onSearch={handleSearch}
          onAdvocateRemoved={clearCauseList}
          onAdvocateAdded={() => {
            if (causeList) {
              setSearchActive(false);
              setCauseListVisible(false);

              setTimeout(() => {
                resetCauseList();
              }, 400);

              setToast("Advocate added — hit Search to update the cause list");
            }
          }}
          pinned={pinned}
          onPin={pin}
          onUnpin={unpin}
        />

        {(loading || isAutoLoading) && (
          <div className="flex justify-center py-10">
            <div className="flex flex-col items-center gap-3 p-6 bg-[#fffdf6] border-2 border-[#d8cdb5] rounded-2xl shadow-md">
              <div className="w-10 h-10 border-[3px] border-[#d8cdb5] border-t-[#8b6f47] rounded-full animate-spin"></div>

              <span className="text-sm text-[#8b6f47] font-medium">
                Loading your cause list...
              </span>
            </div>
          </div>
        )}

        {!loading && causeList && (
          <div
            className={`transition-opacity duration-400 ${
              causeListVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <CauseListSection
              causelist={causeList}
              downloadId={downloadId}
              onError={setModal}
              date={searchDate}
            />
          </div>
        )}
      </main>

      <footer className="bg-[#3b2f2a] text-[#e8dccf] text-center text-xs md:text-sm py-4 mt-10 border-t border-[#5a4a33]">
        <p>Maintained by Advocate Aivin Alex Philip.</p>
        <p className="mt-1">
          © Aalmaav Ventures Private Limited. All rights reserved.
        </p>
        <p className="mt-1">
          Information is sourced from the official website of the High Court of
          Kerala, which holds copyright over the data.
        </p>
        <p className="mt-1">
          Users are advised to verify details with the official daily cause list
          PDF.
        </p>
      </footer>

      {modal && <ErrorModal {...modal} onClose={() => setModal(null)} />}

      {showPinHint && <PinHintModal onClose={() => setShowPinHint(false)} />}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
