<template>
  <v-row>
    <v-col cols="12">
      <v-sheet class="mx-auto mb-4" elevation="8">
        <v-data-table
          :headers="headers"
          :items="articles.content"
          class="elevation-1"
          @dblclick:row="openPost"
        >
          <template #[`item.createTime`]="{ item }">
            {{ item.createTime | formatDate }}
          </template>
          <template #[`item.state`]="{ item }">
            <v-chip v-if="item.state === 1" color="green" dark> 可见</v-chip>
            <v-chip v-else-if="item.state === 0" color="grey" dark>
              待通过
            </v-chip>
            <v-chip v-else color="orange" dark>隐藏</v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-icon
              v-if="item.state === 1"
              small
              class="mr-2"
              @click="changeState(item.id, 2)"
              >mdi-eye</v-icon
            >
            <v-icon
              v-else-if="item.state === 2"
              small
              class="mr-2"
              @click="changeState(item.id, 1)"
              >mdi-eye-off</v-icon
            >
            <v-icon small class="mr-2" @click="openEditor(item.id)">
              mdi-pencil</v-icon
            >
            <v-icon small @click="deletePost([item.id])"> mdi-delete </v-icon>
          </template>
          <template #[`item.type`]="{ item }">
            {{ item.type ? '通知' : '文章' }}
          </template>
        </v-data-table>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataTableHeader } from 'vuetify'
import { Page } from '~/src'
import { ArticleSimple } from '~/src/article'

interface Data {
  articles: Page<ArticleSimple> | null
  headers: DataTableHeader[]
}

export default Vue.extend({
  name: 'ArticleList',
  layout: 'admin',
  async asyncData({ $axios }): Promise<object | void> {
    const { data } = await $axios.get('/api/article', {
      params: {
        admin: true,
      },
    })
    const articles: Page<ArticleSimple> = data.data as Page<ArticleSimple>
    return {
      articles,
    }
  },
  data(): Data {
    return {
      articles: null,
      headers: [
        {
          text: '状态',
          value: 'state',
        },
        {
          text: '标题',
          value: 'title',
          cellClass: 'text-caption',
        },
        {
          text: '作者',
          value: 'user.name',
        },
        {
          text: '类型',
          value: 'type',
        },
        {
          text: '标签',
          value: 'tagName',
        },
        {
          text: '创建时间',
          value: 'createTime',
        },
        {
          text: '操作',
          value: 'actions',
        },
      ],
    }
  },
  methods: {
    openEditor(id: number) {
      this.$router.push({
        path: '/post/edit',
        query: {
          id: String(id),
        },
      })
    },
    openPost(_event: MouseEvent, data: any) {
      const item = data.item as ArticleSimple
      this.$router.push({
        path: `/post/${item.id}`,
      })
    },
    async changeState(id: number, state: number) {
      try {
        await this.$axios.put(`/api/article/${id}`, {
          state,
        })
        this.$toast.success('操作成功')
        this.$nuxt.refresh()
      } catch (error: any) {
        if (error.response.message) {
          this.$toast.error(error.response.message)
        } else {
          this.$toast.error('操作失败')
        }
      }
    },
    async deletePost(ids: number[]) {
      try {
        await this.$axios.delete(`/api/article/`, {
          params: {
            ids: ids.join(','),
          },
        })
        this.$toast.success('删除成功')
        this.$nuxt.refresh()
      } catch (e) {
        this.$toast.error('删除失败')
      }
    },
  },
})
</script>
