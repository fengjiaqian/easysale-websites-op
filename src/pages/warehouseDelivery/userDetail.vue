<template>
  <div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="base"></el-tab-pane>
      <el-tab-pane label="仓配服务信息" name="warehouse"></el-tab-pane>
      <el-tab-pane label="服务数据" name="service"></el-tab-pane>
      <el-tab-pane label="托管商品" name="product"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component v-show="activeName!==`base`" :is="selectView" :dealerId="dealerInfo.dealerId"></component>
    </keep-alive>
    <!-- ***************************************************基本信息********************************************-->
    <div v-show="activeName===`base`" class="dealerInfo">
      <el-row>
        <el-col :span="8">经销商手机：{{dealerInfo.mobileNo}}</el-col>
        <el-col :span="8">首次申请服务时间：{{dealerInfo.firstServiceTime}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">是否收取仓配费用：{{dealerInfo.isGetWarehouseCharge===1?`是`:`否`}}</el-col>
        <el-col :span="8">业务类型：{{dealerInfo.businessType===0?`正常业务`:`贷款业务`}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">状态：{{dealerInfo.status===0?`停用`:`启用`}}</el-col>
      </el-row>
    </div>

    <div class="backHome">
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>

  </div>
</template>


<script>

  import warehouseForm from '@/pages/dealerDetailComponents/dealerDetailWarehouseForm'
  import serviceForm from '@/pages/dealerDetailComponents/dealerDetailServiceForm'
  import productForm from '@/pages/dealerDetailComponents/dealerDetailProductForm'

  export default {
    name: 'userDetail',
    props: [],
    data() {
      return {
        activeName: `base`,
        dealerInfo: {},
      }
    },
    components: {
      warehouseForm, serviceForm, productForm
    },
    activated() {
      this.dealerInfo = JSON.parse(this.$route.query.dealerInfo) || {}
      console.log(this.dealerInfo)
    },
    methods: {
      handleClick(tab, event) {
        console.log(`tab`, tab.name)
      },
      indexMethods(index, type) {
        return (this[type].pageNum - 1) * this[type].pageSize + index + 1
      },
      goBack() {
        this.$router.push({name: `wareHouseDealer`})
      },
    },
    computed: {
      selectView() {
        return this.activeName === `warehouse` ? `warehouseForm` :
          this.activeName === `service` ? `serviceForm` :
            this.activeName === `product` ? `productForm` : ``
      }
    },
  }
</script>


<style lang="stylus" scoped>
  .dealerInfo {
    margin-top: 12px
  }

  .el-row {
    font-size: 14px
    padding-bottom: 12px
  }

  .backHome {
    text-align: center
    margin-top:40px
  }

</style>
