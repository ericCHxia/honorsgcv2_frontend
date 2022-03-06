<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="8">
      <v-card>
        <v-card-title class="headline" v-text="data.title"></v-card-title>
        <div class="markdown-view github-markdown-body px-4 pt-0 pb-2" v-html="$md.render(data.detail)"></div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  validate({params}) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({$axios, params, error}) {
    try {
      const res = await $axios.get(`/api/article/${params.id}`)
      return {data: res.data.data}
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        error({statusCode: 404, message: 'Page not found'})
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$prism.highlightAll()
  },
})
</script>

<style>
code {
  background-color: transparent !important;
}

.markdown-view {
  line-height: normal !important;
}
</style>
