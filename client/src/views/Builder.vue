<template lang="">
  <div class="builder">
    <v-card style="height: 100%; background-color: rgb(237, 237, 237)">
      <v-tabs style="background-color: #fff" v-model="tab" bg-color="">
        <v-tab value="one">Query</v-tab>
        <v-tab value="two">Data</v-tab>
      </v-tabs>
      <query-builder v-if="tab === 'one'" />
      <builder-data v-else />
    </v-card>
  </div>
</template>
<script>
/**
 * Компонент, що відповідає за відображення основного функціоналу
 * @vue/component
 * @module Builder
 * @requires builderData
 * @requires queryBuilder
 */
import queryBuilder from '../components/queryBuilder/queryBuilder.vue'
import builderData from '../components/builderData/builderData.vue'
export default {
  data() {
    return {
      /**
       * Стан, що відповідає умову відображення або компоненту побудови запиту, або відображення результату
       * @type {string|null}
       */
      tab: null,
    }
  },
  components: {
    builderData,
    queryBuilder,
  },
}
</script>
<style lang="scss">
.builder {
  height: 100%;
}
</style>
