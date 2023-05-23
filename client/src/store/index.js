import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      databaseList: [],
      accessDeleteValue: false,
      accessSaving: false,
      disableSaving: false,
      loading: false,
      countElements: 0,
      errorFixed: [],
      builderData: [],
      globalError: false,
      queryName: null,
      operatorsList: [
        {
          id: 1,
          title: 'from',
        },
        {
          id: 2,
          title: 'match',
        },
        {
          id: 3,
          title: 'sample',
        },
        {
          id: 4,
          title: 'limit',
        },
        {
          id: 5,
          title: 'project',
        },
        {
          id: 6,
          title: 'sort',
        },
        {
          id: 7,
          title: 'subtract',
        },
        {
          id: 8,
          title: 'union',
        },
        {
          id: 9,
          title: 'intersect',
        },
      ],
    }
  },
  getters: {
    getDatabaseList(state) {
      return state.databaseList
    },
    getQueryName(state) {
      return state.queryName
    },
    getLoading(state) {
      return state.loading
    },
    getGlobalError(state) {
      return state.globalError
    },
    getErrorFixed(state) {
      return state.errorFixed
    },
    getBuilderData(state) {
      return state.builderData
    },
    getCountElements(state) {
      return state.countElements
    },
    getOperatorsList(state) {
      return state.operatorsList
    },
    getAccessDeleteValue(state) {
      return state.accessDeleteValue
    },
    getAccessSaving(state) {
      return state.accessSaving
    },
    getDisableSaving(state) {
      return state.disableSaving
    },
  },
  mutations: {
    addDatabaseToList(state, item) {
      state.databaseList.push(item)
    },
    changeAccessDeleteValue(state) {
      state.accessDeleteValue = !state.accessDeleteValue
    },
    changeQueryName(state, value) {
      state.queryName = value
    },
    changeGlobalError(state, value) {
      state.globalError = value
    },
    changeErrorFixed(state, obj) {
      console.log(obj)
      const findItem = state.errorFixed.find(item => {
        return item.id === obj.id
      })
      if (findItem) {
        findItem.error = obj.value
      } else {
        state.errorFixed.push({ id: obj.id, error: obj.value })
      }
      // if (
      //   state.errorFixed.reduce((acc, item) => {
      //     if (item.error) {
      //       acc += 1
      //     }
      //     return acc
      //   }, 0) === state.countElements
      // ) {
      //   state.accessSaving = true
      // } else {
      //   state.accessSaving = false
      // }
    },
    changeLoading(state) {
      state.loading = !state.loading
    },
    changeAccessSaving(state) {
      state.accessSaving = !state.accessSaving
    },
    changeDisableSaving(state) {
      state.disableSaving = !state.disableSaving
    },
    setBuilderData(state, newData) {
      state.countElements = 0
      for (let index = 0; index < newData.length; index++) {
        newData[index].queries.forEach(item => {
          if (item) {
            state.countElements++
          }
        })
      }
      localStorage['builderData'] = JSON.stringify(newData)
      state.builderData = newData
    },
  },
  actions: {},
  modules: {},
})
