<template>
  <div id="operator" v-loading="fullscreenLoading">
    <!--搜索条件-->
    <el-form :inline="true" :model="warehouseSearchForm"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="所属公司" v-if="isGroupCompany">
        <el-select v-model="warehouseSearchForm.cityId">
          <el-option
            v-for="company in companyList"
            :key="company.id"
            :label="company.orgName"
            :value="company.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市">
        <admin-city-selector
          ref="adminCitySelector"
          :targetLevel="2"
          @select-admin-city="onSelectAdminCity"
          @clean-admin-city="onCleanAdminCity"
        ></admin-city-selector>
      </el-form-item>
      <el-form-item label="仓库">
        <el-input v-model="warehouseSearchForm.name" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getWarehouseList()" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <el-button type="primary" class="add-warehouse" @click="addWarehouse">新增仓库</el-button>
    <el-table
      :data="warehouseList"
      border
      height='520'
      style="width: 100%;margin-top:16px;">
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="仓库名称"></el-table-column>
      <el-table-column prop="companyName" label="所属公司" v-if="isGroupCompany"></el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <span>{{`${scope.row.province||``}${scope.row.city||``}${scope.row.county||``}${scope.row.street||``}`}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="custodianCharge" label="托管费"></el-table-column>
      <el-table-column prop="transportCharge" label="配送费"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status===0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="editWarehouse(scope.row)">编辑</el-button>
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
      :page-size="warehouseSearchForm.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>
  </div>
</template>

<script>
  import http from 'http/warehouseMessageApi'
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState} from 'vuex'

  export default {
    name: "warehouseMessageManage",
    data() {
      return {
        warehouseSearchForm: {
          cityId: ``,
          city: ``,
          parentCityId: ``,
          pageNum: 1,
          name: '',//仓库名称关键字
          pageSize: 20,
        },
        companyList: [],
        provinceList: [],
        cityChooseProps: {
          label: 'name',
          value: 'name',
          children: 'cities'
        },
        totalCount: 0,
        warehouseList: [],
        fullscreenLoading: false
      }
    },
    components: {
      AdminCitySelector
    },
    activated() {
      this.getWarehouseList()
      if (this.isGroupCompany) {
        this.getCompanyList()
      }
    },
    methods: {
      resetForm() {
        this.warehouseSearchForm = {
          cityId: ``,
          city: ``,
          pageNum: 1,
          name: '',//仓库名称关键字
          pageSize: 10,
        }
        this.$refs[`adminCitySelector`].clean()
        this.getWarehouseList();
      },
      getCompanyList() {
        http.listCompany(this.ruleId)
          .then(data => {
            this.companyList = data || []
          })
          .catch(e => {
            console.log(e)
          })
      },
      //查询仓库列表信息
      getWarehouseList() {
        this.fullscreenLoading = true
        let {pageNum, pageSize, cityId, city, name} = this.warehouseSearchForm
        http.getWarehouseList({pageNum, pageSize, city, cityId, name, parentCityId: this.ruleId})
          .then(data => {
            this.warehouseList = data || []
            this.totalCount = data ? data.totalCount : 0
            this.fullscreenLoading = false
          })
          .catch(e => {
            console.log(e)
            this.fullscreenLoading = false
          })
      },
      onSelectAdminCity(valueArr) {
        this.warehouseSearchForm.city = valueArr[valueArr.length - 1].name
      },
      onCleanAdminCity() {
        this.warehouseSearchForm.city = ``
      },

      //新增仓库
      addWarehouse() {
        this.$router.push({path: '/warehouseMessageAdd'})
      },
      editWarehouse(row) {
       // if (row.stockNumber) return this.$message(`该仓库有库存，暂不可编辑`)
        this.$router.push({path: '/warehouseMessageAdd', query: {warehouse: row}})

      },
      //启用停用仓库
      toggleState(row, index) {
        this.fullscreenLoading = true
        http.disableWarehouse({warehouseId: row.warehouseId, status: row.status === 0 ? 1 : 0})
          .then(data => {
            this.warehouseList[index].status = this.warehouseList[index].status === 0 ? 1 : 0
            this.fullscreenLoading = false
          })
          .catch(e => {
            this.$message(e)
            this.fullscreenLoading = false
          })
      },
      handlePageNumChange(num) {
        this.warehouseSearchForm.pageNum = num
        this.getWarehouseList()
      },
      indexMethods(index) {
        return (this.warehouseSearchForm.pageNum - 1) * this.warehouseSearchForm.pageSize + index + 1
      },
      goToDetail(row) {
        this.$router.push({path: '/warehouseMessageDetail', query: {warehouse: row}})
      }
    },
    computed: {
      isGroupCompany() {
        return this.choseRoleInfoList.ruleOrgType === 2
      },
      ruleId() {
        return this.choseRoleInfoList.ruleOrgId
      },
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    watch: {}

  }
</script>

<style scoped lang="stylus">
  #operator {
    .header {
      border-bottom: 1px solid #ededed;
      padding-bottom: 20px;
    }

    .el-col {
      display: flex;
      flex-direction: row;
      align-items center;
    }

    .el-row {
      display: flex;
      align-items center;
      padding-bottom: 15px;
      padding-left: 15px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .add-warehouse {
      padding: 10px 24px;
      margin-top:16px
    }

    .el-pagination {
      float right;
      margin-top 20px;
    }
  }

  .el-form {
    .el-form-item {
      .el-cascader, .el-select, .el-input {
        width 250px;
      }
    }
  }

  .query-btn{
    text-align center
    border-bottom:1px solid #ededed
    padding-bottom:20px
  }


</style>

