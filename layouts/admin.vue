<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <Avatar v-model="user"/>

      <v-divider></v-divider>
      <v-list>
        <v-list-item to="/admin">
          <v-list-item-action>
            <v-icon>mdi-apps</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>管理主页</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group prepend-icon="mdi-file-document-outline" no-action>
          <template #activator>
            <v-list-item-title>文章管理</v-list-item-title>
          </template>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>文章列表</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-file-document-multiple-outline</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>标签管理</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-tag-text</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
        <v-list-group prepend-icon="mdi-google-classroom" no-action>
          <template #activator>
            <v-list-item-title>共同体管理</v-list-item-title>
          </template>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>共同体列表</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>共同体类型</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-tag</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>打卡记录</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-note-plus</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
        <v-list-group prepend-icon="mdi-account-circle" no-action>
          <template #activator>
            <v-list-item-title>用户管理</v-list-item-title>
          </template>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>查看</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-account-box-multiple</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>添加用户</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>用户导出</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-export-variant</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-server-network</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>网站管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>返回主页</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt :key="$route.path"/>
      </v-container>
    </v-main>

    <!-- 用户菜单 -->
    <v-navigation-drawer v-model="rightDrawer" right temporary fixed>
      <v-card v-if="islogin" flat>
        <v-card-title v-text="user['name']"></v-card-title>
        <v-card-subtitle v-text="user['userId']"></v-card-subtitle>
        <v-card-actions>
          <v-btn @click.stop="logout">退出</v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>

    <!--  页脚 -->
    <v-footer app>
      <span>&copy; 2019-{{ new Date().getFullYear() }}</span>
      <v-spacer></v-spacer>
      <a
        target="_blank"
        href="http://www.beian.miit.gov.cn/"
        style="text-decoration: none"
      >
        <img
          src="https://s1.ax1x.com/2020/07/02/NqYHbQ.png"
          style="float: left"
        />浙ICP备2021029370号-1
      </a>
    </v-footer>
  </v-app>
</template>


<script lang="ts">
import Vue from 'vue'
import Avatar from '@/components/Avatar.vue'

export default Vue.extend({
  components: {
    Avatar,
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      title: '卓越学院学习共同体平台',
      user: this.$auth.user,
      islogin: this.$auth.loggedIn,
      rightDrawer: false,
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
  }
})
</script>
