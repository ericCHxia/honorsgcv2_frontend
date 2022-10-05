<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="12">
      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <client-only>
              <HonorEditor v-model="content.detail" />
            </client-only>
          </v-col>
          <v-col cols="12" md="4" class="justify-space-between">
            <v-card>
              <v-card-title>
                <span class="headline">设置</span>
              </v-card-title>

              <v-card-text>
                <v-hover v-slot="{ hover }">
                  <v-card class="my-4 rounded-lg" :elevation="hover ? 10 : 2" @click="beginUpload">
                    <v-img class="grey lighten-2" contain aspect-ratio="1" height="250" elevation="5" :src="cover">
                    </v-img>
                  </v-card>
                </v-hover>

                <v-text-field v-model="content.title" label="标题" :rules="titleRule" :counter="$store.state.maxTitleLength">
                </v-text-field>
                <v-text-field v-model="content.limit" label="人数限制">
                  <template #append>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-icon v-on="on"> mdi-help-circle-outline</v-icon>
                      </template>
                      <span> 如果为0，则不限制人数 </span>
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-select v-model="typeId" label="共同体类型" :items="types" item-value="id" item-text="name"></v-select>
                <v-select v-model="content.registrationType" label="报名类型" :items="registrationTypes" item-value="id"
                  item-text="name">
                  <template #append>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-icon v-on="on"> mdi-help-circle-outline</v-icon>
                      </template>
                      <span>
                        "自由报名"：参与共同体不需要审批<br />
                        "审批报名"：参与共同体需要审批
                      </span>
                    </v-tooltip>
                  </template>
                </v-select>
                <v-textarea v-model="content.describe" label="描述" :rules="describeRule"
                  :counter="$store.state.maxDescriptionLength"></v-textarea>
                <v-checkbox v-model="content.needMentor" :label="`指导者: ${content.needMentor ? '需要' : '不需要'}`">
                </v-checkbox>
              </v-card-text>

              <v-card-actions class="justify-space-between">
                <v-btn color="primary" @click="submit">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import HonorEditor from '@/components/Editor.vue'
import { CommunityType, Community } from '~/src'

interface Data {
  content: Community
  typeId: number | null
  types: CommunityType[]
  registrationTypes: object
  uploadImageFile: File | null
  uploadImageBase64: string
  describeRule: ((v: string) => (string | boolean))[]
  titleRule: ((v: string) => (string | boolean))[]
}

export default Vue.extend({
  components: {
    HonorEditor
  },
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get('/api/community/type')
    const types: CommunityType[] = data.data
    if (params.id) {
      const { data } = await $axios.get(`/api/community/${params.id}`)
      const content: Community = data.data
      return {
        content,
        types,
        typeId: content.type?.id
      }
    }
    return {
      types
    }
  },
  data(): Data {
    return {
      content: {
        title: '',
        detail: '',
        type: null,
        needMentor: true,
        registrationType: 0,
        limit: 0,
        img: '',
        describe: '',
        user:{
          id: 0,
          name: '',
        }
      },
      typeId: null,
      types: [],
      registrationTypes: [
        {
          id: 0,
          name: '自由报名'
        },
        {
          id: 1,
          name: '审批报名'
        }
      ],
      describeRule: [
        v => v.length <= this.$store.state.maxDescriptionLength || `描述不能超过${this.$store.state.maxDescriptionLength}个字符`,
        v => v.trim().length > 0 || '描述不能为空'
      ],
      uploadImageFile: null,
      uploadImageBase64: '',
      titleRule: [
        v => v.length <= this.$store.state.maxTitleLength || `标题不能超过${this.$store.state.maxTitleLength}个字符`,
        v => v.trim().length > 0 || '标题不能为空'
      ]
    }
  },
  head() {
    return {
      title: '编辑共同体'
    }
  },
  computed: {
    cover(): string {
      if (this.uploadImageBase64) {
        return this.uploadImageBase64
      }
      if (this.content.img && typeof this.content.img !== 'string') {
        return this.content.img.original.url
      }
      return '/upload.svg'
    }
  },
  methods: {
    file2base64(file: File): Promise<string> {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          resolve(reader.result as string)
        }
        reader.onerror = (error) => {
          reject(error)
        }
      })
    },
    async uploadImage(file: File) {
      if (file) {
        const base64 = await this.file2base64(file)
        this.uploadImageBase64 = base64
        this.uploadImageFile = file
      }
    },
    async submit() {
      if (!this.content.title.trim()) {
        this.$toast.error('请填写标题')
        return
      }
      if (this.content.title.length > this.$store.state.maxTitleLength) {
        this.$toast.error(`标题不能超过${this.$store.state.maxTitleLength}个字符`)
        return
      }
      if (this.typeId === null || this.typeId === undefined) {
        this.$toast.error('请选择共同体类型')
        return
      }
      if (!this.content.describe.trim()) {
        this.$toast.error('请填写描述')
        return
      }
      if (this.content.describe.length > this.$store.state.maxDescriptionLength) {
        this.$toast.error('描述不能超过200个字符')
        return
      }
      if (!this.content.detail || !this.content.detail.trim()) {
        this.$toast.error('请填写详情')
        return
      }
      if (!this.content.img && !this.uploadImageFile) {
        this.$toast.error('请上传封面')
        return
      }
      try {
        if (this.uploadImageFile) {
          const data = await this.$uploadImg(this.uploadImageFile)
          this.content.img = data
          this.uploadImageFile = null
          this.uploadImageBase64 = ''
        }
      } catch (e: any) {
        if (e.response.message) {
          this.$toast.error(e.response.message)
        } else {
          this.$toast.error('上传图片失败')
        }
        return
      }

      try {
        const content = {
          ...this.content,
          typeId: this.typeId
        }
        if (content.img && typeof content.img !== 'string') {
          content.img = content.img.name
        }
        if (content.id) {
          await this.$axios.put(`/api/community/${content.id}`, content)
        } else {
          const { data } = await this.$axios.post('/api/community', content)
          this.content.id = data.data.id
        }
        this.$router.push({
          name: 'community-id',
          params: {
            id: String(this.content.id)
          }
        })
      } catch (e: any) {
        if (e.response.message) {
          this.$toast.error(e.response.message)
        } else {
          this.$toast.error('提交失败')
        }
      }
    },
    beginUpload() {
      const fileInput = document.createElement('input') as HTMLInputElement
      fileInput.accept = 'image/jpeg,image/png,image/webp'
      fileInput.type = 'file'
      fileInput.onchange = (event: any) => {
        this.uploadImage(event.target.files[0])
        document.body.removeChild(fileInput)
      }
      document.body.appendChild(fileInput)
      fileInput.click()
    }
  }
})
</script>
