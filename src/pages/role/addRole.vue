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
        <el-select v-model="productDetailForm.parentId" placeholder="请输入关键字"
                   clearable
                   filterable
                   remote
                   :remote-method="queryDealerList"
                   autocomplete
                   @change="selectWarehouse"
                   :disabled="pageType=='edit'"
        >
          <el-option v-for="dealer in dealerList" :label="dealer.roleName" :value="dealer.id"
                     :key="dealer.id"></el-option>
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
        <el-button @click="resetForm()">重置</el-button>
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
          state: 1,//状态 0=停用 1=启用
        },
        dealerList: [],
        loading: false
      }
    },
    activated() {
      console.log(this.choseRoleInfoList)
      if (this.$route.query.productInfo) {
        this.pageType = `edit`
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
      /*选择经销商获取经销商手机号*/
      selectWarehouse(id) {
        console.log(id)
        let obj = {}
        obj = this.dealerList.find(item => {
          return item.id == id
        })
        console.log(obj)
        if(id==``){
          this.productDetailForm.mobileNo = ``
          this.productDetailForm.dealerName = ``
          this.productDetailForm.dealerId = ``
        }else{
          this.productDetailForm.mobileNo = obj.contactNumber
          this.productDetailForm.dealerName = obj.dealerName
          // this.productDetailForm.facilitatorId = obj.facilitatorId
          this.productDetailForm.dealerId = obj.dealerId
        }

      },
      //模糊查询产品列表
      remoteMethod(query) {
        if (query.length >= 2) {
          this.loading = true
          this.getProductList(query)
        } else {
          this.productList = []
        }
      },

      /*获取产品列表*/
      getProductList(name) {

        return https.getProductList({productName: name})
          .then(data => {
            this.productList = data.dataList
            this.loading = false
          })
      },
      /*选择产品获取产品规则名称和产品品牌*/
      selectProduct(id) {
        console.log(id)
        let obj = {}
        obj = this.productList.find(item => {
          return item.productSpecificationId == id
        })
        console.log(obj)
        this.productDetailForm.productBrand = obj.productBrand
        this.productDetailForm.productName = obj.productName
        this.productDetailForm.specificationName = obj.specificationName
        this.productDetailForm.productSpecificationId = obj.productSpecificationId
      },
      submitForm(formName) {
        let params = Object.assign({}, this.productDetailForm)
        console.log(this.userInfo);
        // params.createUser = this.userInfo.id;
        // params.lastUpdateUser = this.userInfo.userId
        params.userId = this.userInfo.id

        this.$refs[formName].validate((valid) => {
          if (valid) {
            https.addRole(params)
              .then(() => {
               console.log(params);
                if (this.pageType == 'add') {
                  this.$message(`新增成功`)

                } else {
                  this.$message(`修改成功`)
                }
                this.$router.go(-1)
              })
              .catch(e => {
                // this.fullscreenLoading = false
                this.$message(e)
              })
          } /*else if (valid && this.pageType === `edit`) {
            http.updateWarehouse(params)
              .then(() => {
                // this.fullscreenLoading = false
                this.$message(`编辑成功`)
                this.$router.go(-1)
              })
              .catch(e => {
                // this.fullscreenLoading = false
                this.$message(e)
              })
          }*/ else {
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
        let moneyValidator = (rule, value, callback) => {
          if (!value && value !== 0) {
            callback(new Error(`数值不能为空`))
          } else if (isNaN(value)) {
            callback(new Error(`请输入正确的数值`))
          } else if (parseFloat(value) < 0) {
            callback(new Error(`数值不能为负数`))
          } else {
            callback()
          }
        }
        let baseRules = {
          roleName: [{required: true, message: '请输入角色', trigger: 'change'}],
          state: [{required: true, message: '请选择状态', trigger: 'change'}],

        }
        /*if (this.isGroupCompany) {
          return Object.assign({}, baseRules, {

          })
        } else {

        }*/
        return baseRules
      },
      /*isGroupCompany() {
        return this.choseRoleInfoList.ruleOrgType === 2
      },*/
      ruleId() {
        return this.choseRoleInfoList.ruleOrgId
      },
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
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
