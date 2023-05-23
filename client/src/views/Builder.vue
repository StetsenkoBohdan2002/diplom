<template lang="">
  <div class="builder">
    <v-card style="height: 100%; background-color: rgb(237, 237, 237)">
      <v-tabs style="background-color: #fff" v-model="tab" bg-color="">
        <v-tab value="one">Query</v-tab>
        <v-tab value="two">Data</v-tab>
      </v-tabs>
      <!-- <v-card-text style="padding: 0px">
        <v-window v-model="tab">
          <v-window-item v-if="tab === 'one'" value="one"> -->
      <query-builder v-if="tab === 'one'" />
      <!-- </v-window-item>
          <v-window-item v-else value="two"> -->
      <builder-data v-else />
      <!-- </v-window-item>
        </v-window>
      </v-card-text> -->
    </v-card>
  </div>
</template>
<script>
import queryBuilder from '../components/queryBuilder/queryBuilder.vue'
import builderData from '../components/builderData/builderData.vue'
export default {
  data() {
    return {
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
