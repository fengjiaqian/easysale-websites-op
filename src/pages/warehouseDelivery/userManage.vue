<template>
  <div id="operator">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>仓配服务</el-breadcrumb-item>
      <el-breadcrumb-item>经销商管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓配经销商</el-breadcrumb-item>
    </el-breadcrumb>

    <h2 class="header">仓配经销商</h2>

    <!--搜索条件-->
    <el-form :inline="true" :model="searchForm"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
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
    </el-form>
    <div class="button-wrap">
      <el-button type="primary" @click="submitForm()" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" style="margin-left:40px;" size="medium">重置</el-button>
    </div>
    <!--表格-->
    <el-table
      :data="userList"
      border
      style="width: 100%;margin-top:28px;">
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="经销商手机">
      </el-table-column>
      <el-table-column label="首次申请服务时间">
        <template slot-scope="scope">
          <span>{{scope.row.createtime|formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否收取仓配费用">
        <template slot-scope="scope">
          <span>{{scope.row.isgetwarehousecharge?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型">
        <template slot-scope="scope">
          <span>{{scope.row.bussinesstype===0?'正常业务':'贷款业务'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status===0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row,scope.$index)">详情</el-button>
          <el-button type="text" size="small" @click="toggleFee(scope.row,scope.$index)">是否收费</el-button>
          <el-button type="text" size="small" @click="toggleState(scope.row,scope.$index)">
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
      :page-size="searchForm.pageSize"
      :current-page.sync="searchForm.currentPage"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>
  </div>
</template>

<script>
  import http from 'http/dealerManageApi'

  export default {
    name: "operator",
    filters: {
      formatTime(timestrap) {
        let date = new Date(timestrap)
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      }
    },
    data() {
      return {
        searchForm: {
          bussinesstype: null,
          mobileNo: ``,
          facilitatorId: 7,
          isgetwarehousecharge: null,
          pageNum: 1,
          pageSize: 10,
        },
        totalCount: 0,

        userList: [],
      }
    },
    mounted() {
      this.queryDealerList()
    },
    methods: {
      handlePageNumChange(num) {
        this.pageNum = num
        this.queryDealerList()
      },
      submitForm() {
        this.searchForm.pageNum = 1
        this.queryDealerList()
      },
      indexMethods(index) {
        return (this.searchForm.pageNum - 1) * this.searchForm.pageSize + index + 1
      },
      queryDealerList() {
        return http.getDealerList(this.searchForm)
          .then(data => {
            this.userList = data.dataList || []
            this.totalCount = data.pager.recordCount || 0
          })
          .catch(e => {
            this.$message(e)
          })
      },
      resetForm() {
        this.searchForm = {
          bussinesstype: null,
          mobileNo: ``,
          facilitatorId: 7,
          isgetwarehousecharge: null,
          pageNum: 1,
          pageSize: 10,
        }
      },
      toggleState(row, index) {
        let oldStatus = row.status
        let newStatus = oldStatus === 0 ? 1 : 0
        return http.updateState({agencyId: row.agencyId, lastupdateuser: 7, status: newStatus})
          .then(() => {
            this.userList[index].status = newStatus
          })
          .catch(e => {
            this.$message(e)
          })
      },
      toggleFee(row, index) {
      },
      goToDetail(row, index) {
        this.$router.push({name: userDetail, params: {userInfo: row}})
      }

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

    .button-wrap {
      display flex;
      flex-direction row;
      justify-content center;
      align-items center;
    }

  }

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


</style>
