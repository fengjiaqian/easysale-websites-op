<template>
  <div  v-loading="loading">
    <!--搜索条件-->
    <el-form :inline="true" :model="productSearchForm"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="城市">
        <admin-city-selector
          ref="adminCitySelector"
          :targetLevel="2"
          @select-admin-city="onSelectAdminCity"
          @clean-admin-city="onCleanAdminCity"
        ></admin-city-selector>
      </el-form-item>
      <el-form-item label="仓库">
        <el-select v-model="productSearchForm.warehouseId" placeholder="请选择"
                   :disabled="productSearchForm.city?false:true" clearable>
          <el-option v-for="item in warehouseOptions"
                     :key="item.warehouseId"
                     :value="item.warehouseId"
                     :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="productSearchForm.productName" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="queryServiceProductList" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" style="margin-left:40px;" size="medium">重置</el-button>
    </div>
    <!--表格-->
    <el-table
      height="520"
      :data="productList"
      border
      style="width: 100%;margin-top:20px;">
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productName"  label="产品名称">
      </el-table-column>
      <el-table-column prop="specificationName" label="包装规格">
      </el-table-column>
      <el-table-column prop="totalCount" label="库存">
      </el-table-column>
      <el-table-column prop="sortingCharge" label="分拣费">
      </el-table-column>
      <el-table-column prop="custodianCharge" label="托管费">
      </el-table-column>
      <el-table-column prop="transportCharge" label="配送费">
      </el-table-column>
      <el-table-column prop="loadingCharge" label="装车费">
      </el-table-column>
      <el-table-column prop="landingCharge" label="卸货费">
      </el-table-column>
      <el-table-column prop="firstInStockTime" label="首次入库时间">
      </el-table-column>
      <!--<el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="setFee(scope.row,scope.$index)">设置费用</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <!--设置费用弹框-->
    <!--<el-dialog
      title="设置费用"
      :visible.sync="chargeDialog"
      width="30%"
      :append-to-body="true"
    >
      <el-form :model="productForm" ref="productForm" label-width="148px" class="el-form-product">
        <el-form-item label="下货费：">
          <el-input v-model="productForm.unloadingCharge" size="mini" type="number"></el-input>
          <span>元/{{productForm.productUnit}}</span>
        </el-form-item>
        <el-form-item label="分拣费：">
          <el-input v-model="productForm.sortingCharge" size="mini" type="number"></el-input>
          <span>元/{{productForm.productUnit}}</span>
        </el-form-item>
        <el-form-item label="托管费：">
          <el-input v-model="productForm.custodianCharge" size="mini" type="number"></el-input>
          <span>元/{{productForm.productUnit}}</span>
        </el-form-item>
        <el-form-item label="装车费：">
          <el-input v-model="productForm.loadingCharge" size="mini" type="number"></el-input>
          <span>元/{{productForm.productUnit}}</span>
        </el-form-item>
        <el-form-item label="配送费：">
          <el-input v-model="productForm.transportCharge" size="mini" type="number"></el-input>
          <span>元/{{productForm.productUnit}}</span>
        </el-form-item>
        <el-form-item label="卸货费：">
          <el-input v-model="productForm.landingCharge" size="mini" type="number"></el-input>
          <span>元/{{productForm.productUnit}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeDialog = false">取 消</el-button>
        <el-button type="primary" @click="ensureCharge">确 定</el-button>
      </span>
    </el-dialog>-->
    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="productSearchForm.pageSize"
      :current-page.sync="productSearchForm.currentPage"
      :total="totalCount"
      v-if="totalCount>0">
    </el-pagination>
  </div>
</template>


<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import http from 'http/wareHouseDealerApi'
  import https from 'http/warehouseMessageApi'

  export default {
    name: 'dealerDetailProductForm',
    props: [],
    data() {
      return {
        productSearchForm: {
          city:``,
          // cityId: ``,
          warehouseId: ``,
          productName: null,
          dealerId: ``,
          facilitatorId: ``,
          pageNum: 1,
          pageSize: 20,
        },
        // city: ``,
        totalCount: 0,
        productList: [],
        warehouseOptions: [],
        warehouseForm: {
          city: ``,
          cityId: ``,
          name: ``,
          pageNum: 1,
          pageSize: 100,
          parentCityId: ``,
          warehouseId: ``,
        },
        productForm: {
          unloadingCharge: ``, //下货费
          sortingCharge: ``,   //分拣费
          custodianCharge: ``, //托管费
          loadingCharge: ``,   //装车费
          transportCharge: ``, //配送费
          landingCharge: ``,   //卸货费
          lastUpdateUser: ``,    //创建人
          productUnit: ``,
          productSpecificationId: ``,    //参数规则id
          dealerId:``,    //经销商id
        },
        chargeDialog: false,
        loading:false
      }
    },
    components: {
      AdminCitySelector
    },
    mounted() {
      console.log(`产品mounted`)
    },
    activated() {
      console.log(this.choseRoleInfoList)
      this.productSearchForm.dealerId = JSON.parse(this.$route.query.dealerInfo).dealerId
      this.productSearchForm.facilitatorId = this.choseRoleInfoList.ruleOrgId
      this.queryServiceProductList()
    },
    methods: {
      indexMethods(index) {
        return (this.productSearchForm.pageNum - 1) * this.productSearchForm.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.productSearchForm.pageNum = num
        this.queryServiceProductList()
      },
      queryServiceProductList() {
        this.loading = true
        let {productSearchForm} = this
        http.queryProductList(productSearchForm).then(data => {
          console.log(data)
          this.loading = false
          this.productList = data.dataList
          this.productList.forEach(item=>{
            item.firstInStockTime = item.firstInStockTime.substring(0,19)
          })
          this.totalCount = data.pager ? data.pager.recordCount : 0
        }).catch(e=>{
          this.$message(e)
          this.loading = false
        })
      },
      //获取仓库信息
      getWareHouseInfo() {
        console.log(`获取仓库信息`)
        if (this.choseRoleInfoList.ruleOrgType == 1) {
          this.warehouseForm.cityId = this.choseRoleInfoList.ruleOrgId
          this.warehouseForm.parentCityId = this.choseRoleInfoList.ruleOrgId
        } else {
          this.warehouseForm.cityId = ``
          this.warehouseForm.parentCityId = this.choseRoleInfoList.ruleOrgId
        }
        https.getWarehouseList(this.warehouseForm).then(data => {
          this.warehouseOptions = data
        })
      },
      onSelectAdminCity(valueArr) {
        console.log(valueArr)
        this.productSearchForm.city = valueArr[valueArr.length - 1].name
        // this.productSearchForm.cityId = valueArr[valueArr.length - 1].id
         this.warehouseForm.city = valueArr[valueArr.length - 1].name   //TODO 仓库根据城市名搜索 暂时没数据
        this.getWareHouseInfo()
      },
      onCleanAdminCity() {
        this.productSearchForm.city = ``
        this.productSearchForm.cityId = ``
      },
      resetForm() {
        this.productSearchForm = {
          city:``,
          // cityId: ``,
          warehouseId: ``,
          productName: null,
          dealerId: JSON.parse(this.$route.query.dealerInfo).dealerId,
          facilitatorId: this.choseRoleInfoList.ruleOrgId,
          pageNum: 1,
          pageSize: 20,
        };
        this.$refs.adminCitySelector.clean()
        this.queryServiceProductList()
      },
      /*设置费用*/
      /*setFee(row) {
        console.log(row)
        this.productForm.productUnit = row.packageName
        this.productForm.productSpecificationId = row.productSpecificationId
        this.productForm.lastUpdateUser = this.userInfo.userId
        this.productForm.dealerId = row.dealerId
        this.chargeDialog = true
      },*/

      /*ensureCharge() {
        let {productForm} = this
        http.editProductCharge(productForm).then(data => {
          this.chargeDialog = false
          this.$message(`修改成功`)
          this.queryServiceProductList();
          this.productForm = {
            unloadingCharge: ``, //下货费
            sortingCharge: ``,   //分拣费
            custodianCharge: ``, //托管费
            loadingCharge: ``,   //装车费
            transportCharge: ``, //配送费
            landingCharge: ``,   //卸货费
            lastUpdateUser: ``,    //创建人
            productUnit: ``,
            productSpecificationId: ``,    //参数规则id
            dealerId:``,
          };
        }).catch(e => {
          this.$message(`修改失败`)
        })
      },*/
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`])
    },
  }
</script>


<style lang="stylus" scoped>
  .el-form {
    width:100%
    .el-form-item {
      margin-bottom: 20px
    }
    .el-input {
      width 250px;
    }
    .el-select {
      width 250px;
    }
  }

  .query-btn {
    text-align: center
    border-bottom:1px solid #ededed
    padding-bottom:20px
  }

  .el-table {
    margin-top: 20px
  }

  .el-pagination {
    float right;
    margin-top 20px;
  }

  .el-form-product {
    .el-form-item {
      margin-bottom: 12px
    }
  }
</style>
