<template>
  <div class="no-data">
    <img class="no-data__img" src="/images/no-data.png" alt="No data" />
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss">
.no-data {
  font-size: 40px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  &__img {
    width: 500px;
  }
}
</style>
