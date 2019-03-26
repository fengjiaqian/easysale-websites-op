<template>
  <div class="page" v-loading.fullscreen.lock="fullscreenLoading">
    <el-form class="content" :model="warehouseDetailForm"
             ref="warehouseDetailForm" label-width="100px"
             label-suffix="：" size="medium"
             :rules="rules">
      <el-form-item label="所属公司"  prop="cityId" v-if="isGroupCompany&&companyList.length">
        <el-select v-model="warehouseDetailForm.cityId" placeholder="请选择" :disabled="disableToggle">
          <el-option v-for="company in companyList" :label="company.orgName" :value="company.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库名称" prop="name">
        <el-input v-model.trim="warehouseDetailForm.name" placeholder="请输入" :disabled="disableToggle"></el-input>
      </el-form-item>
      <el-form-item label="仓库地址" prop="province">
        <admin-city-selector
          v-if="!initAddressStr"
          ref="adminCitySelector"
          :targetLevel="3"
          :showAllLevels="true"
          @select-admin-city="onSelectAdminCity"
          @clean-admin-city="onCleanAdminCity"
        ></admin-city-selector>
        <!--自定义控件不好初始化值，先用一个div代替，点击后消失重置地址-->
        <div class="el-input el-input--medium" v-else @click="showAddressPicker">
          <el-input :value="initAddressStr" :disabled="disableToggle"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="街道" prop="street" placeholder="请输入">
        <el-input v-model.trim="warehouseDetailForm.street" :disabled="disableToggle"></el-input>
      </el-form-item>
      <el-form-item label="下车费" prop="unloadingCharge">
        <el-input type="number" v-model.number="warehouseDetailForm.unloadingCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="分拣费" prop="sortingCharge">
        <el-input type="number" v-model.number="warehouseDetailForm.sortingCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="托管费" prop="custodianCharge">
        <el-input type="number" v-model.number="warehouseDetailForm.custodianCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="装车费" prop="loadingCharge">
        <el-input type="number" v-model.number="warehouseDetailForm.loadingCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="运输费" prop="transportCharge">
        <el-input type="number" v-model.number="warehouseDetailForm.transportCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="卸货费" prop="landingCharge">
        <el-input type="number" v-model.number="warehouseDetailForm.landingCharge">
          <template slot="append">元/小单位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="warehouseDetailForm.status" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <!-- 新增内配单 -->
      <!--<el-form-item label="奖券收取人">-->
        <!--<el-radio v-model="priceModel" label="1">经纪人</el-radio>-->
        <!--<el-radio v-model="priceModel" label="2">司机</el-radio>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="司机收取奖券时间">-->
        <!--<el-radio v-model="driverGetTime" label="1">随最近一次配送订单取券</el-radio>-->
        <!--<el-radio v-model="driverGetTime" label="2">队长调度</el-radio>-->
      <!--</el-form-item>-->
      <el-form-item label="供货仓库">
        <div class="orderContainer">
          <div>
            <admin-city-selector
              ref="adminCitySelectorTwo"
              :targetLevel="2"
              @select-admin-city="onSelectAdminCityTwo"
              @clean-admin-city="onCleanAdminCityTwo"
            ></admin-city-selector>
          </div>
          <!--自定义控件不好初始化值，先用一个div代替，点击后消失重置地址-->
          <div>
            <!--<el-select v-model="warehouseId" size="medium" placeholder="请选择仓库" :disabled="allotCityName?false:true" clearable>-->
              <!--<el-option-->
                <!--v-for="item in warehouseList"-->
                <!--:key="item.warehouseId"-->
                <!--:label="item.name"-->
                <!--:value="item.warehouseId">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-select v-model="warehouseId" placeholder="请选择仓库"
                       :disabled="allotCityName?false:true"  @change="handleSelectWarehouse"  >
              <el-option v-for="item in warehouseList"
                         :key="item.warehouseId"
                         :value="item.warehouseId"
                         :label="item.name"
                        ></el-option>
            </el-select>
          </div>
          <el-button @click="addOrderConfigure">添加</el-button>
        </div>
      </el-form-item>
      <el-form-item >
        <div class="orderConfigure" v-if='orderConfigure.length > 0'>
          <div v-for="(item,index) in orderConfigure" :key='index'>
            [{{item.allotCityName}}] {{item.allotWarehouseName}}
            <i class="el-icon-close" @click="deleteConfigure(index)"></i>
          </div>
        </div>
      </el-form-item>
      <!-- 新增内配单 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('warehouseDetailForm')">提交</el-button>
        <el-button @click="resetForm('warehouseDetailForm')">重置</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import http from 'http/warehouseMessageApi'
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "warehouseMessageAdd",
    data() {
      return {
        title: `新增仓库`,
        disableToggle:false,//控制地址等信息是否可编辑
        pageType: `add`,
        initAddressStr: ``,
        warehouseDetailForm: {
          city: ``,//城市
          cityId: null,//所属公司id
          companyName: ``,//公司名字
          county: ``,//区域
          createUser: null,
          custodianCharge: 0,//托管费
          landingCharge: 0,//卸货费
          loadingCharge: 0,//装车费
          name: ``,//仓库名称
          province: ``,//省份
          sortingCharge: 0,//分拣费
          status: 1,//状态 0=停用 1=启用
          street: ``,//街道
          transportCharge: 0,//运输费
          unloadingCharge: 0,//下车费
        },
        companyList: [],
        fullscreenLoading: false,
        priceModel:'1',
        driverGetTime:'1',
        warehouseId:'',
        warehouseList:[],
        warehouseName:'',
        orderConfigure:[],
        allotCityName:``,
        allotCityId:``,
        allotList:[],
      }
    },
    components: {
      AdminCitySelector
    },
    mounted() {

    },
    activated() {
      this.disableToggle=false
      if (this.$route.query.warehouse) {
        this.pageType = `edit`
        this.title = `编辑仓库`
        this.warehouseDetailForm = this.$route.query.warehouse
        this.orderConfigure=this.$route.query.warehouse.allotList||[]
       // this.handleGetAllotList()
        if(this.warehouseDetailForm.stockNumber){
          this.disableToggle=true
        }
        this.initAddressStr =
          this.warehouseDetailForm.province +
          '/' + this.warehouseDetailForm.city +
          '/' + this.warehouseDetailForm.county
      } else {
        this.pageType = `add`
        this.allotCityId=``;
        this.allotCityName=``;
        this.$refs.adminCitySelectorTwo.clean()
        this.warehouseDetailForm = {
          city: ``,//城市
          cityId: null,//所属公司id
          companyName: ``,//公司名字
          county: ``,//区域
          createUser: null,
          custodianCharge: 0,//托管费
          landingCharge: 0,//卸货费
          loadingCharge: 0,//装车费
          name: ``,//仓库名称
          province: ``,//省份
          sortingCharge: 0,//分拣费
          status: 1,//状态 0=停用 1=启用
          street: ``,//街道
          transportCharge: 0,//运输费
          unloadingCharge: 0,//下车费
        }
        this.initAddressStr=``;
        this.orderConfigure=[];

      }
      if (this.isGroupCompany) {
        this.getCompanyList()
      }
    },
    methods: {
      handleSelectWarehouse(valId){
        let obj={};
        obj=this.warehouseList.find((item)=>{
          return item.warehouseId===valId
        })
        this.warehouseName=obj.name;
        this.allotCityId=obj.cityId;
       // this.warehouseId=item.warehouseId;
      },
      showAddressPicker() {
        this.initAddressStr = ``
        this.onCleanAdminCity()
      },
      submitForm(formName) {
        let params = Object.assign({}, this.warehouseDetailForm)
        params.createUser = this.userInfo.userId
        params.warehouseType = 0;
        params.allotList=this.orderConfigure;
        if (!params.cityId) {
          params.cityId = this.ruleId
        }
        this.$refs[formName].validate((valid) => {
          if (valid && this.pageType === `add`) {
            http.addWarehouse(params)
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
            http.updateWarehouse(params)
              .then(() => {
                this.fullscreenLoading = false
                this.$message(`编辑成功`)
                this.$router.go(-1)
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
      resetForm(formName) {
        this.initAddressStr = ``
        this.$refs[formName] && this.$refs[formName].resetFields();
        this.$refs[`adminCitySelector`] && this.$refs[`adminCitySelector`].clean()
        this.warehouseDetailForm.cityId = null
      },

      getCompanyList() {
        http.listCompany(this.ruleId)
          .then(data => {
            this.companyList = data || []
          })
          .catch(e => {
            console.log(e)
          })
      },
      onSelectAdminCityTwo(valueArr){
        this.allotCityName=valueArr[valueArr.length - 1].name;
       // this.allotCityId=valueArr[valueArr.length - 1].id
        this.handleGetWarehouseList();
      },
      onCleanAdminCityTwo(){
        this.allotCityName=``;
      },
      onSelectAdminCity(valueArr) {
        this.warehouseDetailForm.province = valueArr[0].name
        this.warehouseDetailForm.city = valueArr[1].name
        this.warehouseDetailForm.county = valueArr[2].name
      },
      onCleanAdminCity() {
        this.warehouseDetailForm.province = ``
        this.warehouseDetailForm.city = ``
        this.warehouseDetailForm.county = ``
      },
      //查询仓库信息列表
      handleGetWarehouseList() {
        //let city=this.city;
        let city = this.allotCityName;
        let pageNum = 1;
        let pageSize = 1000;
        //ruleOrgType=2是集团公司，ruleOrgType=1是一般公司
        //如果是集团公司，就只传到parentcityId
        //如果是一般公司，就parentcityId和cityId都穿服务商Id
        let checkCompany = this.choseRoleInfoList.ruleOrgType || '';
        let serviceId = this.choseRoleInfoList.ruleOrgId;
        //把服务商id传到parentcityId里面去可以查服务商及子服务商的仓库,
        //如果只查一个服务商的仓库，那就把id同时传到parentcityId和’cityId里面
        //分页参数是必须填的，parentcityId必填，其它的不用的话都可以不填
        let cityId = ``;
        let parentCityId = ``;
        if (checkCompany === 1) {//一般公司
          cityId = serviceId;
          parentCityId = serviceId;
        } else {//集团公司
          cityId = ``;
          parentCityId = serviceId;
        }
        http.getWarehouseList({city, cityId, parentCityId, pageNum, pageSize}).then(data => {
          this.warehouseList = data;
          // let dataList=data;
          // console.log('datalist',dataList)
          // for(let val of dataList){
          //   if(val.allotList){
          //     let resultItem=val.allotList;
          //     this.orderConfigure.push(resultItem)
          //     console.log('order',this.orderConfigure)
          //   }
          //
          // }


        }).catch(e => {
          console.log(e)
        })
      },
      //添加内配置单
      addOrderConfigure(){
        if(!this.warehouseId || !this.allotCityName) return
        if(this.pageType ===`edit`){
          let addItem={
            allotSequence:null,
            id:null,
            optUserId:this.userInfo.userId,
            fromCityId:this.warehouseDetailForm.cityId,
            fromCityName:this.warehouseDetailForm.city,
            fromWarehouseId:this.warehouseDetailForm.warehouseId,
            fromWarehouseName:this.warehouseDetailForm.name,
            allotCityId:this.allotCityId,
            allotCityName:this.allotCityName,
            allotWarehouseId:this.warehouseId,
            allotWarehouseName:this.warehouseName
          }
          this.orderConfigure.push(addItem)
        }else {
          let addItem={
            allotSequence:null,
            id:null,
            optUserId:this.userInfo.userId,
            fromCityId:this.ruleId,
            fromCityName:null,
            fromWarehouseId:null,
            fromWarehouseName:null,
            allotCityId:this.allotCityId,
            allotCityName:this.allotCityName,
            allotWarehouseId:this.warehouseId,
            allotWarehouseName:this.warehouseName
          }
          this.orderConfigure.push(addItem)
        }

        // this.orderConfigure.push({
        //   allotWarehouseName : this.warehouseId,
        //   allotCityName : this.allotCityName
        // })
      },
      //删去配置
      deleteConfigure(index){
        this.orderConfigure.splice(index,1)
      }
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
          name: [{required: true, message: '请输入仓库名称', trigger: 'blur'}],
          status: [{required: true, message: '请选择状态', trigger: 'change'}],
          unloadingCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          sortingCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          custodianCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          loadingCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          transportCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          landingCharge: [{required: true, validator: moneyValidator, trigger: 'blur'}],
          province: [{required: true, message: '请选择地区', trigger: 'change'}],
          street: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
        }
        if (this.isGroupCompany) {
          return Object.assign({}, baseRules, {
            cityId: [{required: true, message: '请选择所属公司', trigger: 'change'}],
          })
        } else {
          return baseRules
        }
      },
      isGroupCompany() {
        return this.choseRoleInfoList.ruleOrgType === 2
      },
      ruleId() {
        return this.choseRoleInfoList.ruleOrgId
      },
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    watch: {
      allotCityName:function (newValue) {
        this.warehouseId=``;
        this.warehouseName=``;
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .el-form {
    margin-top 40px;
    width 50%;

    .el-select {
      width 100%;
    }

    .el-cascader {
      width 100%;
    }

    .orderConfigure{
      display flex
      flex-wrap wrap
      >div{
        padding 0 10px
        background-color #f0f2f5
        border-radius 5px
        margin 6px 20px 20px 0
        .el-icon-close{
          cursor pointer
        }
      }
    }

    .orderContainer{
      display flex
      >div{
        margin-right 20px
      }
    }
  }

</style>
