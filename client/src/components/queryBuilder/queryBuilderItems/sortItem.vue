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
        label="Label"
        variant="solo"
        density="compact"
        class="query-value"
        :items="labelsList"
        v-model="label"
      ></v-autocomplete>
      <v-autocomplete
        label="Order"
        variant="solo"
        density="compact"
        class="query-value"
        :items="['$asc', '$desc']"
        v-model="order"
      ></v-autocomplete>
      <v-btn class="clear-btn" icon="mdi-close" @click="clearSortOrder">
      </v-btn>
      <v-alert
        v-if="!order"
        border
        class="error-notify"
        type="error"
        icon="mdi-alert-circle"
        title="Order required"
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
/**
 * Компонент, що відповідає за створення операції агрегування $project та задання відповідних параметрів
 * @vue/component
 * @module sortItem
 * @requires getLabelsList - Функція, що відповідає за надсилання запиту на сервер, для отримання доступних полів з бази даних.
 */
export default {
  /**
   * @typedef {Object} ComponentProps
   * @property {Object} query - Об'єкт конкретного запиту, що зберігає в собі необхідну інформацію про збережений запит.
   * Відображається у випадку, якщо після повторного входу на сторінку є збереженні дані з попереднього разу.
   * @property {Object} item - Об'єкт блоку, що зберігає інформацію про перелік запитів.
   * @property {Array} databaseList - Список баз даних, які є доступними для вибору.
   * @property {Array} operatorsList - Список доступних операторів агрегації.
   */
  /**
   * Обчислювані властивості для компонента, які повертають значення на основі інших властивостей.
   * @typedef {Object} ComponentComputed
   * @property {string} databaseName - Обчислювана властивість, що буде динамічно повертати назву бази даних для поточного об'єкту блоку
   */
  computed: {
    databaseName() {
      return this.item.queries[0].value
    },
  },
  data() {
    return {
      /**
       * Стан, що відповідає за збереження типу операції, що буде створюватися наступною.
       * @type {string|null}
       */
      operation: null,
      /**
       * Стан, що відповідає за збереження параметру сортування. Він може бути '$asc' або '$desc'.
       * @type {string|null}
       */
      order: null,
      /**
       * Стан, що відповідає за значення label для операції агрегування $sort, яке в свою чергу містить поле для виконання пошуку.
       * @type {string|null}
       */
      label: null,
      /**
       * Стан, що відповідає за збереження доступних полів, що отримані з серверу.
       * @type {Array}
       */
      labelsList: [],
    }
  },
  created() {
    if (this.query.sort) {
      this.order = this.query.sort
    }
    if (this.query.label) {
      this.label = this.query.label
    } else {
      this.$store.commit('changeErrorFixed', {
        id: this.query.queryId,
        value: false,
      })
    }
    let parentCollectionName = this.item.queries[0].value
    getLabelsList(parentCollectionName).then(res => {
      if (res.status === 200) {
        this.labelsList = Object.keys(res.data.labelsObj)
      }
    })
  },
  /**
   * Спостерігач за полем order.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля order.
   */
  /**
   * Спостерігач за полем label.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля label.
   */
  /**
   * Спостерігач за полем databaseName, що є обчислюваною властивістю, та динамічно зберігає поточну базу даних.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля databaseName.
   */
  watch: {
    order: function (newValue) {
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
      this.changeSortOrder(newValue)
    },
    label: function (newValue) {
      this.changeSortLabel(newValue)
    },
    databaseName: function (newValue) {
      getLabelsList(newValue).then(res => {
        if (res.status === 200) {
          this.labelsList = Object.keys(res.data.labelsObj)
          this.label = null
          this.order = null
        }
      })
    },
  },
  methods: {
    /**
     * Функція, що змінює поле label в об'єкті запиту sort для об'єкту блока
     * @param {string} newValue - Нове значення поля label
     */
    changeSortLabel(newValue) {
      this.$emit('changeSortLabel', this.item.id, this.query.queryId, newValue)
    },
    /**
     * Функція, що видаляє повністю поточний запит з об'єкту блоку
     */
    deleteQuery() {
      this.$emit('deleteQuery', this.query.queryId, this.item.id)
    },
    /**
     * Функція, що змінює поле order в об'єкті запиту sort для об'єкту блока
     * @param {string} newValue - Нове значення поля order
     */
    changeSortOrder(newValue) {
      this.$emit('changeSortOrder', this.item.id, this.query.queryId, newValue)
    },
    /**
     * Функція, що очищає поля поточного запиту sample для повторного заповнення
     */
    clearSortOrder() {
      this.order = null
      this.$emit('changeSortOrder', this.item.id, this.query.queryId, null)
    },
    /**
     * Функція яка відповідає за додавання нового запиту до об'єкту блоку
     * @param {number} operation - Тип нової операції агрегування
     */
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
