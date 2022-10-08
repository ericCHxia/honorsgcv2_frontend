<template>
  <v-list-item two-line>
    <v-list-item-avatar :size="small?30:50" color="blue-grey lighten-4">
      <v-img :src="avatar"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title :class="'font-weight-bold '+small?'caption':''">
        {{ user.name }}
      </v-list-item-title>
      <v-list-item-subtitle :class="small?'caption':'text-overline'">
        <span v-if="user.userId.length===8">{{user.userId.substr(0,2)+'级 '}}</span>
        <span v-if="simplify">{{user.subject|formatSubject}}</span>
        <span v-else>{{user.subject}}</span>
      </v-list-item-subtitle>
      <v-list-item-subtitle :class="small?'caption':''">{{ date|formatDate }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-card-actions>
      <slot name="tail">
      </slot>
    </v-card-actions>

  </v-list-item>
</template>

<script lang="ts">
import Vue from "vue";
import { PropType } from "@vue/composition-api";
import { identicon } from 'minidenticons'
import { User } from "~/src";

export default Vue.extend({
  name: "UserBar",
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    date: {
      type: Number,
      required: false,
      default: 0
    },
    small: {
      type: Boolean,
      default: false
    },
    simplify: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    avatar(): string {
      if (this.user.avatar.trim().length > 0) {
        return `/image/50/${this.user.avatar}`
      } else {
        const data = identicon(String(this.user.id))
        const out = 'data:image/svg+xml;utf8,' + encodeURIComponent(data);
        return out
      }
    }
  }
})
</script>
