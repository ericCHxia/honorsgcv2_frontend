<template>
  <v-row>
    <v-col cols="12">
      <v-sheet class="mx-auto mb-4" elevation="8">
        <v-data-table
          :headers="headers"
          :items="articles.content"
          class="elevation-1"
        >
          <template #[`item.createTime`]="{item}">
            {{ item.createTime|formatDate }}
          </template>
          <template #[`item.state`]="{ item }">
            <v-chip v-if="item.state===1" color="green" dark> 可见</v-chip>
            <v-chip v-else-if="item.state===0" color="grey" dark> 待通过</v-chip>
            <v-chip v-else color="orange" dark>隐藏</v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <nuxt-link :to="{
              path:'/post/edit',
              query:{
                id:item.id
              }
            }">
              <v-icon small class="mr-2"> mdi-pencil</v-icon>
            </nuxt-link>

            <v-icon small>
              mdi-delete
            </v-icon>
          </template>
          <template #[`item.type`]="{item}">
            {{ item.type ? '通知' : '文章' }}
          </template>
        </v-data-table>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {DataTableHeader} from 'vuetify';
import {ArticleSimple, Page} from "~/src";

interface Data {
  articles: Page<ArticleSimple> | null
  headers: DataTableHeader[]
}

export default Vue.extend({
  name: "ArticleList",
  filters: {
    formatDate(value: number) {
      if (!value) return ''
      return new Date(value).toLocaleString()
    }
  },
  layout: 'admin',
  async asyncData({$axios}): Promise<object | void> {
    const {data} = await $axios.get('/api/article', {
      params: {
        admin: true
      }
    })
    const articles: Page<ArticleSimple> = data.data as Page<ArticleSimple>;
    return {
      articles
    }
  },
  data(): Data {
    return {
      articles: null,
      headers: [
        {
          text: '状态',
          value: 'state'
        },
        {
          text: '标题',
          value: 'title',
          cellClass: 'text-caption'
        },
        {
          text: '作者',
          value: 'user.name'
        },
        {
          text: '类型',
          value: 'type'
        },
        {
          text: '标签',
          value: 'tagName'
        },
        {
          text: '创建时间',
          value: 'createTime'
        },
        {
          text: '操作',
          value: 'actions'
        }
      ]
    }
  }
})
</script>
