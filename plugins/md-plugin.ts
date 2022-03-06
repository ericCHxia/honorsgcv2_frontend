import {Middleware} from '@nuxt/types'
import Token from 'markdown-it/lib/token'
import {Options} from 'markdown-it'
import Renderer from 'markdown-it/lib/renderer'
import MavonEditor from 'mavon-editor'
import MarkdownIt from 'markdown-it/lib'
import Vue from 'vue'
import 'mavon-editor/dist/css/index.css'

Vue.use(MavonEditor)


const uploadsPattern = /^(\/upload\/img|\/image\/org)\/(.*)/
const avaliableWidth = [200, 400, 600, 800, 1024, 1280, 1366, 1440, 1600, 1920, 2560]

function generateSrcset(tokens: Token[], idx: number, options: Options, env: any, self: Renderer) {
  const token = tokens[idx]
  console.log("generateSrcset", token)
  if (token.attrs) {
    const src = token.attrs[token.attrIndex("src")][1]
    const filenmae = uploadsPattern.exec(src)
    if (filenmae) {
      let srcset = ""
      avaliableWidth.forEach(width => {
        srcset += `/image/${width}/${filenmae[2]} ${width}w, `
      })
      srcset = srcset.substring(0, srcset.length - 2)
      token.attrPush(['srcset', srcset])
      token.attrSet("src", "/image/org/" + filenmae[2])
      // return `<v-img src="${token.attrs[token.attrIndex("src")][1]}" srcset="${srcset} alt="${token.attrs[token.attrIndex("alt")][1]}" ></v-img>`
    } else {
      token.attrPush(["src", src])
    }
  }
  return self.renderToken(tokens, idx, options)
}

const mdMiddleware: Middleware = ({$md}) => {
  $md.renderer.rules.image = generateSrcset
}

//@ts-ignore
const markdownIt: MarkdownIt = MavonEditor.mavonEditor.getMarkdownIt()
markdownIt.renderer.rules.image = generateSrcset

export default mdMiddleware
