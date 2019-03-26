<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>仓配服务</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>申请入库产品</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 class="header">申请入库产品</h2>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待设置" name="wait"></el-tab-pane>
      <el-tab-pane label="已设置" name="already"></el-tab-pane>
    </el-tabs>
    <!--搜索条件-->
    <el-form :inline="true" :model="searchForm"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="产品名称">
        <el-input v-model="searchForm.productName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="searchForm.brandName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="城市">
        <el-select v-model="searchForm.cityId" placeholder="请选择">
          <el-option label="上海" value="shanghai"></el-option>
          <el-option label="北京" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库">
        <el-select v-model="searchForm.warehouseId" placeholder="请选择">
          <el-option label="上海" value="shanghai"></el-option>
          <el-option label="北京" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经销商手机">
        <el-input v-model="searchForm.mobileNo" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="是否收费">
        <el-select v-model="searchForm.isgetwarehousecharge" placeholder="请选择">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-select v-model="searchForm.bussinesstype" placeholder="请选择">
          <el-option label="正常业务" :value="0"></el-option>
          <el-option label="贷款业务" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间">
        <el-date-picker
          v-model="searchForm.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="button-wrap">
      <el-button type="primary" @click="submitForm('searchForm')" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm('searchForm')" style="margin-left:40px;" size="medium">重置</el-button>
    </div>
    <!--设置对话框-->
    <el-dialog title="设置费用" :modal="false" :visible.sync="feeDialogVisible" width="30%" center>
      <el-form :model="feeForm" label-width="100px" :rules="rules" ref="feeForm">
        <el-form-item label="下货费" prop="shipGoodsAmount">
          <el-input v-model="feeForm.shipGoodsAmount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分拣费" prop="sortingFee">
          <el-input v-model="feeForm.sortingFee" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="托管费" prop="depositFee">
          <el-input v-model="feeForm.depositFee" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="装车费" prop="loadingCharge">
          <el-input v-model="feeForm.loadingCharge" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配送费" prop="deliveryFee">
          <el-input v-model="feeForm.deliveryFee" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="卸货费" prop="landingCharge">
          <el-input v-model="feeForm.landingCharge" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary">确定</el-button>
        <el-button @click="feeDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!--表格-->
    <el-table
      :data="tableDataThree"
      border
      style="width: 100%;margin-top: 30px">
      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="brand"
        label="品牌">
      </el-table-column>
      <el-table-column
        prop="city"
        label="业务城市">
      </el-table-column>
      <el-table-column
        prop="warehouse"
        label="仓库">
      </el-table-column>
      <el-table-column
        prop="dealerPhone"
        label="经销商手机">
      </el-table-column>
      <el-table-column
        prop="packingUnit"
        label="包装规格">
      </el-table-column>
      <el-table-column
        prop="cost"
        label="是否收取仓配费用">
      </el-table-column>
      <el-table-column
        prop="businessType"
        label="业务类型">
      </el-table-column>
      <el-table-column
        prop="shipGoodsFee"
        label="下货费">
      </el-table-column>
      <el-table-column
        prop="sortFee"
        label="分拣费">
      </el-table-column>
      <el-table-column
        prop="depositFee"
        label="托管费">
      </el-table-column>
      <el-table-column
        prop="loadFee"
        label="装车费">
      </el-table-column>
      <el-table-column
        prop="deliveryFee"
        label="配送费">
      </el-table-column>
      <el-table-column
        prop="unloadingFee"
        label="卸货费">
      </el-table-column>
      <el-table-column
        prop="firstInDate"
        label="首次入库时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="gotoDetail">详情
          </el-button>
          <el-button type="text" size="small" @click="setFee(scope.row)">设置费用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import http from 'http/goodsApi'

  export default {
    name: "productManage",
    data() {
      return {
        activeName: 'wait',

        searchForm: {
          brandName: ``,
          bussinesstype: null,
          chargeType: null,
          cityId: null,
          endTime: ``,
          facilitatorId: 7,
          inStockId: null,
          isgetwarehousecharge: null,
          pageNum: 1,
          pageSize: 10,
          productName: ``,
          productSkuId: null,
          startTime: ``,
          warehouseId: null,
          timeRange: []
        },

        feeDialogVisible: false,
        rules: [],
        feeForm: {
          shipGoodsAmount: 0,
          sortingFee: 0,
          depositFee: 0,
          loadingCharge: 0,
          deliveryFee: 0,
          landingCharge: 0,
        },

        tableDataThree: [{
          productName: '百威啤酒600ml（12瓶装）',
          brand: '酒鬼',
          city: '武汉市',
          warehouse: '武汉市易酒批1号仓库',
          dealerPhone: '18845877854',
          packingUnit: '12瓶/件',
          cost: '否',
          businessType: '正常业务',
          shipGoodsFee: '0元/件',
          sortFee: '0元/件',
          depositFee: '0元/件',
          loadFee: '0元/件',
          deliveryFee: '0元/件',
          unloadingFee: '0元/件',
          firstInDate: '18-04-09  18:06',
        }],
      }
    },
    mounted() {
      this.getProducts()
    },
    methods: {
      getProducts() {
        let params = this.searchForm
        params.chargeType = this.activeName === `wait` ? 0 : 1
        return http.getProductList(params)
      },
      submitForm(formName) {
        if (formName === `searchForm`) {
          this.getProducts()
        } else {
        }
      },
      resetForm(formName) {
        if (formName === `searchForm`) {
          this.searchForm = {
            brandName: ``,
            bussinesstype: null,
            chargeType: null,
            cityId: null,
            endTime: ``,
            facilitatorId: null,
            inStockId: null,
            isgetwarehousecharge: null,
            pageNum: 1,
            pageSize: 10,
            productName: ``,
            productSkuId: null,
            startTime: ``,
            warehouseId: null,
            timeRange: []
          }
        } else if (formName === `feeForm`) {
          this.feeForm = {
            shipGoodsAmount: 0,
            sortingFee: 0,
            depositFee: 0,
            loadingCharge: 0,
            deliveryFee: 0,
            landingCharge: 0,
          }
        }
      },
      indexMethods(index) {
        return (this.searchForm.pageNum - 1) * this.searchForm.pageSize + index + 1
      },
      handleClick(tab, event) {
        this.resetForm(`searchForm`)
        this.getProducts()
      },
      setFee(row) {
        this.feeDialogVisible = true
      },
      gotoDetail() {
        this.$router.replace('/productDetail')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .el-form {
    .el-input {
      width 250px;
    }
    .el-select {
      width 250px;
    }
  }

  .button-wrap {
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
  }
</style>
