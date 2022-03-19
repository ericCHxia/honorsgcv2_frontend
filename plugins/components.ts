import Vue from 'vue'
import {getSrcSet} from '~/src/image'

function formatDate(value: number) {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

function formatStr(text: string, len: number) {
  if (text.length < len) return text
  else return text.substring(0, len) + '...'
}

function formatSubject(text: string) {
  if (text.includes('('))return text.substring(0, text.indexOf('(')).trim()
  if (text.includes('（'))return text.substring(0, text.indexOf('（')).trim()
  return text
}

Vue.filter('formatDate', formatDate)
Vue.filter('formatStr', formatStr)
Vue.filter('formatSubject', formatSubject)
Vue.prototype.getSrcSet = getSrcSet
