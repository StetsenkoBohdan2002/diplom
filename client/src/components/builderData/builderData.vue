<template>
  <!-- Репозиторій проект: https://github.com/StetsenkoBohdan2002/diplom -->
  <div class="builder-data">
    <h1 class="builder-data__title">Result:</h1>
    <div class="builder-data__list" v-if="saved">
      <div class="builder-data__item" v-for="item in saved" :key="item._id">
        <div class="builder-data__item_switch" @click="switchItem(item)">
          {{ item.parse ? 'Revert' : 'Parse' }}
        </div>
        <div class="builder-data__item_copy" @click="copyItem(item)">Copy</div>
        <div class="builder-data__item_content" v-if="!item.parse">
          {{ item }}
        </div>
        <pre class="builder-data__item_content" v-else>
          {{ item }}
        </pre>
      </div>
    </div>
    <noData class="builder-data__empty" v-else />
  </div>
</template>
<script>
import { getData } from '@/Api.js'
import noData from '../noData/noData.vue'
/**
 * Компонент, що відповідає за відображення даних відповідно до побудованого запиту
 * @vue/component
 * @module builderData
 * @requires getData
 * @requires noData
 */
export default {
  name: 'builder-data',
  components: {
    noData,
  },
  data() {
    return {
      /**
       * Стан, що відповідає за збереження результатів отримання даних
       * @type {string|null}
       */
      saved: null,
    }
  },
  created() {
    this.$store.commit('changeLoading')
    const getCountElements = this.$store.getters.getCountElements
    const getErrorFixed = this.$store.getters.getErrorFixed.reduce(
      (acc, item) => {
        if (item.error) {
          acc += 1
        }
        return acc
      },
      0
    )
    if (
      getCountElements !== getErrorFixed ||
      (!getCountElements && !getErrorFixed)
    ) {
      this.$store.commit('changeLoading')
      return
    }
    getData(this.$store.getters.getBuilderData).then(res => {
      this.saved = res.data.queryResult.map(item => {
        item.parse = false
        return item
      })
      this.$store.commit('changeLoading')
    })
  },
  methods: {
    /**
     * Функція, що відповідає за копіювання елементу відповіді до буферу
     * @param {object} item - Поле, що є об'єктом для копіювання
     */
    copyItem(item) {
      navigator.clipboard
        .writeText(JSON.stringify(item))
        .then(() => {
          console.log('Текст скопійовано в буфер обміну')
        })
        .catch(error => {
          console.error(
            'Сталася помилка при копіюванні в буфер обміну: ' + error
          )
        })
    },
    /**
     * Функція, що відповідає парсинг об'єкту з рядка до об'єкту та навпаки
     * @param {object} item - Поле, що є об'єктом для копіювання
     */
    switchItem(item) {
      item.parse = !item.parse
    },
  },
}
</script>
<style lang="scss">
.builder {
  &-data {
    height: calc(100vh - 160px);
    overflow: auto;
    &__empty {
      height: 80%;
    }
    &__title {
      padding-top: 20px;
    }
    &__list {
      /* overflow: auto; */
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    &__item {
      background-color: #fff;
      padding: 20px 10px 5px;
      border-radius: 5px;
      width: 100%;
      text-align: left;
      margin-bottom: 30px;
      position: relative;
      &_switch,
      &_copy {
        position: absolute;
        left: 40px;
        transition: background-color 0.3s ease-in-out;
        top: -20px;
        width: 100px;
        height: 30px;
        border-radius: 5px;
        text-transform: uppercase;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        background-color: rgb(255, 102, 0);
        cursor: pointer;
        &:hover {
          background-color: rgb(204, 82, 0);
        }
      }
      &_copy {
        left: 200px;
        background-color: rgb(20, 243, 187);
        &:hover {
          background-color: rgb(15, 204, 157);
        }
      }
    }
  }
}
</style>
