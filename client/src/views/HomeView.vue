<template>
  <div class="home">
    <h2 class="animate__animated animate__backInLeft home__title">
      Query Builder
    </h2>
    <h4 class="animate__animated home__by animate__fadeIn">by</h4>
    <h2 class="animate__animated home__name animate__backInRight">
      Stetsenko Bohdan
    </h2>
  </div>
</template>

<script>
/**
 * Компонент, що відповідає за відображення головної сторінки
 * @vue/component
 * @module HomeView
 */
export default {
  name: 'HomeView',
  components: {},
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  &__title {
    font-size: 64px;
    border-bottom: 4px solid #000;
    margin-bottom: 15px;
  }
  &__by {
    font-size: 24px;
  }
  &__name {
    font-size: 34px;
  }
}
</style>
