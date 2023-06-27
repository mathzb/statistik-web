import {create} from 'zustand'

export const useBookStore = create( (set, get) => ({
    companyId: '',
    updateCompanyId: (newCompanyId) => set({companyId: newCompanyId}),
    dateFrom: '',
    updateDateFrom: (newDateFrom) => set({dateFrom: newDateFrom}),
    dateTo: '',
    updateDateTo: (newDateTo) => set({dateTo: newDateTo}),
    dataStat: [],
    updateDataStat: (newDataStat) => set({dataStat: newDataStat}),
    isLoading: false,
    updateIsLoading: (newIsLoading) => set({isLoading: newIsLoading}),
    isError: false,
    updateIsError: (newIsError) => set({isError: newIsError}),
    errMsg: '',
    updateErrMsg: (newErrMsg) => set({errMsg: newErrMsg}),
    queueType: '',
    updateQueueType: (newQueueType) => set({queueType: newQueueType}),
    periodData: [],
    updatePeriodData: (newPeriodData) => set({periodData: newPeriodData}),
    agentData: [],
    updateAgentData: (newAgentData) => set({agentData: newAgentData}),
    queueNumber: "",
    updateQueueNumber: (newQueueNumber) => set({queueNumber: newQueueNumber}),
    selectedEndpoints: [],
    updateSelectedEndpoints: (newSelectedEndpoint) => set({selectedEndpoints: newSelectedEndpoint})
}));