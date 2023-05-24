<template>
  <div class="query-item" :style="{ 'padding-left': tab * 40 + 'px' }">
    <main-item
      @addNewChildQuery="addNewChildQuery"
      @changeQueryDatabase="changeQueryDatabase"
      :databaseList="databaseList"
      :operatorsList="operatorsList"
      :tab="tab"
      :query="query"
      @deleteQuery="deleteQuery"
      :item="item"
      v-if="query.type === 'from'"
    />
    <match-item
      @deleteQuery="deleteQuery"
      @changeMatchLabel="changeMatchLabel"
      @changeMatchValues="changeMatchValues"
      @changeMatchType="changeMatchType"
      @clearMatchQuery="clearMatchQuery"
      @addNewChildQuery="addNewChildQuery"
      :databaseList="databaseList"
      :operatorsList="operatorsList"
      :tab="tab"
      :query="query"
      :item="item"
      v-if="query.type === 'match'"
    />
    <subtract-item
      @deleteQuery="deleteQuery"
      @changeNewField="changeNewField"
      @changeFirstValue="changeFirstValue"
      @changeSecondValue="changeSecondValue"
      @clearSubtractQuery="clearSubtractQuery"
      @addNewChildQuery="addNewChildQuery"
      :databaseList="databaseList"
      :operatorsList="operatorsList"
      :tab="tab"
      :query="query"
      :item="item"
      v-if="query.type === 'subtract'"
    />
    <sample-item
      @deleteQuery="deleteQuery"
      @changeSampleSize="changeSampleSize"
      @addNewChildQuery="addNewChildQuery"
      :operatorsList="operatorsList"
      :tab="tab"
      :query="query"
      :item="item"
      v-if="query.type === 'sample'"
    />
    <limit-item
      @deleteQuery="deleteQuery"
      @changeLimitSize="changeLimitSize"
      @addNewChildQuery="addNewChildQuery"
      :operatorsList="operatorsList"
      :tab="tab"
      :query="query"
      :item="item"
      v-if="query.type === 'limit'"
    />
    <project-item
      @deleteQuery="deleteQuery"
      @changeProjectLables="changeProjectLables"
      @addNewChildQuery="addNewChildQuery"
      :operatorsList="operatorsList"
      :databaseList="databaseList"
      :tab="tab"
      :query="query"
      :item="item"
      v-if="query.type === 'project'"
    />
    <sort-item
      @deleteQuery="deleteQuery"
      @changeSortOrder="changeSortOrder"
      @changeSortLabel="changeSortLabel"
      @addNewChildQuery="addNewChildQuery"
      :operatorsList="operatorsList"
      :databaseList="databaseList"
      :tab="tab"
      :query="query"
      :item="item"
      v-if="query.type === 'sort'"
    />
    <union-item
      @deleteQuery="deleteQuery"
      @changeUnionCollection="changeUnionCollection"
      @addNewChildQuery="addNewChildQuery"
      :operatorsList="operatorsList"
      :databaseList="databaseList"
      :tab="tab"
      :query="query"
      :item="item"
      v-if="query.type === 'union'"
    />
    <intersect-item
      @deleteQuery="deleteQuery"
      @changeIntersectCollection="changeIntersectCollection"
      @changeIntersectComparisonField="changeIntersectComparisonField"
      @clearIntersectCollection="clearIntersectCollection"
      @addNewChildQuery="addNewChildQuery"
      :operatorsList="operatorsList"
      :databaseList="databaseList"
      :tab="tab"
      :query="query"
      :item="item"
      v-if="query.type === 'intersect'"
    />
  </div>
</template>
<script>
/**
 * Компонент, що відповідає за обгортку для операцій агрегування, в залежності від типу операції, дані будуть далі прокидуватися
 * до відповідного компоненту
 * @vue/component
 * @module queryBuilderItem
 * @requires IntersectItem
 * @requires LimitItem
 * @requires MainItem
 * @requires MatchItem
 * @requires ProjectItem
 * @requires SampleItem
 * @requires SortItem
 * @requires SubtractItem
 * @requires UnionItem
 */
import IntersectItem from './queryBuilderItems/intersectItem.vue'
import LimitItem from './queryBuilderItems/limitItem.vue'
import MainItem from './queryBuilderItems/mainItem.vue'
import MatchItem from './queryBuilderItems/matchItem.vue'
import ProjectItem from './queryBuilderItems/projectItem.vue'
import SampleItem from './queryBuilderItems/sampleItem.vue'
import SortItem from './queryBuilderItems/sortItem.vue'
import SubtractItem from './queryBuilderItems/subtractItem.vue'
import UnionItem from './queryBuilderItems/unionItem.vue'
export default {
  /**
   * @typedef {Object} ComponentProps
   * @property {Object} query - Об'єкт конкретного запиту, що зберігає в собі необхідну інформацію про збережений запит.
   * Відображається у випадку, якщо після повторного входу на сторінку є збереженні дані з попереднього разу.
   * @property {Object} item - Об'єкт блоку, що зберігає інформацію про перелік запитів.
   * @property {Array} databaseList - Список баз даних, які є доступними для вибору.
   * @property {Array} operatorsList - Список доступних операторів агрегації.
   * @property {number} tab - Поле що відповідає за відступ для запитів, щоб ієрархія коректно відображалася
   */
  components: {
    MainItem,
    MatchItem,
    SampleItem,
    LimitItem,
    ProjectItem,
    SortItem,
    SubtractItem,
    UnionItem,
    IntersectItem,
  },
  methods: {
    /**
     * Функція, що видаляє повністю поточний запит з об'єкту блоку
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    deleteQuery(queryId, parentId) {
      this.$emit('deleteQuery', queryId, parentId)
    },
    /**
     * Функція, що змінює поле label в об'єкті запиту match для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля label
     */
    changeMatchLabel(parentId, queryId, newValue) {
      this.$emit('changeMatchLabel', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле label в об'єкті запиту sort для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля labels
     */
    changeSortLabel(parentId, queryId, newValue) {
      this.$emit('changeSortLabel', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле newField в об'єкті запиту subtract для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля label
     */
    changeNewField(parentId, queryId, newValue) {
      this.$emit('changeNewField', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле firstField в об'єкті запиту subtract для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля label
     */
    changeFirstValue(parentId, queryId, newValue) {
      this.$emit('changeFirstValue', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле secondField в об'єкті запиту subtract для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля label
     */
    changeSecondValue(parentId, queryId, newValue) {
      this.$emit('changeSecondValue', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле order в об'єкті запиту sort для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля order
     */
    changeSortOrder(parentId, queryId, newValue) {
      this.$emit('changeSortOrder', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле collection в об'єкті запиту union для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля collection
     */
    changeUnionCollection(parentId, queryId, newValue) {
      this.$emit('changeUnionCollection', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле collection в об'єкті запиту intersect для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля collection
     */
    changeIntersectCollection(parentId, queryId, newValue) {
      this.$emit('changeIntersectCollection', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поля comparisonField в об'єкті запиту intersect для об'єкту блока, в залежності від поля type
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення полів comparisonField
     * @param {string} type - Тип поля в залежності від якого буде змінюватися comparisonField
     */
    changeIntersectComparisonField(parentId, queryId, newValue, type) {
      this.$emit(
        'changeIntersectComparisonField',
        parentId,
        queryId,
        newValue,
        type
      )
    },
    /**
     * Функція, що змінює поле size в об'єкті запиту sample для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {number} newValue - Нове значення поля size
     */
    changeSampleSize(parentId, queryId, newValue) {
      this.$emit('changeSampleSize', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле labels в об'єкті запиту project для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля labels
     */
    changeProjectLables(parentId, queryId, newValue) {
      this.$emit('changeProjectLables', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле size в об'єкті запиту limit для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {number} newValue - Нове значення поля size
     */
    changeLimitSize(parentId, queryId, newValue) {
      this.$emit('changeLimitSize', parentId, queryId, newValue)
    },
    /**
     * Функція, що очищає поля поточного запиту match для повторного заповнення
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    clearMatchQuery(parentId, queryId) {
      this.$emit('clearMatchQuery', parentId, queryId)
    },
    /**
     * Функція, що очищає поля поточного запиту subtract для повторного заповнення
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    clearSubtractQuery(parentId, queryId) {
      this.$emit('clearSubtractQuery', parentId, queryId)
    },
    /**
     * Функція, що очищає поля поточного запиту intersect для повторного заповнення
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    clearIntersectCollection(parentId, queryId) {
      this.$emit('clearIntersectCollection', parentId, queryId)
    },
    /**
     * Функція, що змінює поле values в об'єкті запиту match для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {null|string|Array} newValue - Нове значення поля values
     */
    changeMatchValues(parentId, queryId, newValue) {
      this.$emit('changeMatchValues', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле type в об'єкті запиту match для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля type
     */
    changeMatchType(parentId, queryId, newValue) {
      this.$emit('changeMatchType', parentId, queryId, newValue)
    },
    /**
     * Функція, що змінює поле поточну базу даних в об'єкті блоку
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {string} newValue - Нове значення поля database
     */
    changeQueryDatabase(id, newValue) {
      this.$emit('changeQueryDatabase', id, newValue)
    },
    /**
     * Функція яка відповідає за додавання нового запиту до об'єкту блоку
     * @param {number} operation - Тип нової операції агрегування
     * @param {boolean} newQuery - Поле що відповідає, чи створюється новий запит в поточному блоці, чи новий блок
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    addNewChildQuery(operation, newQuery, parentId) {
      this.$emit('addNewChildQuery', operation, newQuery, parentId)
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
<style lang="scss">
.query {
  &-item {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 0;
    justify-content: space-between;
    &-main {
      display: flex;
      width: 90%;
    }
  }
  &-select {
    border-radius: 5px;
    margin-right: 10px;
    background-color: rgb(20, 243, 187);
    max-width: 80px;
    & > .v-input__details {
      display: none;
    }
  }
  &-value {
    max-width: 200px;
    margin-left: 10px;
    height: 42px;
    & > .v-input__control > .v-field {
      box-shadow: 0 1px 2px rgb(190, 190, 190);
    }
    & > .v-input__details {
      display: none;
    }
  }
  &-type {
    border-radius: 5px;
    background-color: rgb(63, 63, 63);
    color: #fff;
    height: 42px;
    width: 120px;
    text-transform: uppercase;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.dropdown {
  &-item {
    &:hover {
      background-color: rgb(241, 241, 241);
      width: 100%;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
  }
  &-btn {
    max-width: 42px !important;
    min-width: 42px !important;
    height: 42px !important;
    padding: 0 5px !important;
    margin-right: 10px;
    background-color: rgb(20, 243, 187);
  }
}
</style>
