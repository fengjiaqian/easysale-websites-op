<template>
  <div class="productAdd">
    <el-form class="content" :model="productDetailForm"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             :rules="rules"
             style="width:50%">
      <el-form-item label="产品名称" prop="productName">
        <el-select v-model="productDetailForm.productName" placeholder="请输入关键词"
                   clearable
                   filterable
                   remote
                   :remote-method="remoteMethod"
                   :loading="loading"
                   @change="selectProduct"
                   :disabled="pageType=='edit'"
                   autocomplete>
          <el-option v-for="(product,index) in productList" :label="product.productName" :value="product.productSpecificationId"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌" prop="productBrand">
        <el-input v-model="productDetailForm.productBrand" placeholder="请输入" disabled class="disable-input"></el-input>
      </el-form-item>
      <el-form-item label="包装规格" prop="specificationName">
        <el-input type="text" v-model="productDetailForm.specificationName" disabled>
        </el-input>
      </el-form-item>
      <el-form-item label="经销商名称" prop="dealerId">
        <el-select v-model="productDetailForm.dealerName" placeholder="请输入关键字"
                   clearable
                   filterable
                   remote
                   :remote-method="queryDealerList"
                   autocomplete
                   @change="selectWarehouse"
                   :disabled="pageType=='edit'"
        >
          <el-option v-for="dealer in dealerList" :label="dealer.dealerName" :value="dealer.id"
                     :key="dealer.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经销商手机" prop="mobileNo" placeholder="经销商手机">
        <el-input v-model="productDetailForm.mobileNo" disabled></el-input>
      </el-form-item>

      <el-form-item label="下货费" prop="unloadingCharge">
        <el-input type="number" v-model.number="productDetailForm.unloadingCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="分拣费" prop="sortingCharge">
        <el-input type="number" v-model.number="productDetailForm.sortingCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="托管费" prop="custodianCharge">
        <el-input type="number" v-model.number="productDetailForm.custodianCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="装车费" prop="loadingCharge">
        <el-input type="number" v-model.number="productDetailForm.loadingCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="配送费" prop="transportCharge">
        <el-input type="number" v-model.number="productDetailForm.transportCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="卸货费" prop="landingCharge">
        <el-input type="number" v-model.number="productDetailForm.landingCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="productDetailForm.status" placeholder="请选择">
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
  import http from 'http/wareHouseDealerApi'
  import https from 'http/productManageApi'

  export default {
    name: 'productAdd',
    props: [],
    data() {
      return {
        title: `新增仓库`,
        pageType: `add`,
        // initAddressStr: ``,
        productDetailForm: {
          // city: ``,//城市
          // county: ``,//区域
          // createUser: null,
          // street: ``,//街道
          productName: ``,//商品名称
          productSpecificationId: ``,	//商品规格参数id
          productBrand: ``,//品牌
          dealerName: ``,  //经销商名称
          dealerId: ``,    //经销商id
          mobileNo: ``,    //经销商手机
          facilitatorId: ``,   //服务商ID
          specificationName: ``,   //包装规格
          unloadingCharge: 0,//下车费
          sortingCharge: 0,//分拣费
          custodianCharge: 0,//托管费
          loadingCharge: 0,//装车费
          transportCharge: 0,//运输费
          landingCharge: 0,//卸货费
          status: 1,//状态 0=停用 1=启用
        },
        dealerList: [],
        productList: [],
        loading: false
      }
    },
    activated() {
      console.log(this.choseRoleInfoList)
      if (this.$route.query.productInfo) {
        this.pageType = `edit`
        this.productDetailForm = this.$route.query.productInfo
        //服务商id
        /*this.initAddressStr =
          this.warehouseDetailForm.province +
          '/' + this.warehouseDetailForm.city +
          '/' + this.warehouseDetailForm.county*/
      } else {
        this.pageType = `add`
        this.productDetailForm = {
          productName: ``,//商品名称
          productSpecificationId: ``,	//商品规格参数id
          productBrand: ``,//品牌
          dealerName: ``,  //经销商名称
          dealerId: ``,    //经销商id
          facilitatorId: ``,   //服务商id
          mobileNo: ``,    //经销商手机
          specificationName: ``,   //包装规格
          unloadingCharge: 0,//下车费
          sortingCharge: 0,//分拣费
          custodianCharge: 0,//托管费
          loadingCharge: 0,//装车费
          transportCharge: 0,//运输费
          landingCharge: 0,//卸货费
          status: 1,//状态 0=停用 1=启用
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
        return https.queryDealer({dealerName: name})
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
        console.log(params)
        params.createUser = this.userInfo.userId
        params.lastUpdateUser = this.userInfo.userId
        params.facilitatorId = this.ruleId
        // params.warehouseType = 0
        /*if (!params.cityId) {
          params.cityId = this.ruleId
        }*/
        this.$refs[formName].validate((valid) => {
          if (valid) {
            https.addOrEditProduct(params)
              .then(() => {
                // this.fullscreenLoading = false
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
            productName: ``,//商品名称
            productSpecificationId: ``,	//商品规格参数id
            productBrand: ``,//品牌
            dealerName: ``,  //经销商名称
            dealerId: ``,    //经销商id
            facilitatorId: ``,   //服务商id
            mobileNo: ``,    //经销商手机
            specificationName: ``,   //包装规格
            unloadingCharge: 0,//下车费
            sortingCharge: 0,//分拣费
            custodianCharge: 0,//托管费
            loadingCharge: 0,//装车费
            transportCharge: 0,//运输费
            landingCharge: 0,//卸货费
            status: 1,//状态 0=停用 1=启用
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
          productName: [{required: true, message: '请选择产品', trigger: 'change'}],
          productBrand: [{required: true, message: '请输入仓库名称', trigger: 'blur'}],
          dealerId: [{required: false, message: '请选择经销商', trigger: 'change'}],
          mobileNo: [{required: false, message: '请选择经销商', trigger: 'change'}],
          status: [{required: true, message: '请选择状态', trigger: 'change'}],
          unloadingCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          sortingCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          custodianCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          loadingCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          transportCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          landingCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
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
