// Репозиторій проект: https://github.com/StetsenkoBohdan2002/diplom
/**
 * Головним файлом проєкту, у якому відбувається впровадження та встановлення фреймворку Vue.js, а також інших необхідних залежностей, що потрібні для нашого проєкту.
 * @module main
 * @requires createApp
 * @requires App
 * @requires router
 * @requires store
 * @requires 'vuetify/styles'
 * @requires createVuetify
 * @requires 'vuetify/components'
 * @requires 'vuetify/directives'
 * @requires '@mdi/font/css/materialdesignicons.css'
 * @requires 'vuetify/dist/vuetify.min.css'
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'

/**
 * Ініціалізує об'єкт Vuetify для використання в додатку.
 * @param {Object} options - Об'єкт з налаштуваннями Vuetify.
 * @param {Object} options.components - Компоненти, які будуть доступні в Vuetify.
 * @param {Object} options.directives - Директиви, які будуть доступні в Vuetify.
 * @returns {Object} - Об'єкт Vuetify для використання в додатку.
 */
const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(store).use(vuetify).use(router).mount('#app')
