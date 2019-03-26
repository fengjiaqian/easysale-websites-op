<template>
  <div>
    <div class="block-box">
      <h3>入库单信息</h3>
      <el-row>
        <el-col :span="8">入库单编号：{{stockNo}}</el-col>
        <el-col :span="8">仓库：{{detailInfoList.warehouseName}}</el-col>
        <el-col :span="8">经销商手机：{{detailInfoList.mobileNo}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">是否收费：{{detailInfoList.isGetWarehouseCharge?'是':'否'}}</el-col>
        <el-col :span="8">业务类型：{{detailInfoList. businessType?'贷款业务':'正常业务'}}</el-col>
        <el-col :span="8">下货费用：{{detailInfoList.shipGoodsAmount}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">分拣费用：{{detailInfoList.sortingFee}}</el-col>
        <el-col :span="8">创建时间：{{detailInfoList.createTime}}</el-col>
        <!--待审核的是0，待入库的是1，已入库的是4，已取消7-->
        <!--申请入库 = 0,待入库 = 1,部分入库 = 2,拒绝入库 = 3,已入库 = 4,已过期 = 5,待支付=6，已取消 =7-->
        <el-col :span="8">
          状态：{{detailInfoList.state===0?'待审核':detailInfoList.state===1?'待入库':detailInfoList.state===2?'部分入库':detailInfoList.state===3?'拒绝入库':detailInfoList.state===4?'已入库':detailInfoList.state===5?'已过期':detailInfoList.state===6?'待支付':'已取消'}}
        </el-col>
      </el-row>
      <el-row>

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
              label="入库数量"
              >
            </el-table-column>
            <el-table-column
              prop="sortingCharge"
              label="分拣费"
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--<el-tab-pane label="分配调度记录" name="second">-->
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
  import {mapState, mapGetters} from 'vuex';

  export default {
    name: "inboundDetail",
    data() {
      return {
        pageNum: 1,
        pageSize: 5,
        activeName: 'first',
        recordList: [],
        stockNo: null,
        dealerId: null,
        detailInfoList: {},
        productList: [],
      }
    },
    mounted() {
      this.stockNo = this.$route.params.stockNo;
      this.dealerId = this.$route.params.dealerId;
      this.selectInStockNoteDetail();
    },
    activated(){
      this.stockNo = this.$route.params.stockNo;
      this.dealerId = this.$route.params.dealerId;
      this.selectInStockNoteDetail();
    },
    methods: {
      //入库单详情
      selectInStockNoteDetail() {
        let {stockNo, dealerId} = this;
        http.selectInStockNoteDetail({stockNo, dealerId}).then(data => {
          this.detailInfoList = data||[];
          if(data.items) {
            data.items.forEach(item => {
              item.resultUnit = item.packageCount + '' + item.packageName + '' + item.unitCount + '' + item.unitName
            });
          }
            this.productList = data.items||[]

          console.log('product', this.productList)
        }).catch(e => {
          console.log(e)
        })
      },
      handleClick() {
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      goBack() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .header {
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .block-box {
    height 250px;
    width 80%;
    .el-row {
      margin-top 27px
      font-size:14px
    }
  }
</style>
