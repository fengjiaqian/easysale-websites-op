<template>
  <div id="welcomePage" style="margin:0 auto;width:300px;height:100px">
    <H1> {{msg}}</H1>
  </div>
</template>

<script>
    export default {
        name: "welcomePage",
        data(){
          return {
            msg:'易经销后台管理系统！'
          }
        }
    }
</script>

<style scoped>

</style>
