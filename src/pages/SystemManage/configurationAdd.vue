<template>
  <div class="shopAdd" v-loading="loading">
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
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
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
    name: 'configurationAdd',
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
      //根据不同的状态  弹出对应的  from 表单
      submitForm() {
        this.loading = true;
        console.log(this.configurationInfo);
        console.log(this.userInfo);
        let params = Object.assign({}, this.configurationInfo)
        if (this.valiFromObj(params)) {
          params.createUser = this.userInfo.id;
          console.log(params);
          https_f.saveOrUpdate(params).then(data => {
            this.$message({
              type: 'success',
              message: '新增成功'
            });
            this.loading = false;
            this.resetForm();
          }).catch(e => {
            this.$message(`新增失败`)
            this.resetForm();
            this.loading = false;
          })
        } else {
          this.loading = false;
        }
        this.$router.go(-1);
      },
      resetForm() {
        this.configurationInfo= {
          contentKey: '',
          contentValue: '',
          orgId:'',
          remark:'',
          contentType:'',
        }
      },
      valiFromObj(jsonobj) {
        if (jsonobj.contentKey == null || jsonobj.contentKey == undefined || jsonobj.contentKey == '') {
          this.$message(`请输入键`)
          return false;
        }
        if (jsonobj.contentValue == null || jsonobj.contentValue == undefined || jsonobj.contentValue == '') {
          this.$message(`请输入值`)
          return false;
        }
        return true;
      },
      //
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    mounted: function () {
      that =  this;
      this.shopInfo= {
        shopName: '',
        phone: '',
        address:'',
      }
    }
  }
</script>
<style lang="stylus">
  .suserAdd {
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border 10px;
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
