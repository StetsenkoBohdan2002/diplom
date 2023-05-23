<template lang="">
  <div class="builder">
    <saved-queries />
  </div>
</template>
<script>
import savedQueries from '../components/savedQueries/savedQueries.vue'
export default {
  components: {
    savedQueries,
  },
}
</script>
<style lang="scss">
.builder {
  height: 100%;
}
</style>
