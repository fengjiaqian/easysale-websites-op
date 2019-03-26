<template>
  <div id="productDetail" v-loading="loading">
    <h4>产品信息</h4>
    <div class="productInfo">
      <div class="product-info-content"><span>产品名称：</span>
        <p>{{productDetailInfo.productName}}</p></div>
      <div class="product-info-content"><span>产品品牌：</span>
        <p>{{productDetailInfo.productBrand}}</p></div>
      <div class="product-info-content"><span>经销商手机：</span>
        <p>{{productDetailInfo.mobileNo}}</p></div>
      <div class="product-info-content"><span>包装规格：</span>
        <p>{{productDetailInfo.specificationName}}</p></div>
    </div>
    <!--<el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane label="费用信息" name=0></el-tab-pane>
    </el-tabs>-->
    <ul class="cost-info-title">
      <li>费用信息</li>
    </ul>
    <!--费用信息-->
    <div class="costInfo">
      <div class="cost-info-content"><span>下货费：</span>
        <p>{{productDetailInfo.unloadingCharge}}元/件</p></div>
      <div class="cost-info-content"><span>分拣费：</span>
        <p>{{productDetailInfo.sortingCharge}}元/件</p></div>
      <div class="cost-info-content"><span>托管费：</span>
        <p>{{productDetailInfo.custodianCharge}}元/件</p></div>
      <div class="cost-info-content"><span>装车费：</span>
        <p>{{productDetailInfo.loadingCharge}}元/件</p></div>
      <div class="cost-info-content"><span>配送费：</span>
        <p>{{productDetailInfo.transportCharge}}元/件</p></div>
      <div class="cost-info-content"><span>卸货费：</span>
        <p>{{productDetailInfo.landingCharge}}元/件</p></div>
    </div>
    <div class="backHome">
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
  import http from 'http/productManageApi'

  export default {
    name: "productDetail",
    data() {
      return {
        productDetailInfo: {},
        /*productSpecificationId: ``,    //产品规格参数id
        dealerId: ``,*/
        productInfo: {},
        loading:false
      }
    },
    activated() {
      this.productInfo = this.$route.query.productInfo
      this.getProductInfo()
    },
    methods: {
      getProductInfo() {
        this.loading = true
        // let {productSpecificationId, dealerId} = this
        http.getProductDetailInfo(this.productInfo).then(data => {
          this.productDetailInfo = data
          this.loading = false
        })
          .catch(e=>{
            this.loading = false
            this.$message(e)
          })
      },
      handleClick(val) {

      },
      goBack() {
        this.$router.push({name: `applyWarehouseProduct`})
      },
    }
  }
</script>

<style scoped lang="stylus">
  .productInfo {
    display: flex
    flex-wrap: wrap
  }

  .product-info-content {
    display: flex
    align-items: center
    width: 25%
    font-size: 14px
    margin-bottom: 20px

    > span {
      color: #333
    }

    > p {
      color: #666
      margin: 0
    }
  }

  .costInfo {
    display: flex
    flex-wrap: wrap

    > .cost-info-content {
      display: flex
      align-items: center
      width: 50%
      font-size: 14px
      margin-bottom: 20px

      > span {
        color: #333
      }

      > p {
        color: #666
        margin: 0
      }
    }
  }

  .backHome {
    text-align: center
    margin-top: 50px
  }

  .cost-info-title {
    display: flex
    align-items: center
    border-bottom: 1px solid #ededed
    font-size: 14px
    li {
      list-style none
      padding: 12px 6px
      border-bottom: 1px solid #409EFF
      color: #409EFF
    }
  }

</style>
