import Vue from 'vue'
import Footer from '@/components/Footer.vue'

Vue.component('HonorFooter', Footer)

function formatDate(value: number) {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

function formatStr(text: string, len: number) {
  if (text.length < len) return text
  else return text.substr(0, len) + '...'
}

Vue.filter('formatDate', formatDate)
Vue.filter('formatStr', formatStr)
