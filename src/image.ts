import {ImageResponse} from "~/src/index";
import {NuxtAxiosInstance} from "@nuxtjs/axios";

export function getSrcSet(imgData: ImageResponse) {
  let srcSet = ''
  for (const img of imgData.srcset) {
    srcSet += `${img.url} ${img.width}w,\n`
  }
  srcSet = srcSet.substr(0, srcSet.length - 2)
  return srcSet
}

export class Honor {
  private axios:NuxtAxiosInstance;
  constructor(axios:NuxtAxiosInstance) {
    this.axios = axios;
  }

  async uploadImage(image:File){
    const formData = new FormData()
    formData.append('image', image)
    return await this.axios.post('/api/upload_image', formData)
  }
}
