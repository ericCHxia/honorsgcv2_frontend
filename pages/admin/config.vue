<template>
  <v-card>
    <v-card-title>网站管理</v-card-title>
    <v-card-text>
      <v-row>
        <v-col md="6">
          <v-select
            v-model="config.semester"
            :items="semesters"
            item-text="text"
            item-value="value"
            label="学期设置"
            outlined
            class="activate"
            :append-outer-icon="config.semester!==oldConfig.semester?'mdi-check-all':''"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn color="primary" @click="saveConfig">保存</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { HonorConfig } from '~/src'

interface Data {
  config: HonorConfig,
  oldConfig: HonorConfig,
  semesters: {
    text: string
    value: number
  }[]
}

export default Vue.extend({
  name: 'Config',
  layout: 'admin',
  async asyncData({ $axios }) {
    const configResonpse = await $axios.get('/api/config')
    const config = configResonpse.data.data
    return { config }
  },
  data(): Data {
    return {
      config: {},
      semesters: [
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
      ],
      oldConfig: {},
    }
  },
  mounted() {
    this.oldConfig = JSON.parse(JSON.stringify(this.config))
  },
  methods: {
    async saveConfig() {
      try {
        await this.$axios.put('/api/config', this.config)
        this.$toast.success('保存成功')
        this.oldConfig = JSON.parse(JSON.stringify(this.config))
        this.$nuxt.refresh()
      } catch (e) {
        this.$toast.error('保存失败')
      }
    },
  },
})
</script>