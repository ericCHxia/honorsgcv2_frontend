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
                <v-text-field v-model="content.title" label="标题"
                              :rules="titleRule" :counter="$store.state.maxTitleLength">
                ></v-text-field>
                <v-textarea v-model="content.describe" label="描述" :counter="$store.state.maxDescriptionLength" :rules="describeRules"></v-textarea>
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
import {ArticleRequest, ArticleTag} from '~/src/article'

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
          title: '',
          describe: '',
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
  async save(){
    let content:any
    // TODO: 设置前端校验
    try {
      if (this.content.id) {
        const {data} = await this.$axios.put("/api/article/"+this.content.id, this.content)
        content = data.data
      } else {
        const {data} = await this.$axios.post("/api/article", this.content)
        content = data.data
      }
      this.$toast.success("保存成功")
      this.$router.push({path: `/post/${content.articleId}`})
    }catch(e:any){
      if(e.response.data.message){
        this.$toast.error(e.response.data.message)
      }else{
        this.$toast.error("保存失败")
      }
    }
  }

  couldCommit = false

  get describeRules() {
    return [
      (v: string) => !!v.trim() || '描述不能为空',
      (v: string) => v.length <= this.$store.state.maxDescriptionLength || `描述不能超过${this.$store.state.maxDescriptionLength}个字符`,
    ]
  }

  get titleRule() {
    return [
      (v: string) => !!v.trim() || '标题不能为空',
      (v: string) => v.length <= this.$store.state.maxTitleLength || `标题不能超过${this.$store.state.maxTitleLength}个字符`,
    ]
  }
}
</script>

<style scoped>
code {
  background-color: transparent !important;
}
</style>
