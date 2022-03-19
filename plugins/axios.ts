import {Middleware} from '@nuxt/types'

const axiosMiddleware: Middleware = ({$axios, app}) => {
  $axios.onResponse(response => {
    if (response.headers.refreshtoken !== undefined) {
      // @ts-ignore
      app.$auth.strategy.token.set(response.headers.refreshtoken)
    }
  })
}

export default axiosMiddleware
