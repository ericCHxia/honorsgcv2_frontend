<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-card>
        <v-img
          :lazy-src="community.img.base64"
          :src="community.img.original.url"
          :srcset="getSrcSet(community.img)"
          max-height="500"
        >
        </v-img>
        <v-card-title class="headline" v-text="community.title"></v-card-title>
        <v-card-text
          class="markdown-view github-markdown-body"
          v-html="$md.render(community.detail)"
        ></v-card-text>
      </v-card>
    </v-col>

    <!--  -->
    <v-col cols="12" md="4">
      <v-card class="mb-6">
        <v-card-title>信息</v-card-title>
        <v-card-text>
          <p>
            指导者：<a
              v-for="participant in community.mentors"
              :key="participant.id"
              :v-if="participant.valid"
              @click="userInfo(participant)"
              >{{ participant.name }}
            </a>
          </p>
          <p>
            参与者：<a
              v-for="participant in community.participants"
              :key="participant.id"
              :v-if="participant.valid"
              @click="userInfo(participant)"
              >{{ participant.name }}
            </a>
          </p>
          <p>
            人数限制：{{ community.participants.length }}/{{
              community.limit > 0 ? community.limit : '无限制'
            }}
          </p>
          <p>创建时间：{{ community.createDate | formatDate }}</p>
          <p>
            报名方式：{{ community.registrationType ? '需要审核' : '自由报名' }}
          </p>
          <p>
            报名状态：
            <v-chip v-if="community.enrolling" :color="'success'" text>
              正常报名
            </v-chip>
            <v-chip v-else :color="'error'" text> 已结束 </v-chip>
          </p>
          <p>
            共同体状态：
            <v-chip v-if="community.state === 1" color="green" dark>
              可见</v-chip
            >
            <v-chip v-else-if="community.state === 0" color="grey" dark>
              待通过</v-chip
            >
            <v-chip v-else color="orange" dark>隐藏</v-chip>
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn v-if="!isParticipant" @click="joinIn(1, false)"
            >我要指导</v-btn
          >
          <v-btn v-if="!isParticipant" @click="joinIn(0, false)"
            >我要参与</v-btn
          >
          <v-btn v-if="isMentor" @click="joinIn(1, true)">取消指导</v-btn>
          <v-btn v-if="isParticipant && !isMentor" @click="joinIn(0, true)"
            >取消参与</v-btn
          >
          <v-btn
            v-if="
              isParticipant ||
              $auth.user.privilege > 0 ||
              $auth.user.id === community.user.id
            "
            @click="recordDialog = true"
            >打卡
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-if="$auth.user.privilege > 0 || $auth.user.id === community.user.id"
      >
        <v-card-title>管理</v-card-title>
        <v-card-actions>
          <v-card class="d-flex align-content-start flex-wrap" flat>
            <v-btn class="ma-1" @click.stop="managerParticipantDialog = true"
              >人员</v-btn
            >
            <v-btn class="ma-1" :to="`/community/edit/${community.id}`"
              >编辑</v-btn
            >
            <v-btn
              v-if="!community.enrolling"
              class="ma-1"
              @click="changeEnrolling(true)"
              >开启报名</v-btn
            >
            <v-btn
              v-if="community.enrolling"
              class="ma-1"
              @click="changeEnrolling(false)"
              >关闭报名</v-btn
            >
            <v-btn
              v-if="community.state === 1"
              class="ma-1"
              @click="changeState(2)"
            >
              隐藏
            </v-btn>
            <v-btn
              v-else-if="community.state === 0"
              class="ma-1"
              @click="changeState(1)"
            >
              通过审批
            </v-btn>
            <v-btn v-else class="ma-1" @click="changeState(1)">可见</v-btn>
            <v-btn class="ma-1" @click.stop="deleteCommunity">删除</v-btn>
          </v-card>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col v-if="records.length > 0" cols="12" md="8">
      <v-card>
        <v-card-title>打卡记录</v-card-title>
        <template v-for="(item, index) in records">
          <v-divider v-if="index" :key="index"></v-divider>
          <v-card :key="item.id" flat class="py-2">
            <honor-user-bar :user="item.user" :date="item.createTime">
              <template #tail>
                <v-menu bottom left>
                  <template #activator="{ on, attrs }">
                    <v-btn small icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list v-if="isAdmin() || item.user.id == $auth.user.id">
                    <v-list-item @click="deleteRecord(item)">
                      <v-list-item-title>删除</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </honor-user-bar>
            <v-card-text class="body-1 justify-start">
              <v-row class="justify-start">
                <v-col cols="3">
                  <v-img
                    :src="item.image.original.url"
                    max-height="200"
                    contain
                    :srcset="getSrcSet(item.image)"
                    :lazy-src="item.image.base64"
                    @click="selectImage(item.image)"
                  ></v-img>
                </v-col>
                <v-col cols="9">
                  {{ item.detail }}
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-card>
    </v-col>

    <v-col cols="auto">
      <!-- 用户信息 -->
      <v-dialog
        v-model="dialog"
        transition="dialog-top-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar color="primary" dark>用户信息</v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>用户名</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ selectedUser.name }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>学号</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ selectedUser.userID }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>QQ</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ selectedUser.qq ? selectedUser.qq : '不存在' }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>学院</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ selectedUser.college }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>专业</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ selectedUser.major }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>班级</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ selectedUser.classID }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="participantDialog = true">
              删除人员
            </v-btn>
            <v-btn text color="primary" @click="dialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 删除确认 -->
      <v-dialog
        v-model="participantDialog"
        transition="dialog-top-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar>确认删除</v-toolbar>
          <v-card-text class="mt-3">
            你确定要从
            <em class="warning--text">{{ community.title }}</em> 中删除
            <em class="warning--text">{{ selectedUser.name }}</em> 吗？
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="primary" @click="participantDialog = false"
              >关闭
            </v-btn>
            <v-btn color="primary"> 确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 共同体人员管理 -->
      <v-dialog v-model="managerParticipantDialog" max-width="800">
        <v-data-table
          v-model="selectedUsers"
          :headers="managerParticipantHeaders"
          :items="participants"
          :search="participantSearch"
          :items-per-page="5"
          fixed-header
          :footer-props="{
            'items-per-page-all-text': '全部',
            'items-per-page-text': '条/页'
          }"
          show-select
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>参与者管理</v-toolbar-title>
              <v-text-field
                v-model="participantSearch"
                append-icon="mdi-magnify"
                label="搜索"
                single-line
                hide-details
                class="mx-4"
              ></v-text-field>
              <v-menu open-on-hover offset-x>
                <template #activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    批量操作
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item link>
                    <v-list-item-title> 删除</v-list-item-title>
                  </v-list-item>
                  <v-list-item link @click="approve">
                    <v-list-item-title> 通过</v-list-item-title>
                  </v-list-item>
                  <v-list-item link @click="excelExport">
                    <v-list-item-title> 导出</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                text
                icon
                color="red"
                class="ml-2"
                @click="managerParticipantDialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-icon small class="mr-2"> mdi-pencil</v-icon>
            <v-icon small @click.stop="deleteParticipant(item)">
              mdi-delete
            </v-icon>
          </template>

          <template #[`item.type`]="{ item }">
            <v-chip v-if="item.type === 1" color="orange" dark> 指导者</v-chip>
            <v-chip v-else color="green" dark> 参与者</v-chip>
          </template>

          <template #[`item.valid`]="{ item }">
            <v-chip v-if="item.valid" color="green" dark> 有效</v-chip>
            <v-chip v-else color="grey" dark> 待通过</v-chip>
          </template>

          <template #no-data>
            <v-alert icon="mdi-alert-outline" :value="true" color="error" dark>
              没有参与者
            </v-alert>
          </template>

          <template #no-results>
            <v-alert icon="mdi-alert-outline" :value="true" color="error" dark>
              没有搜索到结果
            </v-alert>
          </template>

          <template
            #[`footer.page-text`]="{ pageStart, pageStop, itemsLength }"
          >
            {{ pageStart }} - {{ pageStop }} 共 {{ itemsLength }}
          </template>
        </v-data-table>
      </v-dialog>

      <!-- 共同体打卡 -->
      <v-dialog v-model="recordDialog" max-width="800">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>打卡</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text icon color="red" @click="recordDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-hover v-slot="{ hover }">
                  <v-card class="my-4 rounded-lg" :elevation="hover ? 12 : 2" @click="beginUpload">
                    <v-img
                      aspect-ratio="1"
                      class="align-center"
                      :src="cover"
                      contain
                    >
                    </v-img>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="8">
                <v-select
                  v-model="recordSelectedUserId"
                  :items="validParticipants"
                  item-text="name"
                  item-value="id"
                  label="参与人员"
                  clearable
                  multiple
                  chips
                  outlined
                  prepend-icon="mdi-account-multiple"
                >
                  <template #selection="{ attrs, item, parent, selected }">
                    <v-chip
                      v-if="item === Object(item)"
                      v-bind="attrs"
                      :color="`primary`"
                      :input-value="selected"
                      small
                      dark
                    >
                      <span class="pr-2">
                        {{ item.name }}
                      </span>
                      <v-icon small @click="parent.selectItem(item)">
                        $delete
                      </v-icon>
                    </v-chip>
                  </template>
                  <template #prepend-item>
                    <v-list-item ripple @mousedown.prevent @click="toggle">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            recordSelectedUserId.length > 0 ? 'indigo' : ''
                          "
                        >
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>全选</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
                <v-textarea
                  v-model="recordContent"
                  label="打卡内容"
                  :counter="true"
                  rows="3"
                  outlined
                  :rules="[(v) => !!v || '请输入打卡内容']"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="recordDialog = false">
              取消</v-btn
            >
            <v-btn color="primary" @click="submitComment">提交</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-if="selectedImage"
        v-model="imageDialog"
        content-class="image-dialog"
      >
        <v-img
          :src="selectedImage.original.url"
          :srcset="getSrcSet(selectedImage)"
          class="scale-image"
          :lazy-src="selectedImage.base64"
          @click="imageDialog = false"
        ></v-img>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Community,
  CommunityParticipant,
  CommunityRecord,
  ImageResponse,
  User
} from '~/src'

interface Data {
  dialog: boolean
  participantDialog: boolean
  selectedUsers: CommunityParticipant[]
  recordSelectedUserId: number[]
  validParticipants: CommunityParticipant[]
  managerParticipantDialog: boolean
  recordDialog: boolean
  selectedUser: CommunityParticipant
  managerParticipantHeaders: any
  participants?: CommunityParticipant[]
  participantSearch: string
  recordContent: string
  recordImage: File | null
  imageBase64: string
  community: Community | null
  records: CommunityRecord[]
  imageDialog: boolean
  selectedImage: ImageResponse | null
}

// TODO: 更换请求方式 测试记录图片上传
export default Vue.extend({
  async asyncData({ $axios, params, $auth, error }) {
    try {
      const { data } = await $axios.get('/api/community/' + params.id)
      const community: Community = data.data as Community
      // @ts-ignore
      const participants = community.mentors.concat(community.participants)
      const user: User = $auth.user as User

      const isParticipant =
        participants.find(
          (participant) => participant.id === user.id && participant.valid
        ) !== undefined

      // @ts-ignore
      let isMentor = false
      if (community.mentors) {
        isMentor =
          community.mentors.find((mentor) => mentor.id === user.id) !==
          undefined
      }
      const validParticipants = participants.filter(
        (participant) => participant.valid
      )
      const recordResponse = await $axios.get('/api/community/rec/' + params.id)
      const records: CommunityRecord[] = recordResponse.data
        .data as CommunityRecord[]
      return {
        records,
        community,
        participants,
        isParticipant,
        validParticipants,
        isMentor
      }
    } catch (e: any) {
      error({ statusCode: 404, message: e.response.data.message })
    }
  },
  data(): Data {
    return {
      dialog: false,
      participantDialog: false,
      managerParticipantDialog: false,
      recordDialog: false,
      selectedUser: {
        id: 0,
        name: '',
        classID: '',
        userID: '',
        subject: 0,
        college: '',
        major: '',
        qq: '',
        type: 0,
        valid: false
      },
      managerParticipantHeaders: [
        {
          text: '姓名',
          align: 'left',
          value: 'name'
        },
        {
          text: '状态',
          align: 'left',
          value: 'valid'
        },
        {
          text: '角色',
          align: 'left',
          value: 'type'
        },
        {
          text: '学号',
          align: 'left',
          value: 'userID'
        },
        {
          text: '专业',
          align: 'left',
          value: 'major',
          cellClass: 'text-caption'
        },
        {
          text: '操作',
          align: 'left',
          sortable: false,
          value: 'actions'
        }
      ],
      selectedUsers: [],
      participantSearch: '',
      recordSelectedUserId: [],
      validParticipants: [],
      recordContent: '',
      recordImage: null,
      imageBase64: '',
      records: [],
      imageDialog: false,
      selectedImage: null,
      community: null
    }
  },
  computed: {
    selectSome(): boolean {
      return this.recordSelectedUserId.length > 0 && !this.selectAll
    },
    selectAll(): boolean {
      return this.recordSelectedUserId.length === this.validParticipants.length
    },
    icon(): string {
      if (this.selectAll) return 'mdi-close-box'
      if (this.selectSome) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    cover(): string {
      if (this.imageBase64 !== '') return this.imageBase64
      return '/upload.svg'
    }
  },
  mounted() {
    this.$prism.highlightAll()
  },
  methods: {
    userInfo(participant: CommunityParticipant) {
      this.selectedUser = participant
      this.dialog = true
    },
    async deleteCommunity() {
      try {
        if(this.community)await this.$axios.delete('/api/community/' + this.community.id)
        this.$router.push('/community')
      } catch (e:any) {
        if(e.response.data&&e.response.data.message)this.$toast.error(e.response.data.message)
        else this.$toast.error('删除失败')
      }
    },
    managerParticipant() {},
    uploadImage(file: File) {
      if (file) {
        this.recordImage = file
        this.imageFileToBase64(file)
          .then((data) => {
            this.imageBase64 = data
          })
          .catch((e: any) => {
            if (e.message) {
              this.$toast.error(e.message)
            } else {
              this.$toast.error('上传失败')
            }
          })
      }
    },
    deleteParticipant(p: CommunityParticipant) {
      console.log(p)
    },
    toggle() {
      this.$nextTick(() => {
        if (this.selectAll) {
          this.recordSelectedUserId = []
        } else {
          this.recordSelectedUserId = this.validParticipants.map(
            (participant) => participant.id
          )
        }
      })
    },
    imageFileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result as string)
          }
        }
        reader.onerror = (error) => {
          reject(error)
        }
      })
    },
    beginUpload() {
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.style.display = 'none'
      fileInput.onchange = (event: any) => {
        this.uploadImage(event.target.files[0])
        document.body.removeChild(fileInput)
      }
      document.body.appendChild(fileInput)
      fileInput.click()
    },
    selectImage(image: ImageResponse) {
      this.selectedImage = image
      this.imageDialog = true
    },
    async deleteRecord(record: CommunityRecord) {
      try {
        await this.$axios.delete('/api/community/record', {
          params: {
            ids: record.id
          }
        })
        this.$toast.success('删除成功')
        this.records = this.records.filter((r) => r.id !== record.id)
      } catch (e: any) {
        if (e.response && e.response.data && e.response.data.message) {
          this.$toast.error(e.response.data.message)
        } else {
          this.$toast.error('删除失败')
        }
      }
    },

    joinIn(type: number, isDelete: boolean) {
      if (this.community && this.community.id) {
        const formData = new FormData()
        formData.append('type', type.toString())
        formData.append('delete', isDelete.toString())
        formData.append('id', this.community.id.toString())
        this.$axios
          .post('/api/community/join', formData)
          .then(() => {
            const message = isDelete ? '成功取消报名' : '报名成功'
            this.$toast.success(message, {
              duration: 1000
            })
            this.$nuxt.refresh()
          })
          .catch((error) => {
            this.$toast.error(error.response.data.message, {
              duration: 1000
            })
          })
      }
    },
    // 提交记录
    submitComment() {
      if (this.recordContent === '') {
        this.$toast.error('请输入内容', {
          duration: 1000
        })
        return
      }
      if (this.recordImage === null) {
        this.$toast.error('请上传图片', {
          duration: 1000
        })
        return
      }
      if (!this.community || !this.community.id) {
        this.$toast.error('请先选择社团', {
          duration: 1000
        })
        return
      }
      this.$uploadImg(this.recordImage)
        .then((response) => {
          if (!this.community || !this.community.id) {
            this.$toast.error('请先选择社团', {
              duration: 1000
            })
            return
          }
          this.$axios
            .post('/api/community/rec', {
              communityId: this.community.id,
              cover: response.name,
              attendant: this.recordSelectedUserId,
              detail: this.recordContent
            })
            .then(() => {
              this.$toast.success('发布成功', {
                duration: 1000,
                onComplete: () => {
                  this.$nuxt.refresh()
                }
              })
              this.recordDialog = false
              this.recordContent = ''
              this.recordImage = null
              this.imageBase64 = ''
              this.recordSelectedUserId = []
            })
            .catch((error) => {
              this.$toast.error(error.response.data.message, {
                duration: 1000
              })
            })
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message, {
            duration: 1000
          })
        })
    },
    // 修改报名状态
    changeEnrolling(status: boolean) {
      if (this.community && this.community.id) {
        this.$axios
          .post('/api/community', {
            id: this.community.id,
            enrolling: status,
            update: true
          })
          .then(() => {
            this.$toast.success('修改成功', {
              duration: 1000
            })
            this.$nuxt.refresh()
          })
          .catch((error) => {
            this.$toast.error(error.response.data.message, {
              duration: 1000
            })
          })
      }
    },
    // 修改社团状态
    async changeState(status: boolean) {
      if (this.community && this.community.id) {
        try {
          await this.$axios.put(`/api/community/${this.community.id}`, {
            status
          })
          this.$toast.success('修改成功')
          this.$nuxt.refresh()
        } catch (error: any) {
          if (error.response.message) {
            this.$toast.error(error.response.message)
          } else {
            this.$toast.error('修改失败')
          }
        }
      }
    },

    async approve() {
      try {
        if (!this.community || !this.community.id) return
        const formData = new FormData()
        formData.append('communityId', this.community.id.toString())
        formData.append(
          'userId',
          this.selectedUsers.map((user) => user.id).join(',')
        )
        await this.$axios.post(`/api/community/approve`, formData)
        this.$toast.success('修改成功')
        this.selectedUsers = []
        this.$nuxt.refresh()
      } catch (error: any) {
        if (error.response.message) {
          this.$toast.error(error.response.message)
        } else {
          this.$toast.error('修改失败')
        }
      }
    },

    async excelExport() {
      try {
        const formData = new FormData()
        formData.set('ids', this.selectedUsers.map((val) => val.id).join(','))
        const data = await this.$axios.$post(
          `/api/community/participant/${this.community?.id}/export`,
          formData,
          {
            responseType: 'blob'
          }
        )
        const dateString = new Date().toDateString()
        const fileName = `${this.community?.title}${dateString}.xlsx`
        const blobURL = window.URL.createObjectURL(data)
        // 创建a标签，用于跳转至下载链接
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', decodeURI(fileName))
        // 挂载a标签
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        // 释放blob URL地址
        window.URL.revokeObjectURL(blobURL)
      } catch (e: any) {
        if (e.response.data && e.response.data.message) {
          this.$toast.error(e.response.data.message)
        } else {
          this.$toast.error('导出失败')
        }
      }
    }
  }
})
</script>

<style>
code {
  background-color: transparent !important;
}

.markdown-view {
  line-height: normal !important;
}

.markdown-view img {
  max-width: 100% !important;
}

.scale-image {
  object-fit: contain;
  max-width: 80vw;
  max-height: 80vh;
}

.image-dialog {
  width: fit-content !important;
  height: fit-content !important;
}
</style>
