<template>
  <mavon-editor
    ref="md"
    v-model="inputValue"
    class="editor"
    :toolbars="markdownOption"
    :ishljs="true"
    @change="valueChange"
    @imgAdd="uploadImg"
  />
</template>

<script lang="ts">
import {Component, Emit, Vue, Model} from 'vue-property-decorator'
import {ImageResponse} from '~/plugins';

@Component
export default class HonorEditor extends Vue {
  markdownOption = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    help: true, // 帮助
    undo: true, // 上一步
    redo: true, // 下一步
    trash: true, // 清空
    navigation: true, // 导航目录
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    subfield: true, // 单双栏模式
    preview: true, // 预览
  }

  imgFile: Map<number, File> = new Map();

  private created() {
    this.inputValue = this.value
  }

  private inputValue: string = ''

  @Model('input', {type: String}) value!: string

  @Emit('input')
  valueChange(val: string, render: string) {
    this.inputValue = val
    this.$emit('input', val)
    this.$emit('change', val, render)
  }

  uploadImg(pos: number, file: File) {
    const formData = new FormData()
    formData.append('image', file)
    this.imgFile.set(pos, file)
    this.$axios.post('/api/upload_image', formData).then(res => {
      const imageResponse: ImageResponse = res.data.data
      // @ts-ignore
      this.$refs.md.$img2Url(pos, imageResponse.original.url);
    })
  }
}
</script>

<style scoped>
.editor {
  /* 使得遮罩生效 */
  z-index: 0;
  min-height: 70ex;
}
</style>
