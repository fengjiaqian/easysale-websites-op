<template>
  <div class="productAdd" v-loading="loading">
    <el-form class="content" :model="functionInfo"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="父级节点" prop="parentId">
          <el-input v-model="functionInfo.parentId" placeholder="请输入父级节点"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="父级WholeId" prop="parentWholeId">
        <el-input v-model="functionInfo.parentWholeId" placeholder="请输入父级节点WholeId"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="功能类型" prop="type">
        <el-select v-model="functionInfo.type" placeholder="请选择功能类型">
          <el-option label="模型" :value="1"></el-option>
          <el-option label="菜单" :value="2"></el-option>
          <el-option label="功能" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="系统类型" prop="systemType">
        <el-select v-model="functionInfo.systemType" placeholder="请选择系统类型">
          <el-option label="小程序" :value="1"></el-option>
          <el-option label="PC端" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="functionInfo.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="功能名称" prop="name">
          <el-input v-model="functionInfo.name" placeholder="请输入功能名称"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="功能url" prop="url" >
        <el-input v-model="functionInfo.url" placeholder="请输入功能url"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="功能图标" prop="imageUrl" >
        <el-input v-model="functionInfo.imageUrl" placeholder="请输入功能图标"  class="disable-input"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm('functionInfo')">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
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
    name: 'functionAdd',
    props: [],
    data() {
      return {
        //TODO 先写死 整合之后 改活
        crrur_userid:6666666,
        title: `新增仓库`,
        pageType: `add`,
        // initAddressStr: ``,
        functionInfo: {
          parentId:0,	 //父级节点
          parentWholeId:0,	 //父节点wholeId
          type:3,	// 权限类型（1：模型 2：菜单 3：功能）
          systemType:1,//系统类型（1：小程序 2：pc端）
          name:'', //权限名称
          url:'',//链接
          imageUrl:'',//      图标
          state:1,//状态（0:停用 1：启用）
          createUser:'',//	创建人
          updateUser:'',//更新人即创建人
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
        let params = Object.assign({}, this.functionInfo)
        params.createUser = this.crrur_userid;
        params.updateUser = this.crrur_userid;
        if(this.valiFromObj(params)){
          https_f.addFucntionObj(params).then(data => {
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
        // console.log(this.pageType)
        if (this.pageType === 'edit') {
          //TODO
        } else {
          this.functionInfo={
            parentId:0,	 //父级节点
              parentWholeId:0,	 //父节点wholeId
              type:3,	// 功能类型（1：模型 2：菜单 3：功能）
              systemType:1,//系统类型（1：小程序 2：pc端）
              name:'', //功能名称
              url:'',//链接
              imageUrl:'',//      图标
              state:1,//状态（0:停用 1：启用）
              createUser:'',//	创建人
              updateUser:''//更新人即创建人
          }
        }
      },
      valiFromObj(jsonobj){
        //TODO  验证数据合法性
       /* functionInfo: {
            parentId:0,	 //父级节点
            parentWholeId:0,	 //父节点wholeId
            type:3,	// 权限类型（1：模型 2：菜单 3：功能）
            systemType:1,//系统类型（1：小程序 2：pc端）
            name:'', //权限名称
            url:'',//链接
            imageUrl:'',//      图标
            state:1,//状态（0:停用 1：启用）
            createUser:'',//	创建人
            updateUser:'',//更新人即创建人
        },*/
        if (jsonobj.name == null || jsonobj.name == undefined || jsonobj.name == '') {
          this.$message(`请输入功能名称`)
          return false;
        }
        if (jsonobj.url == null || jsonobj.url == undefined || jsonobj.url == '') {
          this.$message(`请输入功能路径`)
          return false;
        }
        return true;
      },
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    mounted:function(){
      //TODO 获取当前用户ID   赋值

      if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
        let  userobj  =sessionStorage.getItem(`userInfo`);
    //    console.log("init:"+userobj +"==="+(JSON.parse(userobj)).id);
        this.crrur_userid = (JSON.parse(userobj)).id;
     //   console.log(this.crrur_userid);
      }else{
        //用户信息获取失败
        this.$message("网络异常获取用户信息失败!");
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
