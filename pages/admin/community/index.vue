<template>
  <v-row>
    <v-col cols="12">
      <v-row justify="end">
        <v-col>
          <v-text-field
            v-model="searchText"
            solo
            label="搜索"
            prepend-inner-icon="mdi-magnify"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="5" sm="4" md="3" lg="2">
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
        <v-col cols="7" sm="6" md="4" xl="2">
          <v-select
            v-model="semester"
            :items="semesters"
            item-text="text"
            item-value="value"
            label="学期"
            solo
            prepend-inner-icon="mdi-calendar"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="5" sm="3" xl="2">
          <v-select
            v-model="selectState"
            :items="states"
            item-text="text"
            item-value="value"
            label="状态"
            solo
            prepend-inner-icon="mdi-checkbox-marked-circle-outline"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="auto">
          <v-btn large nuxt :to="search">搜索</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            show-select
            :headers="headers"
            :items="currentCommunities"
            class="elevation-2"
            :options.sync="option"
            :items-per-page="10"
            :footer-props="{ itemsPerPageOptions: [10, 20] }"
            :loading="loading"
            :server-items-length="page.totalElements"
            @dblclick:row="openCommunity"
          >
            <template #[`item.createDate`]="{ item }">
              {{ item.createDate | formatDate }}
            </template>
            <template #[`item.state`]="{ item }">
              <v-chip v-if="item.state === 1" color="green" dark> 可见</v-chip>
              <v-chip v-else-if="item.state === 0" color="grey" dark>
                待通过</v-chip
              >
              <v-chip v-else color="orange" dark>隐藏</v-chip>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="openCommunityEdit(item)">
                mdi-pencil</v-icon
              >
              <v-icon small @click="deleteCommunity(item)"> mdi-delete </v-icon>
            </template>
            <template #[`item.type`]="{ item }">
              {{ item.type ? '通知' : '文章' }}
            </template>
            <template
              #[`footer.page-text`]="{ pageStart, pageStop, itemsLength }"
            >
              {{ pageStart }} - {{ pageStop }} 共 {{ itemsLength }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataOptions, DataTableHeader } from 'vuetify'
import { Location } from 'vue-router/types/router'
import { Community, CommunityType, Page } from '~/src'

interface Data {
  communities: Community[]
  page: Page<Community> | null
  headers: DataTableHeader[]
  communityDialog: boolean
  clickedItem: Community | null
  loading: boolean
  option: DataOptions
  currentCommunities: Community[]
  pageNumber: number
  semesters: {
    text: string
    value: number
  }[]
  semester: number
  selectType: number
  states: {
    text: string
    value: number | null
  }[]
  selectState: number | null
  searchText: string
  communityParam: {
    type: number | null
    state?: number
    semester: number | null
    search: string
    admin: boolean
  }
}

export default Vue.extend({
  name: 'AdminCommunity',
  layout: 'admin',
  async asyncData({ $axios, query }): Promise<object | void> {
    const typeResponse = await $axios.get('/api/community/type')
    const types: Array<CommunityType> = typeResponse.data.data
    types.unshift({
      id: -1,
      name: '全部',
    })
    const selectType = query.type ? Number(query.type) : -1
    const selectState = query.state ? Number(query.state) : null
    const searchText = query.q ? query.q : ''
    const semester = query.semester ? Number(query.semester) : -1
    const communityParam = {
      type: selectType,
      state: selectState,
      semester,
      search: searchText,
      admin: true,
    }
    if (selectState === null) {
      // @ts-ignore
      delete communityParam.state
    }
    const { data } = await $axios.get('/api/community', {
      params: {
        ...communityParam,
      },
    })
    const communities: Page<Community> = data.data as Page<Community>

    return {
      communities: communities.content,
      currentCommunities: communities.content.slice(0, 10),
      page: communities,
      types,
      selectType,
      selectState,
      searchText,
      semester,
      communityParam,
    }
  },
  data(): Data {
    return {
      communityParam: {
        admin: true,
        type: null,
        semester: null,
        search: '',
      },
      currentCommunities: [],
      communities: [],
      page: null,
      communityDialog: false,
      headers: [
        {
          text: '状态',
          value: 'state',
          sortable: false,
        },
        {
          text: '标题',
          value: 'title',
          cellClass: 'text-caption',
        },
        {
          text: '创建者',
          value: 'user.name',
        },
        {
          text: '类型',
          value: 'type.name',
        },
        {
          text: '创建时间',
          value: 'createDate',
        },
        {
          text: '操作',
          value: 'actions',
          sortable: false,
        },
      ],
      clickedItem: null,
      loading: false,
      option: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [true],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
      },
      pageNumber: 0,
      semesters: [
        {
          text: '全部',
          value: -1,
        },
        {
          text: '2021-2022 第二学期',
          value: 5,
        },
        {
          text: '2021-2022 第一学期',
          value: 4,
        },
        {
          text: '2020-2021 第二学期',
          value: 3,
        },
      ],
      semester: -1,
      selectType: -1,
      states: [
        {
          text: '全部',
          value: null,
        },
        {
          text: '可见',
          value: 1,
        },
        {
          text: '隐藏',
          value: 2,
        },
        {
          text: '待通过',
          value: 0,
        },
      ],
      selectState: null,
      searchText: '',
    }
  },
  head() {
    return {
      title: '共同体列表',
    }
  },
  computed: {
    search(): Location {
      return {
        query: {
          type: String(this.selectType),
          state: this.selectState === null ? '' : String(this.selectState),
          q: this.searchText,
          semester: String(this.semester),
        },
      }
    },
  },
  watch: {
    option: {
      async handler(val: DataOptions) {
        if (!this.page) return
        this.loading = true
        if ((val.page - 1) * val.itemsPerPage >= this.page.totalElements) {
          this.loading = false
          return
        }
        if (val.page * val.itemsPerPage >= this.communities.length) {
          this.pageNumber = this.pageNumber + 1
          const { data } = await this.$axios.get('/api/community', {
            params: {
              page: this.pageNumber,
              ...this.communityParam,
            },
          })
          this.communities = this.communities.concat(data.data.content)
        }
        this.currentCommunities = this.communities.slice(
          (val.page - 1) * val.itemsPerPage,
          val.page * val.itemsPerPage
        )
        this.loading = false
      },
      deep: true,
    },
    $route() {
      this.$nuxt.refresh()
    },
    communityParam(val: any) {
      if (val.state === null) {
        delete val.state
      }
    },
  },
  methods: {
    openCommunity(_event: MouseEvent, data: any) {
      const item = data.item as Community
      this.$router.push({
        path: `/community/${item.id}`,
      })
    },
    async deleteCommunity(community: Community) {
      try {
        await this.$axios.delete(`/api/community/${community.id}`)
        this.$nuxt.refresh()
        this.$toast.success('删除成功')
      } catch (error: any) {
        if (error.response.message) {
          this.$toast.error(error.response.message)
        } else {
          this.$toast.error('删除失败')
        }
      }
    },
    openCommunityEdit(community: Community) {
      this.$router.push({
        path: `/community/edit/${community.id}`,
      })
    },
  },
})
</script>
