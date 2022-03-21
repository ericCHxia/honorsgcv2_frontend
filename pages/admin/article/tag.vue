<template>
  <v-row>
    <v-col cols="12" sm="4" order-sm="1">
      <v-card>
        <v-card-title>添加标签</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="tagName"
            label="标签名"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="addTag">添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="8" order-sm="0">
      <v-data-table :headers="headers" :items="tags" class="elevation-1">
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2"> mdi-pencil</v-icon>
          <v-icon small @click="deleteTag(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataTableHeader } from 'vuetify'
import { ArticleTag } from '~/src/article'

interface Data {
  tags: ArticleTag[]
  tagName: string
  headers: DataTableHeader[]
}

export default Vue.extend({
  name: 'Tag',
  layout: 'admin',
  async asyncData({ $axios }): Promise<object | void> {
    const { data } = await $axios.get('/api/article/tag', {
      params: {
        admin: true
      }
    })
    const tags: ArticleTag[] = data.data as ArticleTag[]
    return {
      tags
    }
  },
  data(): Data {
    return {
      tags: [],
      headers: [
        {
          text: '编号',
          value: 'id'
        },
        {
          text: '名称',
          value: 'name'
        },
        {
          text: '计数',
          value: 'count'
        },
        {
          text: '操作',
          value: 'actions'
        }
      ],
      tagName: ''
    }
  },
  methods: {
    async addTag() {
      try {
        const formData = new FormData()
        formData.append('name', this.tagName)
        await this.$axios.post('/api/article/tag', formData)
        this.$toast.success('添加成功')
        this.$nuxt.refresh()
        this.tagName = ''
      } catch (e: any) {
        if (e.response.data.message) {
          this.$toast.error(e.response.data.message)
        } else {
          this.$toast.error('添加失败')
        }
      }
    },
    async deleteTag(tag: ArticleTag) {
      try {
        await this.$axios.delete(`/api/article/tag/${tag.id}`)
        this.$toast.success('删除成功')
        this.$nuxt.refresh()
      } catch (e: any) {
        if (e.response.data.message) {
          this.$toast.error(e.response.data.message)
        } else {
          this.$toast.error('删除失败')
        }
      }
    }
  }
})
</script>
