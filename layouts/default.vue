<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <Avatar v-if="$auth.loggedIn" :user="user"/>

      <v-divider></v-divider>
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
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user&&user.privilege > 0" router exact to="/admin">
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt :key="$route.path"/>
      </v-container>
    </v-main>
    <HonorFooter/>
  </v-app>
</template>


<script lang="ts">
import Vue from 'vue'
import Avatar from '~/components/Avatar.vue'

export default Vue.extend({
  components: {
    Avatar,
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
          to: '/',
        },
        {
          icon: 'mdi-post-outline',
          title: '文章',
          to: '/article',
        },
        {
          title: '公告',
          icon: 'mdi-bell-outline',
          to: '/notice',
        },
        {
          title: '共同体',
          icon: 'mdi-forum',
          to: '/community',
        },
      ],
      title: '卓越学院成长共同体平台',
      user: this.$auth.user,
      isLogin: this.$auth.loggedIn,
      rightDrawer: false,
    }
  },
  mounted() {
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
})
</script>
