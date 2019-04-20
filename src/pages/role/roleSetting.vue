
<template>
  <div id="accountSetting">

    <el-form :inline="true"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="角色">
        <el-input v-model="roleName" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getRoleList" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" size="medium">重置</el-button>
    </div>
    <el-button type="primary" class="addAd" @click="addRole">新增角色</el-button>
    <!--<el-table-->
      <!--v-loading="loading"-->
      <!--:data="accountList"-->
      <!--border-->
      <!--height='520'-->
      <!--style="width: 100%;margin-top:16px;">-->
      <!--<el-table-column label="序号">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{indexMethods(scope.$index)}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="角色名称" prop="roleName" ></el-table-column>-->
      <!--<el-table-column label="父角色名称"  prop="parentName"></el-table-column>-->
      <!--<el-table-column label="创建时间"  prop="createTime"></el-table-column>-->
      <!--<el-table-column label="状态" >-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.state==0?'停用':'启用'}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column fixed="right" label="操作">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="small" @click="gotoRoleDetail(scope.row)">详情</el-button>-->
          <!--<el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>-->
          <!--<el-button type="text" size="medium" @click="toggleRoleState(scope.row,scope.$index)">-->
            <!--{{scope.row.state===0?'启用':'停用'}}-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
    <tree-table :data="data" :columns="columns" border/>
    <!--<div class="pagination">-->
      <!--&lt;!&ndash;<p>每页{{pageSize}}条 | 共{{totalCount}}条记录 | 当前第{{currentPage}}/{{pageCount}}页 | 共{{pageCount}}页</p>&ndash;&gt;-->
      <!--<el-pagination-->
        <!--background-->
        <!--layout="prev, pager, next"-->
        <!--@current-change="handlePageNumChange($event)"-->
        <!--:page-size="pageSize"-->
        <!--:total="totalCount"-->
        <!--v-if="totalCount>0"-->
      <!--&gt;-->
      <!--</el-pagination>-->
    <!--</div>-->

  </div>
</template>

<script>
  import http from 'http/roleSetApi';
  import {mapState} from 'vuex';
  import treeTable from "./TreeTable";

  export default {
    name: "roleSetting",

    data() {

      return {
            loading: false,
            columns: [
              {
                text: "角色名称",
                value: "roleName",

              },

              {
                text: "状态",
                value: "state",
                width:200
              },
              {
                text: "创建时间",
                value: "createTime",
                width: 300
              },
            ],
            data: [{
              "children": [],
              "createTime": "2019-04-02 15:01:35",
              "createUser": 2,
              "id": "66125024155",
              "roleName": "烟酒店6",
              "state": 1,
              "updateTime": "2019-04-02 15:01:35",
              "updateUser": 2
            },
              {
                "children": [],
                "createTime": "2019-04-12 21:04:17",
                "id": "509809977262894348",
                "roleName": "橘色",
                "state": 1,
                "updateTime": "2019-04-12 21:04:17"
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "children": [],
                        "createTime": "2019-04-15 14:41:57",
                        "createUser": 970361,
                        "id": "4794874810657009342",
                        "parentId": "4809793945624642619",
                        "roleName": "温恩",
                        "state": 1,
                        "updateTime": "2019-04-15 14:41:57",
                        "updateUser": 970361
                      }
                    ],
                    "createTime": "2019-04-13 17:58:42",
                    "createUser": 8118051876142393000,
                    "id": "4809793945624642619",
                    "parentId": "661250242354700444",
                    "roleName": "23424",
                    "state": 1,
                    "updateTime": "2019-04-13 17:58:42",
                    "updateUser": 8118051876142393000
                  }
                ],
                "createTime": "2019-04-02 15:01:35",
                "createUser": 2,
                "id": "661250242354700444",
                "roleName": "老板33",
                "state": 1,
                "updateTime": "2019-04-02 15:01:35",
                "updateUser": 2
              }],

        //账户查询字段
        roleName: null,
        cityName: null,
        mobileNo: null,
        state: null,
        currentPage: 1,
        pageSize: 20,
        dictionaryCode: 'userRole',//后台接口要求写死
        queryRoleList: '',
        totalCount: 0,
        roleListData: [],//角色清单
        resetDialogVisible: false,
        accountList: [],
        resetFormLabelWidth: '130px',
        cityRoleOptions: [],
        cityId: ``,
        serviceList: [],//服务商列表
        parentOrgId: ``,
        showServiceSelector: false,
      }
    },
    mounted() {
      console.log(`生命周期mounted`)
      this.getRoleList();
      // this.getRoleTreeList();
    },
    //keepalive组件每次进都会触发的方法
    activated() {
      this.cityId = ``
      // this.getRoleList();
      console.log(`生命周期activated`)
    },
    components: { treeTable },
    methods: {
      /*获取角色数据列表*/
      getRoleTreeList() {
        this.loading = true;
        http.getRoleTreeList({}).then(data => {
          this.loading = false;
          this.data = data;
          //alert(JSON.stringify(data))
          console.log(JSON.stringify(data))
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },


      //获取账户接口
      getRoleList() {
        let roleOrgId = this.choseRoleInfoList.ruleOrgId
        let {currentPage, mobileNo, pageSize, roleName, state,userInfo} = this;
        let cityId = this.cityId || this.parentOrgId||''
        //let cityId = cityInfoList[1];
        http.getRoleList({cityId, currentPage, mobileNo, pageSize, roleName, state, roleOrgId,userInfo}).then(data => {
          this.accountList = data || [];
          this.totalCount = data ? data.totalCount : 0;
          this.roleListData = data.authList;

          this.loading = false;
        }).catch(e => {
          console.log(e)
        })
      },

      resetForm() {
        this.roleName = null;
        this.mobileNo = null;
        this.parentOrgId = null;
        this.cityId = null;
        this.state = null;
        this.getRoleList();
      },
      /*设置状态*/
      toggleRoleState(row, index) {
        this.loading = true;
        console.log(this.userInfo);
        console.log(this.user_Id);
        let param = {
          roleId: row.id,
          // userId: this.userInfo.id,
          state: row.state == 0 ? 1 : 0,
        }
        console.log(param);
        return http.updateUserRoleState(param).then(data => {
          this.$message(`修改成功`)
          this.getRoleList()
          this.loading = false
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      gotoRoleDetail(row) {
        // item=JSON.stringify(item)
        console.log(row);
        this.$router.push({name: `roleDetail`, query: {id: row.id}})
      },
      ensureReset() {
        if (this.resetRuleForm.newPass === this.resetRuleForm.newPassRepeat) {
          this.changePasswordByOld();
        } else {
          this.$message.error(`两次密码输入不一致`)
        }

        this.resetDialogVisible = false;
      },

      //编辑账户
      editRole(rowItem) {
        console.log(rowItem);
        this.$router.push({path: '/addRole', query: {productInfo: rowItem}})

      },
      indexMethods(index) {
        return (this.currentPage - 1) * this.pageSize + index + 1
      },
      addRole() {
        //只有OPAdmin,HR这个角色可以新增账户
          this.$router.push({name: `addRole`})

      },
      handlePageNumChange(num) {
        this.currentPage = num;
        this.getRoleList();
      },
      handleSelectService() {
        this.findAllCityList();
      }
    },
    computed: {
      canSelectSecondSelector() {
        return (this.showServiceSelector && this.parentOrgId) || !this.showServiceSelector
      },
      ...mapState(`user`, [`choseRoleInfoList`,`choosenRole`])
    },
    watch: {
      choseRoleInfoList(newValue) {
        this.getRoleList();
        this.data;
        // this.getRoleTreeList();
        this.showServiceSelector = !this.choseRoleInfoList.ruleOrgId;
      },
      parentOrgId(newValue) {
        this.cityId = ``
      }
    },
  }
</script>

<style lang="stylus" scoped>

  .el-header {
    span {
      color: #999;
      font-size: 14px;
    }
  }

  .el-main {
    margin-top: 20px;
  }

  .el-row {
    font-size: 14px;
    align-items: center
  }

  .check {
    padding: 20px 20px;
  }

  .addAd {
    padding: 10px 24px;
    margin-top: 16px;
  }

  .query-btn{
    text-align center
    border-bottom:1px solid #ededed
    padding-bottom:20px
  }
  .pagination {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
    color: #999;
    float: right
  }
</style>
