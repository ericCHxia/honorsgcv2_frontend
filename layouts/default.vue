<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <Avatar v-if="$auth.loggedIn" :user="user" />

      <v-divider></v-divider>
      <v-menu offset-y rounded="lg">
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            x-large
            rounded
            class="my-3 ml-2"
            elevation="4"
            v-on="on"
          >
            <v-icon color="primary">mdi-plus</v-icon>
            创建
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="toCreate(0)">
            <v-list-item-title>文章</v-list-item-title>
          </v-list-item>
          <v-list-item @click="toCreate(1)">
            <v-list-item-title>公告</v-list-item-title>
          </v-list-item>
          <v-list-item @click="toCreate(2)">
            <v-list-item-title>共同体</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user && user.privilege > 0" router exact to="/admin">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-show="!$vuetify.breakpoint.xs" v-text="title" />
      <v-spacer />
      <v-switch
        v-model="dark"
        inset
        hide-details
        :prepend-icon="dark ? 'mdi-brightness-2' : 'mdi-brightness-6'"
        @change="changeTheme"
      />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt :key="$route.path" />
      </v-container>
    </v-main>
    <honor-footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Avatar from '~/components/Avatar.vue'
import HonorFooter from '~/components/HonorFooter.vue'

export default Vue.extend({
  components: {
    Avatar,
    HonorFooter
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: '主页',
          to: '/'
        },
        {
          icon: 'mdi-post-outline',
          title: '文章',
          to: '/article'
        },
        {
          title: '公告',
          icon: 'mdi-bell-outline',
          to: '/notice'
        },
        {
          title: '共同体',
          icon: 'mdi-forum',
          to: '/community'
        }
      ],
      title: '卓越学院成长共同体平台',
      user: this.$auth.user,
      isLogin: this.$auth.loggedIn,
      rightDrawer: false,
      dark: this.$vuetify.theme.dark
    }
  },
  mounted() {},
  methods: {
    logout() {
      this.$auth.logout()
    },
    changeTheme() {
      if (this.dark) {
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.dark = false
      }
    },
    toCreate(type: number) {
      if (type === 0) {
        this.$router.push({
          path: '/post/edit',
          query: {
            type: '0'
          }
        })
        this.$nuxt.refresh()
      } else if (type === 1) {
        this.$router.push({
          path: '/post/edit',
          query: {
            type: '1'
          }
        })
        this.$nuxt.refresh()
      } else if (type === 2) {
        this.$router.push({
          path: '/community/edit'
        })
        this.$nuxt.refresh()
      }
    }
  }
})
</script>
