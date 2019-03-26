<template>
  <div id="dealerAudit" v-loading="loading">
    <!--<el-tabs v-model="dealerInfo.dealerState" @tab-click="handleClick">
      <el-tab-pane label="待审批" name=0></el-tab-pane>
      <el-tab-pane label="已通过" name=1></el-tab-pane>
    </el-tabs>-->
    <!--搜索条件-->
    <el-form :inline="true" :model="shopInfo"
             size="medium"
             label-width="120px"
             label-suffix="："
             class="demo-form-inline"
             ref="shopInfo">
      <!--<el-form-item label="经销商手机号">
        <el-input v-model="shopInfo.contactNumber" placeholder="请输入" clearable></el-input>
      </el-form-item>-->
      <el-form-item label="经销商名称">
        <el-input v-model="shopInfo.dealerName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="店铺状态">
        <el-select v-model="shopInfo.auditState" clearable>
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
      <el-table-column prop="shopIntroduce" label="商贸介绍">
      </el-table-column>
      <el-table-column prop="shopName" label="商贸名称">
      </el-table-column>
      <!--<el-table-column  label="经销商logo">
        <template slot-scope="scope">
          <img :src="scope.row.dealerLogoId" alt="">
        </template>
      </el-table-column>-->
      <el-table-column prop="dealerName" label="经销商名称">
      </el-table-column>
      <!--<el-table-column prop="wishCountry" label="希望开通的城市">
      </el-table-column>-->
      <el-table-column label="经销商审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditState===0?'待审批':'通过'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">详情</el-button>
          <!--<el-button type="text" size="small" @click="setCost(scope.row)">{{productInfo.status==0?'设置费用':'调整费用'}}
          </el-button>-->
          <el-button type="text" size="small" @click="auditDealer(scope.row)" v-if="scope.row.auditState==0">审核
          </el-button>
          <!--<el-button type="text" size="small" @click="toggleState(scope.row,scope.$index)"
          >
            {{scope.row.status===0?'启用':'停用'}}
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="shopInfo.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>
  </div>
</template>


<script>
  import http from 'http/dealerManageApi'
  import {mapState} from 'vuex'

  export default {
    name: 'dealerAudit',
    props: [],
    data() {
      return {
        shopInfo: {
          auditState: 0,//店铺状态 (0.待审批 1.通过 )
          contactNumber: ``,
          dealerName: ``,
          dealerState: 1,     //经销商状态 (0.待审批 1.通过 )
          pageNum: 1,
          pageSize: 10,
        },
        totalCount: ``,
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
    components: {},
    activated() {
      this.getDealerList()
    },
    methods: {
      getDealerList() {
        this.loading = true
        return http.getDealerAuditList(this.shopInfo)
          .then(data => {
            this.dealerAuditList = data.data
            this.totalCount = data.totalCount
            this.loading = false
          }).catch(e => {
            this.$message(e)
            this.loading = false
          })
      },

      handleClick(tab) {
        this.shopInfo.auditState = tab.name
        this.getDealerList();
      },
      resetForm() {
        this.shopInfo = {
          dealerState: 1,
          contactNumber: ``,
          dealerName: ``,
          auditState: 0,     //经销商状态 (0.待审批 1.通过 )
          pageNum: 1,
          pageSize: 10,
        }
        this.getDealerList()
      },
      auditDealer(row) {
        let params = {
          dealerId: row.id,
          shopState: row.auditState == 0 ? 1 : 0,
          userId: this.userInfo.userId
        }
        return http.auditShopState(params).then(data => {
          this.$message({
            type: 'success',
            message: '审核成功!'
          });
          this.getDealerList()
        })
      },
      goToDetail(row) {
        let dealerId = row.id
        this.$router.push({name: `shopAuditDetail`, query: {dealerId}})
      },
      indexMethods(index) {
        return (this.shopInfo.pageNum - 1) * this.shopInfo.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.shopInfo.pageNum = num
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
