import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - 卓越学院成长共同体平台',
    title: '卓越学院成长共同体平台',
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
      href: '/icon.ico'
    },
    {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'https://cdn.staticfile.org/MaterialDesign-Webfont/6.5.95/css/materialdesignicons.min.css'
    },
    {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap'
    }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/prism', ssr: true },
    { src: '~/plugins/vue-cropper', ssr: false },
    '@/plugins/axios',
    { src: '~/plugins/vue-infinite-scroll', ssr: false },
    '~/plugins/md-plugin',
    '~/plugins/user-plugin',
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
    '@nuxtjs/auth-next',
    '@nuxtjs/toast'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: '卓越学院成长共同体平台',
      short_name: '共同体平台',
      lang: 'zh-cn',
    },
    meta: {
      name: '卓越学院成长共同体平台',
      author: 'EricXia'
    },
    icon: {
      iconFileName: 'icon.png',
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
    ]
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
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
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    transpile: ['vuetify/lib','minidenticons']
  },

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
          scopeKey: 'authorities',
        },
        endpoints: {
          login: {
            url: '/api/login',
            method: 'post',
          },
          user: { url: '/api/users/mine', method: 'get', propertyName: 'data' },
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
    middleware: ['auth'],
    extendRoutes(routes, resolve) {
      if (!routes.find(route => route.name === 'CommunityEditorId')){
        const router = [
          {
            path: "/community/edit/:id",
            name: "CommunityEditorId",
            component: resolve('pages/community/edit.vue'),
          }
        ];
        routes.push(...router);
      }
    }
  },

  proxy: {
    '/api': {
      target: process.env.BACKEND_URL? process.env.BACKEND_URL : 'http://localhost:8080',
      pathRewrite: {
        '^/api': ''
      }
    },
    '/upload': {
      target: process.env.BACKEND_URL? process.env.BACKEND_URL : 'http://localhost:8080',
    },
    '/image': {
      target: process.env.BACKEND_URL? process.env.BACKEND_URL : 'http://localhost:8080',
    },
  },

  toast: {
    position: 'top-center',
    duration: 2000,
  },

  server: {
    port: 3000,
    host: '0.0.0.0',
  }
}
