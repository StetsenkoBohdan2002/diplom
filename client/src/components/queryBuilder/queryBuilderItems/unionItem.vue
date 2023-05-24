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
        :items="databaseList"
        v-model="collection"
      ></v-autocomplete>
      <v-btn class="clear-btn" icon="mdi-close" @click="clearUnionCollection">
      </v-btn>
      <v-alert
        v-if="!collection"
        border
        class="error-notify"
        type="error"
        icon="mdi-alert-circle"
        title="Collection required!"
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
export default {
  data() {
    return {
      operation: null,
      collection: null,
    }
  },
  created() {
    if (this.query.collection) {
      this.collection = this.query.collection
    } else {
      this.$store.commit('changeErrorFixed', {
        id: this.query.queryId,
        value: false,
      })
    }
  },
  watch: {
    collection: function (newValue) {
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
      this.changeUnionCollection(newValue)
    },
  },
  methods: {
    deleteQuery() {
      this.$emit('deleteQuery', this.query.queryId, this.item.id)
    },
    /**
     * Функція, що змінює поле collection в об'єкті запиту union для об'єкту блока
     * @param {string} newValue - Нове значення поля collection
     */
    changeUnionCollection(newValue) {
      this.$emit(
        'changeUnionCollection',
        this.item.id,
        this.query.queryId,
        newValue
      )
    },
    clearUnionCollection() {
      this.collection = null
      this.$emit(
        'changeUnionCollection',
        this.item.id,
        this.query.queryId,
        null
      )
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
