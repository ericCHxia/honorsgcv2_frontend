<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="communities.content"
        class="elevation-2"
        @click:row="clickRow"
      >
        <template #[`item.createDate`]="{item}">
          {{ item.createDate|formatDate }}
        </template>
        <template #[`item.state`]="{ item }">
          <v-chip v-if="item.state===1" color="green" dark> 可见</v-chip>
          <v-chip v-else-if="item.state===0" color="grey" dark> 待通过</v-chip>
          <v-chip v-else color="orange" dark>隐藏</v-chip>
        </template>
        <template #[`item.actions`]="">
          <v-icon small class="mr-2"> mdi-pencil</v-icon>
          <v-icon small>
            mdi-delete
          </v-icon>
        </template>
        <template #[`item.type`]="{item}">
          {{ item.type ? '通知' : '文章' }}
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="auto">
      <v-dialog v-model="communityDialog" max-width="600">
        <v-card>
          <v-toolbar dense>
            <v-toolbar-title>共同体信息</v-toolbar-title>
          </v-toolbar>
          <v-card-title>
            {{ clickedItem ? clickedItem.title : '' }}
          </v-card-title>
          <v-card-text>

          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {DataTableHeader} from "vuetify";
import {Community, Page} from "~/plugins";

interface Data {
  communities: Page<Community> | null
  headers: DataTableHeader[]
  communityDialog: boolean
  clickedItem: Community | null
}

export default Vue.extend({
  name: "AdminCommunity",
  layout: "admin",
  async asyncData({$axios}): Promise<object | void> {
    const {data} = await $axios.get("/api/community", {
      params: {
        admin: true
      }
    })
    const communities: Page<Community> = data.data as Page<Community>
    return {
      communities
    }
  },
  data(): Data {
    return {
      communities: null,
      communityDialog: false,
      headers: [
        {
          text: '状态',
          value: 'state'
        },
        {
          text: '标题',
          value: 'title',
          cellClass: 'text-caption'
        },
        {
          text: '创建者',
          value: 'user.name'
        },
        {
          text: '类型',
          value: 'type.name'
        },
        {
          text: '创建时间',
          value: 'createDate'
        },
        {
          text: '操作',
          value: 'actions'
        }
      ],
      clickedItem: null
    }
  },
  head() {
    return {
      title: "共同体列表"
    }
  },
  methods: {
    clickRow(item: Community | null) {
      this.clickedItem = item
      this.communityDialog = true
    }
  }
})
</script>
