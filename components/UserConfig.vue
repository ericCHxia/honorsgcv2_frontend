<template>
  <v-dialog v-model="inputValue" width="450">
    <v-card>
      <v-card-title>用户设置</v-card-title>
      <v-card-text>
        <v-row class="flex-child">
          <v-col cols="6">
            <clipper-upload v-model="imgFile">
              <v-avatar class="mb-4" color="blue-grey lighten-4" size="125">
                <v-img
                  id="avatar"
                  :src="avatar"
                  class="alige-center"
                >
                </v-img>
              </v-avatar>
            </clipper-upload>

            <v-dialog v-model="showAvatarDialog" width="500px" persistent>
              <v-card>
                <v-card-title>头像剪裁</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      ><clipper-basic
                        ref="clipper"
                        :src="imgDataUrl"
                        :ratio="1"
                        preview="fixed-preview"
                      ></clipper-basic
                    ></v-col>
                    <v-col>
                      <v-row justify="start">
                        <v-col
                          ><clipper-preview
                            name="fixed-preview"
                            class="preview large-preview"
                          ></clipper-preview
                        ></v-col>
                        <v-col>
                          <clipper-preview
                            name="fixed-preview"
                            class="preview small-preview"
                          ></clipper-preview>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn color="primary" text @click="showAvatarDialog = false"
                    >取消</v-btn
                  >
                  <v-btn color="primary" @click="handleUpload"> 完成 </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-text-field
              v-model="inputuser.classId"
              label="班级"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="inputuser.phone"
              label="手机号"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="inputuser.name"
              label="用户名"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="inputuser.userId"
              label="学号"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="inputuser.college"
              label="学院"
              readonly
            ></v-text-field>
            <v-text-field v-model="role" label="身份" readonly></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="changePasswordDialog = true">
          修改密码
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="inputValue = false"> 取消 </v-btn>
        <v-btn color="primary" @click="inputValue = false"> 确定</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="changePasswordDialog" width="450">
      <v-card>
        <v-card-title>修改密码</v-card-title>
        <v-card-text>
          <honor-password-field
            v-model="oldPassword"
            label="旧密码"
          ></honor-password-field>
          <honor-password-field
            v-model="newPassword"
            label="新密码"
            :rules="[
              (v) => !!v || '请输入新密码',
              (v) => !!v&&v.length >= 6 || '密码长度不能小于6位',
            ]"
          ></honor-password-field>
          <honor-password-field
            v-model="confirmPassword"
            label="确认新密码"
            :rules="[
              (v) => !!v || '请输入确认密码',
              (v) => v === newPassword || '两次密码不一致',
            ]"
          ></honor-password-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" text @click="changePasswordDialog = false">
            取消
          </v-btn>
          <v-btn color="primary" @click="changePassword"> 确定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script lang="ts">
import { PropType } from '@vue/composition-api'
import Vue from 'vue'
import { Md5 } from 'ts-md5'
import { identicon } from 'minidenticons'
import { ImageResponse, User } from '~/src'

interface Data {
  inputuser: User
  inputValue: boolean
  showAvatarDialog: boolean
  imgDataUrl: string | Blob
  imgData: string
  imgFile: Blob | null
  oldPassword: string
  newPassword: string
  confirmPassword: string
  changePasswordDialog: boolean
}
export default Vue.extend({
  name: 'UserConfig',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data(): Data {
    return {
      inputuser: this.user,
      showAvatarDialog: false,
      inputValue: this.value,
      imgDataUrl: '',
      imgData: '',
      imgFile: null,
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
    },
    avatar(): string {
      if (this.inputuser.avatar.trim().length > 0) {
        return `/image/50/${this.inputuser.avatar}`
      } else {
        const data = identicon(String(this.inputuser.id))
        const out = 'data:image/svg+xml;utf8,' + encodeURIComponent(data);
        return out
      }
    }
  },
  watch: {
    inputValue(value: boolean) {
      this.$emit('input', value)
    },
    value(value: boolean) {
      this.inputValue = value
    },
    imgFile(value: Blob | null) {
      if (value) {
        this.imgDataUrl = value
        this.showAvatarDialog = true
      }
    },
  },
  methods: {
    canvasToFile(canvas: HTMLCanvasElement) {
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob: Blob | null) => {
            resolve(blob)
          },
          'image/jpeg',
          0.8
        )
      })
    },
    async handleUpload() {
      // @ts-ignore
      const canvas: HTMLCanvasElement = this.$refs.clipper.clip()
      const img = await this.canvasToFile(canvas)
      try {
        const formdata = new FormData()
        formdata.append('image', img as Blob, 'avatar.jpg')
        const imgRes = await this.$axios.post('/api/upload_image', formdata)
        const image: ImageResponse = imgRes.data.data
        const formdata2 = new FormData()
        formdata2.append('avatar', image.name)
        await this.$axios.post('/api/users/avatar', formdata2)
        this.$toast.success('上传成功')
        this.showAvatarDialog = false
        await this.$auth.fetchUser()
        this.$router.go(0)
      } catch (e: any) {
        if (e.response.data.message) {
          this.$toast.error(e.response.data.message)
        } else {
          this.$toast.error('上传失败')
        }
        this.showAvatarDialog = false
      }
    },
    async changePassword() {
      try {
        const formdata = new FormData()
        formdata.set('oldPassword ', Md5.hashStr(this.oldPassword))
        formdata.set('newPassword ', Md5.hashStr(this.newPassword))
        await this.$axios.post('/api/users/password', formdata)
        this.$toast.success('修改成功', {
          onComplete: () => {
            this.$auth.logout()
          },
        })
        this.changePasswordDialog = false
      } catch (e: any) {
        if (e.response.data && e.response.data.message) {
          this.$toast.error(e.response.data.message)
        } else {
          this.$toast.error('修改失败')
        }
        this.changePasswordDialog = false
      }
    },
  },
})
</script>

<style scoped>
.preview {
  border: thin solid rgba(0, 0, 0, 0.12);
}
.large-preview {
  width: 100px;
  height: 100px;
}
.small-preview {
  width: 50px;
  height: 50px;
}
</style>