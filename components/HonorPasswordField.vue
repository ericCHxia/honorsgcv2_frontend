<template>
  <v-text-field
    v-model="inputValue"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    :type="show ? 'text' : 'password'"
    :rules="rules"
    :label="label"
    clearable
    @click:append="show = !show"
    @keyup="keyup"
  ></v-text-field>
</template>

<script lang="ts">
import { PropType } from '@vue/composition-api'
import Vue from 'vue'

interface Data {
  show: boolean
  inputValue: string
}

export default Vue.extend({
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    },
    rules: {
      type: Array as PropType<Array<(v: string) => string | boolean>>,
      required: false,
      default() {
        return []
      }
    },
    label: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  data(): Data {
    return {
      show: false,
      inputValue: ''
    }
  },
  watch: {
    inputValue: {
      handler(value: string) {
        this.$emit('input', value)
      },
      deep: true
    },
    value: {
      handler(value: string) {
        this.inputValue = value
      },
      deep: true
    }
  },
  created() {
    this.inputValue = this.value
  },
  methods: {
    keyup(inputValue:any) {
      this.$emit('keyup', inputValue)
    }
  }
})
</script>
