<template>
  <div id="addAccount">
    <el-container>
      <el-header>
        <span>首页&nbsp;/&nbsp;账户设置 / {{title}}</span>
        <h3>{{title}}</h3>
      </el-header>
      <el-main>
        <el-form :model="accountForm" :rules="rules" ref="ruleForm" style="width: 50%" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="userName">
            <el-input v-model="accountForm.userName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="所属城市：" prop="orgId" v-if="showEditCity">
            <el-select v-model="accountForm.orgId" placeholder="请选择城市">
              <el-option
                v-for="item in cityOptions"
                :key="item.cityId"
                :label="item.cityName"
                :value="item.cityId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobileNo">
            <el-input v-model="accountForm.mobileNo" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="身份证：" prop="idCard">
            <el-input v-model="accountForm.idCard" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="人员类型：" prop="employeeType">
            <el-select v-model="accountForm.employeeType" placeholder="请选择">
              <el-option label="自有人员" :value="1"></el-option>
              <el-option label="外包人员" :value="2"></el-option>
              <el-option label="加盟城市" :value="3"></el-option>
              <el-option label="易酒批零" :value="4"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-select v-model="accountForm.gender" placeholder="请选择">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="submit">
          <el-button type="primary" size="small" @click="submit">提交</el-button>
          <el-button size="small" @click="goBack">返回</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import http from 'http/accountSetApi';
  import {mapState} from 'vuex';

  export default {
    name: "addAccount",
    data() {
      let checkPhone = (rule, value, callback) => {
        let reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!value) {
          callback(new Error('请输入电话号码'));
        } else if (value.length != 11) {
          callback(new Error('电话号码必须是11位数字'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的电话号码'));
        } else {
          callback();
        }
      };
      let validateCard = (rule, value, callback) => {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!value) {
          callback(new Error('请输入身份证号'));
          return
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的身份证号'));
        } else {
          callback();
        }
      };
      return {
        title: '新增账号',
        showEditCity: true,//编辑的时候不选择城市下来框
        accountForm: {
          userName: '',
          mobileNo: '',
          orgId: null,//用户所属城市，可以为null
          idCard: '',//身份证
          gender: '',
          employeeType: '',
        },
        //firstServiceName:``,//一级服务商
        userId: '',
        pageNum: 1,
        pageSize: 7,
        createUserId: '',//创建人id
        //provinceList: [],//省
        //cityInfoList: [],//市
        cityOptions: [],
        cityId: ``,
        citySearchId: ``,

        rules: {
          orgId:[
             {required: true, message: '请选择城市', trigger: 'blur'},
          ],
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          mobileNo: [
            {validator: checkPhone, trigger: 'blur', required: true},
          ],
          idCard: [
            {validator: validateCard, trigger: 'blur', required: true},
          ],
          gender: [
            {required: true, message: '请输入性别', trigger: 'blur'}
          ],
          employeeType: [
            {required: true, message: '请输入人员类型', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      //获取可授权的组织机构列表
      findAllCityList() {
        let orgId = this.choseRoleInfoList.ruleOrgId;

        http.findAllCityListWithParent(orgId).then(data => {
          this.cityOptions = data
        }).catch(e => {
          console.log(e)
        })
      },
      //新增用户
      addAdminUser() {
        let {userName, mobileNo, idCard, gender, employeeType} = this.accountForm;
        let orgId = this.accountForm.orgId||this.choseRoleInfoList.ruleOrgId;//	一级服务商id或者子公司id都可能
        let createUserId = this.createUserId;
        http.addAdminUser({userName, mobileNo, orgId, idCard, gender, employeeType, createUserId}).then(data => {
          this.$router.push({name: `accountSetting`})
          this.$message({type: 'success', message: '新增成功'})
        }).catch(e => {
          this.$message(e)
        })
      },
      //编辑用户
      editAdminUser() {
        let {userName, mobileNo, idCard, gender, employeeType,orgId} = this.accountForm;
        //let orgId = this.cityId;
        let optUserId = this.createUserId;
        let userId = this.userId;
        http.editAdminUser({userName, mobileNo, idCard, gender, employeeType, orgId, optUserId, userId}).then(data => {
          this.$router.push({name: `accountSetting`})
          this.$message({type: 'success', message: '编辑成功'})
        }).catch(e => {
          this.$message(e)
        })
      },
      //提交
      submit() {
        if (this.accountForm.userName&& this.accountForm.mobileNo  && this.accountForm.idCard && this.accountForm.gender  && this.accountForm.employeeType &&this.accountForm.orgId) {
          if (this.$route.query.rowItem) {
            this.editAdminUser()
          } else {
            this.addAdminUser();
          }
        } else {
          this.$message.error(`请填写完整信息`);
        }
      },
      goBack() {
        this.$router.go(-1)
      },
      //赋值  如果编辑需要带值过来
      assignValue(item) {
        this.accountForm.userName = item.trueName;
        this.accountForm.mobileNo = item.mobileNo;
        this.accountForm.orgId = item.cityId;
        this.accountForm.idCard = item.idCard;
        this.accountForm.gender = item.gender;
        this.accountForm.employeeType = item.employeeType;
      }
    },
    mounted() {
      this.findAllCityList();
      //this.firstServiceName=this.choseRoleInfoList.orgName;
      if (this.$store.state.user.userInfo.userId) {
        this.createUserId = this.$store.state.user.userInfo.userId;
      }
      if (this.$route.query.rowItem) {
        this.title = `编辑账户`;
        this.showEditCity = false;
        this.userId = JSON.parse(this.$route.query.rowItem).id;
        this.assignValue(JSON.parse(this.$route.query.rowItem))//如果编辑需要带值过来
      }
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`])
    }
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

  .el-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .el-input {
    width: 340px;
  }

  .el-select {
    width: 340px;
  }

  .submit {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
  }
</style>
