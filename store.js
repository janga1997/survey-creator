import create from "zustand";

const useSurveyStore = create((set) => ({
  searchText: "",
  setSearchText: (e) => set(() => ({ searchText: e.target.value })),
}));

export default useSurveyStore;
