<template>
  <div class="query-builder">
    <Transition name="alert">
      <v-alert
        class="notify"
        v-if="notify"
        :type="alertType"
        :title="alertTitle"
        :text="alertDesc"
      ></v-alert>
    </Transition>
    <div class="query-builder-wrapper">
      <query-builder-section
        v-for="item in builderData"
        :key="item.id"
        :section="item"
        :databaseList="databaseList"
        :operatorsList="operatorsList"
        @deleteQuery="deleteQuery"
        @changeQueryDatabase="changeQueryDatabase"
        @addNewChildQuery="addNewChildQuery"
        @changeMatchLabel="changeMatchLabel"
        @changeSortLabel="changeSortLabel"
        @changeMatchType="changeMatchType"
        @changeMatchValues="changeMatchValues"
        @clearMatchQuery="clearMatchQuery"
        @changeSampleSize="changeSampleSize"
        @changeLimitSize="changeLimitSize"
        @changeProjectLables="changeProjectLables"
        @changeSortOrder="changeSortOrder"
        @changeUnionCollection="changeUnionCollection"
        :accessDeleteValue="accessDeleteValue"
        :accessSavingValue="accessSavingValue"
        @changeNewField="changeNewField"
        @changeFirstValue="changeFirstValue"
        @changeSecondValue="changeSecondValue"
        @clearSubtractQuery="clearSubtractQuery"
        @changeIntersectCollection="changeIntersectCollection"
        @changeIntersectComparisonField="changeIntersectComparisonField"
        @clearIntersectCollection="clearIntersectCollection"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import QueryBuilderSection from './queryBuilderSection.vue'
import requestRatioObject from '@/requestRatio.js'
import { createNewQuery } from '../../Api.js'
export default {
  data() {
    return {
      notify: false,
      alertType: null,
      alertTitle: null,
      alertDesc: null,
      builderData: this.$store.getters.getBuilderData,
      databaseList: this.$store.getters.getDatabaseList,
      operatorsList: this.$store.getters.getOperatorsList,
    }
  },
  watch: {
    accessSaving(newVal) {
      const getCountElements = this.$store.getters.getCountElements
      const getErrorFixed = this.$store.getters.getErrorFixed.reduce(
        (acc, item) => {
          if (item.error) {
            acc += 1
          }
          return acc
        },
        0
      )
      console.log(getCountElements)
      console.log(getErrorFixed)
      if (getCountElements !== getErrorFixed) {
        this.$store.commit('changeDisableSaving')
        this.setNotify(true, 'ERROR', 'Errors in your query!', 'error')
        return
      }
      if (newVal) {
        this.saveQuery(this.builderData)
        this.$store.commit('changeAccessSaving')
      }
    },
  },
  methods: {
    getParentQuery(parentId) {
      return this.builderData.find(item => {
        if (item.id === parentId) {
          return item
        }
      })
    },
    getQueryFromParent(parent, queryId) {
      return parent.queries.find(item => {
        if (item.queryId === queryId) {
          return item
        }
      })
    },
    deleteQuery(queryId, parentId) {
      const findItemById = this.getParentQuery(parentId)
      console.log(findItemById)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      if (findQuery.type === 'from') {
        if (this.builderData.length === 1) {
          this.setNotify(
            true,
            'ERROR',
            'You cannot delete a single query!',
            'error',
            false
          )
        } else {
          this.builderData = this.builderData.filter(item => {
            if (item.id !== parentId) {
              return item
            }
          })
        }
        this.$store.commit('setBuilderData', this.builderData)
        return
      }
      findItemById.queries = findItemById.queries.filter(item => {
        if (item.queryId !== queryId) {
          return item
        }
      })
      this.$store.commit('changeErrorFixed', {
        id: queryId,
        value: false,
      })
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeMatchLabel(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.label = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeSortLabel(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.label = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeNewField(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.newField = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeFirstValue(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.firstValue = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeSecondValue(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.secondValue = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    clearMatchQuery(parentId, queryId) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.label = ''
      findQuery.operation = null
      findQuery.values = null
      this.$store.commit('setBuilderData', this.builderData)
    },
    clearIntersectCollection(parentId, queryId) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.collection = null
      findQuery.comparisonField = null
      this.$store.commit('setBuilderData', this.builderData)
    },
    clearSubtractQuery(parentId, queryId) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.newField = ''
      findQuery.firstValue = null
      findQuery.secondValue = null
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeMatchValues(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.values = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeSampleSize(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.size = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeSortOrder(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.sort = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeUnionCollection(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.collection = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeIntersectCollection(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.collection = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeIntersectComparisonField(parentId, queryId, newValue, type) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      if (type === 'main') {
        findQuery.comparisonFieldMain = newValue
      } else {
        findQuery.comparisonFieldAdditional = newValue
      }
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeProjectLables(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.labels = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeLimitSize(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.size = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    changeMatchType(parentId, queryId, newValue) {
      const findItemById = this.getParentQuery(parentId)
      const findQuery = this.getQueryFromParent(findItemById, queryId)
      findQuery.operation = newValue
      this.$store.commit('setBuilderData', this.builderData)
    },
    addNewChildQuery(operation, newQuery = false, parentId = null) {
      if (newQuery) {
        const query = this.createNewQuery()
        this.builderData.push(query)
        this.$store.commit('setBuilderData', this.builderData)
        return
      }
      if (parentId) {
        const findItemById = this.builderData.find(item => {
          if (item.id === parentId) {
            return item
          }
        })
        let findOperationTitle = this.operatorsList.find(item => {
          return item.id === operation
        }).title
        let query =
          this[requestRatioObject[findOperationTitle]](findOperationTitle)
        findItemById.queries.push(query)
        this.$store.commit('setBuilderData', this.builderData)
      }
    },
    generateUniqueId() {
      return parseInt(Date.now() + Math.random() * Math.pow(10, 10))
    },
    createNewQuery() {
      let newId = this.builderData.length > 0 ? this.builderData.length + 1 : 1
      let queryId = this.generateUniqueId()
      return {
        id: newId,
        queries: [
          {
            queryId,
            type: 'from',
            value: '',
            delete: false,
          },
        ],
      }
    },
    createNewMatch(operation) {
      let queryId = this.generateUniqueId()
      return {
        queryId,
        type: operation,
        label: '',
        operation: null,
        values: null,
        delete: false,
      }
    },
    createNewSubtract(operation) {
      let queryId = this.generateUniqueId()
      return {
        queryId,
        type: operation,
        newField: '',
        firstValue: null,
        secondValue: null,
        delete: false,
      }
    },
    createNewSort(operation) {
      let queryId = this.generateUniqueId()
      return {
        queryId,
        type: operation,
        sort: null,
        label: null,
        delete: false,
      }
    },
    createNewUnion(operation) {
      let queryId = this.generateUniqueId()
      return {
        queryId,
        type: operation,
        collection: null,
        delete: false,
      }
    },
    createNewIntersect(operation) {
      let queryId = this.generateUniqueId()
      return {
        queryId,
        type: operation,
        collection: null,
        comparisonFieldMain: null,
        comparisonFieldAdditional: null,
        delete: false,
      }
    },
    createNewProject(operation) {
      let queryId = this.generateUniqueId()
      return {
        queryId,
        type: operation,
        labels: null,
        delete: false,
      }
    },
    createNewSample(operation) {
      let queryId = this.generateUniqueId()
      return {
        queryId,
        type: operation,
        size: null,
        delete: false,
      }
    },
    createNewLimit(operation) {
      let queryId = this.generateUniqueId()
      return {
        queryId,
        type: operation,
        size: null,
        delete: false,
      }
    },
    changeQueryDatabase(id, newValue) {
      let newArray = this.builderData.map(item => {
        if (item.id === id) {
          item.queries[0].value = newValue
        }
        return item
      })
      this.builderData = newArray
      this.$store.commit('setBuilderData', this.builderData)
    },
    accessDelete(value) {
      for (let index = 0; index < this.builderData.length; index++) {
        for (let j = 0; j < this.builderData[index].queries.length; j++) {
          this.builderData[index].queries[j].delete = value
        }
      }
    },
    saveQuery(data) {
      this.$store.commit('changeDisableSaving')
      this.$store.commit('changeLoading')
      createNewQuery({ name: this.$store.getters.getQueryName, data }).then(
        response => {
          if (response.status === 200) {
            this.setNotify(
              true,
              response.statusText,
              response.data.message,
              'success'
            )
          }
          this.$store.commit('changeLoading')
          this.$store.commit('changeQueryName', null)
        }
      )
    },
    setNotify(notify, alertTitle, alertDesc, alertType, saving = true) {
      this.notify = notify
      this.alertTitle = alertTitle
      this.alertDesc = alertDesc
      this.alertType = alertType
      setTimeout(() => {
        this.notify = false
        if (saving) {
          this.$store.commit('changeDisableSaving')
        }
      }, 3000)
    },
  },
  created() {
    if (
      localStorage['builderData'] &&
      JSON.parse(localStorage['builderData']).length > 0
    ) {
      this.builderData = JSON.parse(localStorage['builderData'])
      return
    }
    let query = this.createNewQuery()
    this.builderData.push(query)
    this.$store.commit('setBuilderData', this.builderData)
  },
  computed: {
    accessDeleteValue() {
      this.accessDelete(this.$store.getters.getAccessDeleteValue)
      return this.$store.getters.getAccessDeleteValue
    },
    ...mapState({
      accessSaving: state => state.accessSaving,
    }),
  },
  components: {
    QueryBuilderSection,
  },
}
</script>
<style lang="scss">
.query-builder {
  overflow: auto;
  &-wrapper {
    padding: 20px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    width: 1450px;
    height: calc(100vh - 96px);
  }
}
.notify {
  position: absolute;
  z-index: 999;
  top: 200px;
  right: 0;
}
.alert-enter-active,
.alert-leave-active {
  transition: all 0.5s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.alert-enter-to,
.alert-leave-from {
  opacity: 1;
  transform: translateX(0%);
}
</style>
