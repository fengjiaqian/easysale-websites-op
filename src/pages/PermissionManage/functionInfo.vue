<template>
  <div class="functionInfo"  v-loading="loading">
    <el-form class="content" :model="functionInfo"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">

      <el-form-item label="系统类型" prop="systemType">
        <el-select v-model="functionInfo.systemType" placeholder="请选择系统类型" disabled="disabled">
          <el-option label="小程序" :value="1"></el-option>
          <el-option label="PC端" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="functionInfo.state" placeholder="请选择" disabled="disabled">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="功能名称" prop="name">
        <el-input v-model="functionInfo.name" placeholder="请输入功能名称" disabled="disabled"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="功能url" prop="url" >
        <el-input v-model="functionInfo.url" placeholder="请输入功能url" disabled="disabled"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="功能图标" prop="imageUrl" >
        <el-input v-model="functionInfo.imageUrl" placeholder="请输入功能图标" disabled="disabled"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>
<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'

  //引入 vue 后台发请求api接口
  import https_f from 'http/functionManageApi'

  export default {
    name: 'functionInfo',
    props: [],
    data() {
      return {
        //当前操作人的ID  页面载入的时候 动态设置
        crrur_userid:6666666,
        // initAddressStr: ``,
        functionInfo: {
          id:0,
          parentId:0,	 //父级节点
          wholeId:0,	 //父节点wholeId
          type:3,	// 功能类型（1：模型 2：菜单 3：功能）
          systemType:1,//系统类型（1：小程序 2：pc端）
          name:'', //功能名称
          url:'',//链接
          imageUrl:'',//      图标
          state:1,//状态（0:停用 1：启用）
          createUser:'',//	创建人
          updateUser:'',//更新人即创建人
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
    //页面新加的方法
    methods: {
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    // 页面载入 触发
    mounted:function(){
      //获取编辑修改的  功能ID
      let pid_ = this.$route.query.id;
      if(pid_.length > 0) {
        this.loading = true;
        let param_ = {
          id: pid_+""
        }
        https_f.getFunctionObj(param_).then(data => {
          let objs = data.dataList;
          if (objs.length == 1) {
            this.functionInfo = objs[0];
          } else {
            this.functionInfo = null;
            this.$message(`网络异常`)
          }
          this.loading = false;
          // 获取当前用户ID 设置当前操作人ID
          if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
            let  userobj  =sessionStorage.getItem(`userInfo`);
            this.crrur_userid = (JSON.parse(userobj)).id;
          }else{
            //用户信息获取失败
            this.$message("网络异常获取用户信息失败!");
          }
        }).catch(e => {
          this.$message(`网络异常`)
          this.loading = false;
        })
      }else{
        this.$message(`缺省功能ID网络异常`)
      }
    }
  }
</script>

<style lang="stylus">
  .productAdd {
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
