<template>
  <v-container>
    <v-data-table v-model="selected" show-select :headers="headers" :items="users" class="elevation-2"
      :options.sync="option" :items-per-page="10" :footer-props="{ itemsPerPageOptions: [10, 20] }" :loading="loading"
      :server-items-length="page.totalElements">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>用户管理</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field v-model="userParam.name" class="nametextfield" dense prepend-inner-icon="mdi-magnify"
            placeholder="姓名" type="text" hide-details outlined rounded clearable @keyup.enter="search">
            <template #append>
              <v-menu v-model="filtermenu" :close-on-content-click="false" :nudge-width="500" offset-x>
                <template #activator="{ on, attrs }">
                  <v-icon v-bind="attrs" class="filterico" v-on="on">mdi-filter-variant</v-icon>
                </template>
                <v-card>
                  <v-card-text>
                    <v-row class="flex-child">
                      <v-col cols="6">
                        <v-autocomplete v-model="userParam.college" :items="options.college" label="学院" hide-details
                          clearable>
                        </v-autocomplete>
                        <v-autocomplete v-model="userParam.subject" :items="options.subject" label="专业" clearable
                          hide-details></v-autocomplete>
                      </v-col>
                      <v-col cols="6">
                        <v-autocomplete v-model="userParam.class" :items="options.classId" label="班级" clearable
                          hide-details>
                        </v-autocomplete>
                        <v-text-field v-model="userParam.userId" label="学号" prepend-inner-icon="mdi-magnify"
                          hide-details>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="filtermenu = false">
                      取消
                    </v-btn>
                    <v-btn color="primary" text @click="filtermenu = false; search()">
                      保存
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </template>
          </v-text-field>
          <v-menu open-on-hover offset-x>
            <template #activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" class="ml-2" v-on="on">
                批量操作
              </v-btn>
            </template>
            <v-list>
              <v-list-item link @click="handleResetPassword">
                <v-list-item-title>重置密码</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon small @click="deleteUser(item)"> mdi-delete </v-icon>
        <v-icon small @click="openUserEdit(item)">mdi-account-edit</v-icon>
      </template>
      <template #[`item.privilege`]="{item}">
        {{item.privilege==0?'普通用户':(item.privilege==1?'管理员':'超级管理员')}}
      </template>
      <template #[`footer.page-text`]="{ pageStart, pageStop, itemsLength }">
        {{ pageStart }} - {{ pageStop }} 共 {{ itemsLength }}
      </template>
    </v-data-table>
    <v-dialog v-model="editorDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">编辑用户</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="2">
                <v-avatar class="mb-4" color="blue-grey lighten-4" size="35">
                <v-img
                  id="avatar"
                  :src="avatar(editorUser)"
                  class="alige-center"
                >
                </v-img>
              </v-avatar>
              </v-col>
              <v-col cols="10">
                <v-text-field v-model="editorUser.name" dense label="姓名" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editorUser.userId" dense label="学号" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete v-model="editorUser.college" dense :items="options.college" label="学院" required>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete v-model="editorUser.subject" dense :items="options.subject" label="专业" required>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete v-model="editorUser.classId" dense :items="options.classId" label="班级" required>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editorUser.phone" dense label="手机号" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="resetPassword([editorUser])">重置密码</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="editorDialog = false">
            取消
          </v-btn>
          <v-btn color="blue darken-1" text @click="editorDialog = false;">
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'
import { DataOptions, DataTableHeader } from 'vuetify'
import { Location } from 'vue-router/types/router'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { identicon } from 'minidenticons'
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
      name: query.name ? query.name : '',
      userId: query.userId ? query.userId : '',
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
    name: '',
    userId: ''
  }

  users: User[] = []
  selected: User[] = []
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

  editorUser: User = {
    id: 0,
    name: '',
    userId: '',
    college: '',
    subject: '',
    classId: '',
    phone: '',
    privilege: 0,
    avatar: ''
  }

  editorDialog = false
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

  filtermenu = false
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

  openUserEdit(user: User) {
    this.editorDialog = true
    this.editorUser = user
  }

  @Watch("option", { deep: true })
  optionHandler(val: DataOptions) {
    if (this.page.pageable.pageNumber === val.page - 1 && this.page.pageable.pageSize === val.itemsPerPage) {
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

  handleResetPassword() {
    this.resetPassword(this.selected)
  }

  resetPassword(users: User[]) {
    const ids = users.map((user) => user.id)
    const data = new FormData()
    data.append('ids', ids.join(','))
    this.$axios.post('/api/users/reset-password', data).then(() => {
      this.$toast.success('重置密码成功')
      this.selected = []
    }).catch((e: any) => {
      if (e.response && e.response.data && e.response.data.message) {
        this.$toast.error(e.response.data.message)
      } else {
        this.$toast.error('重置密码失败')
      }
    })
  }

  avatar(user:User): string {
      if (user.avatar.trim().length > 0) {
        return `/image/50/${user.avatar}`
      } else {
        const data = identicon(String(user.id))
        const out = 'data:image/svg+xml;utf8,' + encodeURIComponent(data);
        return out
      }
    }
}
</script>

<style lang="scss" scoped>
.filterico {
  border-radius: 25px;
  width: 50px;
}

.filterico:hover {
  background-color: #f5f5f5;
}
</style>

<style>
.nametextfield>.v-input__control>.v-input__slot {
  padding: 0 12px !important;
}
</style>