import { nodesModule } from "./nodeModule.js";

const { advocateSuggestionContainer, advocateSelectionContainer } = nodesModule;

export const selectedAdvocates = new Map();

export const advocateDetail = {
  selectedAdvocates: selectedAdvocates,
  advocateCache: new Map(),
  searchController: null,

  search: async function (advocateName) {
    if (this.searchController) this.searchController.abort();
    this.searchController = new AbortController();
    try {
      const params = new URLSearchParams({ name: advocateName });

      const res = await fetch(`/api/advocates?${params}`, {
        signal: this.searchController.signal,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      this.displaySuggestion(data);
    } catch (err) {
      this.clearSuggestion();
      const newDev = document.createElement("div");
      newDev.className = " px-6 py-3 text-sm cursor-pointer hover:bg-[#f4ecd8]";
      newDev.textContent = err.toString().split(":")[1];
      advocateSuggestionContainer.appendChild(newDev);
    }
  },

  displaySuggestion: function (data) {
    this.clearSuggestion();

    data.results.forEach((element) => {
      const newDev = document.createElement("div");
      newDev.className = " px-6 py-3 text-sm cursor-pointer hover:bg-[#f4ecd8]";
      newDev.textContent = element.label;
      newDev.dataset.keyval = element.keyval;
      this.advocateCache.set(element.keyval, element);

      advocateSuggestionContainer.appendChild(newDev);
    });
  },

  clearSuggestion: function () {
    advocateSuggestionContainer.innerHTML = "";
    this.advocateCache.clear();
    return;
  },

  renderSelection: function () {
    advocateSelectionContainer.innerHTML = "";
    this.selectedAdvocates.forEach((element) => {
      const newPill = document.createElement("div");
      newPill.className =
        "flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-[#f4ecd8] border border-[#c9b79c] rounded-full text-xs sm:text-sm text-[#5a4a33] shadow-sm animate-fadeIn";

      const newSpan = document.createElement("span");
      newSpan.className = "font-medium";
      newSpan.textContent = element.label;

      const closeBtnCreate = document.createElement("button");
      closeBtnCreate.className =
        "remove-pill-btn hover:text-red-700 font-bold ml-1 cursor-pointer transition-colors";
      closeBtnCreate.textContent = "×";
      closeBtnCreate.dataset.keyval = element.keyval;

      newPill.appendChild(newSpan);
      newPill.appendChild(closeBtnCreate);
      advocateSelectionContainer.appendChild(newPill);

      this.clearSuggestion();
      nodesModule.searchData.value = "";
    });
  },

  pillRemove: function (e) {
    if (!e.target.classList.contains("remove-pill-btn")) return;
    const selectedRemoved = e.target.dataset.keyval;
    this.selectedAdvocates.delete(selectedRemoved);
    this.renderSelection();
  },
};
