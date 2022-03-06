<template>
  <v-row justify="center">
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
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn>我要指导</v-btn>
          <v-btn>我要参与</v-btn>
          <v-btn
            v-if="
              isParticipant ||
              $auth.user.privilege > 0 ||
              $auth.user.id === community.user.id
            "
            @click="recordDialog = true"
          >打卡
          </v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card
        v-if="$auth.user.privilege > 0 || $auth.user.id === community.user.id"
      >
        <v-card-title>管理</v-card-title>
        <v-card-actions>
          <v-btn @click.stop="managerPaticipantDialog = true">人员</v-btn>
          <v-btn @click.stop="editCommunity">编辑</v-btn>
          <v-btn @click.stop="deleteCommunity">删除</v-btn>
        </v-card-actions>
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
                      <v-list-item-subtitle>{{
                          selectedUser.name
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>学号</v-list-item-title>
                      <v-list-item-subtitle>{{
                          selectedUser.userID
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>QQ</v-list-item-title>
                      <v-list-item-subtitle>{{
                          selectedUser.qq ? selectedUser.qq : '不存在'
                        }}
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
                      <v-list-item-subtitle>{{
                          selectedUser.college
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>专业</v-list-item-title>
                      <v-list-item-subtitle>{{
                          selectedUser.major
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>班级</v-list-item-title>
                      <v-list-item-subtitle>{{
                          selectedUser.classID
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="paticipantDialog = true">
              删除人员
            </v-btn>
            <v-btn text color="primary" @click="dialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 删除确认 -->
      <v-dialog
        v-model="paticipantDialog"
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
            <v-btn text color="primary" @click="paticipantDialog = false"
            >关闭
            </v-btn
            >
            <v-btn color="primary"> 确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 共同体人员管理 -->
      <v-dialog v-model="managerPaticipantDialog" max-width="800">
        <v-data-table
          v-model="seletedUserId"
          :headers="managerPaticipantHeaders"
          :items="participants"
          :search="participantSearch"
          :items-per-page="5"
          fixed-header
          :footer-props="{
            'items-per-page-all-text': '全部',
            'items-per-page-text': '条/页',
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
                  <v-list-item link>
                    <v-list-item-title> 通过</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                text
                icon
                color="red"
                class="ml-2"
                @click="managerPaticipantDialog = false"
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
            <v-chip v-if="item.type == 1" color="orange" dark> 指导者</v-chip>
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
              <v-col cols="4"
              >
                <v-hover v-slot="{ hover }">
                  <v-card
                    class="my-4 rounded-lg"
                    :elevation="hover ? 12 : 2"
                    @click="beginUpload"
                  >
                    <v-img
                      aspect-ratio="1"
                      class="align-center"
                      :src="cover"
                      contain
                    >
                    </v-img>
                    <v-file-input
                      v-show="false"
                      id="image_input"
                      accept="image/jpeg, image/png, image/gif, image/bmp, image/webp"
                      @change="uploadImage"
                    ></v-file-input>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="8">
                <v-select
                  v-model="recordSeletedUserId"
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
                  <template
                    #selection="{ attrs, item, parent, selected }"
                  >
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
                            recordSeletedUserId.length > 0 ? 'indigo' : ''
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
            <v-btn color="primary" text @click="recordDialog = false"> 取消</v-btn>
            <v-btn color="primary">提交</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {Community, CommunityParticipant, ImageResponse, User} from '~/plugins'

interface Data {
  dialog: boolean
  paticipantDialog: boolean
  seletedUserId: number[]
  recordSeletedUserId: number[]
  validParticipants: CommunityParticipant[]
  managerPaticipantDialog: boolean
  recordDialog: boolean
  selectedUser: CommunityParticipant
  managerPaticipantHeaders: any
  participants?: CommunityParticipant[]
  participantSearch: string
  recordContent: string
  recordImage: File | null
  imageBase64: string
}

export default Vue.extend({
  async asyncData({$axios, params, $auth, error}) {
    try {
      const {data} = await $axios.get('/api/community/' + params.id)
      const community: Community = data.data
      // @ts-ignore
      const participants = community.mentors.concat(community.participants)
      // @ts-ignore
      const user: User = $auth.user
      const isParticipant =
        participants.find(
          (participant) => participant.id === user.id && participant.valid
        ) !== undefined
      const validParticipants = participants.filter(
        (participant) => participant.valid
      )
      return {
        community,
        participants,
        isParticipant,
        validParticipants,
      }
    } catch (e: any) {
      error({statusCode: 404, message: e.response.data.message})
    }
  },
  data(): Data {
    return {
      dialog: false,
      paticipantDialog: false,
      managerPaticipantDialog: false,
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
        valid: false,
      },
      managerPaticipantHeaders: [
        {
          text: '姓名',
          align: 'left',
          value: 'name',
        },
        {
          text: '状态',
          align: 'left',
          value: 'valid',
        },
        {
          text: '角色',
          align: 'left',
          value: 'type',
        },
        {
          text: '学号',
          align: 'left',
          value: 'userID',
        },
        {
          text: '专业',
          align: 'left',
          value: 'major',
          cellClass: 'text-caption',
        },
        {
          text: '操作',
          align: 'left',
          sortable: false,
          value: 'actions',
        },
      ],
      seletedUserId: [],
      participantSearch: '',
      recordSeletedUserId: [],
      validParticipants: [],
      recordContent: '',
      recordImage: null,
      imageBase64: '',
    }
  },
  computed: {
    selectSome(): boolean {
      return this.recordSeletedUserId.length > 0 && !this.selectAll
    },
    selectAll(): boolean {
      return this.recordSeletedUserId.length === this.validParticipants.length
    },
    icon(): string {
      if (this.selectAll) return 'mdi-close-box'
      if (this.selectSome) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    cover(): string {
      if (this.imageBase64 !== '') return this.imageBase64
      return '/upload.svg'
    },
  },
  mounted() {
    this.$prism.highlightAll()
  },
  methods: {
    userInfo (participant: CommunityParticipant) {
      this.selectedUser = participant
      this.dialog = true
    },
    editCommunity () {
    },
    deleteCommunity () {
    },
    managerParticipant () {
    },
    getSrcSet(imgData: ImageResponse) {
      let srcSet = ''
      for (const img of imgData.srcset) {
        srcSet += `${img.url} ${img.width}w,\n`
      }
      srcSet = srcSet.substr(0, srcSet.length - 2)
      return srcSet
    },
    uploadImage (file: File) {
      if (file) {
        this.recordImage = file
        this.imagefileToBase64(file).then((data) => {
          this.imageBase64 = data
        })
      }
    },
    deleteParticipant (p: CommunityParticipant) {
      // eslint-disable-next-line no-console
      console.log(p)
    },
    pagetext (
      pageStart: number,
      pageStop: number,
    ) {
      return `第 ${pageStart} 页，共 ${pageStop} 页`
    },
    toggle() {
      this.$nextTick(() => {
        if (this.selectAll) {
          this.recordSeletedUserId = []
        } else {
          this.recordSeletedUserId = this.validParticipants.map(
            (participant) => participant.id
          )
        }
      })
    },
    imagefileToBase64(file: File): Promise<string> {
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
      ;(document.getElementById('image_input') as HTMLInputElement).click()
    },
  },
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
</style>
