<template>
  <div id="suserManage"  v-loading="loading">
    <el-form :inline="true" :model="suserInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="suserInfo">
  <!--    <el-form-item label="微信昵称">
        <el-input v-model="suserInfo.wxNickName" placeholder="请输入微信昵称" clearable></el-input>
      </el-form-item>-->

      <el-form-item label="手机号">
        <el-input v-model="suserInfo.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>

     <!-- 用户类型(1:经销商 2：销售人员  3：终端客户)-->
     <!-- <el-form-item label="用户类型" prop="userType">
        <el-select v-model="suserInfo.userType" placeholder="请选择用户类型">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="经销商" :value="1"></el-option>
          <el-option label="销售人员" :value="2"></el-option>
          <el-option label="终端客户" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="suserInfo.state" placeholder="请选择状态">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="停用" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getSuserList_" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <el-button type="primary" class="add-warehouse" @click="addSuser">新增用户</el-button>

    <!--表格-->
    <el-table
      :data="suserList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wxNickName" label="微信昵称">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" >
      </el-table-column>
      <el-table-column prop="userType" label="用户类型" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.userType===1?'经销商':scope.row.userType==2?'销售人员':'终端客户'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wxAppId" label="微信openid" >
      </el-table-column>
      <el-table-column prop="state" label="状态" width="90">
                <template slot-scope="scope">
                  <span>{{scope.row.state===0?'停用':'启用'}}</span>
                </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">编辑/详情</el-button>
          <el-button type="text" size="small" @click="userAuthRole(scope.row.id)">用户授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="suserInfo.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>
  </div>
</template>

<script>


  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import https_f from 'http/suserManageApi'

  export default {
    name: "suserManage",
    data() {
      return {
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        //6为页面默认状态
        suserInfo: {
          type:6,	// 权限类型（1：模型 2：菜单 3：功能）
          systemType:6,//系统类型（1：小程序 2：pc端）
          name:'', //权限名称
          state:6,//状态（0:停用 1：启用）,
          pageSize:20,
          pageNum:1,
          userType:6,
          wxNickName:'',
          phone:'',
          wxAppId:''
        },
        chargeDialog: false,
        totalCount: 0,
        suserList: [],
        loading: false,
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      param_handle(arr){
        let newarr = arr;
        if(newarr.type == 6){
          delete newarr['type'];
        }
        if(newarr.systemType == 6){
          delete newarr['systemType'];
        }
        if(newarr.state == 6){
          delete newarr['state'];
        }
        if(newarr.userType == 6){
          delete newarr['userType'];
        }
        if(newarr.phone == ''){
          delete newarr['phone'];
        }
        delete newarr['wxNickName'];
        delete newarr['name'];
        delete newarr['wxAppId'];
        return newarr;
      },
      /*新增功能 */
      addSuser(){
        this.$router.push({name: `suserAdd`})
      },
      /*用户授权 */
      userAuthRole(id){
        console.log(id);
        this.$router.push({name:'suser_roleAuthorization', query:{id}})
      },
      /*获取功能数据列表*/
      getSuserList_() {
        this.loading = true;
        // console.log("查询条件:"+JSON.stringify(this.param_handle(this.suserInfo)));
        https_f.suser_List(this.param_handle(this.suserInfo)).then(data => {
          this.loading = false
          // console.log(JSON.stringify(data.dataList));
          // console.log("-------------------------------------");
          // console.log(JSON.stringify(data.pager));

          let objs  = data.dataList;
          // for(let x=0;x<objs.length;x++){
          //     if(objs[x].wxNick){
          //
          //     }
          // }
          this.suserList = data.dataList;
          this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      resetForm() {
        this. suserInfo= {
          type:6,	// 权限类型（1：模型 2：菜单 3：功能）
          systemType:6,//系统类型（1：小程序 2：pc端）
          name:'', //权限名称
          state:6,//状态（0:停用 1：启用）,
          pageSize:20,
          pageNum:1,
          userType:6,
          wxNickName:'',
          phone:'',
          wxAppId:''
        }
        // this.getProductList()
      },
      getSelectDate(value) {
        this.suserInfo.startTime = value[0]
        this.suserInfo.endTime = value[1]
      },
      // 详情 修改
      goToDetail(row) {
        console.log(row.id);
        let id = row.id;
        this.$router.push({name:`suserUpdate`, query:{id}})
      },
      /*设置状态*/
      toggleState(row, index) {
      },
      indexMethods(index) {
        return (this.suserInfo.pageNum - 1) * this.suserInfo.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.suserInfo.pageNum = num
        this.getSuserList_();
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
    },
    mounted:function(){
      //TODO  默认不根据条件查询拉去 第一页
      this.suserInfo.pageNum = 1;
      this.suserInfo.pageSize = 20;
      this.suserInfo.type=6;
      this.suserInfo.systemType=6;
      this.suserInfo.state=6;
      this.suserInfo.name='';
      this.suserInfo.wxNickName='';
      this.suserInfo.phone='';
      this.suserInfo.userType=6;

      this.getSuserList_();
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

