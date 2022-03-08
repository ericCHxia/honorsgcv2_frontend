import {User} from "~/src/index";

export interface ArticleTag{
  id:number
  name:string
  count?:number
}

export interface ArticleRequest{
  id?: number
  tag?: number
  title?: string
  describe?: string
  detail?: string
  type?: number
  state?: number
  haveComment?: boolean
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

export interface ArticleComment{
  id:number
  user:User
  article:ArticleSimple
  detail:string
  createTime:number
}
