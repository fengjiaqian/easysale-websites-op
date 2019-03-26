<template>
  <div id="accountSetting">

    <el-form :inline="true"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="姓名">
        <el-input v-model="trueName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="mobileNo" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="城市">
        <el-select v-model="parentOrgId" size="medium"  v-if="showServiceSelector" @change="handleSelectService"
                   placeholder="请选择">
          <el-option
            v-for="item in serviceList"
            :key="item.parentOrgId"
            :label="item.orgName"
            :value="item.parentOrgId">
          </el-option>
        </el-select>
        <el-select v-model="cityId" size="medium" :disabled="!canSelectSecondSelector" placeholder="请选择城市">
          <el-option
            v-for="item in cityRoleOptions"
            :key="item.cityId"
            :label="item.cityName"
            :value="item.cityId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="userRole" placeholder="请选择" size="medium">
          <el-option
            v-for="item in queryRoleList"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getAccountList" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" size="medium">重置</el-button>
    </div>
    <el-button type="primary" class="addAd" @click="addAccount">新增账号</el-button>
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
      <el-table-column prop="trueName" label="姓名"></el-table-column>
      <el-table-column label="服务商"  prop="cityName"></el-table-column>
      <el-table-column label="手机号"  prop="mobileNo"></el-table-column>
      <el-table-column label="性别"  prop="gender"></el-table-column>
      <el-table-column label="人员类型"  prop="employeeTypeName"></el-table-column>
      <el-table-column label="角色" >
        <template slot-scope="scope">
            <span v-for="item in scope.row.authList">
              <span>{{item.roleName}}、</span>
            </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <span>{{scope.row.enableState==0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="gotoAccountDetail(scope.row.id,scope.row.cityId)">详情</el-button>
          <el-button type="text" size="small" @click="resetPassword(scope.row.id)">重置密码</el-button>
          <el-button type="text" size="small" @click="editAccount(scope.row)">编辑</el-button>
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
  import http from 'http/accountSetApi';
  import {mapState} from 'vuex';

  export default {
    name: "accountSetting",
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
        trueName: null,
        cityName: null,
        mobileNo: null,
        cityInfoList: [],//市
        userRole: null,//用户角色
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
      this.getAccountList();
      this.checkRuleOrgId();
      this.findRoleList();
    },
    //keepalive组件每次进都会触发的方法
    activated() {
      this.cityId = ``
      this.getAccountList();
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
      //获取城市列表接口
      // listAdminCity() {
      //   http.listAdminCity().then(data => {
      //     //data是一个map，即是一个object，每一个属性的key都是省份的名字，每一个属性的value是一个下属城市的数组
      //     // for...in...用于遍历一个对象，map，set的方法，也可以遍历数组，但是一般用for...of...
      //     // forEach是数组的专用方法，用于遍历数组，
      //     // for...of...用于遍历数组
      //     let resultArr = []
      //     for (let key in data) {
      //       //比如循环的第一项，key是“福建省”,data[key]则是他的下属城市数组
      //       let resultArrItem = {label: key, value: key, children: data[key]}
      //       //将返回的数据结构和属性名称转化成和element Ui一致  provinceList:[label:'',value:'',children:[label:'',value:'']]
      //       data[key].forEach(cityItem => {
      //         cityItem.label = cityItem.cityName;
      //         cityItem.value = cityItem.cityId
      //       })
      //       resultArr.push(resultArrItem)
      //     }
      //     this.provinceList = resultArr
      //
      //   }).catch(e => {
      //     console.log(e);
      //   })
      // },
      //获取账户接口
      getAccountList() {
        let roleOrgId = this.choseRoleInfoList.ruleOrgId
        let {currentPage, mobileNo, pageSize, trueName, userRole} = this;
        let cityId = this.cityId || this.parentOrgId||''
        //let cityId = cityInfoList[1];
        http.getAccountList({cityId, currentPage, mobileNo, pageSize, trueName, userRole, roleOrgId}).then(data => {
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
        this.trueName = null;
        this.mobileNo = null;
        this.parentOrgId = null;
        this.cityId = null;
        this.userRole = null;
        this.getAccountList();
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
      addAccount() {
        //只有OPAdmin,HR这个角色可以新增账户
        if (this.choseRoleInfoList.roleCode === `OPAdmin` || this.choseRoleInfoList.roleCode === `HR`) {
          this.$router.push({name: `addAccount`})
        } else {
          this.$message.error(`当前角色无法新增账户`)
        }

      },
      handlePageNumChange(num) {
        this.currentPage = num;
        this.getAccountList();
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
        this.getAccountList();
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
