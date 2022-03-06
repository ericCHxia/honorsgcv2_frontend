<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  asyncData({redirect}) {
    redirect('/notice/1')
  }
})
</script>
