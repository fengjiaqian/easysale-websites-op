<template>
  <div>
    <div class="block-box">
      <el-row>
        <el-col :span="8">公司编号：{{servicerDetail.orgNo}}</el-col>
        <el-col :span="8">公司名称：{{servicerDetail.orgName}}</el-col>
        <el-col :span="8">公司类型：{{servicerDetail.orgType===1?`一般公司`:servicerDetail.orgType===2?`集团公司`:``}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">办公地址：{{servicerDetail.orgAddress}}</el-col>
        <el-col :span="8">联系人：{{servicerDetail.contacterName}}</el-col>
        <el-col :span="8">联系人电话：{{servicerDetail.contacterPhone}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          结算设置：{{servicerDetail.settlementState===1?`不分账`:servicerDetail.settlementState===2?`平台分账给服务商`:servicerDetail.settlementState===3?`服务商分账给平台`:``}}
        </el-col>
        <el-col :span="8">
          状态：{{servicerDetail.state===1?`启用`:servicerDetail.state===1?`停用`:servicerDetail.state===3?`作废`:``}}
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="功能" name="function"></el-tab-pane>
      <el-tab-pane label="仓库数据" name="warehouse"></el-tab-pane>
    </el-tabs>
    <!--功能-->
    <ul v-if="activeName===`function`"
        style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;">
      <div v-for="item in serviceTypeArr" style="margin: 5px 0;">
        <el-checkbox disabled :value="true">{{item}}</el-checkbox>
      </div>
    </ul>
    <!--仓库数据-->
    <div v-if="activeName===`warehouse`">

      <!--搜索条件-->
      <el-form :inline="true" :model="warehouseSearchForm"
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
      </el-form>
      <div class="query-btn">
        <el-button type="primary" @click="submitForm()" size="medium">查询</el-button>
        <el-button type="info" @click="resetForm()" style="margin-left:40px;" size="medium">重置</el-button>
      </div>
      <el-table
        max-height="470"
        :data="warehouseList"
        border style="width: 100%;margin-top:20px;"
      >
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            <span>{{indexMethods(scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="仓库名称">
        </el-table-column>
        <el-table-column prop="city" label="城市">
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            <span>{{`${scope.row.province||``}${scope.row.city||``}${scope.row.county||``}${scope.row.street||``}`}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        background
        layout="total,prev, pager, next"
        @current-change="handlePageNumChange($event)"
        :page-size="warehouseSearchForm.pageSize"
        :current-page.sync="warehouseSearchForm.currentPage"
        :total="totalCount"
        v-if="totalCount>0">
      </el-pagination>
      <div class="button">
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>


  </div>
</template>

<script>
  import http from 'http/servicerApi'
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState} from 'vuex'

  export default {
    name: "warehouseMessageDetail",
    data() {
      return {
        servicerDetail: {},
        warehouseSearchForm: {
          city: ``,
          name: ``,
          pageNum: 1,
          pageSize: 20,
        },
        totalCount: 0,
        warehouseList: [],
        activeName: `function`,
        serviceTypeArr: []
      }
    },
    components: {
      AdminCitySelector
    },
    activated() {
      this.servicerDetail = this.$route.query.servicer || {}
      console.log(this.servicerDetail)
      this.serviceTypeArr =
        this.servicerDetail.serviceType === 1 ? [`仓储服务`] :
          this.servicerDetail.serviceType === 2 ? [`配送服务`] :
            this.servicerDetail.serviceType === 3 ? [`仓储服务`, `配送服务`] : []
      this.warehouseSearchForm = {
        city: ``,
        name: ``,
        pageNum: 1,
        pageSize: 20,
      }
      this.queryWarehouseList()
    },
    methods: {
      queryWarehouseList() {
        let params = this.warehouseSearchForm
        params.parentCityId = this.servicerDetail.id
        http.getServicerWarehouseList(params)
          .then(data => {
            this.warehouseList = data || []
            this.totalCount = data ? data.totalCount : 0
          })
          .catch(e => {
            this.$message(e)
          })
      },
      indexMethods(index) {
        return (this.warehouseSearchForm.pageNum - 1) * this.warehouseSearchForm.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.warehouseSearchForm.pageNum = num
        this.queryWarehouseList()
      },
      onSelectAdminCity(valueArr) {
        this.warehouseSearchForm.city = valueArr[valueArr.length - 1].name
      },
      onCleanAdminCity() {
        this.warehouseSearchForm.city = null
      },
      submitForm() {
        this.queryWarehouseList()
      },
      resetForm() {
        this.warehouseSearchForm = {
          city: ``,
          name: ``,
          pageNum: 1,
          pageSize: 10,
        }
        this.$refs[`adminCitySelector`].clean()
        this.queryWarehouseList()
      },
    },
    computed: {
      ruleId() {
        return this.choseRoleInfoList.ruleOrgId
      },
      ...mapState(`user`, [`choseRoleInfoList`])
    }
  }
</script>

<style lang="stylus" scoped>
  .header {
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .el-row {
    margin-bottom 20px;

    .el-col {
      font-size 14px;
      color: #333;
    }
  }

  .el-form-item {
    margin-bottom: 0
  }

  .button {
    margin-top 10px
    text-align center
  }

  .el-pagination {
    float right;
    margin-top 20px;
  }

  .query-btn {
    text-align center
    border-bottom: 1px solid #ededed
    padding-bottom: 20px
  }

</style>
