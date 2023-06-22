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
        :disabled="!label"
        label="Operation"
        variant="solo"
        density="compact"
        class="query-value"
        :items="operationList"
        v-model="type"
      ></v-autocomplete>
      <v-autocomplete
        :disabled="!type"
        label="Values"
        variant="solo"
        density="compact"
        class="query-value"
        :items="valuesList"
        v-model="values"
        v-if="valueVariant"
        multiple
      ></v-autocomplete>
      <v-text-field
        :disabled="!type"
        v-else
        label="Values"
        variant="solo"
        density="compact"
        class="query-value"
        v-model="values"
        hide-details
        single-line
        type="text"
      ></v-text-field>
      <v-btn class="clear-btn" icon="mdi-close" @click="clearMatchQuery">
      </v-btn>
      <v-alert
        v-if="!values"
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
/**
 * Компонент, що відповідає за створення операції агрегування $match та задання відповідних параметрів
 * @vue/component
 * @module matchItem
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
   * @property {string} errorTitle - Обчислювана властивість, що повертає текст помилки в залежності від заповнених полів
   */
  computed: {
    databaseName() {
      return this.item.queries[0].value
    },
    errorTitle() {
      if (!this.label) {
        return 'Label required'
      } else if (this.label && !this.type) {
        return 'Operation required'
      } else if (!this.values || this.values.length < 1) {
        return 'Values required'
      }
      return null
    },
  },
  created() {
    let parentCollectionName = this.item.queries[0].value
    if (this.query.label) {
      this.label = this.query.label
    }
    if (this.query.operation) {
      if (
        this.query.operation === '$in' ||
        this.query.operation === '$not_in'
      ) {
        this.valueVariant = true
      } else {
        this.valueVariant = false
      }
      this.type = this.query.operation
    }
    if (this.query.values) {
      this.values = this.query.values
    } else {
      this.$store.commit('changeErrorFixed', {
        id: this.query.queryId,
        value: false,
      })
    }
    getLabelsList(parentCollectionName).then(res => {
      if (res.status === 200) {
        this.labelsList = Object.keys(res.data.labelsObj)
        this.savedValuesObj = res.data.labelsObj
        this.valuesList = this.savedValuesObj[this.label]
      }
    })
  },
  data() {
    return {
      /**
       * Стан, що відповідає за збереження даних з серверу по отриманню доступних полів та їх значень з бази даних.
       * @type {object|null}
       */
      savedValuesObj: {},
      /**
       * Стан, що відповідає за тип поля для вибору значень з поля values.
       * @type {boolean}
       */
      valueVariant: false,
      /**
       * Стан, що відповідає за збереження типу операції, що буде створюватися наступною.
       * @type {string|null}
       */
      operation: null,
      /**
       * Стан, що відповідає за збереження доступних полів, що отримані з серверу.
       * @type {Array}
       */
      labelsList: [],
      /**
       * Стан, що відповідає за збереження списку значень доступних полів, що отримані з серверу.
       * @type {Array}
       */
      valuesList: [],
      /**
       * Стан, що відповідає за значення label для операції агрегування $match, яке в свою чергу містить поле для виконання пошуку.
       * @type {string|null}
       */
      label: null,
      /**
       * Стан, що відповідає за значення type для операції агрегування $match, яке в свою чергу містить поле типу входження даних.
       * @type {string|null}
       */
      type: null,
      /**
       * Стан, що відповідає за значення values для операції агрегування $match, яке в свою чергу містить значення для поля label.
       * @type {Array|null}
       */
      values: null,
      /**
       * Стан, що зберігає список можливих полів типу входження.
       * @type {Array}
       */
      operationList: ['$in', '$not_in', '$equal', '$not_equal'],
    }
  },
  /**
   * Спостерігач за полем type.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля type.
   */
  /**
   * Спостерігач за полем label.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля label.
   */
  /**
   * Спостерігач за полем values.
   * @type {Array|null}
   * @property {function} handler - Обробник зміни поля values.
   */
  /**
   * Спостерігач за полем databaseName, що є обчислюваною властивістю, та динамічно зберігає поточну базу даних.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля databaseName.
   */
  watch: {
    type: function (newValue) {
      this.changeMatchType(newValue)
    },
    label: function (newValue) {
      this.changeMatchLabel(newValue)
    },
    values: function (newValue) {
      if (newValue && newValue.length > 0 && !newValue.includes(null)) {
        this.$store.commit('changeErrorFixed', {
          id: this.query.queryId,
          value: true,
        })
      } else if (!newValue || newValue.length < 1) {
        this.$store.commit('changeErrorFixed', {
          id: this.query.queryId,
          value: false,
        })
      }
      this.changeMatchValues(newValue)
    },
    databaseName: function (newValue) {
      getLabelsList(newValue).then(res => {
        if (res.status === 200) {
          this.labelsList = Object.keys(res.data.labelsObj)
          this.savedValuesObj = res.data.labelsObj
          this.valuesList = this.savedValuesObj[this.label]
          this.label = null
          this.values = null
          this.type = null
        }
      })
    },
  },
  methods: {
    /**
     * Функція, що змінює поле label в об'єкті запиту match для об'єкту блока
     * @param {string} newValue - Нове значення поля label
     */
    changeMatchLabel(newValue) {
      if (!this.query.values) {
        this.values = null
      }
      if (!this.query.type) {
        this.type = null
      }
      this.$emit('changeMatchLabel', this.item.id, this.query.queryId, newValue)
    },
    /**
     * Функція, що змінює поле values в об'єкті запиту match для об'єкту блока
     * @param {null|string|Array} newValue - Нове значення поля values
     */
    changeMatchValues(newValue) {
      if (Array.isArray(this.values) && this.values < 1) {
        this.values = null
      }
      if (!this.valueVariant && newValue && !Array.isArray(newValue)) {
        this.$emit('changeMatchValues', this.item.id, this.query.queryId, [
          newValue,
        ])
      } else {
        this.$emit(
          'changeMatchValues',
          this.item.id,
          this.query.queryId,
          newValue
        )
      }
    },
    /**
     * Функція, що очищає поля поточного запиту match для повторного заповнення
     */
    clearMatchQuery() {
      this.values = null
      this.label = null
      this.type = null
      this.$emit('clearMatchQuery', this.item.id, this.query.queryId)
    },
    /**
     * Функція, що змінює поле type в об'єкті запиту match для об'єкту блока
     * @param {string} newValue - Нове значення поля type
     */
    changeMatchType(newValue) {
      if (newValue === '$in' || newValue === '$not_in') {
        this.valueVariant = true
        if (!Array.isArray(this.values) && this.values !== null) {
          this.values = []
        }
        this.valuesList = this.savedValuesObj[this.label]
      } else {
        this.valueVariant = false
        if (Array.isArray(this.values) && this.values !== null) {
          if (this.values[0]) {
            this.values = [this.values[0]]
          } else {
            this.values = []
          }
        }
      }
      this.changeMatchValues(this.values)
      this.$emit('changeMatchType', this.item.id, this.query.queryId, newValue)
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
    /**
     * Функція, що видаляє повністю поточний запит з об'єкту блоку
     */
    deleteQuery() {
      this.$emit('deleteQuery', this.query.queryId, this.item.id)
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
