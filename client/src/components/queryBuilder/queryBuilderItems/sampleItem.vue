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
      <v-text-field
        label="Size"
        variant="solo"
        density="compact"
        class="query-value"
        v-model="size"
        hide-details
        single-line
        type="number"
        min="0"
      ></v-text-field>
      <v-btn class="clear-btn" icon="mdi-close" @click="clearSamleQuery">
      </v-btn>
      <v-alert
        v-if="!size"
        border
        class="error-notify"
        type="error"
        icon="mdi-alert-circle"
        title="Size required"
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
/**
 * Компонент, що відповідає за створення операції агрегування $sample та задання відповідних параметрів
 * @vue/component
 * @module sampleItem
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
  data() {
    return {
      /**
       * Стан, що відповідає за збереження типу операції, що буде створюватися наступною.
       * @type {string|null}
       */
      operation: null,
      /**
       * Стан, що відповідає за значення size для операції агрегування $sample.
       * @type {number|null}
       */
      size: null,
    }
  },
  created() {
    if (this.query.size) {
      this.size = this.query.size
    } else {
      this.$store.commit('changeErrorFixed', {
        id: this.query.queryId,
        value: false,
      })
    }
  },
  /**
   * Спостерігач за полем size.
   * @type {number|null}
   * @property {function} handler - Обробник зміни поля size.
   */
  watch: {
    size: function (newValue) {
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
      this.changeSampleSize(newValue)
    },
  },
  methods: {
    /**
     * Функція, що видаляє повністю поточний запит з об'єкту блоку
     */
    deleteQuery() {
      this.$emit('deleteQuery', this.query.queryId, this.item.id)
    },
    /**
     * Функція, що змінює поле size в об'єкті запиту sample для об'єкту блока
     * @param {number} newValue - Нове значення поля size
     */
    changeSampleSize(newValue) {
      this.$emit('changeSampleSize', this.item.id, this.query.queryId, newValue)
    },
    /**
     * Функція, що очищає поля поточного запиту sample для повторного заповнення
     */
    clearSamleQuery() {
      this.size = null
      this.$emit('changeSampleSize', this.item.id, this.query.queryId, null)
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
