<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="records.content"
        class="elevation-1"
      >
        <template #[`item.createTime`]="{item}">
          {{item.createTime|formatDate}}
        </template>
        <template #[`item.detail`]="{item}">
          {{item.detail|formatStr(20)}}
        </template>
        <template #[`item.actions`]="">
          <v-icon small class="mr-2"> mdi-pencil</v-icon>
          <v-icon small >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import {CommunityRecord, Page} from "~/plugins";

export default Vue.extend({
  name: "Record",
  layout: "admin",
  async asyncData({$axios}): Promise<object | void>{
    const {data} = await $axios.get("/api/community/rec")
    const records:Page<CommunityRecord> = data.data as Page<CommunityRecord>
    return {
      records
    }
  },
  data(){
    return{
      headers:[
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
      ],
      records:null
    }
  }
})
</script>
