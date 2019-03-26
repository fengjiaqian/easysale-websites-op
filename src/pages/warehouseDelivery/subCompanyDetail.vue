<template>

  <div>
    <div class="block-box" v-loading="loading">
      <h4>公司信息</h4>
      <el-row>
        <el-col :span="8">子公司ID：{{detailList.id}}</el-col>
        <el-col :span="8">子公司名称：{{detailList.orgName}}</el-col>
        <el-col :span="8">状态：
          <span v-if="detailList.state==1">启用</span>
          <span v-else>停用</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">所在城市：{{detailList.city}}</el-col>
        <el-col :span="8">联系人名称：{{detailList.contacterName}}</el-col>
        <el-col :span="8">联系人手机：{{detailList.contacterPhone}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">组织机构地址：{{detailList.orgAddress}}</el-col>
        <el-col :span="8">所在省份：{{detailList.province}}</el-col>
        <el-col :span="8">组织机构编号：{{detailList.orgNo}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">父公司Id：{{detailList.parentOrgId}}</el-col>
        <el-col :span="8">组织机构级别：
          <span v-if="detailList.orgClass==1">一级</span>
          <span v-if="detailList.orgClass==2" e>二级</span>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
  import http from 'http/subCompanyApi';

  export default {
    name: "subCompanyDetail",
    data() {
      return {
        orgId: '',
        detailList: [],
        loading:true
      }
    },
    methods: {
      //查找一个子公司
      findOneCompany() {
        let {orgId} = this;
        http.findOneCompany({orgId}).then(data => {
          this.detailList = data;
          this.loading=false
        }).catch(e => {
          console.log(e)
        })
      }
    },
    mounted() {
      if (this.$route.query.id) {
        this.orgId = this.$route.query.id;
        this.findOneCompany();
      }

    }
  }
</script>

<style lang="stylus" scoped>
  .header {
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .block-box {
    height 250px;
    width 80%;
    .el-row {
      margin-top 27px
    }
  }

  .el-col {
    font-size: 14px
  }
</style>
