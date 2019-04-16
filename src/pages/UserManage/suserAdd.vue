<template>
  <div class="suserAdd" v-loading="loading">
    <el-form class="content" :model="suserInfo"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="微信昵称" prop="wxNickName">
        <el-input v-model="suserInfo.wxNickName" placeholder="可选项/如已知可输入"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="suserInfo.phone" placeholder="请输入手机号码"  class="disable-input"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="suserInfo.password" placeholder="请输入登录密码"  class="disable-input"></el-input>
      </el-form-item>


      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="suserInfo.userType" placeholder="目前只能选择经销商">
          <el-option label="经销商" :value="1"></el-option>
        </el-select>
      </el-form-item>

     <!-- <el-form-item label="状态" prop="state">
        <el-select v-model="suserInfo.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>-->


      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'

  import https_f from 'http/suserManageApi'

  export default {
    name: 'suserAdd',
    props: [],
    data() {
      return {
        // 先写死 页面载入动态设置
        crrur_userid:6666666,
        title: `新增仓库`,
        pageType: `add`,
        // initAddressStr: ``,
        suserInfo: {
          wxNickName:'',
          phone:'',
          userType:1,
          image_url:'',
          wx_app_id:'',
          update_time:'',
          create_user:'',
          update_user:'',
          state:1,
          password:''
        },
        dealerList: [],
        productList: [],
        loading: false
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      submitForm(formName) {
        this.loading = true;
        let params = Object.assign({}, this.suserInfo)
        params.create_user = this.crrur_userid;
        params.update_user = this.crrur_userid;
        if(this.valiFromObj(params)){
          https_f.addSuserObj(params).then(data => {
            this.$message(`新增成功`)
            this.resetForm();
            this.loading = false;
          }).catch(e => {
            this.$message(`新增失败`)
            this.resetForm();
            this.loading = false;
          })
        }else{
          // this.$message(`请输入提示项`)
          this.loading = false;
        }
      },
      resetForm() {
        if (this.pageType === 'edit') {
        } else {
          this.suserInfo={
            wxNickName:'',
            phone:'',
            userType:1,
            image_url:'',
            wx_app_id:'',
            update_time:'',
            create_user:'',
            update_user:'',
            state:1,
            password:''
          }
        }
      },
      valiFromObj(jsonobj){
        // 验证数据合法性
        if (jsonobj.wxNickName == null || jsonobj.wxNickName == undefined || jsonobj.wxNickName == '') {
          this.$message(`请输入微信昵称`)
          return false;
        }
        if (jsonobj.phone == null || jsonobj.phone == undefined || jsonobj.phone == '') {
          this.$message(`请输入手机号`)
          return false;
        }else{
          if(!(/^1[34578]\d{9}$/.test(jsonobj.phone))){
            this.suserInfo.phone = '';
            this.$message("手机号码有误，请重填");
            return false;
          }
        }
        if (jsonobj.password == null || jsonobj.password == undefined || jsonobj.password == '') {
          this.$message(`请输入密码`)
          return false;
        }else{
          if((jsonobj.password).length < 6 ){
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
      //获取当前用户ID   赋值
      if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
        let  userobj  =sessionStorage.getItem(`userInfo`);
        this.crrur_userid = (JSON.parse(userobj)).id;
      }else{
        //用户信息获取失败
        this.$message("网络异常获取用户信息失败!");
      }
    }
  }
</script>
<style lang="stylus">
  .suserAdd {
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
</style>
