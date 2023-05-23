<template lang="">
  <div class="query-item from">
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
        label="Choose"
        variant="solo"
        density="compact"
        class="query-value"
        :items="databaseList"
        v-model="database"
      ></v-autocomplete>
      <v-btn class="clear-btn" icon="mdi-close" @click="clearQuery"> </v-btn>
      <v-alert
        border
        class="error-notify"
        v-if="!database"
        type="error"
        icon="mdi-alert-circle"
        title="Collection required"
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
 * Компонент, що відповідає за задання головного поля для виконання пошуку, а саме from.
 * Саме це поле, буде виступати відповідною базою даних з якої відбудеться пошук.
 * @vue/component
 * @module mainItem
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
       * Стан, що відповідає за значення database для операції агрегування $from, що вказує базу даних з якої буде відбуватися пошук.
       * @type {string|null}
       */
      database: null,
    }
  },
  /**
   * Спостерігач за полем size.
   * @type {string|null}
   * @property {function} database - Обробник зміни поля database.
   */
  watch: {
    database: function (newValue) {
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
      this.changeQueryDatabase(newValue)
    },
  },
  methods: {
    /**
     * Функція, що очищає поля поточного запиту для повторного заповнення
     */
    clearQuery() {
      this.database = null
      this.$emit('changeQueryDatabase', this.item.id, null)
    },
    /**
     * Функція, що змінює поле поточну базу даних в об'єкті блоку
     * @param {string} newValue - Нове значення поля database
     */
    changeQueryDatabase(newValue) {
      this.$emit('changeQueryDatabase', this.item.id, newValue)
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
    },
    /**
     * Функція, що видаляє повністю поточний запит з об'єкту блоку
     */
    deleteQuery() {
      this.$emit('deleteQuery', this.query.queryId, this.item.id)
    },
  },
  created() {
    if (this.query.value) {
      this.database = this.query.value
    } else {
      this.$store.commit('changeErrorFixed', {
        id: this.query.queryId,
        value: false,
      })
    }
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
