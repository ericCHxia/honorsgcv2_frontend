import type MarkdownIt from "markdown-it/lib"
import Vue from 'vue'
import {PrismClass} from "~/plugins/prism";
import {Honor} from "~/src/image";

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
  avatar: string
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


export type ImageSingle = {
  url: string
  width: number
}

export type ImageResponse = {
  name: string
  original: ImageSingle
  width: number
  height: number
  srcset: ImageSingle[]
  base64: string
}

export type Community = {
  id?: number | null
  title: string
  detail: string
  describe: string
  createDate?: string | null
  user: UserSimple
  type: CommunityType
  img: ImageResponse
  limit: number
  state: number
  enrolling: boolean
  needMentor: boolean
  registrationType: number
  participants?: CommunityParticipant[]
  mentors?: CommunityParticipant[]
}

export type CommunityRequestBody = {
  typeId: number
  title: string
  describe: string
  detail: string
  img: string
  limit: number
  state: number
  enrolling: boolean
  needMentor: boolean
  registrationType: number
}

export class User {
  accountNonExpired?: boolean
  accountNonLocked?: boolean
  authorities?: string[]
  classId?: string
  college?: string
  credentialsNonExpired?: boolean
  enabled?: boolean
  id: number
  name?: string
  privilege: number
  qq?: string
  subject?: string
  userId?: string
  username?: string
  phone?: string
  avatar:string
}

export interface CommunityRecord{
  id:number
  user:UserSimple
  communityId:number
  communityTitle:string
  detail:string
  image:ImageResponse
  createTime:number
  attendant:UserSimple[]
}

declare module 'vue/types/vue' {
  interface Vue {
    $prism: PrismClass,

    $md5(str: string, raw?: false): string,

    $md: MarkdownIt,
    getSrcSet(imgData: ImageResponse): string
    $honor: Honor
    isAdmin: () => boolean
    $uploadImg: (file: File) => Promise<ImageResponse>
  }
}

interface HonorConfig{
  semester?:number
}

declare module '@nuxt/types' {
  interface Context {
    $md: MarkdownIt,
  }
}

declare module '*.vue' {
  export default Vue
}

export type UserOptions = {
  classId: string[]
  college: string[]
  subject: string[]
}