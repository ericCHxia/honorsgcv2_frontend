import type MarkdownIt from "markdown-it/lib"
import type Token from "markdown-it/lib/token"
import axios from "axios"

const uploadsPattern = /^\/upload\/img\/(.*)/
export default function mdSrcsetPlugin(md: MarkdownIt): void {
  md.renderer.rules.image = (tokens: Token[], idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx]
    if (token.attrs) {
      const src = token.attrs[token.attrIndex("src")][1]

      if (uploadsPattern.test(src)) {
        const filenmae = src.match(uploadsPattern)
        const file = axios.get("/api/upload_image/" + filenmae)
        tokens[idx].attrPush(["src", src])
        if (filenmae) {
          const srcset = `/upload/img/${filenmae[1]} 400w, /upload/img/${filenmae[1]} 800w, /upload/img/${filenmae[1]} 1200w`
          tokens[idx].attrPush(["srcset", srcset])
        }
      } else {
        tokens[idx].attrPush(["src", src])
      }
    }
    return self.renderToken(tokens, idx, options)
  }
}
