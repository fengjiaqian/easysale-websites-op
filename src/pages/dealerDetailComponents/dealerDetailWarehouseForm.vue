<template>
  <div v-loading="loading">
    <!--搜索条件-->
    <el-form :inline="true" :model="warehouseSearchForm"
             size="medium" label-width="60"
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
      <el-form-item style="float: right" class="query-btn">
        <el-button type="primary" @click="queryWarehouseList()" size="medium">查询</el-button>
        <el-button type="info" @click="resetForm()" style="margin-left:40px;" size="medium">重置</el-button>
      </el-form-item>
    </el-form>

    <!--表格-->
    <el-table
      :data="warehouseList"
      height="520"
      border
      style="width: 100%;margin-top:14px;"
      >
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市">
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库">
      </el-table-column>
      <el-table-column prop="detailAddress" label="地址">
      </el-table-column>
      <el-table-column prop="firstServiceTime" label="首次使用时间">
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="warehouseSearchForm.pageSize"
      :current-page.sync="warehouseSearchForm.pageNum"
      :total="totalCount"
      v-if="totalCount>0">
    </el-pagination>
  </div>
</template>


<script>
  import http from 'http/wareHouseDealerApi'
  import AdminCitySelector from 'common/AdministrativeCitySelector'


  export default {
    name: 'dealerDetailWarehouseForm',
    data() {
      return {
        warehouseSearchForm: {
          city: ``,
          pageSize: 20,
          pageNum: 1,
          dealerId:``,
          facilitatorId:``,
        },
        totalCount: 0,
        warehouseList: [],
        loading:false
      }
    },
    components: {
      AdminCitySelector,
    },
    methods: {
      indexMethods(index) {
        return (this.warehouseSearchForm.pageNum - 1) * this.warehouseSearchForm.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.warehouseSearchForm.pageNum = num
        this.queryWarehouseList()
      },

      //根据经销商id,城市id过滤仓库
      queryWarehouseList() {
        this.loading = true
        http.filterDealerWarehouseList(this.warehouseSearchForm).then(data=>{
          this.loading = false
          this.warehouseList = data.dataList
          this.warehouseList.forEach(item=>{
            item.firstServiceTime = item.firstServiceTime.substring(0,19)
          })
          this.totalCount = data.pager.recordCount
        }).catch(e=>{
          this.$message(e)
          this.loading = false
        })
      },

      onSelectAdminCity(valueArr) {
        console.log(valueArr)
        this.warehouseSearchForm.city = valueArr[valueArr.length - 1].name
        // this.warehouseSearchForm.cityId = valueArr[valueArr.length - 1].id
      },
      onCleanAdminCity() {
        this.warehouseSearchForm.city = ``
      },
      submitForm() {

      },
      resetForm() {
        this.warehouseSearchForm = {
          city: ``,
          pageSize: 20,
          pageNum: 1,
          dealerId :JSON.parse(this.$route.query.dealerInfo).dealerId,
          facilitatorId:JSON.parse(this.$route.query.dealerInfo).facilitatorId
        }
        // this.city = ``,
        this.$refs[`adminCitySelector`].clean()
        this.queryWarehouseList()
      },
    },
    mounted() {
      console.log(`仓库mounted`)

    },

    activated() {
      console.log(`仓库activated`)
      this.warehouseSearchForm.dealerId = JSON.parse(this.$route.query.dealerInfo).dealerId
      this.warehouseSearchForm.facilitatorId = JSON.parse(this.$route.query.dealerInfo).facilitatorId
      console.log(this.$route.query.dealerInfo.dealerId)
      this.queryWarehouseList()
    },
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .el-form {
    display: flex;
    flex-direction: column;

    .query-btn {
      text-align center
      border-bottom:1px solid #ededed
      padding-bottom:20px
    }

    .el-form-item{
      margin-bottom:8px
    }

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
</style>
