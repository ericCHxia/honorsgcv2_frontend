<template>
  <v-row>
    <v-col cols="8">
      <v-data-table
        :headers="headers"
        :items="types"
        class="elevation-1"
      >
        <template #[`item.actions`]="">
          <v-icon small class="mr-2"> mdi-pencil</v-icon>
          <v-icon small>
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-card-title>添加类型</v-card-title>
        <v-card-text>
          <v-text-field label="类型名" outlined></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn>添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import {CommunityType} from "~/src";

export default Vue.extend({
  name: "CommunityType",
  layout: "admin",
  async asyncData({$axios}): Promise<object | void> {
    const {data} = await $axios.get("/api/community/type")
    const types: CommunityType[] = data.data as CommunityType[]
    return {
      types
    }
  },
  data() {
    return {
      types: [],
      headers: [
        {
          text: "名称",
          value: "name"
        },
        {
          text: "计数",
          value: "count"
        },
        {
          text: "操作",
          value: "actions"
        }
      ]
    }
  }
})
</script>
