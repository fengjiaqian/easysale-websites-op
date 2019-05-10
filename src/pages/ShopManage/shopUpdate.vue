<template>
  <div class="shopUpdate"  v-loading="loading">
    <el-form class="content" :model="shopInfo"   :rules="rules"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="shopInfo.shopName" placeholder="请输入店铺名称"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="shopInfo.phone" placeholder="请输入手机号码" disabled="disabled" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="店铺地址" prop="address">
        <el-input v-model="shopInfo.address" placeholder="请输入店铺地址"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="shopInfo.state" disabled="disabled">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">修改</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>
<script>
  import https_f from 'http/shopManageApi'
  export default {
    name: 'shopUpdate',
    props: [],
    data() {
      return {
        shopInfo: {
          id:0,
          shopName:'',
          phone:'',
          address:'',
          state:null,
        },
        alertInfoState:false,
        loading: false,
        // 表单定义验证规则
        rules: {
          // 姓名
          shopName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
          address: [{ required: true, message: '请输入店铺地址', trigger: 'blur' }],
        },
      }
    },
    components: {
    },
    methods: {
      param_handle(arr){
        let newarr = arr;
        delete newarr['state'];
        delete newarr['phone'];
        delete newarr['updateTime'];
        delete newarr['createTime'];
        delete newarr['shopType'];
        return newarr;
      },
      // 确定修改
      ensureCharge(){
        this.alertInfoState = false;
        this.loading = true;
        let params = Object.assign({}, this.shopInfo)
        if(this.valiFromObj(params)){
          let new_ar =  this.param_handle(params);
          https_f.shopupdtae(new_ar).then(data => {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          }).catch(e => {
            this.$message("修改失败!");
          })
          this.loading = false;
        }else{
          this.loading = false;
        }
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
      valiFromObj(jsonobj){
        //  验证数据合法性
        if (jsonobj.shopName == null || jsonobj.shopName == undefined || jsonobj.shopName == '') {
          this.$message(`请输入店铺名称`)
          return false;
        }
        if (jsonobj.address == null || jsonobj.address == undefined || jsonobj.address == '') {
          this.$message(`请输入店铺地址`)
          return false;
        }
        return true;
      },
    },
    computed: {
    },
    mounted:function(){
      if(this.$route.query.row != null && this.$route.query.row != undefined){
        this.shopInfo = this.$route.query.row;
        console.log(JSON.stringify(this.shopInfo));
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
