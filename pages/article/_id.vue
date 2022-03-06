<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-text-field
        v-model="searchText"
        solo
        label="搜索"
        prepend-inner-icon="mdi-magnify"
        @keydown="search"
      ></v-text-field>
      <v-sheet class="mx-auto mb-4">
        <v-container>
          <v-row>
            <v-col
              v-for="article in articles['content']"
              :key="article['id']"
              cols="12"
            >
              <v-card class="ma-1">
                <v-card-title class="subtitle-1">
                  <span class="text-truncate">{{ article['title'] }}</span>
                </v-card-title>
                <v-card-text>
                  {{ article['describe'] }}
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-text class="d-flex flex-row">
                  <v-btn color="primary" @click="click_post(article['id'])">
                    查看
                    <v-icon right>mdi-open-in-new</v-icon>
                  </v-btn>
                  <div class="caption d-flex flex-row mx-2">
                    {{ article['user']['name'] }}<br/>
                    {{ article['createTime'] | formateDate }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <v-pagination
        v-model="page"
        :length="articles.totalPages"
        :total-visible="7"
      ></v-pagination>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  filters: {
    formateDate (val: number) {
      return new Date(val).toLocaleString()
    },
  },
  async asyncData({$axios, params, error, query}) {
    try {
      const param = {
        page: Number(params.id) - 1,
        search: query.q ? query.q : '',
        type: 0
      }
      const {data} = await $axios.get('/api/article', {
        params: param,
      })
      if (data.data.empty) {
        error({statusCode: 404, message: '没有找到相关文章'})
      }
      return {page: Number(params.id) || 1, articles: data.data}
    } catch (e: any) {
      error({statusCode: e.code})
    }
  },
  data() {
    return {
      data: null,
      searchText: this.$route.query.q,
      page: 0,
      id: 0,
    }
  },
  watch: {
    page (val) {
      this.pageChange(val)
    },
  },
  methods: {
    pageChange (page: number) {
      const link = document.createElement('a')
      if (this.searchText) {
        link.href = `/article/${page}?q=${this.searchText}`
      } else {
        link.href = `/article/${page}`
      }
      link.click()
    },
    click_post(id: number) {
      this.$router.push(`/post/${id}`)
    },
    search(k: KeyboardEvent) {
      if (k.code === 'Enter') {
        const link = document.createElement('a')
        link.href = `/article/1?q=${this.searchText}`
        link.click()
      }
    },
  },
})
</script>
