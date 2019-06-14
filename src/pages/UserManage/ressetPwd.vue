<template>
  <div class="ressetPwd" v-loading="loading">
    <el-form class="content" :model="userInfo"   :rules="rules"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="原始密码" prop="jpwd">
        <el-input v-model="userInfo.jpwd" placeholder="请输入原始密码" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="newpwd">
        <el-input v-model="userInfo.newpwd" placeholder="请输入新密码" class="disable-input"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="clickpwd">
        <el-input v-model="userInfo.clickpwd" placeholder="请输入确认密码" class="disable-input"></el-input>
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
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import https_f from 'http/suserManageApi'
  import Urls from '../../assets/models/baseUrl'
  const prefix = Urls.supplyChainUrl
  let that = null;
  export default {
    name: 'ressetPwd',
    props: [],
    data() {
      return {
        userobj:null,
        userInfo: {
          jpwd: '',
          newpwd: '',
          clickpwd:'',
        },
        loading: false,
        // 表单定义验证规则
        rules: {
          // 原始密码
          jpwd: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
          //确认密码
          clickpwd: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            {
              validator: function(rule, value, callback) {
                  if (that.userInfo.newpwd === value) {
                    callback();
                  } else {
                    callback(new Error('两次输入密码不一致'))
                  }
              },
              trigger: 'blur'
            }
          ],
          newpwd:[
            { required: true, message: '请输入新密码', trigger: 'blur' },
            {
              validator: function(rule, value, callback) {
                if (value.length < 6) {
                  callback(new Error('密码由6位字符串组成！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
        },
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      //根据不同的状态  弹出对应的  from 表单
      submitForm() {
        this.loading = true;
        let params = Object.assign({}, this.userInfo)
        let par = {
          id:this.userobj.id,
          password:params.jpwd
        }
        if (this.valiFromObj(par)) {
          https_f.valiuserpwd(par).then(data => {
            par.password = this.userInfo.newpwd;
            https_f.updateSuserObj(par).then(data => {
              this.loading = false;
              this.$message(`修改成功`);
              this.userInfo.jpwd = '';
              this.userInfo.newpwd = '';
              this.userInfo.clickpwd = '';
            }).catch(e => {
              this.$message(e)
              this.userInfo.jpwd = '';
              this.userInfo.newpwd = '';
              this.userInfo.clickpwd = '';
              this.loading = false;
            })
          }).catch(e => {
            this.userInfo.jpwd = '';
            this.$message(e)
            this.loading = false;
          })
        }else{
          return false;
        }
      },
      resetForm() {
        this.userInfo = {
          jpwd: '',
          newpwd: '',
          clickpwd:'',
        }, this.userobj = null;
      },
      valiFromObj(jsonobj) {
        if (this.userInfo.jpwd == null || this.userInfo.jpwd == undefined || this.userInfo.jpwd == '') {
          this.$message(`请输入原始密码`)
          this.loading = false;
          return false;
        }
        if (this.userInfo.newpwd == null || this.userInfo.newpwd == undefined || this.userInfo.newpwd == '') {
          this.$message(`请输入新密码`)
          this.loading = false;
          return false;
        } else {
          if ((this.userInfo.newpwd).length < 6) {
            this.$message(`密码最少由6位字符串组成`)
            this.loading = false;
            return false;
          }
        }
        if (this.userInfo.clickpwd == null || this.userInfo.clickpwd == undefined || this.userInfo.clickpwd == '') {
          this.$message(`请输入确认密码`)
          this.loading = false;
          return false;
        } else {
          if ((this.userInfo.clickpwd).length < 6) {
            this.$message(`密码最少由6位字符串组成`)
            this.loading = false;
            return false;
          }
        }

        if(this.userInfo.newpwd != this.userInfo.clickpwd){
          this.$message(`两次密码不一致`)
          this.loading = false;
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
      this.userInfo = {
          jpwd: '',
          newpwd: '',
          clickpwd:'',
      }, this.userobj = null;
      if(this.$route.query.row != null && this.$route.query.row != undefined){
        this.userobj = this.$route.query.row;
      }else{
        this.$message(`网络异常`)
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
