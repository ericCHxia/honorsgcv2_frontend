<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <!-- 文章开始 -->
      <v-sheet class="mx-auto mb-4" elevation="8">
        <v-card-title class="ml-4 text-h5 pb-0">文章</v-card-title>
        <v-slide-group show-arrows class="px-4">
          <v-slide-item
            v-for="article in articles['content']"
            :key="article['id']"
          >
            <v-card class="ma-2" width="300px">
              <honor-user-bar
                :user="article.user"
                :date="article.createTime"
                small
                simplify
              />
              <v-divider class="mx-4"></v-divider>
              <v-card-title class="subtitle-1">
                <span class="text-truncate">{{ article['title'] }}</span>
              </v-card-title>
              <v-card-text style="height: 60px">
                {{ article['describe'] }}
              </v-card-text>
              <v-card-actions class="justify-end mx-2">
                <v-btn color="primary" @click="click_post(article['id'])">
                  查看
                  <v-icon right>mdi-open-in-new</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-slide-item>
        </v-slide-group>
        <div>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="ma-4" to="/article"> 加载更多</v-btn>
          <v-btn
            color="primary"
            class="ma-4"
            :to="{
              path: '/post/edit',
              query: {
                type: '0',
              },
            }"
            nuxt
          >
            编写文章
          </v-btn>
        </div>
      </v-sheet>
      <!-- 文章结束 -->

      <!-- 通知开始 -->
      <v-sheet class="mx-auto mb-4" elevation="8">
        <v-card-title class="ml-4 text-h5 pb-0">公告</v-card-title>
        <v-slide-group show-arrows class="px-4 pb-4">
          <v-slide-item
            v-for="article in notes['content']"
            :key="article['id']"
          >
            <v-card class="ma-4" width="300px">
              <honor-user-bar
                :user="article.user"
                :date="article.createTime"
                small
                simplify
              />
              <v-divider class="mx-4"></v-divider>
              <v-card-title class="subtitle-1">
                <span class="text-truncate">{{ article['title'] }}</span>
              </v-card-title>
              <v-card-text style="height: 80px">
                {{ article['describe'] }}
              </v-card-text>
              <v-card-actions class="justify-end mx-2">
                <v-btn color="primary" @click="click_post(article['id'])">
                  查看
                  <v-icon right>mdi-open-in-new</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-slide-item>
        </v-slide-group>
        <div>
          <v-btn color="primary" class="ma-4" to="/notice"> 加载更多</v-btn>
          <v-btn
            color="primary"
            class="ma-4"
            :to="{
              path: '/post/edit',
              query: {
                type: '1',
              },
            }"
            nuxt
          >
            创建公告
          </v-btn>
        </div>
      </v-sheet>
      <!-- 通知结束 -->

      <!-- 共同体开始 -->
      <v-sheet
        v-if="communities.content.length > 0"
        class="mx-auto mb-4"
        elevation="8"
      >
        <v-card-title class="ml-4 text-h5 pb-0">共同体</v-card-title>
        <v-slide-group show-arrows class="px-4 pb-4">
          <v-slide-item
            v-for="article in communities['content']"
            :key="article['id']"
          >
            <v-card class="ma-4" width="400px">
              <v-img
                v-if="article.img"
                :lazy-src="article['img'].base64"
                :src="article['img'].original.url"
                class="mx-auto"
                height="150"
                :srcset="getSrcSet(article['img'])"
                contain
                sizes="(min-width: 1280px) 1280px"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-img
                v-else
                class="mx-auto"
                height="150"
                src="/not-found.png"
                contain
                sizes="(min-width: 1280px) 1280px"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-list-item style="height: 100px">
                <v-list-item-content>
                  <v-list-item-title class="text-h5 mb-0">
                    {{ article['title'] }}
                  </v-list-item-title>
                  <div class="text-overline mb-1 d-flex justify-space-between">
                    <div>{{ article['type']['name'] }}</div>
                    <div>
                      {{
                        article.participants +
                        '/' +
                        (article.limit ? article.limit : '无限制')
                      }}
                    </div>
                  </div>
                  <v-list-item-subtitle
                    >{{ article['describe'] }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mx-4"></v-divider>
              <v-card-actions class="justify-space-between mx-2">
                <honor-user-bar
                  :user="article.user"
                  :date="article.createDate"
                  small
                  simplify
                ></honor-user-bar>
                <v-btn color="primary" @click="click_community(article['id'])">
                  查看
                  <v-icon right>mdi-open-in-new</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-slide-item>
        </v-slide-group>
        <div>
          <v-btn color="primary" class="ma-4" to="/community"> 加载更多</v-btn>
          <v-btn color="primary" class="ma-4" to="/community/edit">
            创建共同体</v-btn
          >
        </div>
      </v-sheet>
      <!-- 共同体结束 -->
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Index',
  filters: {
    title(value: string) {
      if (!value) return ''
      if (value.length < 10) return value
      return value.substr(0, 10) + '...'
    },
  },
  async asyncData({ $axios }) {
    const res = await $axios.get('/api/users/mine')
    const articles = await $axios.get('/api/article', {
      params: {
        type: 0,
      },
    })
    const notes = await $axios.get('/api/article', {
      params: {
        type: 1,
      },
    })
    const communities = await $axios.get('/api/community')
    return {
      user: res.data.data,
      articles: articles.data.data,
      notes: notes.data.data,
      communities: communities.data.data,
    }
  },
  methods: {
    click_post(id: number) {
      this.$router.push(`/post/${id}`)
    },
    click_community(id: number) {
      this.$router.push(`/community/${id}`)
    },
  },
})
</script>
