<template lang="">
  <div class="query-item match">
    <div class="query-item-main">
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn class="dropdown-btn" v-bind="props"> + </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click=";(operation = item.id), addNewChildQuery(item.id)"
            class="dropdown-item"
            v-for="(item, index) in operatorsList"
            :key="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="query-type">
        {{ query.type }}
      </div>
      <v-autocomplete
        label="Collection"
        variant="solo"
        density="compact"
        class="query-value"
        :items="chooseDatabaseList"
        v-model="collection"
      ></v-autocomplete>
      <v-autocomplete
        label="Field main database"
        :disabled="!collection"
        variant="solo"
        density="compact"
        class="query-value"
        :items="labelsListMain"
        v-model="comparisonFieldMain"
      ></v-autocomplete>
      <v-autocomplete
        :disabled="!comparisonFieldMain"
        label="Field choosen database"
        variant="solo"
        density="compact"
        class="query-value"
        :items="labelsListAdd"
        v-model="comparisonFieldAdditional"
      ></v-autocomplete>
      <v-btn
        class="clear-btn"
        icon="mdi-close"
        @click="clearIntersectCollection"
      >
      </v-btn>
      <v-alert
        v-if="!comparisonFieldAdditional"
        border
        class="error-notify"
        type="error"
        icon="mdi-alert-circle"
        :title="errorTitle"
        density="compact"
        color="#f4154d"
      ></v-alert>
    </div>
    <v-btn
      v-if="query.delete"
      class="delete-btn animate__fadeInRight animate__animated"
      icon="mdi-delete"
      @click="deleteQuery"
    >
    </v-btn>
  </div>
</template>
<script>
import { getLabelsList } from '@/Api'

export default {
  computed: {
    chooseDatabaseList() {
      return [...this.databaseList].filter(item => {
        return item !== this.item.queries[0].value
      })
    },
    databaseName() {
      return this.item.queries[0].value
    },
    errorTitle() {
      if (!this.collection) {
        return 'Collection required!'
      } else if (this.collection && !this.comparisonField) {
        return 'Comparison Field required'
      }
      return null
    },
  },
  created() {
    if (this.query.comparisonFieldMain) {
      this.comparisonFieldMain = this.query.comparisonFieldMain
    }
    if (this.query.comparisonFieldAdditional) {
      this.comparisonFieldAdditional = this.query.comparisonFieldAdditional
    }
    if (this.query.collection) {
      this.collection = this.query.collection
    }
    let parentCollectionName = this.item.queries[0].value
    getLabelsList(parentCollectionName).then(res => {
      if (res.status === 200) {
        this.labelsListMain = Object.keys(res.data.labelsObj)
        this.savedValuesObj = res.data.labelsObj
      }
    })
  },
  data() {
    return {
      operation: null,
      collection: null,
      comparisonFieldMain: null,
      comparisonFieldAdditional: null,
      labelsListMain: [],
      savedValuesObj: [],
      labelsListAdd: [],
      savedValuesAdd: [],
    }
  },
  watch: {
    databaseName: function (newValue) {
      getLabelsList(newValue).then(res => {
        if (res.status === 200) {
          this.labelsListMain = Object.keys(res.data.labelsObj)
          this.savedValuesObj = res.data.labelsObj
          this.comparisonFieldMain = null
          this.comparisonFieldAdditional = null
          if (newValue === this.collection) {
            this.collection = null
          }
        }
      })
    },
    collection: function (newValue) {
      getLabelsList(newValue).then(res => {
        if (res.status === 200) {
          this.labelsListAdd = Object.keys(res.data.labelsObj)
          this.savedValuesObjAdd = res.data.labelsObj
          if (!this.query.comparisonFieldAdditional) {
            this.comparisonFieldAdditional = null
          }
        }
      })
      this.changeIntersectCollection(newValue)
    },
    comparisonFieldMain: function (newValue) {
      this.changeIntersectComparisonField(newValue, 'main')
    },
    comparisonFieldAdditional: function (newValue) {
      if (newValue) {
        this.$store.commit('changeErrorFixed', {
          id: this.query.queryId,
          value: true,
        })
      } else {
        this.$store.commit('changeErrorFixed', {
          id: this.query.queryId,
          value: false,
        })
      }
      this.changeIntersectComparisonField(newValue, 'add')
    },
  },
  methods: {
    deleteQuery() {
      this.$emit('deleteQuery', this.query.queryId, this.item.id)
    },
    /**
     * Функція, що змінює поле collection в об'єкті запиту intersect для об'єкту блока
     * @param {string} newValue - Нове значення поля collection
     */
    changeIntersectCollection(newValue) {
      this.$emit(
        'changeIntersectCollection',
        this.item.id,
        this.query.queryId,
        newValue
      )
    },
    changeIntersectComparisonField(newValue, type) {
      this.$emit(
        'changeIntersectComparisonField',
        this.item.id,
        this.query.queryId,
        newValue,
        type
      )
    },
    clearIntersectCollection() {
      this.collection = null
      this.comparisonFieldAdditional = null
      this.сomparisonFieldMain = null
      this.$emit('clearIntersectCollection', this.item.id, this.query.queryId)
    },
    addNewChildQuery(operation) {
      if (!operation) {
        return
      }
      if (operation === 1) {
        this.$emit('addNewChildQuery', operation, true)
      } else {
        this.$emit('addNewChildQuery', operation, false, this.item.id)
      }
      this.operation = null
      // this.$refs.operationSelect.blur()
    },
  },
  props: {
    tab: {
      type: Number,
    },
    query: {
      type: Object,
    },
    item: {
      type: Object,
    },
    databaseList: {
      type: Array,
    },
    operatorsList: {
      type: Array,
    },
  },
}
</script>
<style lang="scss"></style>
