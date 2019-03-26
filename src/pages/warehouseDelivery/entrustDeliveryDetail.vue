<template>
  <div>
    <div class="block-box">
      <h4>出库单信息</h4>
      <el-row>
        <el-col :span="8">出库单编号：{{stockNo}}</el-col>
        <el-col :span="8">仓库：{{detailInfoList.warehouseName}}</el-col>
        <el-col :span="8">经销商手机：{{detailInfoList.mobileNo}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">是否收费：{{detailInfoList.isGetWarehouseCharge?'是':'否'}}</el-col>
        <el-col :span="8">业务类型：{{detailInfoList.businessType?'贷款业务':'正常业务'}}</el-col>
        <el-col :span="8">下货费用：{{detailInfoList.shipGoodsAmount}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">配送费：{{detailInfoList.deliveryFee}}</el-col>
        <el-col :span="8">托管费：{{detailInfoList.depositFee}}</el-col>
        <el-col :span="8">装货费：{{detailInfoList.loadingCharge}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">创建时间：{{detailInfoList.createTime}}</el-col>
        <!--出库单据状态(待支付 = 0,待提货 = 1,待出库 = 2,已出库 = 3,部分出库 = 4,已取消 = 5)；-->
        <el-col :span="8">状态：
          {{detailInfoList.state===2?'待出库':detailInfoList.state===3?'已出库':detailInfoList.state===4?'部分出库':detailInfoList.state===0?'待支付':detailInfoList.state===1?'待提货':'已取消'}}
        </el-col>
      </el-row>
    </div>

    <div class="block-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品信息" name="first">
          <el-table
            :data="productList"
            border
            style="width: 100%;margin-top: 30px">
            <el-table-column label="序号">
              <template slot-scope="scope">
                <span>{{indexMethods(scope.$index)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="productName"
              label="产品名称"
              >
            </el-table-column>
            <el-table-column
              prop="specificationName"
              label="包装规格"
              >
            </el-table-column>
            <el-table-column
              prop="resultUnit"
              label="出库数量"
              >
            </el-table-column>
            <el-table-column
              prop="custodianCharge"
              label="托管费"
             >
            </el-table-column>
            <el-table-column
              prop="deliveryFee"
              label="运输费"
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="提货人信息" name="second">
          <div style="line-height: 20px;margin-top: 30px; font-size: 14px;">
            <div>姓名：{{consigneeInfo.userName}}</div>
            <div style="margin-top: 20px">身份证号：{{consigneeInfo.identitycard}}</div>
            <div style="margin-top: 20px">手机号：{{consigneeInfo.userMobileNo}}</div>
            <div style="margin-top: 20px">预计提货时间：{{consigneeInfo.pickuptime}}</div>
          </div>

        </el-tab-pane>
        <!--<el-tab-pane label="分配调度记录" name="third">-->
          <!--<div v-for="item of recordList" style="line-height: 20px;margin-top: 30px">-->
            <!--<span>{{item}}</span>-->
          <!--</div>-->

        <!--</el-tab-pane>-->
      </el-tabs>
    </div>
    <el-row>
      <el-col :span="6" :offset="9">
        <el-button type="primary" @click="goBack">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import http from 'http/orderManageApi';
  export default {
    name: "entrustDeliveryDetail",
    data(){
      return{
        pageNum: 1,
        pageSize: 5,
        activeName: 'first',
        recordList: [],
        stockNo: null,
        dealerId: null,
        detailInfoList: {},
        productList: [],
        consigneeInfo:{
          userName:``,
          identitycard:``,
          userMobileNo:``,
          pickuptime:``
        },//提货人信息
      }
    },
    mounted(){
      this.stockNo = this.$route.params.stockNo;
      this.dealerId = this.$route.params.dealerId;
      this.selectApplyStockNoteDetail();
    },
    activated() {
      this.stockNo = this.$route.params.stockNo;
      this.dealerId = this.$route.params.dealerId;
      this.selectApplyStockNoteDetail();
    },
    methods:{
      selectApplyStockNoteDetail() {
        let {stockNo, dealerId} = this;
        http.selectApplyStockNoteDetail({stockNo, dealerId}).then(data => {
          this.detailInfoList = data||[];
          if(data.items) {
            data.items.forEach(item => {
              item.resultUnit = item.packageCount + '' + item.packageName + '' + item.unitCount + '' + item.unitName
            });
          }
          this.productList = data.items||[]
          this.consigneeInfo=data.stockUserInfo;
          console.log('product', this.productList)
        }).catch(e => {
          console.log(e)
        })
      },
      goBack() {
        this.$router.go(-1)
      },
      handleClick() {
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .header{
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .block-box{
    height 265px;
    width 80%;
    .el-row{
      margin-top 22px
    }
  }

  .el-col{
    font-size:14px
  }
</style>


