<template>
  <div>
    <h4>仓库信息</h4>
    <div class="block-box">
      <el-row>
        <el-col :span="8">仓库名称：{{warehouseDetail.name}}</el-col>
        <el-col :span="8">城市：{{warehouseDetail.city}}</el-col>
        <el-col :span="8">地址：{{`${warehouseDetail.province||``}${warehouseDetail.city||``}${warehouseDetail.county||``}${warehouseDetail.street||``}`}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">下货费：{{warehouseDetail.unloadingCharge}}元/件</el-col>
        <el-col :span="8">分拣费：{{warehouseDetail.sortingCharge}}元/件</el-col>
        <el-col :span="8">托管费：{{warehouseDetail.custodianCharge}}元/件</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">装车费：{{warehouseDetail.loadingCharge}}元/件</el-col>
        <el-col :span="8">运输费：{{warehouseDetail.transportCharge}}元/件</el-col>
        <el-col :span="8">卸货费：{{warehouseDetail.landingCharge}}元/件</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">状态：{{warehouseDetail.status===0?`停用`:warehouseDetail.status===1?`启用`:``}}</el-col>
      </el-row>
    </div>
    <el-button class="button" @click="$router.go(-1)">返回</el-button>
  </div>
</template>

<script>
  export default {
    name: "warehouseMessageDetail",
    data() {
      return {
        warehouseDetail: {}
      }
    },
    activated() {
      this.warehouseDetail = this.$route.query.warehouse||{}
    },
    methods: {}
  }
</script>

<style lang="stylus" scoped>
  .header {
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .el-row {
    margin-bottom 20px;

    .el-col {
      font-size 14px;
      color: #333;
    }
  }

  .button {
    position fixed;
    bottom 80px;
    left 50%;
  }


</style>
