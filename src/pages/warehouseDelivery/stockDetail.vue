<template>
  <div>
    <h2 class="header">库存详情</h2>
    <div class="block-box">
      <h3>经销商信息</h3>
      <el-row>
        <el-col :span="8">经销商手机：{{}}</el-col>
        <el-col :span="8">首次申请服务时间：{{}}</el-col>
        <el-col :span="8">是否收取仓配费用：{{}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">业务类型：{{}}</el-col>
        <el-col :span="8">状态：{{}}</el-col>
        <el-col :span="8">仓库：{{}}</el-col>
      </el-row>

    </div>

    <div class="block-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="库存信息" name="first">
          <el-row style="margin-top: 10px">
            <el-col :span="2" style="line-height: 30px">
              <span>产品名称：</span>
            </el-col>
            <el-col :span="4">
              <el-input v-model="productName" placeholder="请输入"></el-input>
            </el-col>
            <el-col :span="2" :offset="1" style="line-height: 30px">
              <span>产品品牌：</span>
            </el-col>
            <el-col :span="4">
              <el-input v-model="brand" placeholder="请输入"></el-input>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-button class="btn-inbox" type="primary" size="medium">查询</el-button>
              <el-button class="btn-inbox" type="info" @click="emptyContent" size="medium">重置</el-button>
            </el-col>
          </el-row>

          <el-table
            :data="stockInfoList"
            border
            style="width: 100%;margin-top: 30px">
            <el-table-column label="序号" width="181">
              <template slot-scope="scope">
                <span>{{indexMethods(scope.$index)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operate"
              label="产品名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="number"
              label="品牌"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="包装规格"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="库存"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="待入库"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="待出库"
              width="180">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-row>
      <el-col :span="6" :offset="9">
        <el-button type="primary">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "stockDetail",
    data(){
      return{
        pageNum: 1,
        pageSize: 5,
        activeName:'first',
        productName:'',
        brand:'',
        stockInfoList:[],
      }
    },
    methods:{
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

