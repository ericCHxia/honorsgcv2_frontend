import {Middleware} from '@nuxt/types'

const axiosMiddleware: Middleware = ({$axios, app}) => {
  $axios.onResponse(response => {
    if (response.headers.refreshtoken != undefined) {
      console.log("fresh token: " + response.headers.refreshtoken);
      //@ts-ignore
      app.$auth.strategy.token.set(response.headers.refreshtoken)
    }
  })
}

export default axiosMiddleware
