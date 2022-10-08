<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col align-self="center" cols="10" class="col-md-4 col-sm-6">
        <v-card width="100%">
          <v-card-title class="headline"> 重置密码</v-card-title>
          <v-card-text>
            <honor-password-field
              v-model="newPassword"
              label="密码"
              :rules="[
                (v) => !!v || '请输入密码',
                (v) => v.length >= 6 || '密码长度不能小于6位',
              ]"
            ></honor-password-field>
            <honor-password-field
              v-model="confirmPassword"
              label="确认密码"
              :rules="[
                (v) => !!v || '请输入确认密码',
                (v) => v === newPassword || '两次密码不一致',
              ]"
            >
            </honor-password-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="submit">重置</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Md5 } from 'ts-md5'

import Vue from 'vue'
export default Vue.extend({
  name: 'Reset',
  layout: 'login',
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
    }
  },
  methods: {
    async submit() {
      if (this.newPassword !== this.confirmPassword) {
        this.$toast.error('两次密码不一致')
        return
      }
      const formdata = new FormData()
      formdata.append('newPassword', Md5.hashStr(this.newPassword).toString())
      formdata.append('oldPassword', '')
      try {
        await this.$axios.post('/api/users/password', formdata)
        this.$toast.success('密码重置成功')
        this.$router.push('/')
      } catch (e: any) {
        this.$toast.error(e.response.data.message)
      }
    },
  },
})
</script>