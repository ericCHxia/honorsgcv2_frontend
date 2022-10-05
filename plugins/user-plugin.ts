import {Plugin} from '@nuxt/types'
import Vue from 'vue'
import { ImageResponse, User } from '~/src'

const userPlugin:Plugin = ({app,$axios}) => {
    Vue.prototype.isAdmin = () => {
        const user:User = app.$auth.user as unknown as User

        return user && user.authorities && user.authorities.includes('ADMIN')
    }
    const uploadImg = async (file:File):Promise<ImageResponse> => {
        const formData = new FormData()
        formData.append('image',file)
        const {data} = await $axios.post('/api/upload_image',formData)
        return data.data
    }
    Vue.prototype.$uploadImg = uploadImg
}

export default userPlugin