import Vue from 'vue'
import filters from '~/plugins/filters'
import {getSrcSet} from '~/src/image'
Vue.use(filters)

Vue.prototype.getSrcSet = getSrcSet