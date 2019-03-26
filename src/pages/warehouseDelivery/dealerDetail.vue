<template>
  <div>
    <h2 class="header">经销商详情</h2>
    <!--基本信息-->
    <el-tabs v-model="activeName" style="height: 670px" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <div class="box">
          <p>经销商手机：{{}}</p>
          <p>是否收取仓配费用：{{}}</p>
          <p>状态：{{}}</p>
        </div>
      </el-tab-pane>
      <!--仓配服务信息-->
      <el-tab-pane label="仓配服务信息" name="second">
        <div class="box">
          <el-row type="flex">
            <el-col :span="1">
              <span style="line-height: 2.6rem">城市：</span>
            </el-col>
            <el-col :span="3">
              <el-select v-model="state" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-button class="btn-inbox" type="primary" size="medium">查询</el-button>
              <el-button class="btn-inbox" type="info" @click="emptyContent" size="medium">重置</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top: 30px">
            <el-table-column label="序号" width="257">
              <template slot-scope="scope">
                <span>{{indexMethods(scope.$index)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="city"
              label="城市"
              width="330">
            </el-table-column>
            <el-table-column
              prop="warehouse"
              label="仓库"
              width="330">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              width="330">
            </el-table-column>
            <el-table-column
              prop="firstDate"
              label="首次使用时间"
              width="330">
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handlePageNumChange($event)"
            :page-size="pageSize"
            :total="totalCount"
            v-if="totalCount>0"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <!--服务数据-->
      <el-tab-pane label="服务数据" name="third">
        <div class="box">
          <el-row type="flex">
            <el-col :span="1">
              <span style="line-height: 2.6rem">城市：</span>
            </el-col>
            <el-col :span="3">
              <el-select v-model="state" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1" :offset="1">
              <span style="line-height: 2.6rem">仓库：</span>
            </el-col>
            <el-col :span="3">
              <el-select v-model="state" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in optionTwo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1" :offset="1">
              <span style="line-height: 2.6rem">时间：</span>
            </el-col>
            <el-col :span="6">
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
            <el-col :span="3" :offset="1">
              <el-button class="btn-inbox" type="primary">查询</el-button>
              <el-button class="btn-inbox" type="info" @click="emptyContent">重置</el-button>
            </el-col>
          </el-row>
          <el-row class="boxNum">
            <el-col :span="4" style="text-align: center" >
              <div style="color: #0096FF">￥0</div>
              <div>分拣费用</div>
            </el-col>
            <el-col :span="4" style="text-align: center">
              <div style="color: #0096FF">￥0</div>
              <div>配送费用</div>
            </el-col>
            <el-col :span="4" style="text-align: center">
              <div style="color: #0096FF">￥0</div>
              <div>托管费用</div>
            </el-col>
            <el-col :span="4" style="text-align: center">
              <div style="color: #0096FF">￥0</div>
              <div>入库申请数</div>
            </el-col>
            <el-col :span="4" style="text-align: center">
              <div style="color: #0096FF">￥0</div>
              <div>出库自提申请数</div>
            </el-col>
            <el-col :span="4" style="text-align: center">
              <div style="color: #0096FF">￥0</div>
              <div>委托配送申请数</div>
            </el-col>
          </el-row>
          <el-table
            :data="tableDataTwo"
            border
            style="width: 100%;margin-top: 30px">
            <el-table-column label="序号" width="168">
              <template slot-scope="scope">
                <span>{{indexMethods(scope.$index)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              label="时间"
              width="176">
            </el-table-column>
            <el-table-column
              prop="sortingFee"
              label="分拣费用（元）"
              width="176">
            </el-table-column>
            <el-table-column
              prop="deliveryFee"
              label="配送费用（元）"
              width="176">
            </el-table-column>
            <el-table-column
              prop="depositFee"
              label="托管费用（元）"
              width="176">
            </el-table-column>
            <el-table-column
              prop="applyInFee"
              label="入库申请费用"
              width="176">
            </el-table-column>
            <el-table-column
              prop="applyInNum"
              label="入库申请数（笔）"
              width="176">
            </el-table-column>
            <el-table-column
              prop="applyOutNum"
              label="出库自提申请数（笔）"
              width="176">
            </el-table-column>
            <el-table-column
              prop="entrustNum"
              label="委托配送申请数（笔）"
              width="176">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!--托管商品-->
      <el-tab-pane label="托管商品" name="fourth">
        <div class="box">
          <el-row type="flex">
            <el-col :span="1">
              <span style="line-height: 2.6rem">城市：</span>
            </el-col>
            <el-col :span="3">
              <el-select v-model="state" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1" :offset="1">
              <span style="line-height: 2.6rem">仓库：</span>
            </el-col>
            <el-col :span="3">
              <el-select v-model="state" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in optionTwo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2" :offset="1">
              <span style="line-height: 2.6rem">产品名称：</span>
            </el-col>
            <el-col :span="3">
              <el-input v-model="productName" placeholder="请输入"></el-input>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-button class="btn-inbox" type="primary">查询</el-button>
              <el-button class="btn-inbox" type="info" @click="emptyContent">重置</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="tableDataThree"
            border
            style="width: 100%;margin-top: 30px">
            <el-table-column label="序号" width="100">
              <template slot-scope="scope">
                <span>{{indexMethods(scope.$index)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="productName"
              label="产品名称"
              width="210">
            </el-table-column>
            <el-table-column
              prop="packingUnit"
              label="包装规格"
              width="130">
            </el-table-column>
            <el-table-column
              prop="stock"
              label="库存"
              width="130">
            </el-table-column>
            <el-table-column
              prop="sortFee"
              label="分拣费"
              width="130">
            </el-table-column>
            <el-table-column
              prop="depositFee"
              label="托管费"
              width="130">
            </el-table-column>
            <el-table-column
              prop="deliveryFee"
              label="配送费"
              width="130">
            </el-table-column>
            <el-table-column
              prop="loadFee"
              label="装车费"
              width="130">
            </el-table-column>
            <el-table-column
              prop="unloadingFee"
              label="卸货费"
              width="130">
            </el-table-column>
            <el-table-column
              prop="firstInDate"
              label="首次入库时间"
              width="150">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="checkState(scope.row)">设置费用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!--操作记录-->
      <el-tab-pane label="操作记录" name="fifth">
        <el-table
          :data="tableDataFour"
          border
          style="width: 100%;margin-top: 30px">
          <el-table-column label="序号" width="120">
            <template slot-scope="scope">
              <span>{{indexMethods(scope.$index)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operatorId"
            label="操作人ID"
            width="176">
          </el-table-column>
          <el-table-column
            prop="operator"
            label="操作人"
            width="176">
          </el-table-column>
          <el-table-column
            prop="operatorPhone"
            label="操作人电话"
            width="176">
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            width="400">
          </el-table-column>
          <el-table-column
            prop="dataType"
            label="数据类型"
            width="176">
          </el-table-column>
          <el-table-column
            prop="operateDate"
            label="操作时间"
            width="176">
          </el-table-column>
          <el-table-column
            prop="operateState"
            label="操作状态"
            width="176">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-col :span="6" :offset="9">
        <el-button type="primary">返回</el-button>
      </el-col>
    </el-row>
    <!--设置对话框-->
    <el-dialog title="设置费用" :modal="false"  :visible.sync="feeDialogVisible" width="30%" center>
      <el-form :model="feeForm" :label-width="formLabelWidth" :rules="rules" ref="feeForm">
        <el-form-item label="下货费" prop="unloadingFee">
          <el-input v-model="feeForm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分拣费" prop="depositFee">
          <el-input v-model="feeForm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="托管费" prop="depositFee">
          <el-input v-model="feeForm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="装车费" prop="loadFee">
          <el-input v-model="feeForm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配送费" prop="deliveryFee">
          <el-input v-model="feeForm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="卸货费" prop="unloadingFee">
          <el-input v-model="feeForm" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary">确定</el-button>
        <el-button @click="feeDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "dealerDetail",
    data() {
      return {
        activeName: 'first',
        pageNum: 1,
        pageSize: 5,
        totalCount: 0,
        feeDialogVisible:false,//设置费用对话框
        value6: '',//时间选择器选中的时间
        formLabelWidth: `100px`,
        productName:'',//产品名称
        options: [{
          value: '选项1',
          label: '武汉'
        }, {
          value: '选项2',
          label: '成都'
        }, {
          value: '选项3',
          label: '上海'
        }, {
          value: '选项4',
          label: '杭州'
        }, {
          value: '选项5',
          label: '北京'
        }],
        optionTwo: [{
          value: '选项1',
          label: '武汉市易酒批1号仓库'
        }, {
          value: '选项2',
          label: '武汉市易酒批2号仓库'
        }, {
          value: '选项3',
          label: '武汉市易酒批3号仓库'
        }, {
          value: '选项4',
          label: '武汉市易酒批4号仓库'
        }, {
          value: '选项5',
          label: '武汉市易酒批5号仓库'
        }],
        state: '',
        tableData: [{
          city: '武汉市',
          warehouse: '武汉市易久批1号仓库',
          address: '上海市普陀区金沙江路 1518 弄',
          firstDate: '2016-05-02'
        }, {
          city: '武汉市',
          warehouse: '武汉市易久批2号仓库',
          address: '上海市普陀区金沙江路 1517 弄',
          firstDate: '2016-05-02'
        }, {
          city: '武汉市',
          warehouse: '武汉市易久批3号仓库',
          address: '上海市普陀区金沙江路 1519 弄',
          firstDate: '2016-05-02'
        }, {
          city: '武汉市',
          warehouse: '武汉市易久批4号仓库',
          address: '上海市普陀区金沙江路 1516 弄',
          firstDate: '2016-05-02'
        }],
        tableDataTwo:[{
          date:'2018-04-01',
          sortingFee:0,
          deliveryFee:0,
          depositFee:0,
          applyInFee:0,
          applyOutNum:0,
          entrustNum:0,
        },{
          date:'2018-04-02',
          sortingFee:0,
          deliveryFee:0,
          depositFee:0,
          applyInFee:0,
          applyOutNum:0,
          entrustNum:0,
        }],
        tableDataThree:[{
          productName:'百威啤酒600ml（12瓶装）',
          packingUnit:'12瓶/件',
          stock:'20件0瓶',
          sortFee:'0元/件',
          depositFee:'0元/件',
          deliveryFee:'0元/件',
          loadFee:'0元/件',
          unloadingFee:'0元/件',
          firstInDate:'18-04-09  18:06' ,
        },{
          productName:'百威啤酒600ml（12瓶装）',
          packingUnit:'12瓶/件',
          stock:'20件0瓶',
          sortFee:'0元/件',
          depositFee:'0元/件',
          deliveryFee:'0元/件',
          loadFee:'0元/件',
          unloadingFee:'0元/件',
          firstInDate:'18-04-09  18:06' ,
        }],
        tableDataFour:[{
          operatorId:8974,
          operator:'王冉冉',
          operatorPhone:15623654582,
          content:'设置费用，是否收取仓配费用：否；业务类型：贷款业务',
          dataType:'经销商信息',
          operateDate:'2018-01-30  12:02',
          operateState:'成功'
        }],
        feeForm:[],
        rules:{}
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.pageNum = num
      },
      emptyContent() {

      },
      checkState(row){
        this.feeDialogVisible=true
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .header {
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .box {
    margin-top 2.3rem;
  }

  .btn-inbox {
    height 2.3rem;
    line-height 0.7rem
  }
  .boxNum{
    width 100%;
    border 1px solid #EDEDED;
    height 80px;
    line-height 40px;
    background-color #FAFAFA;
    margin-top 20px;
  }

</style>
