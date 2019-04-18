<template>
  <div class="suserInfo"  v-loading="loading">
    <el-form class="content" :model="suserInfo"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="用户名称" prop="wxNickName">
        <el-input v-model="suserInfo.wxNickName" placeholder="可选项" disabled="disabled" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="suserInfo.phone" placeholder="请输入手机号码" disabled="disabled" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="suserInfo.userType" disabled="disabled" placeholder="请选择用户类型">
          <el-option label="经销商" :value="1"></el-option>
          <el-option label="销售人员" :value="2"></el-option>
          <el-option label="终端" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
         <el-select v-model="suserInfo.state" placeholder="请选择" disabled="disabled">
           <el-option label="启用" :value="1"></el-option>
           <el-option label="停用" :value="0"></el-option>
         </el-select>
       </el-form-item>-

      <el-form-item>
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
    name: 'suserInfo',
    props: [],
    data() {
      return {
        //页面载入 动态设置当前操作人ID
        crrur_userid:6666666,
        // initAddressStr: ``,
        suserInfo: {
          id:0,
          wxNickName:'',
          phone:'',
          userType:1,
          update_user:0
        },
        alertInfoState:false,
        alertInfo:{
          status:0,
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
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    mounted:function(){
      //根据ID 拉取功能实体   编辑修改用户的ID
      let uid = this.$route.query.id;
      if(uid > 0) {
        this.loading = true;
        let param_ = {
          id: uid
        }
        // alert("传递参数:"+JSON.stringify(param_));
        https_f.getSuserObj(param_).then(data => {
          // 查询出实体 赋值
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
</style>
