<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="12">
      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <client-only>
              <HonorEditor v-model="content.detail"/>
            </client-only>
          </v-col>
          <v-col cols="12" md="4" class="justify-space-between">
            <v-card>
              <v-card-title>
                <span class="headline">设置</span>
              </v-card-title>

              <v-card-text>
                <v-text-field label="标题"></v-text-field>
                <v-select
                  v-model="content.type"
                  label="分类"
                  :items="types"
                  item-value="id"
                  item-text="name"
                ></v-select>
                <v-textarea label="描述"></v-textarea>
                <v-checkbox
                  v-model="couldCommit"
                  :label="`评论: ${couldCommit ? '开启' : '关闭'}`"
                ></v-checkbox>
              </v-card-text>

              <v-card-actions class="justify-space-between">
                <v-btn color="primary">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

import HonorEditor from '@/components/Editor.vue'
import {ArticleRequest} from '~/plugins'

@Component({
  components: {
    HonorEditor,
  },
  head: {
    title: '文章编辑',
  },
  asyncData({query}) {
    if (query.type) {
      return {
        content: {
          type: Number(query.type),
        },
      }
    }
  },
})
export default class extends Vue {
  content: ArticleRequest = {}
  types = [
    {
      id: 1,
      name: '通知',
    },
    {
      id: 0,
      name: '文章',
    },
  ]

  couldCommit = false
}
</script>

<style scoped>
code {
  background-color: transparent !important;
}
</style>
