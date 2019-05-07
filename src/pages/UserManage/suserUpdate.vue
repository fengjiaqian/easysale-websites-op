<template>
  <div class="suserUpdate"  v-loading="loading">
    <el-form class="content" :model="suserInfo"   :rules="rules"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="用户名称" prop="wxNickName">
        <el-input v-model="suserInfo.wxNickName" placeholder="请输入用户名称"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="suserInfo.phone" placeholder="请输入手机号码" disabled="disabled" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="登录密码" prop="password">
        <el-input v-model="suserInfo.password" placeholder="请输入登录密码"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="suserInfo.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">修改</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>
<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import https_f from 'http/suserManageApi'
  import Urls from '../../assets/models/baseUrl'
  const prefix = Urls.supplyChainUrl
  export default {
    name: 'suserUpdate',
    props: [],
    data() {
      return {
        crrur_userid:6666666,
        suserInfo: {
          id:0,
          wxNickName:'',
          phone:'',
          userType:0,
          update_user:0,
          state:6,
          password:'',
        },
        alertInfoState:false,
        loading: false,
        // 表单定义验证规则
        rules: {
          // 姓名
          wxNickName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
          password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        },
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      param_handle(arr){
        let newarr = arr;
        delete newarr['phone'];
        delete newarr['userType'];
        delete newarr['createTime'];
        return newarr;
      },
      // 确定修改
      ensureCharge(){
        this.alertInfoState = false;
        this.loading = true;
        let params = Object.assign({}, this.suserInfo)
        params.update_user = this.crrur_userid;
        if(this.valiFromObj(params)){
          let new_ar =  this.param_handle(params);
          https_f.updateSuserObj(new_ar).then(data => {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          }).catch(e => {
            this.$message("修改失败!");
          })
          this.loading = false;
        }else{
          this.loading = false;
        }
      },
      submitForm() {
        //弹出窗口
        this.$confirm('确定要修改当前数据吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行
          this.ensureCharge();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取变更'
          });
        });
      },
      resetForm() {
        this.suserInfo={
          id:0,
          wxNickName:'',
          phone:'',
          userType:0,
          update_user:0,
          state:6,
          password:'',
        }
        this.img_msg='只能上传jpg/png文件，且不超过3M';
        this.img_url = [];
      },
      valiFromObj(jsonobj){
        //  验证数据合法性
        if (jsonobj.phone == null || jsonobj.phone == undefined || jsonobj.phone == '') {
          this.$message(`请输入手机号码`)
          return false;
        }
        if (jsonobj.wxNickName == null || jsonobj.wxNickName == undefined || jsonobj.wxNickName == '') {
          this.$message(`请输入昵称`)
          return false;
        }
        if (jsonobj.state == 6) {
          this.$message(`网络异常`)
          return false;
        }
        if (jsonobj.password == null || jsonobj.password == undefined || jsonobj.password == '') {
          this.$message(`请输入密码`)
          return false;
        } else {
          if ((jsonobj.password).length < 6) {
            this.$message(`密码最少由6位字符串组成`)
            return false;
          }
        }
        return true;
      },
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    mounted:function(){
      if (sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined) {
        let userobj = sessionStorage.getItem(`userInfo`);
        this.crrur_userid = (JSON.parse(userobj)).id;
      } else {
        this.crrur_userid = 0;
        this.$message("网络异常获取用户信息失败!");
      }

      if(this.$route.query.row != null && this.$route.query.row != undefined){
        this.loading = true;
        let param_ = {
          id: this.$route.query.row.id
        }
        https_f.getSuserObj(param_).then(data => {
          this.loading = false;
          this.suserInfo = data;
        }).catch(e => {
          this.$message(`网络异常`)
          this.loading = false;
        })
      }else{
        this.$message(`网络异常`)
      }
    }
  }
</script>
<style lang="stylus">
  .suserUpdate {
    .el-form {
      margin-top 40px;
      width 50%;
    }
    .el-select {
      width 100%;
      > .el-input__inner {
        cursor: text !important
      }
    }
    input {
      cursor: text !important
    }
    .el-cascader {
      width 100%;
    }
    .el-input.is-disabled > .el-input__inner {
      color: #333 !important
    }
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: inline;
    border-radius: 15px;
  }

  .imgsclass {
    white-space: nowrap;
    position: relative;
  }
</style>
