<template>
  <div class="shopAdd" v-loading="loading">
    <el-form class="content" :model="shopInfo"   :rules="rules"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="shopInfo.shopName" placeholder="请输入店铺名称" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="shopInfo.phone" placeholder="请输入手机号码" class="disable-input"></el-input>
      </el-form-item>
      <el-form-item label="店铺地址" prop="address">
        <el-input v-model="shopInfo.address" placeholder="请输入店铺地址" class="disable-input"></el-input>
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

  import https_f from 'http/shopManageApi'
  let that;
  export default {
    name: 'shopAdd',
    props: [],
    data() {
      return {
        shopInfo: {
          shopName: '',
          phone: '',
          address:'',
        },
        loading: false,
        // 表单定义验证规则
        rules: {
          // 姓名
          shopName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
          // 手机号码
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            {
              validator: function(rule, value, callback) {
                let MobileRegex = /^(13[0-9]|147|15[0-9]|17[0-9]|18[0-9])\d{8}$/
                if (!MobileRegex.test(value)) {
                  callback(new Error('手机号码格式不正确！'))
                }
              },
              trigger: 'blur'
            }
          ],
          address: [{ required: true, message: '请输入店铺地址', trigger: 'blur' }],
        },
      }
    },
    components: {
    },
    methods: {
      //根据不同的状态  弹出对应的  from 表单
      submitForm() {
        this.loading = true;
        let params = Object.assign({}, this.shopInfo)
        if (this.valiFromObj(params)) {
          https_f.shopadd(params).then(data => {
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
        this.shopInfo= {
          shopName: '',
            phone: '',
          address:'',
        }
      },
      valiFromObj(jsonobj) {
        if (jsonobj.shopName == null || jsonobj.shopName == undefined || jsonobj.shopName == '') {
          this.$message(`请输入店铺名称`)
          return false;
        }
        if (jsonobj.phone == null || jsonobj.phone == undefined || jsonobj.phone == '') {
          this.$message(`请输入手机号`)
          return false;
        } else {
          if (!(/^1[34578]\d{9}$/.test(jsonobj.phone))) {
            this.shopInfo.phone = '';
            this.$message("手机号码有误，请重填");
            return false;
          }
        }
        if (jsonobj.address == null || jsonobj.address == undefined || jsonobj.address == '') {
          this.$message(`请输入店铺地址`)
          return false;
        }
        return true;
      },
      //
    },
    computed: {
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
