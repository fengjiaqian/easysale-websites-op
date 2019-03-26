<template>
<div>
  <h2 class="header">产品详情</h2>
  <div class="block-box">
    <h3>产品信息</h3>
    <el-row>
      <el-col :span="8">产品名称：{{productName}}</el-col>
      <el-col :span="8">产品品牌：{{brand}}</el-col>
      <el-col :span="8">业务城市：{{city}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="8">仓库：{{warehouse}}</el-col>
      <el-col :span="8">经销商手机：{{dealerPhone}}</el-col>
      <el-col :span="8">包装规格：{{packingUnit}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="8">是否收取费用：{{warehouse}}</el-col>
      <el-col :span="8">业务类型：{{dealerPhone}}</el-col>
      <el-col :span="8">首次入库时间：{{packingUnit}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="8">状态：{{state}}</el-col>
    </el-row>
  </div>
  <div class="block-box">
    <h3>费用信息</h3>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="费用信息" name="first">
        <el-row>
          <el-col :span="12">下货费：{{shipGoodsFee}}</el-col>
          <el-col :span="12">分拣费：{{sortFee}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">托管费：{{depositFee}}</el-col>
          <el-col :span="12">装车费：{{loadFee}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">配送费：{{deliveryFee}}</el-col>
          <el-col :span="12">卸货费：{{unloadingFee}}</el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="库存信息" name="second">
        <el-row>
          <el-col :span="2">
            <span style="line-height: 2.6rem">时间：</span>
          </el-col>
          <el-col :span="5">
            <div class="block">
              <el-date-picker
                v-model="value6"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button class="btn-inbox" type="primary" size="medium">查询</el-button>
            <el-button class="btn-inbox" type="info" @click="emptyContent" size="medium">重置</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="dataTable"
          border
          style="width: 100%;margin-top: 30px">
          <el-table-column label="序号" width="315">
            <template slot-scope="scope">
              <span>{{indexMethods(scope.$index)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作"
            width="315">
          </el-table-column>
          <el-table-column
            prop="number"
            label="数量"
            width="315">
          </el-table-column>
          <el-table-column
            prop="date"
            label="时间"
            width="316">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>

<script>
    export default {
        name: "productDetail",
      data(){
          return{
            activeName:'first',
            pageNum: 1,
            pageSize: 5,
            dataTable:[{
              operate:'出库',
              number:'1件',
              date: '2018-04-11~2018-05-12'
            },{
              operate:'入库',
              number:'1件',
              date: '2018-04-11~2018-05-12'
            }],
            productName:'剑南春12年400ml',
            brand:'剑南春',
            city:'武汉市花山',
            warehouse:'武汉市易酒批仓库1号',
            dealerPhone:'18854877854',
            packingUnit:'10瓶/件',
            cost:'否',
            businessType:'正常业务',
            firstInDate: '18-04-09  18:06',
            state:'带设置费用',
            shipGoodsFee: '0.00元/件',
            sortFee: '0元/件',
            depositFee: '0元/件',
            loadFee: '0元/件',
            deliveryFee: '0元/件',
            unloadingFee: '0元/件',

          }
      },
      methods:{
        handClick(tab, event) {

        },
        emptyContent() {

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
  height 250px;
  width 80%;
  .el-row{
    margin-top 27px
  }
}
</style>
