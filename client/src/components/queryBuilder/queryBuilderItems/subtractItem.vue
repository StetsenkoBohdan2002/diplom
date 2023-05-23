<template lang="">
  <div class="query-item subtract">
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
      <v-text-field
        label="New field"
        variant="solo"
        density="compact"
        class="query-value"
        v-model="newField"
      ></v-text-field>
      <v-autocomplete
        :disabled="!newField"
        label="First field"
        variant="solo"
        density="compact"
        class="query-value"
        :items="labelsListFirstFieldShow"
        v-model="firstValue"
      ></v-autocomplete>
      <v-autocomplete
        :disabled="!firstValue"
        label="Second field"
        variant="solo"
        density="compact"
        class="query-value"
        :items="labelsListSecondFieldShow"
        v-model="secondValue"
      ></v-autocomplete>
      <v-btn class="clear-btn" icon="mdi-close" @click="clearSubtractQuery">
      </v-btn>
      <v-alert
        v-if="!secondValue"
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
 * Компонент, що відповідає за створення операції агрегування $subtract та задання відповідних параметрів
 * @vue/component
 * @module subtractItem
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
   * @property {string} errorTitle - Обчислювана властивість, що повертає текст помилки в залежності від заповнених полів
   * @property {string} databaseName - Обчислювана властивість, що буде динамічно повертати назву бази даних для поточного об'єкту блоку
   */
  created() {
    if (this.query.firstValue) {
      this.firstValue = this.query.firstValue
    }
    if (this.query.secondValue) {
      this.secondValue = this.query.secondValue
    } else {
      this.$store.commit('changeErrorFixed', {
        id: this.query.queryId,
        value: false,
      })
    }
    if (this.query.newField) {
      this.newField = this.query.newField
    }
    let parentCollectionName = this.item.queries[0].value
    getLabelsList(parentCollectionName).then(res => {
      if (res.status === 200) {
        this.labelsListFirstField = Object.keys(res.data.labelsObj)
        this.labelsListSecondField = Object.keys(res.data.labelsObj)
        this.labelsListFirstFieldShow = Object.keys(res.data.labelsObj)
        this.labelsListSecondFieldShow = Object.keys(res.data.labelsObj)
      }
    })
  },
  computed: {
    databaseName() {
      return this.item.queries[0].value
    },
    errorTitle() {
      if (!this.newField) {
        return 'New field required'
      } else if (this.newField && !this.firstValue) {
        return 'Operation required'
      } else if (!this.values) {
        return 'Values required'
      }
      return null
    },
  },
  data() {
    return {
      /**
       * Стан, що відповідає за збереження доступних полів(статичні), що отримані з серверу для першого поля вибору.
       * @type {Array}
       */
      labelsListFirstField: [],
      /**
       * Стан, що відповідає за збереження доступних полів(статичні), що отримані з серверу для другого поля вибору, з даними, що не перетинаються з першим полем.
       * @type {Array}
       */
      labelsListSecondField: [],
      /**
       * Стан, що відповідає за збереження доступних полів, що будуть відображені для першого поля.
       * @type {Array}
       */
      labelsListFirstFieldShow: [],
      /**
       * Стан, що відповідає за збереження доступних полів, що будуть відображені для другого поля.
       * @type {Array}
       */
      labelsListSecondFieldShow: [],
      /**
       * Стан, що відповідає за збереження типу операції, що буде створюватися наступною.
       * @type {string|null}
       */
      operation: null,
      /**
       * Стан, що відповідає за значення newField для операції агрегування $subtract, яке в свою чергу містить назву нового поля в якому будуть міститися результати операції.
       * @type {string|null}
       */
      newField: null,
      /**
       * Стан, що відповідає за значення firstValue для операції агрегування $subtract, яке в свою чергу буде зберігате обране перше поле.
       * @type {string|null}
       */
      firstValue: null,
      /**
       * Стан, що відповідає за значення firstValue для операції агрегування $subtract, яке в свою чергу буде зберігате обране друге поле.
       * @type {string|null}
       */
      secondValue: null,
    }
  },
  /**
   * Спостерігач за полем newField.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля newField.
   */
  /**
   * Спостерігач за полем firstValue.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля firstValue.
   */
  /**
   * Спостерігач за полем secondValue.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля secondValue.
   */
  /**
   * Спостерігач за полем databaseName, що є обчислюваною властивістю, та динамічно зберігає поточну базу даних.
   * @type {string|null}
   * @property {function} handler - Обробник зміни поля databaseName.
   */
  watch: {
    newField: function (newValue) {
      this.changeNewField(newValue)
    },
    firstValue: function (newValue) {
      this.changeFirstValue(newValue)
    },
    secondValue: function (newValue) {
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
      this.changeSecondValue(newValue)
    },
    databaseName: function (newValue) {
      getLabelsList(newValue).then(res => {
        if (res.status === 200) {
          this.labelsListFirstField = Object.keys(res.data.labelsObj)
          this.labelsListSecondField = Object.keys(res.data.labelsObj)
          this.labelsListFirstFieldShow = Object.keys(res.data.labelsObj)
          this.labelsListSecondFieldShow = Object.keys(res.data.labelsObj)
          this.firstValue = null
          this.secondValue = null
          this.newField = null
        }
      })
    },
  },
  methods: {
    /**
     * Функція, що змінює поле newField в об'єкті запиту subtract для об'єкту блока
     * @param {string} newValue - Нове значення поля label
     */
    changeNewField(newValue) {
      this.$emit('changeNewField', this.item.id, this.query.queryId, newValue)
    },
    /**
     * Функція, що змінює поле firstField в об'єкті запиту subtract для об'єкту блока
     * @param {string} newValue - Нове значення поля label
     */
    changeFirstValue(newValue) {
      this.labelsListSecondFieldShow = this.labelsListSecondField.filter(
        item => item !== newValue && item !== this.firstValue
      )
      this.$emit('changeFirstValue', this.item.id, this.query.queryId, newValue)
    },
    /**
     * Функція, що змінює поле secondField в об'єкті запиту subtract для об'єкту блока
     * @param {string} newValue - Нове значення поля label
     */
    changeSecondValue(newValue) {
      this.labelsListFirstFieldShow = this.labelsListFirstField.filter(
        item => item !== newValue && item !== this.secondValue
      )
      this.$emit(
        'changeSecondValue',
        this.item.id,
        this.query.queryId,
        newValue
      )
    },
    /**
     * Функція, що очищає поля поточного запиту subtract для повторного заповнення
     */
    clearSubtractQuery() {
      this.newField = null
      this.firstValue = null
      this.secondValue = null
      this.$emit('clearSubtractQuery', this.item.id, this.query.queryId)
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
    },
    deleteQuery() {
      this.$emit('deleteQuery', this.query.queryId, this.item.id)
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
