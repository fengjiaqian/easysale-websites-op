<template>
  <div class="block-box">
    <h4>店铺审核详情</h4>
    <el-row>

      <el-col :span="8">联系人电话：{{dealerDetailInfo.contactNumber}}</el-col>
      <el-col :span="8">联系人：{{dealerDetailInfo.contactor}}</el-col>
      <el-col :span="8">经销商名称：{{dealerDetailInfo.dealerName}}</el-col>
      <el-col :span="8">经销商LOGO：<img :src="dealerDetailInfo.imgUrl" class="dealerLogo"/></el-col>
      <el-col :span="8">经销商审核状态：{{dealerDetailInfo.dealerState==0?'待审核':'已通过'}}</el-col>
      <el-col :span="8">经销商类型：{{dealerDetailInfo.dealerType==0?'普通经销商':'采购经销商'}}</el-col>
      <el-col :span="8">详细地址：{{dealerDetailInfo.address}}</el-col>
    </el-row>
    <el-button class="button" @click="$router.go(-1)">返回</el-button>
  </div>
</template>

<script>
  import http from 'http/dealerManageApi'

  export default {
    name: "dealerAuditDetail",
    data() {
      return {
        dealerDetailInfo: {},
        dealerId: ``
      }
    },
    activated() {
      // console.log(this.$route.query.dealerId)
      this.dealerId = this.$route.query.dealerId
      this.getDealerDetail()
    },
    methods: {
      getDealerDetail() {
        let {dealerId} = this

        return http.dealerAuditDetail({dealerId}).then(data => {
          this.dealerDetailInfo = data
        })
      },
    },
  }
</script>

<style scoped lang="stylus">

  .el-row {
    margin-bottom 20px;

    .el-col {
      font-size 14px;
      color: #333;
      padding-bottom: 20px
      display: flex
      align-items:center
    }
  }

    .dealerLogo{
      width:50px
      height:50px
    }

  .button {
    position fixed;
    bottom 80px;
    left 50%;
  }
</style>
