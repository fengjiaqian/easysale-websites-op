<template>
  <div class="productAdd">
    <el-form class="content" :model="productDetailForm"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             :rules="rules"
             style="width:50%">

      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="productDetailForm.roleName" placeholder="请输入" ></el-input>
      </el-form-item>

      <el-form-item label="父角色名称" prop="parentId">
        <el-select v-model="productDetailForm.parentName" placeholder="请输入关键字"
                   clearable
                   filterable
                   remote
                   :remote-method="queryDealerList"
                   autocomplete
                   :disabled="pageType=='edit'"
        >
          <el-option v-for="dealer in dealerList" :label="dealer.roleName" :value="dealer.id"
                     :key="dealer.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="状态" prop="state">
        <el-select v-model="productDetailForm.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('productDetailForm')">提交</el-button>
        <!--<el-button @click="resetForm()">重置</el-button>-->
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import https from 'http/roleSetApi';

  export default {
    name: 'addRole',
    props: [],
    data() {
      return {
        title: `新增仓库`,
        pageType: `add`,
        // initAddressStr: ``,
        productDetailForm: {
          roleName:'',//角色名称
          parentId:'',//父id
          parent:{
            roleName:'',
          },
          parentName:'',
          roleId:'',
          state: 1,//状态 0=停用 1=启用
        },
        updateRole:{},
        dealerList: [],
        loading: false
      }
    },
    activated() {
      console.log(this.choseRoleInfoList)
      console.log(this.$route.query);
      if (this.$route.query.productInfo) {
        this.pageType = `edit`
        alert(111);
        this.productDetailForm = this.$route.query.productInfo
      } else {
        this.pageType = `add`
        this.productDetailForm = {
          roleName: ``,//商品名称
          parentId: ``,   //服务商id
          state: 1,//状态 0=停用 1=启用
        }
      }
    },
    components: {
      AdminCitySelector

    },
    methods: {
      /*模糊查询经销商列表*/
      queryDealerList(query) {
        console.log(this.$route.query.productInfo);
        if (query.length >= 1) {
          this.loading = true
          this.getWarehouseList(query)
        } else {
          this.dealerList = []
        }
      },
      /*获取经销商列表*/
      getWarehouseList(name) {
        return https.getRoleList({roleName: name})
          .then(data => {
            this.dealerList = data
          })
      },


      submitForm(formName) {

        let params = Object.assign({}, this.productDetailForm)
        console.log(this.userInfo);
        params.userId = this.userInfo.id
        params.parentId=params.parentName;
        this.$refs[formName].validate((valid) => {
          console.log(params);
          if (valid && this.pageType === `add`) {
            https.addRole(params)
              .then(() => {
                this.fullscreenLoading = false
                this.$message(`新增成功`)
                this.$router.go(-1)
              })
              .catch(e => {
                this.fullscreenLoading = false
                this.$message(e)
              })
          } else if (valid && this.pageType === `edit`) {
            this.updateRole.roleId=params.id;
            this.updateRole.roleName=params.roleName;
            this.updateRole.state=params.state;
            console.log(this.updateRole);
            https.updateBackRole(this.updateRole)
              .then(() => {
                this.fullscreenLoading = false
                this.$message(`编辑成功`)
                this.$router.push({name: `roleSetting`})
              })
              .catch(e => {
                this.fullscreenLoading = false
                this.$message(e)
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm() {
        console.log(this.pageType)
        if (this.pageType === 'edit') {
          this.productDetailForm.unloadingCharge = 0
          this.productDetailForm.sortingCharge = 0
          this.productDetailForm.custodianCharge = 0
          this.productDetailForm.loadingCharge = 0
          this.productDetailForm.transportCharge = 0
          this.productDetailForm.landingCharge = 0
        } else {
          this.productDetailForm = {
            roleName: ``,//角色名称
            parentId: ``,   //服务商id
            state: 1,//状态 0=停用 1=启用
          }
        }


      },
    },
    computed: {
      rules() {
        let baseRules = {
          roleName: [{required: true, message: '请输入角色', trigger: 'change'}],
          state: [{required: true, message: '请选择状态', trigger: 'change'}],

        }

        return baseRules
      },

      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },

  // 页面载入 触发
  mounted:function() {

    if (this.$route.query.productInfo) {
      this.pageType = `edit`
      this.productDetailForm = this.$route.query.productInfo
      console.log(this.productDetailForm);
    } else {
      this.pageType = `add`
      this.productDetailForm = {
        roleName: ``,//商品名称
        parentId: ``,   //服务商id
        state: 1,//状态 0=停用 1=启用
      }
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
