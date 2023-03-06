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
      ],
      oldConfig: {},
    }
  },
  mounted() {
    for(let i=3;i<=60;i++){
      this.semesters.push({
        text: `${2019+Math.floor((i-1)/2)}-${2020+Math.floor((i-1)/2)} 第${i%2===0?'二':'一'}学期`,
        value: i,
      })
    }
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