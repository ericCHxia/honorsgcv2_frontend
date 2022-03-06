<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  asyncData({redirect}) {
    redirect('/article/1')
  }
})
</script>
