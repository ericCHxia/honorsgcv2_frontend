<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card>
        <honor-user-bar :user="article.user" :date="article.createTime">
          <template v-if="isAdmin()||article.user.id==$auth.user.id" #tail>
            <v-menu bottom left>
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item v-if="isAdmin()&&article.state === 0" @click="changeState(1)">
                  <v-list-item-title>通过审批</v-list-item-title>
                </v-list-item>
                <v-list-item :to="`/post/edit?id=${article.id}`">
                  <v-list-item-title>编辑</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteArticle">
                  <v-list-item-title>删除</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </honor-user-bar>
        <v-divider></v-divider>
        <v-card-title class="headline">
          {{ article.title }}
        </v-card-title>
        <div
          class="markdown-view github-markdown-body px-4 pt-0 pb-2"
          v-html="$md.render(article.detail)"
        ></div>
      </v-card>
    </v-col>
    <v-col v-if="article.haveComment" cols="12">
      <v-card>
        <v-card-title>评论</v-card-title>
        <v-card flat class="py-2">
          <honor-user-bar :user="$auth.user"></honor-user-bar>
          <v-card-text class="body-1">
            <v-textarea
              v-model="comment"
              auto-grow
              outlined
              rows="2"
              hide-details
            ></v-textarea>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn @click="submitComment">提交</v-btn>
          </v-card-actions>
        </v-card>
        <template v-if="comments.length > 0">
          <template v-for="(item, index) in comments">
            <v-divider :key="index"></v-divider>
            <v-card :id="`comment_${item.id}`" :key="item.id" flat class="py-2">
              <honor-user-bar :user="item.user" :date="item.createTime">
                <template v-if="isAdmin()||item.user.id===$auth.user.id||article.user.id==$auth.user.id" #tail>
                  <v-menu bottom left>
                    <template #activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item link @click="deleteComment(item.id)">
                        <v-list-item-title>删除</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </honor-user-bar>
              <v-card-text class="body-1">
                {{ item.detail }}
              </v-card-text>
            </v-card>
          </template>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Article, ArticleComment } from '~/src/article'

interface Data {
  fab: boolean
  article: Article | null
  comments: ArticleComment[] | null
  comment: string
}

export default Vue.extend({
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({ $axios, params, error }) {
    try {
      const { data } = await $axios.get(`/api/article/${params.id}`)
      const article: Article = data.data as Article
      if (article.haveComment) {
        const { data } = await $axios.get(`/api/article/cmt/${params.id}`)
        const comments: ArticleComment[] = data.data as ArticleComment[]
        return {
          article,
          comments,
        }
      }
      return { article }
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        error({ statusCode: 404, message: 'Page not found' })
      }
    }
  },
  data(): Data {
    return {
      fab: false,
      comments: null,
      article: null,
      comment: '',
    }
  },
  mounted() {
    this.$prism.highlightAll()
  },
  methods: {
    submitComment() {
      if (this.article && this.article.id) {
        const formData = new FormData()
        formData.append('id', String(this.article.id))
        formData.append('detail', this.comment)
        this.$axios
          .post(`/api/article/cmt`, formData)
          .then(() => {
            this.comment = ''
            this.$toast.success('评论成功', {
              duration: 1000,
            })
            if (this.article && this.article.id) {
              this.$axios
                .get(`/api/article/cmt/${this.article.id}`)
                .then(({ data }) => {
                  this.comments = data.data as ArticleComment[]
                })
                .catch(() => {
                  this.$toast.error('刷新评论失败', {
                    duration: 1000,
                  })
                })
            }
          })
          .catch(() => {
            this.$toast.error('评论失败', {
              duration: 1000,
            })
          })
      }
    },
    deleteComment(id: number) {
      this.$axios
        .delete(`/api/article/cmt`, {
          params: {
            ids: id,
          },
        })
        .then(() => {
          this.$toast.success('删除成功', {
            duration: 1000,
          })
          if (this.comments) {
            this.comments = this.comments.filter((item) => item.id !== id)
          }
        })
        .catch(() => {
          this.$toast.error('删除失败', {
            duration: 1000,
          })
        })
    },
    deleteArticle() {
      if (this.article && this.article.id) {
        this.$axios
          .delete(`/api/article`, {
            params: {
              ids: this.article.id,
            },
          })
          .then(() => {
            this.$toast.success('删除成功', {
              duration: 1000,
            })
            this.$router.push('/')
          })
          .catch(() => {
            this.$toast.error('删除失败', {
              duration: 1000,
            })
          })
      }
    },
    async changeState(state: number) {
      if (this.article && this.article.id) {
        try {
          await this.$axios.put(`/api/article/${this.article.id}`, {
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
      }
    },
  },
})
</script>

<style>
code {
  background-color: transparent !important;
}

.markdown-view {
  line-height: normal !important;
}
</style>
