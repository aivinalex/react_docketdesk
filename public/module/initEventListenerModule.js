import { toggleErrorMessager, isLoading, buttonId } from "./helperModule.js";
import { advocateDetail } from "./advocateModule.js";
import { nodesModule } from "./nodeModule.js";
import {
  causeListSearch,
  createTableDesktop,
  createCardMobile,
} from "./causelistModule.js";
import { createMessage } from "./errorPromtModule.js";

export const initEventListeners = function () {
  const {
    searchButton,
    searchData,
    searchDate,
    nameError,
    dateError,
    advocateSuggestionContainer,
    advocateSelectionContainer,
    searchBody,
    causelistContainer,
    downloadPdf,
  } = nodesModule;

  [searchData, searchDate].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchButton.click();
      }
    });
  });

  searchData.addEventListener("focus", () => {
    toggleErrorMessager(searchData, nameError, false);
  });
  searchDate.addEventListener("focus", () => {
    toggleErrorMessager(searchDate, dateError, false);
  });

  searchData.addEventListener("input", () => {
    const searchValue = searchData.value?.trim().toLowerCase();
    if (!searchValue || searchValue.length < 4) {
      advocateDetail.clearSuggestion();
      advocateDetail.advocateSearchDebounce.cancel();
      return;
    }
    advocateDetail.advocateSearchDebounce(searchValue);
  });

  document.addEventListener("click", (e) => {
    const isSearchinput = searchData.contains(e.target);
    const isSelectioninput = advocateSuggestionContainer.contains(e.target);
    if (!isSearchinput && !isSelectioninput) advocateDetail.clearSuggestion();
  });

  advocateSuggestionContainer.addEventListener("click", (e) => {
    const itemClicked = e.target.closest("[data-keyval]");
    if (!itemClicked) return;
    const selected = itemClicked.dataset.keyval;
    const data = advocateDetail.advocateCache.get(selected);
    if (advocateDetail.selectedAdvocates.has(selected)) {
      return;
    }
    advocateDetail.selectedAdvocates.set(selected, data);
    advocateDetail.renderSelection();
  });

  advocateSelectionContainer.addEventListener("click", (e) => {
    advocateDetail.pillRemove(e);
  });

  searchButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const isDateEmpty = !searchDate.value;
    const isNameSelectedEmpty = advocateDetail.selectedAdvocates.size === 0;
    toggleErrorMessager(searchData, nameError, false);
    toggleErrorMessager(searchDate, dateError, false);
    if (isDateEmpty || isNameSelectedEmpty) {
      if (isDateEmpty) toggleErrorMessager(searchDate, dateError, true);
      if (isNameSelectedEmpty) toggleErrorMessager(searchData, nameError, true);
      return;
    }
    const date = searchDate.value;

    isLoading(true);
    causelistContainer.classList.add("hidden");

    try {
      const data = await causeListSearch(
        date,
        advocateDetail.selectedAdvocates,
      );

      const { response, id } = data;

      if (response.causelist?.length) {
        //
        createTableDesktop(response);
        createCardMobile(response);
        isLoading(false);
        buttonId(id);
        // add butoton id and linkfunction
        searchBody.classList.add("search-active");
      } else {
        throw new Error("No cases found in cause list");
      }
    } catch (err) {
      console.log(err);
      isLoading(false);
      causelistContainer.classList.add("hidden");

      createMessage({
        message: err.message,
        messageType: "warning",
        title:""
      });
    }
  });
  downloadPdf.addEventListener("click", async (e) => {
    const id = e.target.closest("[data-id]")?.dataset.id;

    try {
      const res = await fetch(`/download/pdf/${encodeURIComponent(id)}`);

      if (!res.ok) {
        let message = "Download failed";

        try {
          const data = await res.json();
          message = data.message || message;
        } catch {
          const text = await res.text();
          message = text || message;
        }

        throw new Error(message);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const fileName =
        disposition?.split("filename=")[1]?.replace(/"/g, "") ||
        "causelist.pdf";
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      createMessage({
        message: err.message,
        messageType: "error",
        title: "",
      });
    }
  });
};
