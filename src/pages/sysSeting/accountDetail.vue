<template>
  <div>
    <div class="block-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="人员信息" name="first" v-loading="loading">
          <div style="line-height: 20px;margin-top: 30px;font-size: 14px;">
            <div class="userInfo">姓名： {{employeeInfo.trueName}}</div>
            <div class="userInfo">服务商： {{employeeInfo.cityName}}</div>
            <div class="userInfo">手机号： {{employeeInfo.mobileNo}}</div>
            <div class="userInfo">性别： {{employeeInfo.gender}}</div>
            <div class="userInfo">人员类型： {{employeeInfo.employeeTypeName}}</div>
            <div class="userInfo">状态： {{employeeInfo.enableState==0?'停用':'启用'}}</div>
            <el-button class="userInfo" @click="goBack">返回</el-button>
          </div>

        </el-tab-pane>
        <el-tab-pane label="人员授权" name="second">
          <div style="line-height: 20px;">
            <el-button type="primary" class="addAd" @click="addNewRole">+ 新增授权</el-button>
            <el-table
              :data="roleList"
              border
              style="width: 100%;margin-top:16px;">
              <el-table-column label="序号" width="60">
                <template slot-scope="scope">
                  <span>{{indexMethods(scope.$index)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="角色" width="260" prop="roleName"></el-table-column>
              <el-table-column prop="trueName" label="姓名" width="180"></el-table-column>
              <el-table-column label="手机号" width="180" prop="mobileNo"></el-table-column>
              <el-table-column label="性别" width="180" prop="gender"></el-table-column>
              <el-table-column label="人员类型" width="180" prop="employeeTypeName"></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope" v-if="scope.row.canRemove">
                  <el-button type="primary" icon="el-icon-delete" size="small"
                             @click="deleteOneRole(scope.row.id,scope.row.userRole)">移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

        </el-tab-pane>

      </el-tabs>
    </div>
    <!--人员授权弹框-->
    <el-dialog title="人员授权" top="160px" :modal="false" :visible.sync="dialogVisible" width="40%" center>
      <el-form :label-width="resetFormLabelWidth" ref="resetRuleForm">
        <el-form-item label="角色" prop="userRole">
          <el-select v-model="role" placeholder="请选择">
            <el-option
              v-for="item in queryRoleList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showWarehouseList" label="仓库：" prop="warehouseId">
          <el-select v-model="warehouseId" placeholder="请选择">
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="showServiceSelector" label="服务商：" prop="parentOrgId">
          <el-select v-model="parentOrgId" size="medium"
                     placeholder="请选择">
            <el-option
              v-for="item in serviceList"
              :key="item.parentOrgId"
              :label="item.orgName"
              :value="item.parentOrgId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="城市：" v-if="showCityList" prop="cityId">

          <!--<el-col  v-if="showServiceSelector">-->
          <!--<el-select v-model="parentOrgId"  @change="handleSelectService"-->
          <!--placeholder="请选择">-->
          <!--<el-option-->
          <!--v-for="item in serviceList"-->
          <!--:key="item.parentOrgId"-->
          <!--:label="item.orgName"-->
          <!--:value="item.parentOrgId">-->
          <!--</el-option>-->
          <!--</el-select>-->

          <!--&lt;!&ndash;<el-cascader size="mini"&ndash;&gt;-->
          <!--&lt;!&ndash;:options="provinceList"&ndash;&gt;-->
          <!--&lt;!&ndash;:show-all-levels="false"&ndash;&gt;-->
          <!--&lt;!&ndash;v-model="cityInfoList"&ndash;&gt;-->
          <!--&lt;!&ndash;@change="onSelectCity">&ndash;&gt;-->
          <!--&lt;!&ndash;</el-cascader>&ndash;&gt;-->
          <!--</el-col>-->
          <el-col style="margin-top: 3px">
            <el-select v-model="cityId" placeholder="请选择城市">
              <el-option
                v-for="item in cityRoleOptions"
                :key="item.cityId"
                :label="item.cityName"
                :value="item.cityId">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="clickAddNewRole()">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>


  import http from 'http/accountSetApi';
  import {mapState, mapMutations} from "vuex";
  import BusinessCitySelector from 'common/BusinessCitySelector'

  export default {

    name: "accountDetail",
    data() {
      return {
        activeName: 'first',
        loading:true,
        employeeInfo: {
         authList: []
        },
        optUserId: '',//创建人id
        currentPage: 1,
        pageSize: 11,
        trueName: '',
        oneRoleId: '',//删除角色的ID
        dialogVisible: false,
        queryRoleList: [],
        role: ``,
        user_Id: ``,
        dictionaryCode: 'userRole',//后台接口要求写死
        resetFormLabelWidth: `130px`,
        operateRoleList: [],//当前角色可操作的角色列表
        roleList: [],
        warehouseList: [],//仓库列表
        serviceList: [],//服务商列表
        //showServiceSelector:false,
        parentOrgId: ``,
        orgType: ``,//WarehouseOperative HR OPAdmin Developer传1 Cashier CityAdmin CityManager DeliveryUser SaleUser传2 StoreAdmin LogisticsLeader Stevedore WarehouseManager传3
        warehouseId: '',
        org_Id: '',
        cityId: ``,//选择的城市Id
        cityRoleOptions: [],//新增角色，选择city
        citySearchId: ``,
      }
    },
    methods: {
      //单个用户信息查询接口
      queryUserInfo(){
        let userId=this.user_Id;
        http.queryUserInfo(userId).then(data=>{
          this.employeeInfo = data;
          if (this.employeeInfo.authList) {
            this.employeeInfo.authList.forEach(item => {
              item.trueName = this.employeeInfo.trueName;
              item.mobileNo = this.employeeInfo.mobileNo;
              item.gender = this.employeeInfo.gender;
              item.employeeTypeName = this.employeeInfo.employeeTypeName;
            })
            this.roleList = this.employeeInfo.authList;
          }
          this.queryRefList();
          this.loading=false
        }).catch(e=>{
          console.log(e)
        })
      },
      //根据用户信息查询一级服务商信息
      findParentCity(){
        let orgId=this.citySearchId;
        http.findParentCity(orgId).then(data=>{
          this.serviceList = data;
        }).catch(e=>{
          console.log(e)
          }
        )
      },
      //查询一级服务商信息接口
      // findFristOrgClass() {
      //   http.findFristOrgClass().then(data => {
      //     this.serviceList = data;
      //   }).catch(e => {
      //     console.log(e)
      //   })
      // },
      //获取仓库信息接口
      findJiuPiWarehouseListByCityId() {
        let cityId = this.$route.query.cityId;//通过路由传过来的当前人员的城市Id
        http.findJiuPiWarehouseListByCityId(cityId).then(data => {
          let loginRole = this.choseRoleInfoList.orgType;
          let loginOrgId = this.choseRoleInfoList.orgId;
          //如果登录角色时仓库级别的（orgType为3），筛选出data列表中Id与当前角色的orgId相等的一项
          if (loginRole === 3) {
            this.warehouseList = data.filter(item => item.id === loginOrgId)
          } else {
            this.warehouseList = data
          }
        })
      },
      //移除角色接口
      removeAdminAuth() {
        let {oneRoleId} = this;
        http.removeAdminAuth(oneRoleId).then(data => {
          this.roleList = this.roleList.filter(item => item.id !== oneRoleId);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(e => {
          console.log(e)
        })
      },
      //删除司机角色
      removeAdminAuthForDriver() {
        let params = {authId: this.oneRoleId, userId: this.user_Id};
        http.removeAdminAuthForDriver(params).then(data => {
          this.roleList = this.roleList.filter(item => item.id !== this.oneRoleId);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(e => {
          console.log(e)
        })
      },
      //查询当前角色权限下可移除角色接口
      queryRefList() {
        let dictionaryValue = this.choosenRole;
        //后台接口要求
        let dictionaryCode = `userRole`;
        let dictionaryRefCode = `userRoleAuth`;
        http.queryRefList({dictionaryValue, dictionaryCode, dictionaryRefCode}).then(data => {
          this.queryRoleList = data;//可新增的角色
          this.operateRoleList = data
          this.choseCanRemoveRole();
         // console.log('operateList', this.operateRoleList)
        }).catch(e => {
          console.log(e)
        })
      },
      //1.拿到当前账号的角色，比如Developer
      //2.通过当前角色，去查询该角色有权限操作的角色列表 命名为operateRoleList
      //3.获取人员详情中的列表，此列表与上述列表不一样 命名为queryRoleList
      //4.遍历命名为queryRoleList，在queryRoleList的每个item中增加一个是否可以操作移除的属性 canRemove
      //如果queryRoleList[index]的userRole在operateRoleList中存在，则证明该项可操作，queryRoleList[index].canRemove=true,否则设置为false
      //注意：在页面顶部的角色切换的时候，相应的roleList也要跟着刷新，queryRoleList里的canRemove也要刷新
      //设置当前  列表的canRemove属性
      choseCanRemoveRole() {
        this.roleList.forEach(role => {
          //role.canRemove = this.getCanRemoveProp(role)
          let resultIndex = this.getCanRemoveProp(role);
          //Vue 不能检测以下变动的数组,例如：vm.items[indexOfItem] = newValue,需使用this.$set让页面响应渲染
          role.canRemove = this.$set(role, "canRemove", resultIndex);
          this.$forceUpdate()
        })
      },
      //获取当前角色的canRemove属性
      getCanRemoveProp(role) {
        let index = this.operateRoleList.findIndex(item => item.value === role.userRole);
        return index !== -1;
      },

      //新增用户角色
      addAdminAuth() {
        let {optUserId, orgType, org_Id, role, user_Id} = this;
        http.addAdminAuth({optUserId, orgType, org_Id, role, user_Id}).then(data => {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
          this.queryUserInfo();
          this.queryRefList();
        }).catch(e => {
          this.$message.error(e);
        })
      },
      //获取可授权的组织机构列表
      findAllCityList() {
        let orgId = this.citySearchId;
        http.findAllCityListWithParent(orgId).then(data => {
          this.cityRoleOptions = data
        }).catch(e => {
          console.log(e)
        })
      },
      handleClick() {
      },
      goBack() {
        this.$router.go(-1)
      },
      indexMethods(index) {
        return (this.currentPage - 1) * this.pageSize + index + 1
      },
      //确认新增角色
      clickAddNewRole() {
        this.checkCityRoleList();
        if (this.org_Id || (this.org_Id === 0&&this.choosenRole===`Developer`)) {
          this.addAdminAuth();
        } else {
          this.$message.error(`请填写完整角色信息`);
        }
        this.dialogVisible = false;
      },
      //显示新增角色弹框
      addNewRole() {
        this.dialogVisible = true
      },
      //删除角色
      deleteOneRole(roleId, userRole) {
        this.oneRoleId = roleId;
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //如果删除的角色是配送员，就调删除配送员的接口
          if (userRole == `DeliveryUser`) {
            this.removeAdminAuthForDriver()
          } else {
            this.removeAdminAuth();
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //WarehouseOperative  HR OPAdmin 先判断如果是ruleOrgId=0的超管登录，需要选择一级服务商，传选中的作为ruleOrgId，如果不等于0，直接传登录人的ruleOrgId
      //Developer orgId传 0 orgType 1
      checkAdminRole() {
        if (this.role === `Developer`) {
          this.org_Id = 0;
        } else {
          if (this.choseRoleInfoList.ruleOrgId !== 0) {
            this.org_Id = this.choseRoleInfoList.ruleOrgId
          } else {
            this.org_Id=this.parentOrgId;
          }
        }
      },
      //根据选择的角色判断后台传值
      //后台要求 ：WarehouseOperative  HR OPAdmin Developer orgType 1
      //Cashier CityAdmin CityManager DeliveryUser SaleUser orgId传cityId  orgType 2
      //StoreAdmin  LogisticsLeader Stevedore WarehouseManager  orgId传 warehouseId orgType传3
      checkCityRoleList() {
        let adminRole = [`WarehouseOperative`, `HR`, `OPAdmin`, `Developer`,`DealerAuditManager`,`ShopAuditManager`];
        let cityRole = ['CityAdmin', 'CityManager', 'DeliveryUser', 'SaleUser'];
        let warehouseRole = ['Cashier','StoreAdmin', 'LogisticsLeader', 'Stevedore', 'WarehouseManager', 'OrderPicker'];
        let choseWarehouseRole = warehouseRole.filter(item => item === this.role);
        let choseCityRole = cityRole.filter(item => item === this.role);
        let choseAdminRole = adminRole.filter(item => item === this.role);
        if (choseCityRole.length) {
          this.org_Id = this.cityId;
          this.orgType = 2;
        } else if (choseWarehouseRole.length) {
          this.orgType = 3;
          this.org_Id = this.warehouseId;
        } else if (choseAdminRole.length) {
          this.orgType = 1;
          this.checkAdminRole()
        }
      },
      ...mapMutations(`user`, [`setChoseRoleInfoList`]),
    },
    watch: {
      //监听当前角色改变，重新调角色权限操作接口
      choosenRole(newValue) {
        this.queryRefList()
      },
      // role(newRole){
      //   this.checkAdminRole()
      // }
    },
    activated(){
      if (this.$route.query.id) {
        this.user_Id = this.$route.query.id;
        this.citySearchId = this.$route.query.cityId;
      }
      if (this.$store.state.user.userInfo.userId) {
        this.optUserId = this.$store.state.user.userInfo.userId;
      }
      this.queryUserInfo();
      this.findJiuPiWarehouseListByCityId();
      this.findAllCityList();
      this.findParentCity();
    },
    mounted() {
      if (this.$route.query.id) {
        this.user_Id = this.$route.query.id;
        this.citySearchId = this.$route.query.cityId;
      }
      if (this.$store.state.user.userInfo.userId) {
        this.optUserId = this.$store.state.user.userInfo.userId;
      }
      this.queryUserInfo();
      this.findJiuPiWarehouseListByCityId();
      this.findAllCityList();
      this.findParentCity();
    },
    computed: {
      ...mapState(`user`, [`choosenRole`, `userInfo`, `choseRoleInfoList`]),
      //根据选择的角色，控制以下变量，进而控制仓库与城市下拉框的显隐
      showWarehouseList: function () {
        let warehouseRole = ['Cashier','StoreAdmin', 'LogisticsLeader', 'Stevedore', 'WarehouseManager', 'OrderPicker'];
        let choseWarehouseRole = warehouseRole.filter(item => item === this.role);
        return !!choseWarehouseRole.length;
      },
      showCityList: function () {
        let cityRole = ['CityAdmin', 'CityManager', 'DeliveryUser', 'SaleUser'];
        let choseCityRole = cityRole.filter(item => item === this.role);
        return !!choseCityRole.length;
      },
      showServiceSelector:function () {
        // //Developer orgId传 0 orgType 1,所以此时Developer不需要传服务商
        let adminRole = [`WarehouseOperative`, `HR`, `OPAdmin`,`DealerAuditManager`,`ShopAuditManager`];
        let choseAdminRole = adminRole.filter(item => item === this.role);
        return !!choseAdminRole.length&&!this.choseRoleInfoList.ruleOrgId;
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .userInfo {
    margin 50px 120px

  }
</style>
