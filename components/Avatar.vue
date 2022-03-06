<template>
  <v-sheet color="grey lighten-4" class="pa-4">
    <v-avatar class="mb-4" color="grey darken-1" size="64"></v-avatar>
    <div>{{ inputuser.name }}</div>
    <div>{{ inputuser.userId }}</div>
    <div class="d-flex justify-space-between mt-4">
      <v-btn @click.stop="settingDialog = true">设置</v-btn>
      <v-btn @click.stop="logout">退出</v-btn>
    </div>

    <!-- 用户设置 -->
    <v-dialog v-model="settingDialog" width="450">
      <v-card>
        <v-card-title>用户设置</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="inputuser.name"
                label="用户名"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="inputuser.userId"
                label="学号"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="inputuser.classId"
                label="班级"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="inputuser.college"
                label="学院"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="inputuser.qq"
                label="QQ"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="role"
                label="身份"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="changePasswordDialog = true">
            修改密码
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="settingDialog = false">
            取消
          </v-btn>
          <v-btn color="primary" @click="settingDialog = false"> 确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 修改密码 -->
    <v-dialog v-model="changePasswordDialog" width="450">
      <v-card>
        <v-card-title>修改密码</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="oldPassword"
            label="旧密码"
            type="password"
          ></v-text-field>
          <v-text-field
            v-model="newPassword"
            label="新密码"
            :rules="[
              v => !!v || '请输入新密码',
              v => v.length >= 6 || '密码长度不能小于6位'
            ]"
            type="password"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="确认新密码"
            :rules="[
              v => !!v || '请输入确认密码',
              v => v === newPassword || '两次密码不一致'
            ]"
            type="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" text @click="changePasswordDialog = false">
            取消
          </v-btn>
          <v-btn color="primary" @click="changePasswordDialog = false">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script lang="ts">
import { PropType } from '@vue/composition-api';
import Vue from 'vue'
import {User} from "~/plugins";

export default Vue.extend({
  name: 'Avatar',
  model: {
    prop: 'user',
    event: 'change',
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  data() {
    return {
      settingDialog: false,
      inputuser: {
        name: '',
        userId: '',
        qq: '',
        college: '',
      },
      changePasswordDialog: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  },
  computed: {
    role(): string {
      if (this.user.privilege === 2) return '超级管理员'
      if (this.user.privilege === 1) return '管理员'
      return '普通用户'
    }
  },
  created() {
    this.inputuser = this.user
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
})
</script>
