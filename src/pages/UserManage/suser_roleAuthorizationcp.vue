<template>
  <div id="suser_roleAuthorization"  v-loading="loading">
    <el-form :inline="true" :model="roleInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="roleInfo">
      <el-form-item label="角色名称">
        <el-input v-model="roleInfo.roleName" placeholder="请输入角色名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="roleInfo.state" placeholder="请选择状态">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getSuserList_" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <!--表格-->
    <el-table
      :data="suserList"
      border
      height="520"
      style="width: 100%;margin-top:20px;"  >

        <el-table-column  prop="ck_status"  label="复选" width="68"  >
          <template slot-scope="scope">
           <el-checkbox  :checked="scope.row.ck_status == 1"  @change="getckstatus(scope.row.id)" ></el-checkbox>
          </template>
        </el-table-column>
      <el-table-column label="序号" width="58" >
        <template slot-scope="scope" >
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称">
      </el-table-column>
      <el-table-column prop="state" label="状态" width="90">
        <template slot-scope="scope">
          <span>{{scope.row.state===0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" >
      </el-table-column>
    </el-table>
    <div style="margin:0 auto;width:300px;height:100px;margin-top:25px">
      <el-button type="primary" @click="onckbox_"  size="medium">保存</el-button>
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>
    <!--分页-->
   <!-- <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="functionInfo.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>-->
    <!--设置费用弹框-->
    <el-dialog
      :title="alertInfo.status==0?'确认信息':'确认信息'"
      :visible.sync="alertInfoState"
      width="30%"
      :append-to-body="true">
      <el-form label-width="148px" class="el-form-product">
        <el-form-item >
          <span>您确定授权这些角色给用户吗!</span>
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
  import https_f from 'http/suserRoleAuthorizationApi'
  export default {
    name: "suser_roleAuthorization",
    data() {
      return {
        ckboxarr:[],
        //页面载入  动态设置当前操作人ID
        crrur_userid:6666666,
        crrud_auth_uid:0,
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        //6为页面默认状态
        roleInfo: {
          id:0,
          roleName:'', //权限名称
          state:1,//状态（0:停用 1：启用）,
          pageNum:1,
          pageSize:3000,
          createTime:'',
          createUser:''
        },
        alertInfo:{
          status:0
        },
        alertInfoState:false,
        chargeDialog: false,
        totalCount: 0,
        suserList: [],
        loading: false,
        //用户已有的角色
        userrolearr:[],
        //是否是 没授权过的用户
        isauth_user:false
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      getUserAuthRoleIds_(id){
        let param_ = {
          userId: id
        }
        https_f.getUserAuthRoleIds(param_).then(data => {
          this.loading = false;
          // console.log(JSON.stringify(data));
          this.userrolearr = data;
          if(data.length <= 0){
            this.isauth_user = true;
          }
          this.getSuserList_();
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      getckstatus(val){
        if(this.userrolearr.length == 0){
          this.userrolearr.push(val);
        }else{
          let indexs_ = this.userrolearr.indexOf(val);
          if(indexs_ != -1){
            this.userrolearr.splice(indexs_, 1);
          }else{
            this.userrolearr.push(val);
          }
        }
      },
      // 确定修改
      ensureCharge(){
       this.alertInfoState = false;
        let cdparam = {
          roleIdList:this.userrolearr,
          userId:this.crrud_auth_uid
        }
        // 执行用户角色授权
        this.loading = true;
        //保存
        if(this.isauth_user){
          https_f.add_authuser_role(cdparam).then(data => {
            this.loading = false;
            this.$message({
              type: 'success',
              message: '授权成功'
            });
          }).catch(e => {
            this.$message(e)
            this.loading = false
          })
        }else{
          //修改
          https_f.update_authuser_role(cdparam).then(data => {
            this.loading = false;
            this.$message({
              type: 'success',
              message: '修改授权成功'
            });
          }).catch(e => {
            this.$message(e)
            this.loading = false
          })
        }
      },
      onckbox_(){
        if((this.userrolearr).length >0){
          // this.alertInfoState = true;
          this.$confirm('您确定授权这些角色给用户吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //执行
            this.ensureCharge();
          }).catch(() => {
            /*this.$message({
              type: 'info',
              message: '已取变更'
            });*/
          });
        }else{
          this.$message('请选择要授权的角色');
        }
      },
      param_handle(arr){
        let newarr = arr;
        return newarr;
      },
      /*获取功能数据列表*/
      getSuserList_() {
        this.loading = true;
        https_f.getAllRole(this.roleInfo).then(data => {
          this.loading = false
          let parenArr = [];
          let cArr = [];
          for(let x=0;x<data.length;x++){
            if(data[x].parentId != undefined || data[x].parentId != null){
              cArr.push(data[x]);
            }else{
              parenArr.push(data[x]);
            }
          }
          this.suserList = parenArr;
          // 测试添加选中状态
          let rids  = this.userrolearr;
          for(let x=0;x<this.suserList.length;x++){
            for(let i=0;i<rids.length;i++){
              if(this.suserList[x].id == rids[i]){
                (this.suserList)[x].ck_status = 1;
              }
            }
          }
          // this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      resetForm() {
        this. roleInfo= {
          id:0,
          roleName:'', //权限名称
          state:1,//状态（0:停用 1：启用）,
          pageNum:1,
          pageSize:3000,
          createTime:'',
          createUser:''
        }
        this.getSuserList_();
      },
      getSelectDate(value) {
        this.roleInfo.startTime = value[0]
        this.roleInfo.endTime = value[1]
      },
      /*设置状态*/
      toggleState(row, index) {
      },
      indexMethods(index) {
        return (this.roleInfo.pageNum - 1) * this.roleInfo.pageSize + index + 1
      },
      //触发分页拉去下一页
      handlePageNumChange(num) {
        this.roleInfo.pageNum = num
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
      // 默认不根据条件查询拉去 第一页
      this.roleInfo.id = 0;
      this.roleInfo.roleName = '';
      this.roleInfo.state=1;
      this.roleInfo.pageNum=1;
      this.roleInfo.pageSize=3000;
      this.roleInfo.createTime='';
      this.roleInfo.createUser='';
      // console.log("授权页面:"+this.$route.query.id);
      this.crrud_auth_uid = this.$route.query.id;
      if(this.crrud_auth_uid > 0) {
        this.loading = true;
        this.getUserAuthRoleIds_(this.crrud_auth_uid);
        // 初始化userid  crrur_userid
        if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
          let  userobj  =sessionStorage.getItem(`userInfo`);
          this.crrur_userid = (JSON.parse(userobj)).id;
        }else{
          // this.$message("网络异常获取用户信息失败!");
        }
      }else{
        this.$message("获取用户信息失败!");
      }
    }
  }
</script>

<style scoped lang="stylus">
  body {font-family: Helvetica, sans-serif;}
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

