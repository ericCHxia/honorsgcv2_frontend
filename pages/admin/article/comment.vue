<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-data-table :headers="headers" :items="comments" class="elevation-1" @dblclick:row="openComment">
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2"> mdi-pencil</v-icon>
          <v-icon small @click="deleteComment([item])"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataTableHeader } from 'vuetify'
import { ArticleComment } from '~/src/article'

interface Data {
  comments: ArticleComment[]
  headers: DataTableHeader[]
}

export default Vue.extend({
  name: 'Comment',
  layout: 'admin',
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/article/cmt')
    const comments: ArticleComment[] = data.data as ArticleComment[]
    return {
      comments,
    }
  },
  data(): Data {
    return {
      headers: [
        {
          text: '标题',
          value: 'article.title',
        },
        {
          text: '用户',
          value: 'user.name',
        },
        {
          text: '内容',
          value: 'detail',
        },
        {
          text: '操作',
          value: 'actions',
        },
      ],
      comments: [],
    }
  },
  methods: {
    async deleteComment(comments: ArticleComment[]) {
      try {
        await this.$axios.delete(`/api/article/cmt`,{
          params: {
            ids: comments.map(cmt => cmt.id).join(','),
          },
        })
        this.comments = this.comments.filter(cmt => !comments.includes(cmt))
        this.$toast.success('删除成功')
      } catch (e: any) {
        if (e.response && e.response.data.message) {
          this.$toast.error(e.response.data.message)
        } else {
          this.$toast.error('未知错误')
        }
      }
    },
    openComment(_event: MouseEvent, data: any) {
      const comment:ArticleComment = data.item
      this.$router.push({
        path: `/post/${comment.article.id}#comment_${comment.id}`,
      })
    },
  },
})
</script>
