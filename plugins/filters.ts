import { VueConstructor } from 'vue/types/umd'

function formatDate(value: number) {
    if (!value) return ''
    return new Date(value).toLocaleString()
}

function formatStr(text: string, len: number) {
    if (text.length < len) return text
    else return text.substring(0, len) + '...'
}

function formatSubject(text: string) {
    if (text.includes('(')) return text.substring(0, text.indexOf('(')).trim()
    if (text.includes('（')) return text.substring(0, text.indexOf('（')).trim()
    return text
}

declare module 'vue/types/vue'  {
    interface Vue {
        formatDate: typeof formatDate
        formatStr: typeof formatStr
        formatSubject: typeof formatSubject
    }
}

export default {
    install(Vue: VueConstructor) {
        Vue.filter('formatDate', formatDate)
        Vue.filter('formatStr', formatStr)
        Vue.filter('formatSubject', formatSubject)
    }
}