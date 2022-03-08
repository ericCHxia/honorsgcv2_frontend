<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="comments"
        class="elevation-1"
      >
        <template #[`item.actions`]="">
          <v-icon small class="mr-2"> mdi-pencil</v-icon>
          <v-icon small >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import {ArticleComment} from "~/src";

export default Vue.extend({
  name: "Comment",
  layout: "admin",
  async asyncData({$axios}) {
    const {data} = await $axios.get("/api/article/cmt")
    const comments: ArticleComment[] = data.data as ArticleComment[];
    return {
      comments
    }
  },
  data() {
    return {
      headers: [
        {
          text: "标题",
          value: "article.title"
        },
        {
          text: "用户",
          value: "user.name"
        },
        {
          text: "内容",
          value: "detail"
        },
        {
          text: "操作",
          value: "actions"
        }
      ],
      comments: []
    }
  }
})
</script>
