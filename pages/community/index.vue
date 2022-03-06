<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <!-- 搜索框 -->
      <v-container>
        <v-row>
          <v-col cols="7" md="9"
          >
            <v-text-field
              solo
              label="搜索"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field
            >
          </v-col>
          <v-col cols="5" md="3">
            <v-select
              v-model="selectType"
              :items="types"
              item-text="name"
              item-value="id"
              label="类型"
              solo
            ></v-select>
          </v-col>
        </v-row>
      </v-container>

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
              <v-col v-for="community in communities" :key="community.id" cols="12" md="6" lg="4">
                <v-card class="mx-auto" outlined>
                  <v-img
                    :lazy-src="community.img.base64"
                    :src="community.img.original.url"
                    :srcset="getSrcSet(community.img)"
                    height="250"
                    gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.3)"
                    class="white--text align-end"
                  >
                    <v-card-title class="text-h5 mb-1">
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
                  <v-card-actions>
                    <v-btn
                      outlined
                      rounded
                      text
                      :to="{
                        name: 'community-id',
                        params: { id: community.id },
                      }"
                    >参与
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </client-only>
            <v-col v-show="!bottom"
            >
              <v-skeleton-loader
                max-width="500"
                type="card"
              ></v-skeleton-loader
              >
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
import {CommunityType, Page, Community, ImageResponse} from '~/plugins'

declare type Data = {
  selectType: number,
  page: number,
  totalPages: number,
  communities: Community[],
  loading: boolean,
  bottom: boolean,
};

export default Vue.extend({
  filters: {
    titleFilter(value: string) {
      if (value.length > 12) {
        return value.substr(0, 12) + '...'
      } else {
        return value
      }
    },
  },
  async asyncData({$axios}) {
    const typeResponse = await $axios.get('/api/community/type')
    const types: Array<CommunityType> = typeResponse.data.data
    types.unshift({
      id: -1,
      name: '全部',
    })

    const communitiesResponse = await $axios.get('/api/community', {
      params: {
        page: 0,
        type: -1,
      },
    })
    const communities: Page<Community> = communitiesResponse.data.data
    return {
      types,
      communities: communities.content,
      totalPages: communities.totalPages,
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
        const {data} = await this.$axios.get('/api/community', {
          params: {
            page: this.page,
            type: this.selectType,
          },
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
  },
})
</script>
