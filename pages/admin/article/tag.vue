<template>
  <v-row>
    <v-col cols="8">
      <v-data-table
        :headers="headers"
        :items="tags"
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
    <v-col cols="4">
      <v-card>
        <v-card-title>添加标签</v-card-title>
        <v-card-text>
          <v-text-field label="标签名" outlined></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn>添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {ArticleTag} from "~/src";

export default Vue.extend({
  name: "Tag",
  layout: "admin",
  async asyncData({$axios}): Promise<object | void> {
    const {data} = await $axios.get("/api/article/tag", {
      params: {
        admin: true
      }
    })
    const tags: ArticleTag[] = data.data as ArticleTag[]
    return {
      tags
    }
  },
  data() {
    return {
      tags: [],
      headers: [
        {
          text: "编号",
          value: "id"
        },
        {
          text: "名称",
          value: "name"
        },
        {
          text: "计数",
          value: "count"
        },
        {
          text: "操作",
          value: "actions"
        }
      ]
    }
  }
})
</script>
