<template>
  <!-- Репозиторій проект: https://github.com/StetsenkoBohdan2002/diplom -->
  <div class="saved-wrapper">
    <div class="saved-func">
      <v-select
        label="Sort by date"
        variant="solo"
        density="compact"
        class="sort-date"
        :items="['New', 'Old']"
        @update:modelValue="sortData"
        v-model="sortBy"
      ></v-select>
      <v-text-field
        label="Search by name"
        variant="solo"
        density="compact"
        class="search-name"
        v-model="searchLine"
        @input="searchByName"
      ></v-text-field>
    </div>
    <v-divider :thickness="3" class="border-opacity-25"></v-divider>
    <div class="saved-query" v-if="queries.length > 0">
      <div class="query-header">
        <div class="query-header_id">ID</div>
        <div class="query-header_name">Query Name</div>
        <div class="query-header_list">Query List</div>
        <div class="query-header_date">Created Date</div>
        <div class="query-header_string">Query String</div>
        <div></div>
        <div></div>
      </div>
      <div class="query-list">
        <div
          class="query-list__item"
          v-for="(query, index) in sortedData"
          :key="query._id"
        >
          <div class="query-list__item_index">{{ index + 1 }}</div>
          <div class="query-list__item_name">{{ query.name }}</div>
          <div class="query-list__item_queries">
            <v-chip
              variant="elevated"
              class="item"
              v-for="item in query.queryList"
              :key="item"
            >
              {{ item }}
            </v-chip>
          </div>
          <div class="query-list__item_date">
            {{ updateDate(query.created_date) }}
          </div>
          <div class="query-list__item_query">{{ query.query }}</div>
          <v-btn
            class="copy-btn"
            icon="mdi-content-copy"
            @click="copyQuery(query)"
          ></v-btn>
          <v-btn
            class="delete-btn"
            icon="mdi-close"
            @click="deleteQuery(query)"
          ></v-btn>
        </div>
      </div>
    </div>
    <no-data v-else-if="queries.length < 1 && !$store.getters.getLoading" />
  </div>
</template>
<script>
import { deleteSavedQuery, getSavedQueries } from '@/Api.js'
import noData from '../noData/noData.vue'
/**
 * Компонент, що відповідає за відображення збережених шаблонів операцій
 * @vue/component
 * @module savedQueries
 * @requires deleteSavedQuery
 * @requires getSavedQueries
 * @requires noData
 */
let timer
export default {
  components: { noData },
  data() {
    return {
      /**
       * Стан, що відповідає за збереження даних з серверу по отриманню збережених шаблонів запитів
       * @type {Array}
       */
      queries: [],
      /**
       * Стан, що відповідає за збереження відсортованих даних, в залежноті від дати та поля пошуку
       * @type {object|null}
       */
      sortedData: [],
      /**
       * Стан, що відповідає варіант сортування
       * @type {object|null}
       */
      sortBy: 'New',
      /**
       * Стан, що відповідає за збереження поля пошуку
       * @type {object|null}
       */
      searchLine: '',
    }
  },
  methods: {
    /**
     * Функція, що відповідає за пошук по полю searchLine
     */
    searchByName() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.sortedData = [...this.queries].filter(item =>
          item.name.toLowerCase().includes(this.searchLine.toLowerCase())
        )
      }, 500)
    },
    /**
     * Функція, що відповідає за сортування даних по полю sortBy
     */
    sortData() {
      if (this.sortBy === 'New') {
        this.sortedData = [...this.queries].sort((a, b) => {
          const dateA = new Date(a.created_date)
          const dateB = new Date(b.created_date)
          return dateA - dateB
        })
      } else {
        this.sortedData = [...this.queries].sort((a, b) => {
          const dateA = new Date(a.created_date)
          const dateB = new Date(b.created_date)
          return dateB - dateA
        })
      }
    },
    /**
     * Функція, що відповідає за копіювання відповідного запиту
     * @param {Object} data - Ідентифікатор відповідного блоку, в якому знаходиться запит
     */
    copyQuery(data) {
      localStorage['builderData'] = data.query
      this.$store.commit('setBuilderData', JSON.parse(data.query))
      this.$router.push({ path: '/query-builder' })
    },
    /**
     * Функція, що видаляє повністю збережений запит
     * @param {object} query - Запит який буде видалено
     */
    deleteQuery(query) {
      this.$store.commit('changeLoading')
      deleteSavedQuery(query._id).then(res => {
        if (res.status === 200) {
          this.queries = res.data.queries
          this.sortedData = res.data.queries
        }
        this.$store.commit('changeLoading')
      })
    },
    /**
     * Функція, що форматує дату для коректного відображення
     * @param {string} date - Поле з датою
     */
    updateDate(date) {
      const options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
      return new Date(date).toLocaleString('uk-UA', options)
    },
  },
  created() {
    this.$store.commit('changeLoading')
    getSavedQueries().then(res => {
      if (res.status === 200) {
        this.queries = res.data.queries
        if (this.sortBy === 'New') {
          this.sortedData = res.data.queries.sort((a, b) => {
            const dateA = new Date(a.created_date)
            const dateB = new Date(b.created_date)
            return dateB - dateA
          })
        } else {
          this.sortedData = res.data.queries.sort((a, b) => {
            const dateA = new Date(a.created_date)
            const dateB = new Date(b.created_date)
            return dateA - dateB
          })
        }
      }
      this.$store.commit('changeLoading')
    })
  },
}
</script>
<style lang="scss">
.copy-btn,
.delete-btn {
  margin-left: 10px;
}
.delete-btn {
  width: 10%;
  justify-self: end;
  background-color: rgb(244, 21, 77);
  color: #fff;
  width: 42px !important;
  height: 42px !important;
}
.saved-func {
  display: flex;
  column-gap: 10px;
  padding-top: 20px;
  padding-left: 30px;
}

.search-name {
  max-width: 400px;
}
.sort-date {
  max-width: 200px;
}
.saved-wrapper {
  height: 100%;
}
.saved-query {
  padding: 20px;
}
.query-list {
  padding: 10px;
  &__item {
    text-align: left;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgb(190, 190, 190);
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #fff;
    padding: 10px 20px;
    margin-bottom: 15px;
    &_index {
      width: 50px;
    }
    &_name {
      width: 10%;
    }
    &_queries {
      width: 20%;
      padding: 10px;
      margin-right: 10px;
      /* display: flex; */
      overflow: scroll;
      white-space: nowrap;
      border: 1px solid #000;
      border-radius: 5px;
      flex-wrap: nowrap;
      & > .item:not(:first-child) {
        margin-left: 10px;
      }
    }
    &_date {
      width: 20%;
    }
    &_query {
      border: 1px solid #000;
      border-radius: 5px;
      width: 40%;
      overflow: auto;
      white-space: nowrap;
      padding: 14px;
    }
  }
}
.query-header {
  font-weight: 600;
  display: flex;
  padding: 0 30px;
  text-align: left;
  &_id {
    width: 50px;
  }
  &_name {
    width: 10%;
  }
  &_list {
    width: 20%;
    padding-left: 10px;
  }
  &_date {
    padding-left: 10px;
    width: 20%;
  }
  &_string {
    padding-left: 10px;
    width: 40%;
  }
}
</style>
