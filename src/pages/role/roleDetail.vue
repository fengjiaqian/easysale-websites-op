<template>
  <div>


    <div class="block-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色信息" name="first" v-loading="loading">
          <div style="line-height: 20px;margin-top: 30px;font-size: 14px;">
            <div class="userInfo">角色： {{employeeInfo.roleName}}</div>
            <div class="userInfo">父角色名称： {{employeeInfo.parentName}}</div>
            <div class="userInfo">创建时间： {{employeeInfo.createTime}}</div>
            <div class="userInfo">状态: {{employeeInfo.state==0?'停用':'启用'}}</div>

            <el-button class="userInfo" @click="goBack">返回</el-button>
          </div>

        </el-tab-pane>


        <el-tab-pane label="功能授权" name="second">
          <div style="line-height: 20px;">
            <el-button type="primary" class="addAd" @click="addNewRole">+ 新增授权</el-button>
            <!--<el-table-->
              <!--:data="roleList"-->
              <!--border-->
              <!--style="width: 100%;margin-top:16px;">-->
              <!--<el-table-column label="序号" width="60">-->
                <!--<template slot-scope="scope">-->
                  <!--<span>{{indexMethods(scope.$index)}}</span>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column label="角色" width="260" prop="roleName"></el-table-column>-->
              <!--<el-table-column prop="trueName" label="姓名" width="180"></el-table-column>-->
              <!--<el-table-column label="手机号" width="180" prop="mobileNo"></el-table-column>-->
              <!--<el-table-column label="性别" width="180" prop="gender"></el-table-column>-->
              <!--<el-table-column label="人员类型" width="180" prop="employeeTypeName"></el-table-column>-->
              <!--<el-table-column fixed="right" label="操作">-->
                <!--<template slot-scope="scope" v-if="scope.row.canRemove">-->
                  <!--<el-button type="primary" icon="el-icon-delete" size="small"-->
                             <!--@click="deleteOneRole(scope.row.id,scope.row.userRole)">移除-->
                  <!--</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</el-table>-->
          </div>

        </el-tab-pane>

      </el-tabs>
    </div>

    <!--人员授权弹框-->
    <el-dialog title="角色功能授权" top="160px" :modal="false" :visible.sync="dialogVisible" width="40%" center>
      <el-form :label-width="resetFormLabelWidth" ref="tree">
        <el-tree
          :data="menuItems"
          show-checkbox
          node-key="id"
          :default-expanded-keys="expandedKeys"
          :default-checked-keys="checkedKeys"
          :props="defaultProps"
          @click="getCheckedKeys"
        >
        </el-tree>

      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="clickAddNewRole()">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>


  import http from 'http/roleSetApi';
  import {mapState, mapMutations} from "vuex";
  import BusinessCitySelector from 'common/BusinessCitySelector'

  export default {

    name: "roleDetail",
    data() {
      return {
        activeName: 'first',
        roleId:'',
        roleName:'',
        loading:true,
        employeeInfo: {
         authList: [],

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
        expandedKeys: [],//展开的菜单项
        checkedKeys: [],//选中的菜单项
        menuItem:[],
        menuItems: [{
          id: 1,
          label: '系统管理',
          children: [{
            id: 4,
            label: '功能管理',
            children: [{
              id: 9,
              label: '功能维护',
              children: [{
                id: 11,
                label: '功能分配'
              }]
            }, {
              id: 10,
              label: '资源管理'
            }]
          }]
        }, {
          id: 2,
          label: '账户管理',
          children: [{
            id: 5,
            label: '用户管理'
          }, {
            id: 6,
            label: '角色管理'
          }]
        }, {
          id: 3,
          label: '任务管理',
          children: [{
            id: 7,
            label: '任务执行'
          }, {
            id: 8,
            label: '执行记录'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      //单个用户的角色查寻
      selectRoleById(){
        http.selectRoleById(this.role).then(data=>{
          this.employeeInfo = data;
          console.log( this.employeeInfo);
          if (this.employeeInfo.authList) {
            this.employeeInfo.authList.forEach(item => {
              item.trueName = this.employeeInfo.trueName;
              item.mobileNo = this.employeeInfo.mobileNo;
              item.gender = this.employeeInfo.gender;
              item.employeeTypeName = this.employeeInfo.employeeTypeName;
            })
            this.roleList = this.employeeInfo.authList;
          }
          this.loading=false
        }).catch(e=>{
          console.log(e)
        })
      },

      //单个角色的权限查寻
      findAllRolePermission(){
        console.log(this.role);
        http.findAllRolePermission(this.role).then(data=>{
          this.expandedKeys = data;
          this.checkedKeys = data;
          console.log(data);
          this.loading=false
        }).catch(e=>{
          console.log(e)
        })
      },

      //查寻所有的功能列表
      findAllPermissionList(){
        http.findAllPermissionList().then(data=>{
          this.menuItems = data;
          console.log(data);
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
      findFristOrgClass() {
        http.findFristOrgClass().then(data => {
          this.serviceList = data;
        }).catch(e => {
          console.log(e)
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


      // //新增用户角色
      addAdminAuth() {
        let {optUserId, orgType, org_Id, role, user_Id} = this;
        http.addAdminAuth({optUserId, orgType, org_Id, role, user_Id}).then(data => {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
          this.selectRoleById();
        }).catch(e => {
          this.$message.error(e);
        })
      },

      // //确认新增角色
      clickAddNewRole() {
        // this.checkedKeys = data;
        console.log(this.$refs.tree);
        console.log(this.checkedKeys);

        this.dialogVisible = false;
      },
      //显示新增角色弹框
      addNewRole() {
        this.dialogVisible = true
      },
      // //删除角色
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
      handleClick() {
      },
      goBack() {
        this.$router.go(-1)
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
      // //根据选择的角色判断后台传值
      // //后台要求 ：WarehouseOperative  HR OPAdmin Developer orgType 1
      // //Cashier CityAdmin CityManager DeliveryUser SaleUser orgId传cityId  orgType 2
      // //StoreAdmin  LogisticsLeader Stevedore WarehouseManager  orgId传 warehouseId orgType传3
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
      },
      // role(newRole){
      //   this.checkAdminRole()
      // }
    },
    activated(){
      console.log(this.$route.query);
      this.employeeInfo = this.$route.query.id || {}
      if (this.$route.query) {
        this.role = this.$route.query;
        console.log(this.role)
      }
      this.selectRoleById();
      this.findAllPermissionList();
      this.findAllRolePermission();

    },
    mounted() {
      if (this.$route.query.id) {
        this.user_Id = this.$route.query.id;
        this.citySearchId = this.$route.query.cityId;
      }
      if (this.$store.state.user.userInfo.userId) {
        this.optUserId = this.$store.state.user.userInfo.userId;
      }
      this.selectRoleById();
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
