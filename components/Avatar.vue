<template>
  <v-sheet color="darken-1" class="pa-4">
    <v-avatar class="mb-4" color="grey darken-1" size="64" @click="settingDialog=true">
      <v-img v-if="user.avatar.trim().length > 0" :src="`/image/200/${user.avatar}`"></v-img>
      <v-img 
        v-else
        :src="`https://sdn.geekzu.org/avatar/${user.id}?s=64&d=identicon`"
      >
      </v-img>
    </v-avatar>

    <v-file-input
      v-show="false"
      id="image_input"
      accept="image/jpeg, image/png, image/bmp, image/webp"
    ></v-file-input>
    <v-list-item class="pa-0">
      <v-list-item-content class="pa-0">
        <v-list-item-title class="font-weight-black text-h6">{{
          inputuser.name
        }}</v-list-item-title>
        <v-list-item-subtitle class="body-2">{{
          inputuser.college
        }}</v-list-item-subtitle>
        <v-list-item-subtitle>{{
          inputuser.subject | formatSubject
        }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <div class="d-flex justify-space-between mt-4">
      <v-btn color="info" @click.stop="settingDialog = true">设置</v-btn>
      <v-btn color="error" @click.stop="logout"><v-icon>mdi-exit-to-app</v-icon>退出</v-btn>
    </div>

    <!-- 用户设置 -->
    <honor-user-config v-model="settingDialog" :user="user"></honor-user-config>
    
  </v-sheet>
</template>

<script lang="ts">
import { PropType } from '@vue/composition-api'
import Vue from 'vue'
import { ImageResponse, User } from '~/src'
import UserConfig from '@/components/UserConfig.vue'

interface Data {
  settingDialog: boolean
  inputuser: User
  avatarFile: File | null
  showAvatarDialog: boolean
}

export default Vue.extend({
  name: 'Avatar',
  components: {
    HonorUserConfig: UserConfig,
  },
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
  data(): Data {
    return {
      settingDialog: false,
      inputuser: {
        name: '',
        userId: '',
        qq: '',
        college: '',
      },
      avatarFile: null,
      showAvatarDialog: false,
    }
  },
  computed: {
    role(): string {
      if (this.user.privilege === 2) return '超级管理员'
      if (this.user.privilege === 1) return '管理员'
      return '普通用户'
    },
  },
  created() {
    this.inputuser = this.user
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
    beginUpload() {
      ;(document.getElementById('image_input') as HTMLInputElement).click()
    },
    cropAvatar() {
      const image = (document.getElementById('avatar') as HTMLImageElement).src
      this.$emit('change', image)
    },
    uploadImage(file: File) {
      if (file) {
        this.avatarFile = file
      }
      const formData = new FormData()
      formData.append('image', file)
      this.$axios.post('/api/upload_image', formData).then((res) => {
        const imageResponse: ImageResponse = res.data.data
        // @ts-ignore
        this.$refs.md.$img2Url(pos, imageResponse.original.url)
      })
    },
  },
})
</script>

<style scoped>
#avatar {
  backdrop-filter: blur(5px);
}
</style>
