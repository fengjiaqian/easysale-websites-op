<template>
  <div class="suserAdd" v-loading="loading">
    <el-form class="content" :model="suserInfo"   :rules="rules"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="员工名称" prop="wxNickName">
        <el-input v-model="suserInfo.wxNickName" placeholder="请输入员工名称" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="suserInfo.phone" placeholder="请输入手机号码" class="disable-input"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="suserInfo.password" placeholder="请输入登录密码" class="disable-input"></el-input>
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
    name: 'suserAdd',
    props: [],
    data() {
      return {
        suserInfo: {
          wxNickName: '',
          phone: '',
          userType:0,
          password: '',
          crrur_userid:6666,
        },
        loading: false,
        // 表单定义验证规则
        rules: {
          // 姓名
          wxNickName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          // 手机号码
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            {
              validator: function(rule, value, callback) {
                let MobileRegex = /^(13[0-9]|147|15[0-9]|17[0-9]|18[0-9])\d{8}$/
                if (!MobileRegex.test(value)) {
                  callback(new Error('手机号码格式不正确！'))
                } else {
                  let phonearr = {
                    phone: value
                  }
                  https_f.suser_List(phonearr).then(data => {
                    let suserList = data.dataList;
                    try {
                      if (suserList.length <= 0) {
                        callback();
                      } else {
                        callback(new Error('手机号码已存在！'))
                        that.suserInfo.phone = '';
                      }
                    } catch (e) {
                      callback(new Error('手机号码验证异常！'))
                      that.suserInfo.phone = '';
                    }
                  }).catch(e => {
                    callback(new Error('手机号码验证异常！'))
                    that.suserInfo.phone = '';
                  })
                }
              },
              trigger: 'blur'
            }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
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
        let params = Object.assign({}, this.suserInfo)
        params.create_user = this.crrur_userid;
        params.update_user = this.crrur_userid;
        if (this.valiFromObj(params)) {
          params.state = 1;
          https_f.addSuserObj(params).then(data => {
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
      },
      resetForm() {
        this.suserInfo = {
          wxNickName: '',
          phone: '',
          userType:0,
          password: '',
          crrur_userid:6666,
        }
      },
      valiFromObj(jsonobj) {
        if (jsonobj.wxNickName == null || jsonobj.wxNickName == undefined || jsonobj.wxNickName == '') {
          this.$message(`请输入名称`)
          return false;
        }
        if (jsonobj.phone == null || jsonobj.phone == undefined || jsonobj.phone == '') {
          this.$message(`请输入手机号`)
          return false;
        } else {
          if (!(/^1[34578]\d{9}$/.test(jsonobj.phone))) {
            this.suserInfo.phone = '';
            this.$message("手机号码有误，请重填");
            return false;
          } else {
            let phonearr = {
              phone: this.suserInfo.phone
            }
            https_f.suser_List(phonearr).then(data => {
              this.loading = false
              let suserList = data.dataList;
              try {
                if (suserList.length <= 0) {
                  return true;
                } else {
                  this.$message(`手机号码已存在`)
                  this.suserInfo.phone = '';
                  this.loading = false
                  return false;
                }
              } catch (e) {
                this.$message(`手机号码验证异常`)
                this.suserInfo.phone = '';
                this.loading = false
                return false;
              }
            }).catch(e => {
              this.$message(`手机号码验证异常`)
              this.suserInfo.phone = '';
              this.loading = false
              return false;
            })
          }
        }
        if (jsonobj.password == null || jsonobj.password == undefined || jsonobj.password == '') {
          this.$message(`请输入密码`)
          return false;
        } else {
          if ((jsonobj.password).length < 6) {
            this.$message(`密码最少由6位字符串组成`)
            return false;
          }
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
      this.suserInfo = {
        wxNickName: '',
        phone: '',
        userType:0,
        password: '',
        crrur_userid:6666,
      }
      if (sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined) {
        let userobj = sessionStorage.getItem(`userInfo`);
        this.crrur_userid = (JSON.parse(userobj)).id;
      } else {
        this.crrur_userid = 0;
        this.$message("网络异常获取用户信息失败!");
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
