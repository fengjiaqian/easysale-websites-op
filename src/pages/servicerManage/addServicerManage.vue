<template>
  <div class="page" v-loading.fullscreen.lock="fullscreenLoading">
    <el-form class="content" :model="servicerDetailForm"
             ref="servicerDetailForm" label-width="100px"
             label-suffix="：" size="medium"
             :rules="rules">
      <el-form-item label="公司编号" prop="orgNo">
        <el-input v-model.trim="servicerDetailForm.orgNo" placeholder="请输入公司首字母"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="orgName">
        <el-input v-model.trim="servicerDetailForm.orgName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="公司类型" prop="orgType">
        <el-select v-model="servicerDetailForm.orgType" placeholder="请选择">
          <el-option label="一般公司" :value="1"></el-option>
          <el-option label="集团公司" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="办公地址" prop="orgAddress">
        <el-input v-model.trim="servicerDetailForm.orgAddress" placeholder="请输入省、市、区、街道"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contacterName">
        <el-input v-model.trim="servicerDetailForm.contacterName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard" v-if="pageType==`add`">
        <el-input v-model.trim="servicerDetailForm.idCard" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系号码" prop="contacterPhone">
        <el-input v-model.trim="servicerDetailForm.contacterPhone" placeholder="联系人手机将作为系统管理员账号"></el-input>
      </el-form-item>
      <el-form-item label="结算设置" prop="settlementState">
        <el-select v-model="servicerDetailForm.settlementState" placeholder="会员直接支付给服务商">
          <el-option label="不分账" :value="1"></el-option>
          <el-option label="平台分账给服务商" :value="2"></el-option>
          <el-option label="服务商分账给平台" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="servicerDetailForm.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开通服务" prop="serviceType">
        <el-checkbox-group v-model="servicerDetailForm.serviceType">
          <el-checkbox label="仓储服务" @change="handleCloseAllChange"></el-checkbox>
          <el-checkbox label="配送服务" @change="handleCheckAllChange"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('servicerDetailForm')">提交</el-button>
        <el-button @click="resetForm('servicerDetailForm')">重置</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import http from 'http/servicerApi'
  import {mapState} from 'vuex'
  const serviceOptions = ['仓储服务', '配送服务'];
  const serviceOne=['仓储服务'];
  export default {
    name: "addServicerManage",

    data() {
      return {
        title: `新增服务商`,
        pageType: `add`,
        servicerDetailForm: {
          contacterName: ``,//联系人
          idCard: ``,    //身份证号
          contacterPhone: ``,//联系人手机
          orgAddress: ``,//	办公地址
          orgType: 1,//公司类型，1表示一般公司、2表示集团公司
          orgName: ``,//	公司名称
          orgNo: ``,//	公司编号
          serviceType: [],//	开通服务(1:仓储服务，2:配送服务,3:仓储+配送)
          settlementState: 2,//	结算设置，1:不分账,2:平台分账给服务商,3:服务商分账给平台
          state: 1,//状态(1:启用,2:停用,3:作废)
        },
        fullscreenLoading: false
      }
    },
    activated() {
      if (this.$route.query.servicer) {
        this.pageType = `edit`
        this.title = `编辑服务商`
        this.servicerDetailForm = this.$route.query.servicer
        this.servicerDetailForm.serviceType =
          this.$route.query.servicer.serviceType === 1 ? [`仓储服务`] :
            this.$route.query.servicer.serviceType === 2 ? [`配送服务`] : [`仓储服务`, `配送服务`]
      } else {
        this.pageType = `add`
        this.servicerDetailForm = {
          contacterName: ``,//联系人
          contacterPhone: ``,//联系人手机
          orgAddress: ``,//	办公地址
          orgType: 1,//公司类型，1表示一般公司、2表示集团公司
          orgName: ``,//	公司名称
          orgNo: ``,//	公司编号
          serviceType: [],//	开通服务(1:仓储服务，2:配送服务,3:仓储+配送)
          settlementState: 2,//	结算设置，1:不分账,2:平台分账给服务商,3:服务商分账给平台
          state: 1,//状态(1:启用,2:停用,3:作废)
        }
      }
    },
    methods: {
      submitForm(formName) {
        let params = Object.assign({}, this.servicerDetailForm)
        params.optUserId = this.userInfo.userId
        //将serviceType从数组形式转换成枚举值
        if (params.serviceType.length === 2) {
          params.serviceType = 3
        } else if (params.serviceType.length === 1 && params.serviceType[0] === `仓储服务`) {
          params.serviceType = 1
        } else if (params.serviceType.length === 1 && params.serviceType[0] === `配送服务`) {
          params.serviceType = 2
        }
        this.$refs[formName].validate((valid) => {
          if (valid && this.pageType === `add`) {
            http.addServicer(params)
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
            http.updateServicer(params)
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
        this.$refs[formName] && this.$refs[formName].resetFields();
      },
      //选中配送服务，仓储服务一定选中；选中仓储，配送不一定选中
      handleCheckAllChange(val) {
        this.servicerDetailForm.serviceType = val ? serviceOptions : serviceOne;
      },
      handleCloseAllChange(val){
        this.servicerDetailForm.serviceType = val ? serviceOne :[] ;
      }
    },
    computed: {
      rules() {
        return {
          contacterName: [{required: true, message: '请输入联系人', trigger: 'blur'}],
          idCard: [{required: true, message: '请输入身份证号', trigger: 'blur'}],
          contacterPhone: [{required: true, message: '请输入联系人手机', trigger: 'blur'}],
          orgAddress: [{required: true, message: '请输入办公地址', trigger: 'blur'}],
          orgType: [{required: true, message: '请选择公司类型', trigger: 'change'}],
          orgName: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
          orgNo: [{required: true, message: '请输入公司编号', trigger: 'blur'}],
          settlementState: [{required: true, message: '请选择结算设置', trigger: 'change'}],
          state: [{required: true, message: '请选择状态', trigger: 'change'}],
          serviceType: [{type: 'array', required: true, message: '请至少开通一个服务', trigger: 'change'}],
        }
      },
      ...mapState(`user`, [`userInfo`])

    },
    watch: {},
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
  }

</style>
