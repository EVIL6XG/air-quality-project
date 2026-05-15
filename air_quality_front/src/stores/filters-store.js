import { create } from "zustand"

export const useFiltersStore = create((set) => ({
  districtId: "1",
  selectedDistrictId: "1",
  range: {
    from: "",
    to: "",
  },
  dateFrom: "",
  dateTo: "",
  setDistrictId: (districtId) => set({ districtId }),
  setSelectedDistrictId: (districtId) =>
    set({ districtId, selectedDistrictId: districtId }),
  setRange: (from, to) => set({ range: { from, to } }),
  setDateRange: (dateFrom, dateTo) =>
    set({ dateFrom, dateTo, range: { from: dateFrom, to: dateTo } }),
}))

export const useFilterStore = useFiltersStore
