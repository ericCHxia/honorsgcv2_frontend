<template>
  <v-footer app>
    <span>&copy; 2019-{{ new Date().getFullYear() }}</span>
    <v-spacer></v-spacer>
    <a
      target="_blank"
      href="https://beian.miit.gov.cn/"
      style="text-decoration: none"
    >
      浙ICP备2021029370号-1
    </a>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HonorFooter',
})
</script>
