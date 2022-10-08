<template>
  <v-row>
    <v-col cols="12">
      <v-row justify="end">
        <v-col>
          <v-text-field v-model="searchText" solo label="搜索" prepend-inner-icon="mdi-magnify" hide-details
            @keyup.enter="search">
          </v-text-field>
        </v-col>
        <v-col cols="5" sm="4" md="3" lg="2">
          <v-select v-model="selectType" :items="types" item-text="name" item-value="id" label="类型" solo hide-details>
          </v-select>
        </v-col>
        <v-col cols="7" sm="6" md="4" xl="2">
          <v-select v-model="semester" :items="semesters" item-text="text" item-value="value" label="学期"
            menu-props="auto" solo prepend-inner-icon="mdi-calendar" hide-details></v-select>
        </v-col>
        <v-col cols="5" sm="3" xl="2">
          <v-select v-model="selectState" :items="states" item-text="text" item-value="value" label="状态" solo
            prepend-inner-icon="mdi-checkbox-marked-circle-outline" hide-details></v-select>
        </v-col>
        <v-col cols="auto">
          <v-btn large nuxt @click="search">搜索</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table show-select :headers="headers" :items="communities" class="elevation-2" :options.sync="option"
            :items-per-page="10" :footer-props="{ itemsPerPageOptions: [10, 20] }" :loading="loading"
            :server-items-length="page.totalElements" @dblclick:row="openCommunity">
            <template #[`item.createDate`]="{ item }">
              {{ item.createDate | formatDate }}
            </template>
            <template #[`item.state`]="{ item }">
              <v-chip v-if="item.state === 1" color="green" dark> 可见</v-chip>
              <v-chip v-else-if="item.state === 0" color="grey" dark>
                待通过</v-chip>
              <v-chip v-else color="orange" dark>隐藏</v-chip>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="openCommunityEdit(item)">
                mdi-pencil</v-icon>
              <v-icon small @click="deleteCommunity(item)"> mdi-delete </v-icon>
            </template>
            <template #[`item.type`]="{ item }">
              {{ item.type ? '通知' : '文章' }}
            </template>
            <template #[`footer.page-text`]="{ pageStart, pageStop, itemsLength }">
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
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Community, CommunityType, Page } from '~/src'

@Component({
  name: 'AdminCommunity',
  layout: 'admin',
  head: {
    title: '共同体列表'
  },
  async asyncData({ $axios, query }): Promise<object | void> {
    const types: Promise<CommunityType> = $axios.get('/api/community/type').then(({ data }) => {
      data.data.unshift({
        id: -1,
        name: '全部',
      }
      )
      return data.data
    })
    const selectType = query.type ? Number(query.type) : -1
    const selectState = query.state ? Number(query.state) : -1
    const searchText = query.q ? query.q : ''
    const semester = query.semester ? Number(query.semester) : -1
    const pageSize = query.size ? Number(query.size) : 10
    const communityParam = {
      type: selectType,
      state: selectState,
      semester,
      search: searchText,
      admin: true,
    }
    const communities: Page<Community> = await $axios.get('/api/community', {
      params: {
        page_size: pageSize,
        ...communityParam,
      },
    }).then(({ data }) => data.data)
    return {
      communities: communities.content,
      page: communities,
      types: await types,
      selectType,
      selectState,
      searchText,
      semester,
      communityParam,
    }
  },
})
export default class extends Vue {
  communityParam = {
    admin: true,
    type: -1,
    semester: -1,
    search: '',
  }

  communities: Community[] = []
  page: Page<Community> = {
    content: [],
    total: 0,
    totalPage: 0,
    empty: false,
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    pageable: {
      offset: 0,
      pageNumber: 0,
      pageSize: 0,
      paged: false,
      unpaged: false,
      sort: {
        empty: false,
        sorted: false,
        unsorted: false
      }
    },
    size: 0,
    sort: {
      empty: false,
      sorted: false,
      unsorted: false
    },
    totalElements: 0,
    totalPages: 0
  }

  communityDialog = false
  headers: DataTableHeader[] = [
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
  ]

  loading = false
  option: DataOptions = {
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [true],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false,
  }

  semesters = [
    {
      text: '全部',
      value: -1,
    },
    {
      text: '2022-2023 第一学期',
      value: 6,
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
  ]

  semester = -1
  selectType = -1
  states = [
    {
      text: '全部',
      value: -1,
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
  ]

  selectState = -1
  searchText = ''
  get searchLocation(): Location {
    return {
      query: {
        type: String(this.selectType),
        state: this.selectState === null ? '' : String(this.selectState),
        q: this.searchText,
        semester: String(this.semester),
        size: String(this.option.itemsPerPage),
      },
    }
  }

  types = {
    id: -1,
    name: '全部',
  }

  openCommunity(_event: MouseEvent, data: any) {
    const item = data.item as Community
    this.$router.push({
      path: `/community/${item.id}`,
    })
  }

  deleteCommunity(community: Community) {
    this.$axios.delete(`/api/community/${community.id}`).catch((error: any) => {
      if (error.response.message) {
        this.$toast.error(error.response.message)
      } else {
        this.$toast.error('删除失败')
      }
    }).then(() => {
      this.$nuxt.refresh()
      this.$toast.success('删除成功')
    })
  }

  openCommunityEdit(community: Community) {
    this.$router.push({
      path: `/community/edit/${community.id}`,
    })
  }

  @Watch("option", { immediate: true, deep: true })
  optionHandler(val: DataOptions) {
    this.loading = true
    this.$axios.get('/api/community', {
      params: {
        page: val.page - 1,
        page_size: val.itemsPerPage,
        ...this.communityParam,
      },
    }).then(({ data }) => {
      this.page = data.data
      this.communities = data.data.content
    }).catch(() => {
      this.$toast.error('获取共同体列表失败')
      return []
    }).finally(() => {
      this.loading = false
    })
  }

  @Watch("$route")
  handleRouteChange() {
    this.$nuxt.refresh()
  }

  search() {
    this.option.page = 1
    this.$router.push(this.searchLocation)
  }
}
</script>
