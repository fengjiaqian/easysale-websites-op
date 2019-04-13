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
    <el-table
      v-loading="loading"
      :data="accountList"
      border
      height='520'
      style="width: 100%;margin-top:16px;">
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" ></el-table-column>
      <el-table-column label="父角色名称"  prop="parentName"></el-table-column>
      <el-table-column label="创建时间"  prop="createTime"></el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <span>{{scope.row.state==0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="gotoAccountDetail(scope.row.id,scope.row.cityId)">详情</el-button>
          <!--<el-button type="text" size="small" @click="resetPassword(scope.row.id)">重置密码</el-button>-->
          <el-button type="text" size="small" @click="editAccount(scope.row)">编辑</el-button>
          <el-button type="text" size="medium" @click="toggleState(scope.row,scope.$index)">
            {{scope.row.state===0?'启用':'停用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <!--<p>每页{{pageSize}}条 | 共{{totalCount}}条记录 | 当前第{{currentPage}}/{{pageCount}}页 | 共{{pageCount}}页</p>-->
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handlePageNumChange($event)"
        :page-size="pageSize"
        :total="totalCount"
        v-if="totalCount>0"
      >
      </el-pagination>
    </div>
    <!--重置密码对话框-->
    <el-dialog title="重置密码" top="160px" :modal="false" :visible.sync="resetDialogVisible" width="40%" center>
      <el-form :label-width="resetFormLabelWidth" :model="resetRuleForm" :rules="rules" ref="resetRuleForm">
        <!--<el-form-item label="原密码" prop="oldPass">-->
          <!--<el-input v-model="resetRuleForm.oldPass" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="resetRuleForm.newPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassRepeat">
          <el-input v-model="resetRuleForm.newPassRepeat" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="ensureReset()">确定</el-button>
        <el-button @click="resetDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import http from 'http/roleSetApi';
  import {mapState} from 'vuex';

  export default {
    name: "roleSetting",
    data() {
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.resetRuleForm.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        resetRuleForm: {
          //oldPass: '',//旧密码
          newPass: '',//新密码
          newPassRepeat: '',//确认密码
        },//重置密码表单输入规则
        rules: {
          oldPass: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
          ],
          newPass: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, message: '最小必须为6位', trigger: 'blur'}
          ],
          newPassRepeat: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
        loading: true,
        //账户查询字段
        roleName: null,
        cityName: null,
        mobileNo: null,
        state: null,
        cityInfoList: [],//市
        identify: {
          userId: ''
        },//更改密码接口所需参数
        //
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
      this.checkRuleOrgId();
      this.findRoleList();
    },
    //keepalive组件每次进都会触发的方法
    activated() {
      this.cityId = ``
      this.getRoleList();
      console.log(`生命周期activated`)
    },

    methods: {
      //判断登录角色得ruleOrgId,如果ruleOrgId=0，那么需要先查询出所有的一级服务商，传选中的服务商ID，进行二级级联
      checkRuleOrgId() {
        if (this.choseRoleInfoList.ruleOrgId) {
          this.findAllCityList();
        } else {
          this.findFristOrgClass();
          this.showServiceSelector = true;
        }
      },
      //查询一级服务商信息接口
      findFristOrgClass() {
        http.findFristOrgClass().then(data => {
          this.serviceList = data;
        }).catch(e => {
          console.log(e)
        })
      },
      //获取可授权的组织机构列表
      findAllCityList() {
        let orgId = ``;
        //如果登录角色的ruleOrgId不等于0，直接传ruleOrgId的值。否则需要二级级联 ，先查询出所有的一级服务商，传选中的服务商ID ,也就是parentOrgId
        if (this.choseRoleInfoList.ruleOrgId) {
          orgId = this.choseRoleInfoList.ruleOrgId//登录角色的ruleOrgId
        } else {
          orgId = this.parentOrgId;
        }
        http.findAllCityList(orgId).then(data => {
          this.cityRoleOptions = data
        }).catch(e => {
          console.log(e)
        })
      },

      //获取账户接口
      getRoleList() {
        let roleOrgId = this.choseRoleInfoList.ruleOrgId
        let {currentPage, mobileNo, pageSize, roleName, state} = this;
        let cityId = this.cityId || this.parentOrgId||''
        //let cityId = cityInfoList[1];
        http.getRoleList({cityId, currentPage, mobileNo, pageSize, roleName, state, roleOrgId}).then(data => {
          this.accountList = data || [];
          this.totalCount = data ? data.totalCount : 0;
          this.roleListData = data.authList;

          this.loading = false;
        }).catch(e => {
          console.log(e)
        })
      },
      //获取角色接口
      findRoleList() {
        let dictionaryCode = this.dictionaryCode
        http.findRoleList({dictionaryCode}).then(data => {
          this.queryRoleList = data
        }).catch(e => {
          console.log(e)
        })
      },
      //重置密码接口
      changePasswordByOld() {
        let {newPass, newPassRepeat} = this.resetRuleForm;
        let identify = this.identify;
        let userId = this.identify.userId;
        http.changePasswordByOld({userId, identify, newPass, newPassRepeat}).then(data => {
          this.$message({type: 'success', message: '修改成功！'})
        }).catch(e => {
          this.$message(e)
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
      gotoAccountDetail(id, cityId) {
        //item=JSON.stringify(item)
        this.$router.push({name: `accountDetail`, query: {id: id, cityId: cityId}})
      },
      ensureReset() {
        if (this.resetRuleForm.newPass === this.resetRuleForm.newPassRepeat) {
          this.changePasswordByOld();
        } else {
          this.$message.error(`两次密码输入不一致`)
        }

        this.resetDialogVisible = false;
      },
      //重置密码
      resetPassword(id) {
        if(this.choseRoleInfoList.roleCode===`LogisticsLeader`||this.choseRoleInfoList.roleCode===`StoreAdmin`){
          this.$message.error(`当前角色无法修改密码`)
        }else {
          this.resetRuleForm.oldPass = ``;
          this.resetRuleForm.newPass = ``;
          this.resetRuleForm.newPassRepeat = ``;
          this.resetDialogVisible = true;
          this.identify.userId = id;
        }
      },
      //编辑账户
      editAccount(rowItem) {
        //只有OPAdmin,HR这个角色可以编辑账户
        if (this.choseRoleInfoList.roleCode === `OPAdmin` || this.choseRoleInfoList.roleCode === `HR`) {
          rowItem = JSON.stringify(rowItem)
          this.$router.push({name: `editAccount`, query: {rowItem}})
        } else {
          this.$message.error(`当前角色无法编辑账户`)
        }
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
        this.showServiceSelector = !this.choseRoleInfoList.ruleOrgId;
        this.checkRuleOrgId();
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
