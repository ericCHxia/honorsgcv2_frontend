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
                <v-text-field v-model="content.title" label="标题"></v-text-field>
                <v-textarea v-model="content.describe" label="描述"></v-textarea>
                <v-select
                  v-model="content.type"
                  label="分类"
                  :items="types"
                  item-value="id"
                  item-text="name"
                ></v-select>
                <v-select
                  v-model="content.tag"
                  label="标签"
                  :items="tags"
                  item-value="id"
                  item-text="name"
                  ></v-select>
                <v-checkbox
                  v-model="content.haveComment"
                  :label="`评论: ${content.haveComment ? '开启' : '关闭'}`"
                ></v-checkbox>
              </v-card-text>

              <v-card-actions class="justify-space-between">
                <v-btn color="primary" @click="save">保存</v-btn>
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

import HonorEditor from '~/components/Editor.vue'
import {ArticleRequest, ArticleTag} from '~/src'

@Component({
  components: {
    HonorEditor,
  },
  head: {
    title: '文章编辑',
  },
  async asyncData({query,$axios}) {
    const {data} = await $axios.get("/api/article/tag")
    const tags:ArticleTag[] = data.data
    if (query.id) {
      const {data} = await $axios.get("/api/article/"+query.id)
      const community = data.data
      return {
        content: {
          id: community.id,
          title: community.title,
          describe: community.describe,
          detail: community.detail,
          type: community.type,
          haveComment: community.haveComment,
          tag:community.tag.id
        },
        tags
      }
    }
    if (query.type) {
      return {
        tags,
        content: {
          type: Number(query.type),
          haveComment: true
        },
      }
    }
    return {
      tags
    }
  },
})
export default class extends Vue {
  content: ArticleRequest = {haveComment: true}
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

  tags:ArticleTag[] = []
  save(){
    this.$axios.post("/api/article",this.content).then(res=>{
      this.$router.push("/post/"+res.data.data.articleId)
    }).catch(reason => {
      console.log(reason)
    })
  }

  couldCommit = false
}
</script>

<style scoped>
code {
  background-color: transparent !important;
}
</style>
