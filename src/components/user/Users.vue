<template>
  <div class="login_container">
    <span style="color: #000;">个人中心</span>
    <a-button type="primary" @click="info">
      Primary
    </a-button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    info () {
      this.$message.info('This is a normal message')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
