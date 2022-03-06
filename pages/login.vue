<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col align-self="center" cols="10" class="col-md-4 col-sm-6">
        <v-card width="100%">
          <v-card-title class="headline"> 登录</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="login.username"
              label="用户名"
              :rules="[(v) => !!v || '请输入用户名']"
            ></v-text-field>
            <v-text-field
              v-model="login.password"
              label="密码"
              :rules="[(v) => !!v || '请输入密码']"
              type="password"
              :error="is_error"
              :error-messages="error_messages"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="userLogin">登录</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text>使用杭电助手登录</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Md5} from "ts-md5"

export default Vue.extend({
  name: 'Login',
  layout: 'login',
  data() {
    return {
      login: {
        username: '19051131',
        password: 'Xch...12369',
      },
      error_messages: "",
      is_error: false,
    }
  },
  methods: {
    async userLogin() {
      try {
        const data = {
          username: this.login.username,
          password: Md5.hashStr(this.login.password),
        }
        await this.$auth.loginWith('local', {data}).catch(error => {
          const response = error.response.data;
          if (response.code === 1000) {
            this.error_messages = "用户名或密码错误";
          } else {
            this.error_messages = response.message;
          }
          this.is_error = true;
        })
      } catch (error) {
      }
    },
  },
})
</script>
