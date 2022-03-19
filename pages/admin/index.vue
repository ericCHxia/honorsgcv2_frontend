<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col>
          <v-card outlined height="100%">
            <v-card-title>磁盘监控</v-card-title>
            <v-card-text
              ><v-progress-circular
                :rotate="360"
                :size="100"
                :width="10"
                :value="
                  100 -
                  (health.components.diskSpace.details.free /
                    health.components.diskSpace.details.total) *
                    100
                "
                color="teal"
              >
                {{
                  Math.floor(
                    (health.components.diskSpace.details.total -
                      health.components.diskSpace.details.free) /
                      1024 /
                      1024 /
                      1024
                  )
                }}G/{{
                  Math.floor(
                    health.components.diskSpace.details.total /
                      1024 /
                      1024 /
                      1024
                  )
                }}G
              </v-progress-circular></v-card-text
            >
          </v-card>
        </v-col>
        <v-col>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">共同体类型</th>
                  <th class="text-left">数量</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>待通过</td>
                  <td>{{ state['0'] }}</td>
                </tr>
                <tr>
                  <td>可见</td>
                  <td>{{ state['1'] }}</td>
                </tr>
                <tr>
                  <td>隐藏</td>
                  <td>{{ state['2'] }}</td>
                </tr>
                <tr>
                  <td>总计</td>
                  <td>{{ state['total'] }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'

interface Data {
  health: any
}

export default Vue.extend({
  layout: 'admin',
  async asyncData({ $axios }) {
    const healthResonpse = await $axios.get('/api/actuator/health')
    const health = healthResonpse.data.data
    const communityCommintyStateResponse = await $axios.get(
      '/api/community/state'
    )
    return { health, state: communityCommintyStateResponse.data.data }
  },
  data(): Data {
    return {
      health: {},
    }
  },
})
</script>
