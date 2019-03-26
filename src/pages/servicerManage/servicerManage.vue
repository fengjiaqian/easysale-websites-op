<template>
  <div id="operator" v-loading="fullscreenLoading">
    <!--搜索条件-->
    <el-form :inline="true" :model="servicerSearchForm"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="服务商名称">
        <el-input v-model="servicerSearchForm.orgName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="servicerSearchForm.contacterName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话">
        <el-input v-model="servicerSearchForm.contacterPhone" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="servicerSearchForm.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getServicerList()" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <el-button type="primary" class="add-warehouse" @click="addServicer">新增服务商</el-button>
    <el-table
      :data="servicerList"
      border
      height="520"
      style="width: 100%;margin-top:16px;">
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orgName" label="公司名称"></el-table-column>
      <el-table-column prop="detailAddress" label="公司类型">
        <template slot-scope="scope">
          <span>{{scope.row.orgType===1?`一般公司`:scope.row.orgType===2?`集团公司`:``}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contacterName" label="联系人"></el-table-column>
      <el-table-column prop="contacterPhone" label="联系人手机"></el-table-column>
      <el-table-column label="开通服务">
        <template slot-scope="scope">
          <div v-if="scope.row.serviceType===1">
            <el-tag size="mini">仓储服务</el-tag>
          </div>
          <div v-else-if="scope.row.serviceType===2">
            <el-tag size="mini">配送服务</el-tag>
          </div>
          <div v-else-if="scope.row.serviceType===3">
            <el-tag size="mini">仓储服务</el-tag>
            <el-tag size="mini">配送服务</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.state===2?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="goToDetail(scope.row)">详情</el-button>
          <el-button type="text" size="medium" @click="editWarehouse(scope.row)">编辑</el-button>
          <el-button type="text" size="medium" @click="toggleState(scope.row,scope.$index)">
            {{scope.row.state===2?'启用':'停用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="servicerSearchForm.pageSize"
      :total="totalCount"
      v-if="totalCount>0">
    </el-pagination>
  </div>
</template>

<script>
  import http from 'http/servicerApi'
  import {mapState} from 'vuex'

  export default {
    name: "servicerManage",
    data() {
      return {
        servicerSearchForm: {
          contacterName: ``,
          contacterPhone: ``,
          orgName: ``,
          state: null,
          pageNum: 1,
          pageSize: 20,
        },
        totalCount: 0,
        servicerList: [],
        fullscreenLoading: false
      }
    },
    activated() {
      this.getServicerList()
    },
    methods: {
      resetForm() {
        this.servicerSearchForm = {
          contacterName: ``,
          contacterPhone: ``,
          orgName: ``,
          state: null,
          pageNum: 1,
          pageSize: 10,
        }
        this.getServicerList()
      },
      //查询列表信息
      getServicerList() {
        this.fullscreenLoading = true
        let {contacterName, contacterPhone, orgName, state, pageNum, pageSize} = this.servicerSearchForm
        http.getServicerList({contacterName, contacterPhone, orgName, state, pageNum, pageSize})
          .then(data => {
            this.servicerList = data || []
            this.totalCount = data ? data.totalCount : 0
            this.fullscreenLoading = false
          })
          .catch(e => {
            console.log(e)
            this.fullscreenLoading = false
          })
      },

      //新增
      addServicer() {
        this.$router.push({path: '/addServicerManage'})
      },
      editWarehouse(row) {
        this.$router.push({path: '/addServicerManage', query: {servicer: row}})
      },
      //启用停用服务商
      toggleState(row, index) {
        this.fullscreenLoading = true
        http.disableServicer({orgId: row.id, state: row.state === 1 ? 2 : 1})
          .then(() => {
            this.servicerList[index].state = this.servicerList[index].state === 1 ? 2 : 1
            this.fullscreenLoading = false
          })
          .catch(e => {
            this.$message(e)
            this.fullscreenLoading = false
          })
      },
      handlePageNumChange(num) {
        this.servicerSearchForm.pageNum = num
        this.getServicerList()
      },
      indexMethods(index) {
        return (this.servicerSearchForm.pageNum - 1) * this.servicerSearchForm.pageSize + index + 1
      },
      goToDetail(row) {
        this.$router.push({path: '/servicerManageDetail', query: {servicer: row}})
      }
    },
    computed: {},
    watch: {
      // $route(to, from) {
      //   from.meta.keepalive = to.name === `addServicerManage` || to.name === `servicerManageDetail`;
      // },

    }

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
      margin-top: 16px;
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

  .query-btn {
    border-bottom: 1px solid #ededed
    text-align center
    padding-bottom: 20px
  }


</style>

