<template>
  <!-- Репозиторій проект: https://github.com/StetsenkoBohdan2002/diplom -->
  <div class="query-section">
    <query-builder-item
      v-for="(item, index) in section.queries"
      :tab="!index ? 0 : 1"
      :key="index"
      :query="item"
      :item="section"
      :databaseList="databaseList"
      :operatorsList="operatorsList"
      @changeQueryDatabase="changeQueryDatabase"
      @addNewChildQuery="addNewChildQuery"
      @changeMatchLabel="changeMatchLabel"
      @changeSortLabel="changeSortLabel"
      @changeMatchType="changeMatchType"
      @deleteQuery="deleteQuery"
      @changeMatchValues="changeMatchValues"
      @clearMatchQuery="clearMatchQuery"
      @changeSampleSize="changeSampleSize"
      @changeLimitSize="changeLimitSize"
      @changeProjectLables="changeProjectLables"
      @changeSortOrder="changeSortOrder"
      @changeNewField="changeNewField"
      @changeFirstValue="changeFirstValue"
      @changeSecondValue="changeSecondValue"
      @clearSubtractQuery="clearSubtractQuery"
      @changeUnionCollection="changeUnionCollection"
      @clearIntersectCollection="clearIntersectCollection"
      @changeIntersectCollection="changeIntersectCollection"
      @changeIntersectComparisonField="changeIntersectComparisonField"
    />
  </div>
</template>
<script>
import queryBuilderItem from '@/components/queryBuilder/queryBuilderItem.vue'
/**
 * Компонент, що відповідає обгортку для блоку, який містить список усіх операцій агрегування поточного блоку
 * до відповідного компоненту
 * @vue/component
 * @module queryBuilderSection
 * @requires queryBuilderItem
 */
export default {
  /**
   * @typedef {Object} ComponentProps
   * @property {Array} databaseList - Список баз даних, які є доступними для вибору.
   * @property {Array} operatorsList - Список доступних операторів агрегації.
   * @property {Object} section - Поле що відповідає поточний блок
   */
  methods: {
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
     * Функція, що очищає поля поточного запиту match для повторного заповнення
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    clearMatchQuery(parentId, queryId) {
      this.$emit('clearMatchQuery', parentId, queryId)
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
     * Функція, що змінює поле values в об'єкті запиту match для об'єкту блока
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     * @param {null|string|Array} newValue - Нове значення поля values
     */
    changeMatchValues(parentId, queryId, newValue) {
      this.$emit('changeMatchValues', parentId, queryId, newValue)
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
     * Функція, що очищає поля поточного запиту intersect для повторного заповнення
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    clearIntersectCollection(parentId, queryId) {
      this.$emit('clearIntersectCollection', parentId, queryId)
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
    /**
     * Функція, що видаляє повністю поточний запит з об'єкту блоку
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    deleteQuery(queryId, parentId) {
      this.$emit('deleteQuery', queryId, parentId)
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
     * Функція, що очищає поля поточного запиту subtract для повторного заповнення
     * @param {number} queryId - Ідентифікатор запиту відповідного блоку, для видалення
     * @param {number} parentId - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    clearSubtractQuery(parentId, queryId) {
      this.$emit('clearSubtractQuery', parentId, queryId)
    },
  },
  components: { queryBuilderItem },
  props: {
    section: {
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
.query-section {
  padding-bottom: 20px;
  border-bottom: 1px solid #000;
}
</style>
