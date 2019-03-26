<template>
  <div v-loading="loading">
    <!--搜索条件-->
    <el-form :inline="true" :model="serviceSearchForm"
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
        <el-select v-model="serviceSearchForm.warehouseId" placeholder="请选择"
                   :disabled="serviceSearchForm.city?false:true" clearable>
          <el-option v-for="item in warehouseOptions"
                     :key="item.warehouseId"
                     :value="item.warehouseId"
                     :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <!--<el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getSelectDate"
          value-format=" yyyy-MM-dd" format="yyyy-MM-dd">
        </el-date-picker>-->
        <el-date-picker
          v-model="serviceSearchForm.startTime"
          type="date"
          :picker-options="startDatePicker"
          value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
          placeholder="开始日期">
        </el-date-picker>
        <!--value-format=" yyyy-MM-dd" format="yyyy-MM-dd"-->
        <span>至</span>
        <el-date-picker
          v-model="serviceSearchForm.endTime"
          type="date"
          :picker-options="endDatePicker"
          value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
          placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="queryServiceList" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <div class="serviceInfo">
      <p><span>￥{{serviceAmount.totalSortingfee}}</span><span>分拣费用</span></p>
      <p><span>￥{{serviceAmount.totalDeliveryfee}}</span><span>配送费用</span></p>
      <p><span>￥{{serviceAmount.totalDepositfee}}</span><span>托管费用</span></p>
      <p><span>{{serviceAmount.totalInStockCount}}</span><span>入库申请数</span></p>
      <p><span>{{serviceAmount.totalOutStockCount}}</span><span>出库自提申请数</span></p>
      <p><span>{{serviceAmount.totalEntrustmentCount}}</span><span>委托配送申请数</span></p>
    </div>
    <!--表格-->
    <el-table
      :data="serviceList"
      border
      height="520"
      style="width: 100%;margin-top:28px;">
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="storeTime" label="时间">
      </el-table-column>
      <el-table-column prop="sortingfee" label="分拣费用（元）">
      </el-table-column>
      <el-table-column prop="deliveryfee" label="配送费用（元）">
      </el-table-column>
      <el-table-column prop="depositfee" label="托管费用（元）">
      </el-table-column>
      <el-table-column prop="inStockApplyCount" label="入库申请数（笔）">
      </el-table-column>
      <el-table-column prop="outStockApplyCount" label="出库自提申请数（笔）">
      </el-table-column>
      <el-table-column prop="entrustmentApplyCount" label="委托配送申请数（笔）">
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="serviceSearchForm.pageSize"
      :current-page.sync="serviceSearchForm.pageNum"
      :total="totalCount"
      v-if="totalCount>0">
    </el-pagination>
  </div>
</template>


<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import http from 'http/wareHouseDealerApi'
  import https from 'http/warehouseMessageApi'
  import {mapState, mapMutations} from 'vuex'

  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
  export default {
    name: 'dealerDetailServiceForm',
    data() {
      return {
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        serviceSearchForm: {
          city: ``,
          // cityId: ``,
          warehouseId: ``,
          dealerId: ``,
          pageNum: 1,
          pageSize: 20,
          startTime: start,
          endTime: end,
          facilitatorId: ``,
        },

        timeRange: [start, end],
        warehouseForm: {
          city: ``,
          cityId: ``,
          name: ``,
          pageNum: 1,
          pageSize: 100,
          parentCityId: ``,
          warehouseId: ``,
        },
        totalCount: 0,
        serviceList: [],
        warehouseOptions: [],
        serviceAmount: {},
        loading: false
      }
    },
    components: {
      AdminCitySelector
    },
    mounted() {
      console.log(`服务mounted`)
    },
    activated() {
      console.log(`activated`)
      this.serviceSearchForm.dealerId = JSON.parse(this.$route.query.dealerInfo).dealerId
      console.log(this.$route)
      this.serviceSearchForm.facilitatorId = this.choseRoleInfoList.ruleOrgId
      this.queryServiceList()
      this.getAllServiceAmount()
    },
    methods: {
      getSelectDate(value) {
        console.log(value)
        this.serviceSearchForm.startTime = value[0]
        this.serviceSearchForm.endTime = value[1]
        console.log(this.serviceSearchForm.startTime)
      },
      indexMethods(index) {
        return (this.serviceSearchForm.pageNum - 1) * this.serviceSearchForm.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.serviceSearchForm.pageNum = num
        this.queryServiceList()
      },
      queryServiceList() {
        this.getAllServiceAmount()
        this.loading = true
        http.queryAmountList(this.serviceSearchForm).then(data => {
          this.serviceList = data.dataList
          this.serviceList.forEach(item => {
            item.firstServiceTime = item.firstServiceTime.substring(0, 19)
          })
          this.totalCount = data.pager ? data.pager.recordCount : 0
          this.loading = false
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      /*获取服务数据统计*/
      getAllServiceAmount() {
        let {serviceSearchForm} = this
        serviceSearchForm.pageSize = 100
        http.AmountAllList(serviceSearchForm).then(data => {
          this.serviceAmount = data
        })
      },
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
        this.serviceSearchForm.city = valueArr[valueArr.length - 1].name
        this.warehouseForm.city = valueArr[valueArr.length - 1].name   //TODO 仓库根据城市名搜索 暂时没数据
        // this.serviceSearchForm.cityId = valueArr[valueArr.length - 1].id
        this.getWareHouseInfo()
      },
      onCleanAdminCity() {
        console.log(`sdsf`)
        this.serviceSearchForm.city = ``
        // this.serviceSearchForm.cityId = ``
      },
      resetForm() {
        this.serviceSearchForm = {
          city: ``,
          // cityId: ``,
          warehouseId: ``,
          dealerId: JSON.parse(this.$route.query.dealerInfo).dealerId,
          pageNum: 1,
          pageSize: 20,
          startTime: start,
          endTime: end,
          facilitatorId: this.choseRoleInfoList.ruleOrgId,
        }
        this.serviceSearchForm.city = ``;
        this.$refs.adminCitySelector.clean()
        this.serviceSearchForm.startTime = start
        this.serviceSearchForm.endTime = end
        this.getAllServiceAmount()
        this.queryServiceList()
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
      ...mapState(`user`, [`choseRoleInfoList`])
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

  .el-pagination {
    float right;
    margin-top 20px;
  }

  .serviceInfo {
    background: #f1f1f1
    display: flex
    align-items center
    justify-content space-around

    > p {
      display: flex;
      flex-direction: column;
      align-items center
      > span {
        font-size: 14px;
        color: #333;
        &:nth-child(1) {
          color: rgba(24, 144, 255, 1);
          padding-bottom: 12px
        }
      }
    }
  }

  .query-btn {
    text-align: center
    margin-bottom: 20px
    border-bottom: 1px solid #ededed
    padding-bottom: 20px
  }

</style>
