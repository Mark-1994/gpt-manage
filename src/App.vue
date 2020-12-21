<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
#app,
.login_container {
  height: 100%;
}
.login_container {
  background-color: #f0f2f5;
}
</style>
