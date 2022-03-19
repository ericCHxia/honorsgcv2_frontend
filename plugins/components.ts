import Vue from 'vue'
import Footer from '@/components/Footer.vue'
import {getSrcSet} from '~/src/image'
import UserBar from '@/components/UserBar.vue'


Vue.component('HonorFooter', Footer)
Vue.component('HonorUserBar', UserBar)

function formatDate(value: number) {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

function formatStr(text: string, len: number) {
  if (text.length < len) return text
  else return text.substr(0, len) + '...'
}

function formatSubject(text: string) {
  if (text.includes('('))return text.substr(0, text.indexOf('(')).trim()
  if (text.includes('（'))return text.substr(0, text.indexOf('（')).trim()
  return text
}

Vue.filter('formatDate', formatDate)
Vue.filter('formatStr', formatStr)
Vue.filter('formatSubject', formatSubject)
Vue.prototype.getSrcSet = getSrcSet
