import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - 卓越学院学习共同体平台',
    title: '卓越学院学习共同体平台',
    meta: [{
      charset: 'utf-8'
    },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/prism', ssr: true},
    '@/plugins/axios',
    {src: '~/plugins/mavon-editor', ssr: false},
    {src: '~/plugins/vue-infinite-scroll', ssr: false},
    '~/plugins/md-plugin',
    '~/plugins/components',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    prefetchPayloads: false
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // MarkDown module configuration: https://github.com/markdown-it/markdown-it
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    langPrefix: 'line-numbers language-',
    use: [
      'markdown-it-mathjax3',
      // "~/plugins/md-srcset",
    ]
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#3f51b5',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c',
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Auth module configuration: https://auth.nuxtjs.org/
  auth: {
    strategies: {
      local: {
        token: {
          property: 'data.token',
          maxAge: 60 * 5,
          global: true,
          // type: 'Bearer'
        },
        user: {
          property: 'data',
          global: true,
        },
        endpoints: {
          login: {
            url: '/api/login',
            method: 'post',
          },
          user: {url: '/api/user', method: 'get', propertyName: 'data'},
          logout: {url: '/api/logout', method: 'get'},
        }
      }
    },
    redirect: {
      logout: '/login'
    },
    autoLogout: true,
    // localStorage: false,
  },

  // Router module configuration: https://go.nuxtjs.dev/config-router
  router: {
    middleware: ['auth']
  },

  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      pathRewrite: {
        '^/api': ''
      }
    },
    '/upload': {
      target: 'http://localhost:8080',
    },
    '/image': {
      target: 'http://localhost:8080',
    },
  }
}
