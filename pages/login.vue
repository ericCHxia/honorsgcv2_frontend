<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col align-self="center" cols="10" class="col-md-4 col-sm-6">
        <v-card width="100%">
          <v-card-title class="headline"> 登录</v-card-title>
          <v-card-text>
            <v-text-field v-model="login.username" label="学号" :rules="[(v) => !!v || '请输入学号']"></v-text-field>
            <honor-password-field v-model="login.password" label="密码" :rules="[(v) => !!v || '请输入密码']"
              @keyup.enter="userLogin"></honor-password-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="userLogin">登录</v-btn>
            <!-- <v-spacer></v-spacer>
            <v-btn color="primary" text :href="hduHelper"
              >使用杭电助手登录</v-btn
            > -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Md5 } from 'ts-md5'
import Component from 'vue-class-component';
import HonorPasswordField from '~/components/HonorPasswordField.vue'


@Component({
  name: 'Login',
  layout: 'login',
  components: {
    HonorPasswordField
  },
  async asyncData({ app, query, redirect, $axios }) {
    if (app.$auth.loggedIn) {
      redirect("/");
    }
    if (query.token) {
      await app.$auth.setUserToken(String(query.token));
      await app.$auth.fetchUser();
      redirect("/");
    }
    if (query.code) {
      const { data } = await $axios.get("/api/hduhelper", {
        params: {
          code: query.code,
        },
      });
      await app.$auth.setUserToken(String(data.data.token));
      await app.$auth.fetchUser();
      if (app.$auth.user && !app.$auth.user.accountNonLocked) {
        redirect("/reset");
      }
      else {
        redirect("/");
      }
    }
  },
})
export default class extends Vue {
  login = {
    username: "",
    password: "",
  }

  get hduHelper(): string {
    return this.$axios.getUri({
      method: "get",
      url: "https://api.hduhelp.com/oauth/authorize",
      params: {
        response_type: "code",
        redirect_uri: "https://hduhonorsgc.cn/login",
        client_id: "z0AqyOFYkAL2jQ7h",
        state: "33554432",
      },
    });
  }

  userLogin() {
    const data = {
      username: this.login.username,
      password: Md5.hashStr(this.login.password),
    };
    this.$auth.loginWith("local", { data }).catch((error) => {
      const response = error.response.data;
      if (response.code === 1000) {
        this.$toast.error("用户名或密码错误");
      }
      else {
        this.$toast.error(response.message);
      }
    });
  }
}
</script>
