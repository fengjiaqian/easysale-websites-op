<template>
  <div id="applyWarehouseProduct" v-loading="loading">
    <!--<el-tabs v-model="productInfo.status" @tab-click="handleClick">
      <el-tab-pane label="待设置" name=0></el-tab-pane>
      <el-tab-pane label="已设置" name=1></el-tab-pane>
    </el-tabs>-->
    <!--搜索条件-->
    <el-form :inline="true" :model="productInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="productInfo">
      <el-form-item label="产品名称">
        <el-input v-model="productInfo.productName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="productInfo.productBrand" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <!--<el-form-item label="城市">
        <admin-city-selector
          ref="adminCitySelector"
          :targetLevel="2"
          @select-admin-city="onSelectAdminCity"
          @clean-admin-city="onCleanAdminCity"
        ></admin-city-selector>
      </el-form-item>
      <el-form-item label="仓库">
        <el-select v-model="productInfo.warehouseId" clearable>
          <el-option
            v-for="item in warehouseOptions"
            :key="item.warehouseId"
            :label="item.name"
            :value="item.warehouseId">
          </el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="经销商名称">
        <el-input v-model="productInfo.dealerName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="经销商手机">
        <el-input v-model="productInfo.mobileNo" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <!--<el-form-item label="是否收费">
        <el-select v-model="productInfo.isGetWarehouseCharge" clearable>
          <el-option
            v-for="item in chargeOptions"
            :key="item.value"
            :label="item.state"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-select v-model="productInfo.businessType" clearable>
          <el-option
            v-for="item in businessOptions"
            :key="item.value"
            :label="item.type"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间" clearable>
        &lt;!&ndash;<el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getSelectDate"
          value-format=" yyyy-MM-dd" format="yyyy-MM-dd">
        </el-date-picker>&ndash;&gt;
          <el-date-picker
            v-model="productInfo.startTime"
            type="date"
            :picker-options="startDatePicker"
            value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
            placeholder="开始日期">
          </el-date-picker>
          &lt;!&ndash;value-format=" yyyy-MM-dd" format="yyyy-MM-dd"&ndash;&gt;
          <span>至</span>
          <el-date-picker
            v-model="productInfo.endTime"
            type="date"
            :picker-options="endDatePicker"
            value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
            placeholder="结束日期">
          </el-date-picker>
      </el-form-item>-->
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getProductList" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <el-button type="primary" class="add-warehouse" @click="addProduct">配置产品费用</el-button>

    <!--表格-->
    <el-table
      :data="productList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称">
      </el-table-column>
      <el-table-column prop="productBrand" label="品牌">
      </el-table-column>
      <!--<el-table-column prop="businessCity" label="业务城市">
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库">
      </el-table-column>-->
      <el-table-column prop="dealerName" label="经销商名称">
      </el-table-column>
      <el-table-column prop="mobileNo" label="经销商手机">
      </el-table-column>
      <el-table-column prop="specificationName" label="包装规格">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status===0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="是否收取仓配费用">
        <template slot-scope="scope">
          <span>{{scope.row.isGetWarehouseCharge==0?'否':'是'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型">
        <template slot-scope="scope">
          <span>{{scope.row.businessType==0?'正常业务':'贷款业务'}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="unloadingCharge" label="下货费" width="80">
      </el-table-column>
      <el-table-column prop="sortingCharge" label="分拣费" width="80">
      </el-table-column>
      <el-table-column prop="custodianCharge" label="托管费" width="80">
      </el-table-column>
      <el-table-column prop="loadingCharge" label="装车费" width="80">
      </el-table-column>
      <el-table-column prop="transportCharge" label="配送费" width="80">
      </el-table-column>
      <el-table-column prop="landingCharge" label="卸货费" width="80">
      </el-table-column>
      <!--<el-table-column prop="firstInStockTime" label="首次入库时间">
      </el-table-column>-->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">详情</el-button>
          <!--<el-button type="text" size="small" @click="setCost(scope.row)">{{productInfo.status==0?'设置费用':'调整费用'}}
          </el-button>-->
          <el-button type="text" size="small" @click="editProductInfo(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="toggleState(scope.row,scope.$index)"
          >
            {{scope.row.status===0?'启用':'停用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="productInfo.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>
    <!--设置费用弹框-->
    <!--<el-dialog
      :title="productInfo.status==0?'设置费用':'调整费用'"
      :visible.sync="chargeDialog"
      width="30%"
      :append-to-body="true"
    >
      <el-form :model="productForm" ref="productForm" label-width="148px" class="el-form-product">
        <el-form-item label="下货费：">
          <el-input v-model="productForm.unloadingCharge" size="mini" type="number"></el-input>
          <span>元/件</span>
        </el-form-item>
        <el-form-item label="分拣费：">
          <el-input v-model="productForm.sortingCharge" size="mini" type="number"></el-input>
          <span>元/件</span>
        </el-form-item>
        <el-form-item label="托管费：">
          <el-input v-model="productForm.custodianCharge" size="mini" type="number"></el-input>
          <span>元/件</span>
        </el-form-item>
        <el-form-item label="装车费：">
          <el-input v-model="productForm.loadingCharge" size="mini" type="number"></el-input>
          <span>元/件</span>
        </el-form-item>
        <el-form-item label="配送费：">
          <el-input v-model="productForm.transportCharge" size="mini" type="number"></el-input>
          <span>元/件</span>
        </el-form-item>
        <el-form-item label="卸货费：">
          <el-input v-model="productForm.landingCharge" size="mini" type="number"></el-input>
          <span>元/件</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeDialog = false">取 消</el-button>
        <el-button type="primary" @click="ensureCharge">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import http from 'http/productManageApi'
  import https from 'http/wareHouseDealerApi'
  import httpApi from 'http/warehouseMessageApi'

  export default {
    name: "applyWarehouseProduct",
    data() {
      return {
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        productInfo: {
          status: 1,    //  	是否设置产品费用  0=待设置产品费用，1=已设置产品费用
          businessType: ``,    //业务类型    0--正常业务 1--贷款业务
          city: ``,    //城市名称
          startTime: null,   //开始时间
          endTime: null,   //结束时间
          facilitatorId: ``, //服务商id
          isGetWarehouseCharge: ``,    //1为收取 0为不收取
          mobileNo: null,    //手机号
          pageNum: 1,
          pageSize: 20,
          productBrand: null,    //品牌
          productName: null,   //产品名称
          warehouseId: ``,   //仓库id
          dealerName:``,  //经销商名称
        },
        productForm: {
          dealerId: ``,    //经销商id
          unloadingCharge: ``, //下货费
          sortingCharge: ``,   //分拣费
          custodianCharge: ``, //托管费
          loadingCharge: ``,   //装车费
          transportCharge: ``, //配送费
          landingCharge: ``,   //卸货费
          lastUpdateUser: ``,    //创建人
          productSpecificationId: ``,    //商品规格参数id
        },
        chargeDialog: false,
        totalCount: 0,
        // warehouseOptions: [],
        chargeOptions: [
          {
            value: 0,
            state: '否'
          },
          {
            value: 1,
            state: '是'
          }
        ],
        businessOptions: [
          {
            value: 0,
            type: '正常业务',
          },
          {
            value: 1,
            type: '贷款业务'
          }
        ],
        productList: [],
        loading: false,
      }
    },
    components: {
      AdminCitySelector
    },
    activated() {
      this.productInfo.facilitatorId = this.choseRoleInfoList.ruleOrgId
      this.getProductList();
      // this.getWareHouseInfo();
    },
    methods: {
      handleClick(tab) {
        this.productInfo.status = tab.name
        this.getProductList();
      },
      /*新增商品*/
      addProduct() {
        this.$router.push({name: `productAdd`})
      },
      /*获取申请入库产品*/
      getProductList() {
        this.loading = true
        http.getProductInStockList(this.productInfo).then(data => {
          this.loading = false
          this.productList = data.dataList
          this.totalCount = data.pager.recordCount
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
        console.log(this.totalCount)
      },
      /*//获取仓库信息
      getWareHouseInfo() {
        console.log(`获取仓库信息`)
        if (this.choseRoleInfoList.ruleOrgType == 1) {
          this.warehouseForm.cityId = this.choseRoleInfoList.ruleOrgId
          this.warehouseForm.parentCityId = this.choseRoleInfoList.ruleOrgId
        } else {
          this.warehouseForm.cityId = ``
          this.warehouseForm.parentCityId = this.choseRoleInfoList.ruleOrgId
        }
        httpApi.getWarehouseList(this.warehouseForm).then(data => {
          this.warehouseOptions = data
        })
      },*/
      resetForm() {
        this.productInfo = {
          status: this.productInfo.status,    //  	是否设置产品费用  0=待设置产品费用，1=已设置产品费用
          businessType: ``,    //业务类型    0--正常业务 1--贷款业务
          city: ``,    //城市名称
          startTime: null,   //开始时间
          endTime: null,   //结束时间
          facilitatorId: this.choseRoleInfoList.ruleOrgId, //服务商id
          isGetWarehouseCharge: ``,    //1为收取 0为不收取
          mobileNo: null,    //手机号
          pageNum: 1,
          pageSize: 10,
          productBrand: null,    //品牌
          productName: null,   //产品名称
          warehouseId: ``,   //仓库id
          dealerName:``,
        };
        // this.$refs.adminCitySelector.clean()
        this.getProductList()
      },
      onSelectAdminCity(valueArr) {
        this.productInfo.city = valueArr[valueArr.length - 1].name
      },
      onCleanAdminCity() {
        this.productInfo.city = ``
      },
      getSelectDate(value) {
        this.productInfo.startTime = value[0]
        this.productInfo.endTime = value[1]
      },
      goToDetail(row) {
        console.log(row)
        let productInfo = {
          productSpecificationId: row.productSpecificationId,
          dealerId: row.dealerId,
          status: row.status,
          facilitatorId: row.facilitatorId
        }
        console.log(productInfo)
        this.$router.push({name: `warehouseProductDetail`, query: {productInfo}})
      },
      /*设置状态*/
      toggleState(row, index) {
        this.loading = true
        /*console.log(row)*/
        let param = {
          dealerId: row.dealerId,
          facilitatorId: row.facilitatorId,
          lastUpdateUser: this.userInfo.userId,
          productSpecificationId: row.productSpecificationId,
          status: row.status == 0 ? 1 : 0,
        }
        return http.updateProductStatus(param).then(data => {
          this.$message(`修改成功`)
          this.getProductList()
          this.loading = false
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      /*编辑产品信息*/
      editProductInfo(row) {
        this.$router.push({name: `productAdd`, query: {productInfo: row}})
      },
      /*ensureCharge() {
        let {productForm} = this
        https.editProductCharge(productForm).then(data => {
          this.chargeDialog = false
          this.getProductList()
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
          this.$message(`修改成功`)
        }).catch(e=>{
          this.$message(e)
        })
      },*/
      indexMethods(index) {
        return (this.productInfo.pageNum - 1) * this.productInfo.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.productInfo.pageNum = num
        this.getProductList()
      },
      //开始时间小于结束时间
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            if (self.endTime) {
              return new Date(self.endTime).getTime() < time.getTime()
            }
            //return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      //结束时间必须大于开始时间
      processDate() {
        let self = this
        return {
          disabledDate(time) {
            if (self.startTime) {
              return new Date(self.startTime).getTime() > time.getTime()
            }
          }
        }
      },
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`])
    }
  }
</script>

<style scoped lang="stylus">
  .el-form {
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
    border-bottom: 1px solid #ededed
    padding-bottom: 20px
  }

  .el-pagination {
    float: right
    margin-top: 20px
  }

  .el-form-product {
    .el-form-item {
      margin-bottom: 12px
    }
  }

  .add-warehouse {
    padding: 10px 24px;
    margin-top: 16px
  }
</style>
