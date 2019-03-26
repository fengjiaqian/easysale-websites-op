<template>
  <div id="dealerAudit" v-loading="loading">
    <!--<el-tabs v-model="dealerInfo.dealerState" @tab-click="handleClick">
      <el-tab-pane label="待审批" name=0></el-tab-pane>
      <el-tab-pane label="已通过" name=1></el-tab-pane>
    </el-tabs>-->
    <!--搜索条件-->
    <el-form :inline="true" :model="dealerInfo"
             size="medium"
             label-width="120px"
             label-suffix="："
             class="demo-form-inline"
             ref="dealerInfo">
      <el-form-item label="经销商手机号">
        <el-input v-model="dealerInfo.contactNumber" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="经销商名称">
        <el-input v-model="dealerInfo.dealerName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="经销商状态">
        <el-select v-model="dealerInfo.dealerState" clearable>
          <el-option
            v-for="item in dealerOptions"
            :key="item.value"
            :label="item.state"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getDealerList" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>
    <!--表格-->
    <el-table
      :data="dealerAuditList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dealerName" label="经销商名称">
      </el-table-column>
      <el-table-column prop="contactor" label="联系人">
      </el-table-column>
      <el-table-column prop="contactNumber" label="联系电话">
      </el-table-column>
      <el-table-column prop="cityName" label="城市名称">
      </el-table-column>
      <el-table-column prop="address" label="详细地址">
      </el-table-column>
      <el-table-column label="经销商审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.dealerState===0?'待审批':'通过'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">详情</el-button>
          <!--<el-button type="text" size="small" @click="setCost(scope.row)">{{productInfo.status==0?'设置费用':'调整费用'}}
          </el-button>-->
          <el-button type="text" size="small" @click="auditDealer(scope.row)" v-if="scope.row.dealerState==0">审核
          </el-button>
          <!--<el-button type="text" size="small" @click="toggleState(scope.row,scope.$index)"
          >
            {{scope.row.status===0?'启用':'停用'}}
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <!--<el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="dealerInfo.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>-->
    <pagination :page-size="dealerInfo.pageSize" :current-page="dealerInfo.pageNum"
                :total-count="totalCount"
                @pageNumChange="handlePageNumChange"
    ></pagination>
  </div>
</template>


<script>
  import http from 'http/dealerManageApi'
  import {mapState} from 'vuex'
  import pagination from 'common/pagination.vue'

  export default {
    name: 'dealerAudit',
    props: [],
    data() {
      return {
        dealerInfo: {
          // auditState: 0,
          contactNumber: ``,
          dealerName: ``,
          dealerState: 0,     //经销商状态 (0.待审批 1.通过 )
          pageNum: 1,
          pageSize: 10,
        },
        totalCount: 0,
        dealerAuditList: [],
        loading: false,
        dealerOptions: [
          {
            value: 0,
            state: '待审核'
          },
          {
            value: 1,
            state: '已通过'
          }
        ],
      }
    },
    components: {
      pagination
    },
    activated() {
      this.getDealerList()
    },
    methods: {
      getDealerList() {
        this.loading = true
        return http.getDealerAuditList(this.dealerInfo)
          .then(data => {
            this.dealerAuditList = data.data
            this.totalCount = Number(data.totalCount)
            console.log(this.totalCount)
            this.loading = false
          }).catch(e => {
            this.$message(e)
            this.loading = false
          })
      },

      handleClick(tab) {
        this.dealerInfo.dealerState = tab.name
        this.getDealerList();
      },
      resetForm() {
        this.dealerInfo = {
          // auditState: 0,
          contactNumber: ``,
          dealerName: ``,
          dealerState: 0,     //经销商状态 (0.待审批 1.通过 )
          pageNum: 1,
          pageSize: 10,
        }
        this.getDealerList()
      },
      auditDealer(row) {
        let params = {
          dealerId: row.id,
          dealerState: row.dealerState == 0 ? 1 : 0,
          userId: this.userInfo.userId
        }
        return http.auditDealerState(params).then(data => {
          this.$message({
            type: 'success',
            message: '审核成功!'
          });
          this.getDealerList()
        })
      },
      goToDetail(row) {
        let dealerId = row.id
        this.$router.push({name: `dealerAuditDetail`, query: {dealerId}})
      },
      indexMethods(index) {
        return (this.dealerInfo.pageNum - 1) * this.dealerInfo.pageSize + index + 1
      },
      handlePageNumChange(num) {
        console.log(num)
        this.dealerInfo.pageNum = num
        this.getDealerList()
      },
    },
    computed: {
      ...mapState(`user`, [`userInfo`])
    },
  }
</script>


<style lang="stylus" scoped>
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

  .el-pagination {
    float: right
    margin-top: 12px
  }

  .query-btn {
    text-align: center
    border-bottom: 1px solid #ededed
    padding-bottom: 20px
  }
</style>
