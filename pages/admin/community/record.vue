<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-data-table :headers="headers"
      :options.sync="option"
      :items="page.content"
      :items-per-page="10"
      :loading="loading"
      :footer-props="{ itemsPerPageOptions: [10, 20] }"
      :server-items-length="page.totalElements"
      class="elevation-1">
        <template #[`item.createTime`]="{ item }">
          {{ item.createTime | formatDate }}
        </template>
        <template #[`item.detail`]="{ item }">
          {{ item.detail | formatStr(20) }}
        </template>
        <template #[`item.actions`]="">
          <v-icon small class="mr-2"> mdi-pencil</v-icon>
          <v-icon small>
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { DataOptions } from "vuetify";
import { CommunityRecord, Page } from "~/src";

@Component({
  name: "Record",
  layout: "admin",
  async asyncData({ $axios }): Promise<object | void> {
    const { data } = await $axios.get("/api/community/rec")
    const page: Page<CommunityRecord> = data.data as Page<CommunityRecord>
    return {
      page
    }
  },
})
export default class extends Vue {
  headers = [
    {
      text: '共同体名称',
      value: 'communityTitle',
      cellClass: 'text-caption'
    },
    {
      text: '打卡内容',
      value: 'detail',
      cellClass: 'text-caption'
    },
    {
      text: '出席人数',
      value: 'attendant.length'
    },
    {
      text: '打卡时间',
      value: 'createTime'
    }
  ]

  page: Page<CommunityRecord> = {
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

  option: DataOptions = {
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [
      true
    ],
    groupBy: [],
    groupDesc: [],
    mustSort: false,
    multiSort: false
  }

  loading = false

  @Watch('option', { deep: true })
  async onOptionChange() {
    this.loading = true
    const { data } = await this.$axios.get("/api/community/rec", {
      params: {
        page: this.option.page - 1,
        size: this.option.itemsPerPage
      }
    })
    this.page = data.data as Page<CommunityRecord>
    this.loading = false
  }
}
</script>
