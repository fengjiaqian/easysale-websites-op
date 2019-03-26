<template>
  <div id="wareHouseDealer" v-loading="loading">
    <!--搜索条件-->
    <el-form :inline="true" :model="warehouseSearchForm"
             size="medium"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="经销商手机">
        <el-input v-model="warehouseSearchForm.mobileNo" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否收费" >
        <el-select v-model="warehouseSearchForm.isGetWarehouseCharge" clearable>
          <el-option
            v-for="item in chargeOptions"
            :key="item.value"
            :label="item.state"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-select v-model="warehouseSearchForm.businessType" clearable>
          <el-option
            v-for="item in businessOptions"
            :key="item.value"
            :label="item.type"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getDealerInfo">查询</el-button>
      <el-button type="info" @click="resetForm()" style="margin-left:40px;">重置</el-button>
    </div>

    <!--  table    -->
    <el-table
      :data="wareHouseDealerList"
      border
      height="520"
      style="width: 100%;margin-top:28px;">
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobileNo" label="经销商手机"></el-table-column>
      <el-table-column label="首次申请服务时间">
        <template slot-scope="scope">
          <span>{{formatDate(scope.row.firstServiceTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否收取仓配费用">
        <template slot-scope="scope">
          <span>{{scope.row.isGetWarehouseCharge===0?'否':'是'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型">
        <template slot-scope="scope">
          <span>{{scope.row.businessType==0?'正常业务':'贷款业务'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status===0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="editChargeState(scope.row)">是否收费</el-button>
          <el-button type="text" size="small" @click="toggleState(scope.row)"
          >
            {{scope.row.status===0?'启用':'禁用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--是否收费弹框-->
    <el-dialog
      title="设置费用"
      :visible.sync="chargeDialog"
      width="30%"
      :append-to-body="true"
    >
      <el-form :model="settingForm" ref="memberForm" label-width="148px">
        <el-form-item label="是否收取仓配费用">
          <el-select v-model="settingForm.isGetWarehouseCharge">
            <el-option
              v-for="item in chargeOptions"
              :key="item.value"
              :label="item.state"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="settingForm.businessType">
            <el-option
              v-for="item in businessOptions"
              :key="item.value"
              :label="item.type"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeDialog = false">取 消</el-button>
        <el-button type="primary" @click="ensureCharge">确 定</el-button>
      </span>
    </el-dialog>

    <!--禁用弹框-->
    <el-dialog
      title="确定禁用"
      :visible.sync="disableDialog"
      width="30%"
      :append-to-body="true"
    >
      <span>产品分组禁用，相应的价格调整也会禁用</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="disableDialog = false">取 消</el-button>
        <el-button type="primary" @click="continueChange">继 续</el-button>
      </span>
    </el-dialog>

    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>
  </div>
</template>

<script>
  import http from 'http/wareHouseDealerApi'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "dealerManage",
    data() {
      return {
        warehouseSearchForm: {
          mobileNo: '',    //经销商手机号
          isGetWarehouseCharge: ``,    //是否收取仓配费用  0为不收取  1为收取
          businessType: ``,     //  业务类型  	0=正常业务 1=贷款业务
          facilitatorId: ``,    //服务商Id
        },
        settingForm: {
          businessType: ``,
          isGetWarehouseCharge: 1,
        },
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
        wareHouseDealerList: [],
        pageNum: 1,
        pageSize: 20,
        chargeDialog: false,   //是否收费弹窗
        disableDialog: false,      //是否禁用弹框
        dealerId: '',    //经销商id
        facilitatorId:``,   //服务商id
        status: ``,    //状态
        lastUpdateUser: ``,    //最后更新人
        totalCount:``,
        loading:false
      }
    },

    created() {
      this.warehouseSearchForm.facilitatorId = this.choseRoleInfoList.ruleOrgId
      this.getDealerInfo()
    },
    methods: {
      //查询经销商信息
      getDealerInfo() {
        this.loading = true
        let {mobileNo, isGetWarehouseCharge, businessType, facilitatorId} = this.warehouseSearchForm
        let {pageNum, pageSize} = this
        http.getDealerHomeList({
          mobileNo,
          isGetWarehouseCharge,
          businessType,
          pageNum,
          pageSize,
          facilitatorId
        }).then(data => {
          this.wareHouseDealerList = data.dataList
          this.totalCount = data.pager.recordCount
          this.loading = false
        }).catch(e=>{
          this.$message(e)
          this.loading = false
        })
      },
      resetForm() {
        this.warehouseSearchForm = {
          mobileNo: '',    //经销商手机号
          isGetWarehouseCharge: ``,    //是否收取仓配费用  0为不收取  1为收取
          businessType: ``,     //  业务类型  	0=正常业务 1=贷款业务
          facilitatorId: this.choseRoleInfoList.ruleOrgId,
        }
        this.getDealerInfo()
      },
      goToDetail(row) {
        console.log(row)
        row.firstServiceTime = this.formatDate(row.firstServiceTime)
        row = JSON.stringify(row)
        this.$router.push({name:`userDetail`,query:{dealerInfo:row}})
      },
      editChargeState(row) {
        this.facilitatorId = row.facilitatorId
        this.dealerId = row.dealerId
        this.chargeDialog = true
      },
      //确定修改是否收取费用
      ensureCharge() {
        let {businessType, isGetWarehouseCharge} = this.settingForm
        let {dealerId,facilitatorId} = this
        http.editChargeType({businessType, isGetWarehouseCharge, dealerId,facilitatorId}).then(data => {
          this.chargeDialog = false
          this.getDealerInfo()
          this.settingForm = {
            businessType: ``,
            isGetWarehouseCharge: 1,
          }
        })
      },
      //禁用启用
      toggleState(row) {
        this.lastUpdateUser = row.lastUpdateUser
        this.dealerId = row.dealerId
        this.status = row.status == 0 ? 1 : 0
        this.disableDialog = true
        this.facilitatorId = row.facilitatorId
      },
      continueChange() {
        let {dealerId, status, lastUpdateUser,facilitatorId} = this
        http.updateDealerStatus({dealerId, status, lastUpdateUser,facilitatorId}).then(data => {
          this.disableDialog = false
          this.getDealerInfo()
        })
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      //分页
      handlePageNumChange(num){
        this.pageNum = num
        this.getDealerInfo()
      },
      //格式化时间
      formatDate(time) {
        let date = new Date(time);

        let year = date.getFullYear(),
          month = date.getMonth() + 1,//月份是从0开始的
          day = date.getDate(),
          hour = date.getHours(),
          min = date.getMinutes(),
          sec = date.getSeconds();
        let newTime = year + '-' +
          month + '-' +
          day + ' ' +
          hour + ':' +
          min + ':' +
          sec;
        return newTime;
      }
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`])
    }
  }
</script>

<style scoped lang="stylus">
  .el-pagination{
    float: right
    margin-top:12px
  }

  .query-btn{
    text-align center
    padding-bottom:20px
    border-bottom:1px solid #ededed
  }

  .el-table{
    margin-top:20px
  }
</style>
