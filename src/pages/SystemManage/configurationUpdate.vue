<template>
  <div class="configurationUpdate"  v-loading="loading">
    <el-form class="content" :model="configurationInfo"   :rules="rules"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="键" prop="contentKey">
        <el-input v-model="configurationInfo.contentKey" placeholder="请输入键" class="disable-input"></el-input>
      </el-form-item>
      <el-form-item label="值" prop="contentValue">
        <el-input v-model="configurationInfo.contentValue" placeholder="请输入值" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="contentType">
        <el-select v-model="configurationInfo.contentType" placeholder="请选择">
          <el-option label="字符串" :value="0"></el-option>
          <el-option label="数字" :value="1"></el-option>
          <el-option label="JSON" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构号" prop="orgId">
        <el-input type="number" v-model="configurationInfo.orgId" placeholder="请输入机构号" class="disable-input"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea":rows="3" v-model="configurationInfo.remark" placeholder="请输入备注" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">修改</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>
<script>
  import https_f from 'http/sysManageApi'
  import {mapState, mapMutations} from 'vuex'
  let that;
  export default {
    name: 'configurationUpdate',
    props: [],
    data() {
      return {
        configurationInfo: {
          contentKey: '',
          contentValue: '',
          orgId:'',
          remark:'',
          contentType:'',
        },
        alertInfoState:false,
        loading: false,
        // 表单定义验证规则
        rules: {
          // 键
          contentKey: [{ required: true, message: '请输入键', trigger: 'blur' }],
          // 值
          contentValue: [{ required: true, message: '请输入值', trigger: 'blur' }],
          //类型
          contentType: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        },
      }
    },
    components: {
    },
    methods: {
      // 确定修改
      ensureCharge(){
        this.alertInfoState = false;
        this.loading = true;
        let params = Object.assign({}, this.configurationInfo)
          https_f.saveOrUpdate(params).then(data => {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          }).catch(e => {
            this.$message("修改失败!");
          })
          this.loading = false;
        this.$router.go(-1);
      },
      submitForm() {
        //弹出窗口
        this.$confirm('确定要修改当前数据吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行
          this.ensureCharge();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取变更'
          });
        });
      },

    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    mounted:function(){
      that =  this;
      if(this.$route.query.row != null && this.$route.query.row != undefined){
        this.configurationInfo = this.$route.query.row;
        console.log(JSON.stringify(this.configurationInfo));
      }else{
        this.$message(`网络异常`)
      }
    }
  }
</script>
<style lang="stylus">
  .suserUpdate {
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
  .avatar {
    width: 178px;
    height: 178px;
    display: inline;
    border-radius: 15px;
  }

  .imgsclass {
    white-space: nowrap;
    position: relative;
  }
</style>
