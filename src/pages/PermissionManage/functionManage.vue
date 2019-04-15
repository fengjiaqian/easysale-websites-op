<template>
  <div id="applyWarehouseProduct" v-loading="loading">
    <!--<el-tabs v-model="productInfo.status" @tab-click="handleClick">
      <el-tab-pane label="待设置" name=0></el-tab-pane>
      <el-tab-pane label="已设置" name=1></el-tab-pane>
    </el-tabs>-->
    <!--搜索条件-->
    <el-form :inline="true" :model="functionInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="functionInfo">
      <el-form-item label="功能名称">
        <el-input v-model="functionInfo.name" placeholder="请输入" clearable></el-input>
      </el-form-item>

      <el-form-item label="功能类型" prop="type">
        <el-select v-model="functionInfo.type" placeholder="请选择功能类型">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="模型" :value="1"></el-option>
          <el-option label="菜单" :value="2"></el-option>
          <el-option label="功能" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统类型" prop="systemType">
        <el-select v-model="functionInfo.systemType" placeholder="请选择系统类型">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="小程序" :value="1"></el-option>
          <el-option label="PC端" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="functionInfo.state" placeholder="请选择状态">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="停用" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <!--
      <el-form-item label="入库时间" clearable>
        &lt;!&ndash;<el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getSelectDate"
          value-format=" yyyy-MM-dd" format="yyyy-MM-dd">
        </el-date-picker>&ndash;&gt;
          <el-date-picker
            v-model="productInfo.startTime"
            type="date"
            :picker-options="startDatePicker"
            value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
            placeholder="开始日期">
          </el-date-picker>
          &lt;!&ndash;value-format=" yyyy-MM-dd" format="yyyy-MM-dd"&ndash;&gt;
          <span>至</span>
          <el-date-picker
            v-model="productInfo.endTime"
            type="date"
            :picker-options="endDatePicker"
            value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
            placeholder="结束日期">
          </el-date-picker>
      </el-form-item>-->
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getFunctionList_" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <el-button type="primary" class="add-warehouse" @click="addFunction">新增功能</el-button>

    <!--表格-->
    <el-table
      :data="productList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="父级节点" width="80">
      </el-table-column>
      <el-table-column prop="wholeId" label="父级wholeid" width="120">
      </el-table-column>
      <!--<el-table-column prop="businessCity" label="业务城市">
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库"> （1：模型 2：菜单 3：功能）
      </el-table-column>-->
      <el-table-column prop="type" label="功能类型" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.type===1?'模型':scope.row.type===2?'菜单':'功能'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="systemType" label="系统类型" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.type===1?'小程序':'PC'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="功能名称">
      </el-table-column>
<!--      <el-table-column label="状态">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{scope.row.status===0?'停用':'启用'}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <!--<el-table-column label="是否收取仓配费用">
        <template slot-scope="scope">
          <span>{{scope.row.isGetWarehouseCharge==0?'否':'是'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型">
        <template slot-scope="scope">
          <span>{{scope.row.businessType==0?'正常业务':'贷款业务'}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="url" label="url路径" >
      </el-table-column>
      <el-table-column prop="state" label="状态" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.state===0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" >
      </el-table-column>
      <!--<el-table-column prop="firstInStockTime" label="首次入库时间">
      </el-table-column>-->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">编辑/详情</el-button>
          <el-button type="text" size="small" @click="close_start_state(scope.row.state,scope.row.id)">{{scope.row.state===0?'启用':'停用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="functionInfo.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>


    <!--设置费用弹框-->
    <el-dialog
      :title="alertInfo.status==0?'提示信息':'提示信息'"
      :visible.sync="alertInfoState"
      width="30%"
      :append-to-body="true"
    >
      <el-form label-width="148px" class="el-form-product">
        <el-form-item >
          <span>您确定要变更状态吗!</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alertInfoState = false">取 消</el-button>
        <el-button type="primary" @click="ensureCharge">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  //引入 vue 后台发请求api接口
  import https_f from 'http/functionManageApi'

  export default {
    name: "functionManage",
    data() {
      //页面取值的数据
      return {
        //TODO 先写死 整合之后 改活
        crrur_userid:6666666,
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
         //6为页面默认状态
        functionInfo: {
          type:6,	// 权限类型（1：模型 2：菜单 3：功能）
          systemType:6,//系统类型（1：小程序 2：pc端）
          name:'', //权限名称
          state:6,//状态（0:停用 1：启用）,
          pageSize:20,
          pageNum:1,
        },
        chargeDialog: false,
        totalCount: 0,
        productList: [],
        loading: false,
        alertInfoState:false,
        alertInfo:{
          status:0,
        },
        up_state:6,
        up_pid:6
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      //update_
      update_state(param){
        // console.log(JSON.stringify(param));
        https_f.updateFuctionObj(param).then(data => {
          this.$message("执行成功!");
        }).catch(e => {
          this.$message("执行失败!");
        })
        this.alertInfoState = false;
        //刷新页面shuj
        this.getFunctionList_();
      },
      //确认修改状态
      ensureCharge(){
          if(this.up_state == 6){
            this.$message("网络异常!");
            return false;
          }
        if(this.up_pid == 6){
          this.$message("网络异常!");
          return false;
        }
        let param = {
          update_user:this.crrur_userid,
          id:this.up_pid,
        }
        //以上正常不触发 执行下面
        if(this.up_state == 1){
          param .state = 0;
        }else{
          param .state = 1;
        }
        console.log(JSON.stringify(param));
        this.update_state(param);
      },
      //停用或启动
      close_start_state(state,id){
         this.alertInfoState = true;
         this.up_state = state;
         this.up_pid  = id;
      },
      //简单处理传递到后台的数据
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
        return newarr;
      },
      /*新增功能 */
      addFunction(){
        this.$router.push({name: `functionAdd`})
      },
      /*获取功能数据列表*/
      getFunctionList_() {
        this.loading = true;
        https_f.functionList(this.param_handle(this.functionInfo)).then(data => {
          this.loading = false
          // console.log("-------------------------------------");
          this.productList = data.dataList;
          this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      //刷新页面
      resetForm() {
        this. functionInfo= {
            type:6,	// 权限类型（1：模型 2：菜单 3：功能）
            systemType:6,//系统类型（1：小程序 2：pc端）
            name:'', //权限名称
            state:6,//状态（0:停用 1：启用）
            pageSize:20,
            pageNum:1,
        }
       // this.getProductList()
      },
      getSelectDate(value) {
        this.functionInfo.startTime = value[0]
        this.functionInfo.endTime = value[1]
      },
      // 详情 修改
      goToDetail(row) {
        // console.log(row.id);
        let id = row.id;
        this.$router.push({name:`functionUpdate`, query:{id}})
      },
      /*设置状态*/
      toggleState(row, index) {
      },
      indexMethods(index) {
        return (this.functionInfo.pageNum - 1) * this.functionInfo.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.functionInfo.pageNum = num
        this.getFunctionList_();
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
    //页面载入  数据处理
    mounted:function(){
      //TODO  默认不根据条件查询拉去 第一页
      this.functionInfo.pageNum = 1;
      this.functionInfo.pageSize = 20;
      this.functionInfo.type=6;
      this.functionInfo.systemType=6;
      this.functionInfo.state=6;
      this.functionInfo.name='';
      if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
        let  userobj  =sessionStorage.getItem(`userInfo`);
        this.crrur_userid = (JSON.parse(userobj)).id;
      }else{
        //用户信息获取失败
        this.$message("网络异常获取用户信息失败!");
      }
      this.getFunctionList_();
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
