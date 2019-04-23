<template>
  <div class="suserUpdate"  v-loading="loading">
    <el-form class="content" :model="suserInfo"   :rules="rules"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="用户名称" prop="wxNickName">
        <el-input v-model="suserInfo.wxNickName" placeholder="可选项"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="suserInfo.phone" placeholder="请输入手机号码" disabled="disabled" class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="suserInfo.userType" disabled="disabled" placeholder="请选择用户类型">
          <el-option label="经销商" :value="1"></el-option>
          <el-option label="销售人员" :value="2"></el-option>
          <el-option label="终端" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="suserInfo.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <div v-if="suserInfo.userType == 1">
        <el-form-item label="经销商LOGO:" prop="logoIamgeUrls">
          <el-upload :action="upLoadUrl" :multiple="ismultiple"  :data="upobject"
                     ref="upload"
                     :show-file-list="false"
                     :on-success="upLoadSuccess"
                     :before-upload="beforeUpload"
          >
            <el-button @click="uploadPic()" size="small" type="primary">点击上传</el-button>
            &nbsp;&nbsp;&nbsp;<span style="color: red;" class="el-upload__tip" slot="tip">{{img_msg}}</span>
            <div class="el-upload__tip imgsclass" slot="tip"  v-for="(index, items) in img_url">
              <button @click="isDel(items)" style="position:absolute;left: 152px;top:0;border-radius: 6px;">X</button>
              <img  :src="index" class="avatar"/>
            <!--  <img @click="isDel(items)" :src="index"  class="avatar"  />-->
            </div>
          </el-upload>
        </el-form-item>
      </div>


      <el-form-item>
        <el-button type="primary" @click="submitForm()">修改</el-button>
        <!--       <el-button @click="resetForm()">重置</el-button>-->
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
  export default {
    name: 'suserUpdate',
    props: [],
    data() {
      return {
        img_url:[],
        img_msg:'只能上传jpg/png文件，且不超过3M',
        upobject:{
          fileType:1
        },
        ismultiple:false,
        upLoadUrl:prefix+'/file/uploadProductImg',
        //页面载入 动态设置当前操作人ID
        crrur_userid:6666666,
        suserInfo: {
          id:0,
          wxNickName:'',
          phone:'',
          userType:1,
          update_user:0,
          state:6
        },
        alertInfoState:false,
        alertInfo:{
          status:0,
        },
        dealerList: [],
        productList: [],
        loading: false,
        // 表单定义验证规则
        rules: {
          // 姓名
          wxNickName: [{ required: true, message: '用户昵称是必填项', trigger: 'blur' }],
        },
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      //删除图片
      isDel(val){
        this.$confirm('确定要删除当前图片吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //在下标处开始删除,删除一位
          this.img_url.splice(val,1)
          console.log(JSON.stringify(this.img_url));
        }).catch(() => {
        });
      },
      beforeUpload(file) {
        //上传支持格式（.doc/.docx/.pdf/.rar/.zip/.xls/.xlsx/.ppt）
        let reg = /\.(jpg|jpeg|png)$/i;
        if (!reg.test(file.name)) {
          this.$message({
            showClose: true,
            message: '上传支持格式（.jpg/.jpeg/.png）',
            type: 'error'
          });
          return false;
        }

        else if (file.size > 500 * 1024) {
          this.$message({
            showClose: true,
            message: '文件大小上限为500K',
            type: 'error'
          });
          return false;
        }
      },
      // 点击上传图
      uploadPic () {
        // this.index = index;
      },
//这个是对于logo1上传成功的钩子函数，因此logo2上传成功之后的钩子函数与这个同理
      upLoadSuccess(response, file, fileList) {
        let imgs_ = fileList;
        if(imgs_.length > 0){
          if(imgs_[0].status == "success"){
            if(imgs_[0].response.data == undefined){
              this.img_url.push(imgs_[0].response);
            }else{
              this.img_url.push(imgs_[0].response.data);
            }
          }else{
            //上传失败清空上传列表
            this.$message({
              showClose: true,
              message: "上传失败",
              type: 'error'
            });
          }
        }else{
          //上传失败清空上传列表
          this.$message({
            showClose: true,
            message: "上传失败",
            type: 'error'
          });
        }
        console.log("上传的时候:"+JSON.stringify(this.img_url));
        //上传完之后 清空组件缓存的上传信息
        this.$refs.upload.clearFiles();
      },
      param_handle(arr){
        let newarr = arr;
        delete newarr['phone'];
        delete newarr['userType'];
        delete newarr['createTime'];
        return newarr;
      },
      // 确定修改
      ensureCharge(){
        this.alertInfoState = false;
        this.loading = true;
        let params = Object.assign({}, this.suserInfo)
        params.update_user = this.crrur_userid;
        if(this.valiFromObj(params)){
          let new_ar =  this.param_handle(params);
          if(this.img_url.length > 0){
            new_ar.logoIamgeUrls = this.img_url
          }
          https_f.updateSuserObj(new_ar).then(data => {
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
      resetForm() {
          this.suserInfo={
            id:this.suserInfo.id,
            wxNickName:this.suserInfo.wxNickName,
            phone:this.suserInfo.phone,
            userType:this.suserInfo.userType,
            update_user:0,
            state:6
          }
        this.img_msg='只能上传jpg/png文件，且不超过3M';
        this.img_url = [];
      },
      valiFromObj(jsonobj){
        //  验证数据合法性
        if (jsonobj.phone == null || jsonobj.phone == undefined || jsonobj.phone == '') {
          this.$message(`请输入手机号码`)
          return false;
        }
        if (jsonobj.wxNickName == null || jsonobj.wxNickName == undefined || jsonobj.wxNickName == '') {
          this.$message(`请输入昵称`)
          return false;
        }
        if (jsonobj.state == 6) {
          this.$message(`网络异常`)
          return false;
        }
        if(this.img_url.length <= 0){
          this.$message(`请上传LOGO`)
          return false;
        }
        return true;
      },
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    mounted:function(){
      this.img_msg='只能上传jpg/png文件，且不超过3M';
      this.img_url = [];
      if(this.$route.query.row != null && this.$route.query.row != undefined){
          this.loading = true;
          let param_ = {
            id: this.$route.query.row.id,
            userType:this.$route.query.row.userType
          }
          https_f.getSuserObj(param_).then(data => {
            this.loading = false;
            this.suserInfo = data;
            if(data.logoIamgeUrls != undefined && (data.logoIamgeUrls).length>0){
              this.img_url = data.logoIamgeUrls;
            }
          }).catch(e => {
            this.$message(`网络异常`)
            this.loading = false;
          })
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
