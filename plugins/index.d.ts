import type MarkdownIt from "markdown-it/lib"
import Vue from 'vue'
import {PrismClass} from "~/plugins/prism";

export type Sort = {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export type Pageable = {
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
  sort: Sort
}

export interface Page<T>{
  content: T[]
  total: number
  totalPage: number
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: Pageable
  size: number
  sort: Sort
  totalElements: number
  totalPages: number
}

export type CommunityType = {
  id: number
  name: string
  count?: number
}

export type UserSimple = {
  id: number
  name: string
}

export type GlobalResponse<T> = {
  success: boolean
  code: number
  message: string
  data: T
}

export type CommunityParticipant = {
  id: number
  name: string
  classID: string
  userID: string
  subject: number
  college: string
  major: string
  qq: string
  type: number
  valid: boolean
}

export type Community = {
  id: number | null
  title: string | null
  detail: string | null
  describe: string | null
  createDate: string | null
  user: UserSimple | null
  type: CommunityType | null
  img: ImageData | null
  limit: number | null
  state: number | null
  enrolling: boolean | null
  needMentor: boolean | null
  registrationType: number | null
  participants: number | CommunityParticipant[]
  mentors?: CommunityParticipant[]
}

export type ImageSingle = {
  url: string
  width: number
}

export type ImageResponse = {
  original: ImageSingle
  width: number
  height: number
  srcset: ImageSingle[]
  base64: string
}

export type ArticleRequest = {
  id?: number
  tag?: string
  title?: string
  describe?: string
  detail?: string
  type?: number
  state?: number
}

export class User {
  accountNonExpired: boolean
  accountNonLocked: boolean
  authorities: string[]
  classId: string
  college: string
  credentialsNonExpired: boolean
  enabled: boolean
  id: number
  name: string
  privilege: number
  qq: string
  subject: string
  userId: string
  username: string
}

export interface ArticleSimple{
  id: number
  user: User
  tagName: string
  title: string
  describe: string
  state: number
  createTime: number
  type: number
  haveComment: boolean
}

export interface ArticleTag{
  id:number
  name:string
  count?:number
}

declare module 'vue/types/vue' {
  interface Vue {
    $prism: PrismClass,

    $md5(str: string, raw?: false): string,

    $md: MarkdownIt,
  }
}

declare module '@nuxt/types' {
  interface Context {
    $md: MarkdownIt,
  }
}

declare module '*.vue' {
  export default Vue
}
