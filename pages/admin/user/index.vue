<template>
  <v-row>
    <v-col cols="12">
      <v-row justify="end">
        <v-col>
          <v-text-field v-model="userParam.name" solo label="姓名" prepend-inner-icon="mdi-magnify" hide-details
            @keyup.enter="search">
          </v-text-field>
        </v-col>
        <v-col cols="5" sm="4" md="3" lg="2">
          <v-autocomplete v-model="userParam.college" :items="options.college" label="学院" solo hide-details clearable
            @change="search">
          </v-autocomplete>
        </v-col>
        <v-col cols="7" sm="6" md="4" xl="2">
          <v-autocomplete v-model="userParam.subject" :items="options.subject" label="专业" solo clearable
            prepend-inner-icon="mdi-calendar" hide-details @change="search"></v-autocomplete>
        </v-col>
        <v-col cols="5" sm="3" xl="2">
          <v-autocomplete v-model="userParam.class" :items="options.classId" label="班级" solo clearable hide-details
            @change="search">
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table show-select :headers="headers" :items="users" class="elevation-2" :options.sync="option"
            :items-per-page="10" :footer-props="{ itemsPerPageOptions: [10, 20] }" :loading="loading"
            :server-items-length="page.totalElements">
            <template #[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="openUserEdit(item)">
                mdi-pencil</v-icon>
              <v-icon small @click="deleteUser(item)"> mdi-delete </v-icon>
            </template>
            <template #[`item.privilege`]="{item}">
              {{item.privilege==0?'普通用户':(item.privilege==1?'管理员':'超级管理员')}}
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
import { Page, UserOptions, User } from '~/src'

@Component({
  name: 'AdminUser',
  layout: 'admin',
  head: {
    title: '用户列表'
  },
  async asyncData({ $axios, query }): Promise<object | void> {
    const options: Promise<UserOptions> = $axios.get('/api/users/options').then(({ data }) => {
      return data.data
    })
    const userParam = {
      class: query.class ? query.class : '',
      college: query.college ? query.college : '',
      subject: query.subject ? query.subject : '',
      name: query.name ? query.name : ''
    }
    const size = query.size ? Number(query.size) : 10
    const users: Page<User> = await $axios.get('/api/users', {
      params: {
        page: 0,
        page_size: size,
        ...userParam,
      },
    }).then(({ data }) => data.data)
    return {
      users: users.content,
      page: users,
      options: await options,
    }
  },
})
export default class extends Vue {
  userParam = {
    class: '',
    college: '',
    subject: '',
    name: ''
  }

  users: User[] = []
  page: Page<User> = {
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
      text: '姓名',
      value: 'name',
      sortable: false,
    },
    {
      text: '学号',
      value: 'userId'
    },
    {
      text: '班级',
      value: 'classId',
    },
    {
      text: '学院',
      value: 'college',
    },
    {
      text: '身份',
      value: 'privilege',
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

  options: UserOptions = {
    classId: [],
    college: [],
    subject: []
  }

  get searchLocation(): Location {
    return {
      query: {
        size: String(this.option.itemsPerPage),
        ...this.userParam
      },
    }
  }

  deleteUser(_community: User) {
    // TODO: 用户删除
  }

  openUserEdit(_community: User) {
    // TODO: 用户编辑
  }

  @Watch("option", { deep: true })
  optionHandler(val: DataOptions) {
    if(this.page.pageable.pageNumber === val.page - 1 && this.page.pageable.pageSize === val.itemsPerPage)
    {
      return
    }
    this.loading = true
    this.$axios.get('/api/users', {
      params: {
        page: val.page - 1,
        page_size: val.itemsPerPage,
        ...this.userParam,
      },
    }).then(({ data }) => {
      this.page = data.data
      this.users = data.data.content
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
