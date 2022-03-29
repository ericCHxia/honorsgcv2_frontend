<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <!-- 搜索框 -->
      <v-row class="mb-0" justify="end">
        <v-col>
          <v-text-field
            v-model="searchText"
            solo
            label="搜索"
            prepend-inner-icon="mdi-magnify"
            hide-details
            @keydown="keydown"
          ></v-text-field>
        </v-col>
        <v-col cols="4" sm="3" md="2">
          <v-select
            v-model="selectUser"
            :items="selectUserItems"
            item-value="id"
            item-text="name"
            solo
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="5" sm="4" md="3">
          <v-select
            v-model="selectType"
            :items="types"
            item-text="name"
            item-value="id"
            label="类型"
            solo
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="auto">
          <v-btn large nuxt :to="search" color="primary">搜索 </v-btn>
        </v-col>
      </v-row>
      <!-- 列表 -->
      <v-sheet class="mx-auto mb-4">
        <v-container>
          <v-row
            v-infinite-scroll="loadMore"
            dense
            :infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
            :infinite-scroll-threshold="500"
          >
            <client-only>
              <v-col
                v-for="community in communities"
                :key="community.id"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card class="mx-auto" outlined>
                  <v-img
                    v-if="community.img"
                    :lazy-src="community.img.base64"
                    :src="community.img.original.url"
                    :srcset="getSrcSet(community.img)"
                    height="250"
                    gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.3)"
                    class="white--text align-end"
                  >
                    <v-card-title class="text-h5 text-truncate community-title">
                      {{ community.title }}
                    </v-card-title>
                  </v-img>
                  <v-img
                    v-else
                    height="250"
                    gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.3)"
                    class="white--text align-end"
                    src="/not-found.png"
                  >
                    <v-card-title class="text-h5 text-truncate community-title">
                      {{ community.title }}
                    </v-card-title>
                  </v-img>

                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="text-overline mb-4">
                        {{ community.type.name }}
                      </div>
                      <v-list-item-subtitle>
                        {{ community.describe }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <honor-user-bar
                    :user="community.user"
                    small
                    :date="community.createDate"
                  >
                    <template #tail>
                      <v-btn
                        outlined
                        rounded
                        text
                        :to="{
                          name: 'community-id',
                          params: { id: community.id }
                        }"
                        color="secondary"
                        >浏览
                      </v-btn>
                    </template>
                  </honor-user-bar>
                </v-card>
              </v-col>
            </client-only>
            <v-col v-show="!bottom">
              <v-skeleton-loader
                max-width="500"
                type="card"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-container>
        <div v-show="bottom" class="text-center mx-auto">已经到底部了哦</div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Location } from 'vue-router/types/router'
import { CommunityType, Page, Community, ImageResponse } from '~/src'

declare type Data = {
  selectType: number
  page: number
  totalPages: number
  searchText: string
  communities: Community[]
  loading: boolean
  bottom: boolean
  selectUserItems: {
    id: number
    name: string
  }[]
  selectUser: number
}

export default Vue.extend({
  filters: {
    titleFilter(value: string) {
      if (value.length > 12) {
        return value.substr(0, 12) + '...'
      } else {
        return value
      }
    }
  },
  async asyncData({ $axios, query, app }) {
    const typeResponse = await $axios.get('/api/community/type')
    const types: Array<CommunityType> = typeResponse.data.data
    types.unshift({
      id: -1,
      name: '全部'
    })
    const selectType = query.type ? Number(query.type) : -1
    const selectUser = query.user ? Number(query.user) : -1
    const params: any = {
      page: 0,
      type: selectType,
      search: query.q
    }
    if (selectUser === 2) {
      if (app.$auth.user) params.mentor = app.$auth.user.id
    }
    if (selectUser === 0) {
      if (app.$auth.user) params.user = app.$auth.user.id
    }
    if (selectUser === 1) {
      if (app.$auth.user) params.participant = app.$auth.user.id
    }
    const communitiesResponse = await $axios.get('/api/community', {
      params
    })
    const communities: Page<Community> = communitiesResponse.data.data
    return {
      searchText: query.q,
      selectType,
      types,
      selectUser,
      communities: communities.content,
      totalPages: communities.totalPages
    }
  },
  data(): Data {
    return {
      selectType: -1,
      page: 0,
      totalPages: 0,
      communities: [],
      loading: false,
      bottom: false,
      searchText: '',
      selectUserItems: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 0,
          name: '我创建'
        },
        {
          id: 1,
          name: '我参与'
        },
        {
          id: 2,
          name: '我指导'
        }
      ],
      selectUser: -1
    }
  },
  computed: {
    search(): Location {
      return {
        path: '/community',
        query: {
          q: this.searchText,
          type: String(this.selectType),
          user: String(this.selectUser)
        }
      }
    },
    params(): any {
      const data: any = {
        page: this.page,
        q: this.searchText,
        type: String(this.selectType)
      }
      if (this.selectUser === 2) {
        if (this.$auth.user) data.mentor = this.$auth.user.id
      }
      if (this.selectUser === 0) {
        if (this.$auth.user) data.user = this.$auth.user.id
      }
      if (this.selectUser === 1) {
        if (this.$auth.user) data.participant = this.$auth.user.id
      }
      return data
    }
  },
  watch: {
    $route() {
      this.$router.go(0)
    }
  },
  methods: {
    loadMore() {
      this.loading = true
      if (this.page + 1 >= this.totalPages) {
        this.bottom = true
        this.loading = false
        return
      }
      setTimeout(async () => {
        this.page++
        const { data } = await this.$axios.get('/api/community', {
          params: this.params
        })
        const page: Page<Community> = data.data
        if (page.last) {
          this.bottom = true
        }
        this.communities = this.communities.concat(page.content)
        this.loading = false
      }, 1000)
    },
    getSrcSet(imgData: ImageResponse) {
      let srcSet = ''
      for (const img of imgData.srcset) {
        srcSet += `${img.url} ${img.width}w,\n`
      }
      srcSet = srcSet.substr(0, srcSet.length - 2)
      return srcSet
    },
    keydown(key: KeyboardEvent) {
      if (key.code === 'Enter') {
        this.$router.push(this.search)
      }
    }
  }
})
</script>

<style scoped>
.community-title {
  display: block;
}
</style>
