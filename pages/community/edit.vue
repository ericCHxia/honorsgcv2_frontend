<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="12">
      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <client-only>
              <HonorEditor v-model="content.detail"/>
            </client-only>
          </v-col>
          <v-col cols="12" md="4" class="justify-space-between">
            <v-card>
              <v-card-title>
                <span class="headline">设置</span>
              </v-card-title>

              <v-card-text>
                <v-btn class="align-center" block>
                  <v-icon color="blue" x-large>mdi-cloud-upload</v-icon>
                  上传封面
                </v-btn>
                <v-card class="my-4 rounded-lg">
                  <v-img
                    class="grey lighten-2"
                    contain
                    aspect-ratio="1"
                    height="250"
                    elevation="5"
                    src="http://localhost:3000/image/org/b79271ad9b554ddb9465efe83911d144.png"
                  >
                  </v-img>
                </v-card>
                <v-text-field v-model="content.title" label="标题">
                </v-text-field>
                <v-text-field v-model="content.limit" label="人数限制">
                  <template #append>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-icon v-on="on"> mdi-help-circle-outline</v-icon>
                      </template>
                      <span> 如果为0，则不限制人数 </span>
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-select
                  v-model="content.typeId"
                  label="共同体类型"
                  :items="types"
                  item-value="id"
                  item-text="name"
                ></v-select>
                <v-select
                  v-model="content.registrationType"
                  label="报名类型"
                  :items="registrationTypes"
                  item-value="id"
                  item-text="name"
                >
                  <template #append>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-icon v-on="on"> mdi-help-circle-outline</v-icon>
                      </template>
                      <span>
                        "自由报名"：参与共同体不需要审批<br/>
                        "审批报名"：参与共同体需要审批
                      </span>
                    </v-tooltip>
                  </template>
                </v-select>
                <v-textarea label="描述"></v-textarea>
                <v-checkbox
                  v-model="content.needMentor"
                  :label="`指导者: ${content.needMentor ? '需要' : '不需要'}`"
                ></v-checkbox>
              </v-card-text>

              <v-card-actions class="justify-space-between">
                <v-btn color="primary">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import HonorEditor from '@/components/Editor.vue'

export default Vue.extend({
  components: {
    HonorEditor,
  },
  async asyncData({$axios}) {
    const {data} = await $axios.get('/api/community/type')
    return {
      types: data.data,
    }
  },
  data() {
    return {
      content: {
        title: '',
        detail: '',
        typeId: null,
        needMentor: true,
        registrationType: 0,
        limit: 0,
      },
      types: [],
      registrationTypes: [
        {
          id: 0,
          name: '自由报名',
        },
        {
          id: 1,
          name: '审批报名',
        },
      ],
    }
  },
  head() {
    return {
      title: '编辑共同体',
    }
  },
})
</script>
