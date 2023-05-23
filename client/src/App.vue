<template>
  <v-card>
    <div class="loader" v-if="loading">
      <v-progress-circular
        :size="100"
        color=""
        indeterminate
      ></v-progress-circular>
    </div>
    <v-layout style="height: 100vh; position: relative; z-index: 998">
      <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->

      <v-app-bar color="#ffa200" prominent>
        <router-link
          to="/"
          class="ml-5"
          style="text-decoration: none; color: inherit"
          ><v-toolbar-title>Query Builder</v-toolbar-title></router-link
        >
        <v-dialog persistent v-model="dialog" scrollable width="auto">
          <template v-slot:activator="{ props }">
            <v-btn
              color="#fff"
              class="animate__animated animate__fadeIn ml-10"
              variant="elevated"
              :disabled="disableSave"
              v-if="showSaveQueryButton"
              prepend-icon="mdi-check-circle"
              v-bind="props"
            >
              <template v-slot:prepend>
                <v-icon></v-icon>
              </template>
              Save Query
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Save Query</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 100px; width: 300px">
              <v-text-field
                label="Query name"
                variant="solo"
                density="compact"
                class="query-name"
                @input="changeQueryName"
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeQueryModal"
              >
                Close
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="handleNewQuery"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          class="animate__animated animate__fadeIn ml-10"
          color="#fff"
          variant="elevated"
          v-if="showSaveQueryButton"
          @click="accessDelete"
          prepend-icon="mdi-delete"
        >
          <template v-slot:prepend>
            <v-icon></v-icon>
          </template>
          Delete Query
        </v-btn>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-navigation-drawer style="width: 240px" permanent location="right">
        <template v-slot:prepend>
          <v-list-item
            lines="two"
            prepend-avatar="https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"
            title="New User"
            subtitle="Logged in"
          ></v-list-item>
        </template>
        <v-list v-model="currentPage" density="compact" nav>
          <router-link to="/" style="text-decoration: none; color: inherit"
            ><v-list-item
              exact
              prepend-icon="mdi-home"
              title="Home"
              value="Home"
            ></v-list-item>
          </router-link>
          <v-divider></v-divider>
          <router-link to="/about" style="text-decoration: none; color: inherit"
            ><v-list-item
              exact
              prepend-icon="mdi-information"
              title="About"
              value="About"
            ></v-list-item>
          </router-link>
          <v-divider></v-divider>
          <router-link
            to="/query-builder"
            style="text-decoration: none; color: inherit"
            ><v-list-item
              exact
              prepend-icon="mdi-wrench"
              title="Query Builder"
              value="Query Builder"
            ></v-list-item>
          </router-link>
          <router-link
            to="/saved-queries"
            style="text-decoration: none; color: inherit"
            ><v-list-item
              exact
              prepend-icon="mdi-content-save-all"
              title="Saved Queries"
              value="Saved Queries"
            ></v-list-item>
          </router-link>
          <v-divider></v-divider>
        </v-list>
      </v-navigation-drawer>
      <v-main style="background-color: #ededed; padding-right: 240px">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
</template>
<script>
import { getDatabaseList } from '@/Api.js'

export default {
  data: () => ({
    currentPage: '',
    dialog: false,
    accessDeleteValue: false,
  }),
  created() {
    getDatabaseList().then(res => {
      if (res.status === 200) {
        for (let index = 0; index < res.data.collectionList.length; index++) {
          this.$store.commit(
            'addDatabaseToList',
            res.data.collectionList[index]
          )
        }
      }
    })
    if (localStorage['builderData']) {
      let builderDataLocal = JSON.parse(localStorage['builderData'])
      if (builderDataLocal && builderDataLocal.length > 0) {
        this.$store.commit('setBuilderData', builderDataLocal)
      }
    }
  },
  methods: {
    handleNewQuery() {
      this.$store.commit('changeAccessSaving')
      let builderDataLocal = JSON.parse(localStorage['builderData'])
      if (builderDataLocal && builderDataLocal.length > 0) {
        this.$store.commit('setBuilderData', builderDataLocal)
      }
      this.dialog = false
    },
    accessDelete() {
      this.$store.commit('changeAccessDeleteValue')
    },
    changeQueryName(event) {
      this.$store.commit('changeQueryName', event.target.value)
    },
    closeQueryModal() {
      this.$store.commit('changeQueryName', null)
      this.dialog = false
    },
  },
  computed: {
    loading() {
      return this.$store.getters.getLoading
    },
    disableSave() {
      return this.$store.getters.getDisableSaving
    },
    showSaveQueryButton() {
      return this.$route.path === '/query-builder'
    },
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.v-field__input {
  flex-wrap: nowrap !important;
  overflow: auto;
}
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.v-card__loader {
  position: absolute;
  z-index: 1000;
}
.loader {
  width: 100%;
  height: 100vh;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(189, 189, 189, 0.342);
  z-index: 999;
}
.v-progress-circular.v-progress-circular--indeterminate.v-progress-circular--visible {
  position: absolute;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.clear-btn {
  color: #fff;
  margin-left: 10px;
  height: 42px !important;
  width: 42px !important;
  background-color: #000000;
}

.v-field__outline {
  display: none;
}

.error-notify {
  margin-left: 30px;
  max-width: 270px;
  height: 42px;
  display: flex;
  align-items: center;
  & > .v-alert__prepend {
    color: #fff;
    & > .v-icon {
      width: 24px !important;
      height: 24px !important;
    }
  }
  & > .v-alert__content > .v-alert-title {
    font-size: 14px !important;
    color: #fff;
  }
}

.delete-btn {
  width: 10%;
  justify-self: end;
  background-color: rgb(244, 21, 77);
  color: #fff;
  width: 42px !important;
  height: 42px !important;
}
</style>
