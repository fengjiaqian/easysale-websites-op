<template>
  <div class="suserAdd" v-loading="loading">
    <el-form class="content" :model="suserInfo"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
      <el-form-item label="经销商名称" prop="name">
        <el-input v-model="suserInfo.name" placeholder="可选项/如已知可输入"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="suserInfo.phone" placeholder="请输入手机号码"  class="disable-input" ></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="suserInfo.password" placeholder="请输入登录密码"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="用户类型" prop="type">
        <el-select v-model="suserInfo.type" placeholder="目前只能选择经销商" @change="changeFrom">
          <el-option label="请选择" :value="0"></el-option>
          <el-option label="经销商" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="suserInfo.shopName" placeholder="请输入店铺名称"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="店铺描述" prop="instruction">
        <el-input v-model="suserInfo.instruction" placeholder="请输入店铺描述"  class="disable-input"></el-input>
      </el-form-item>


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
             <img @click="isDel(items)" :src="index"  class="avatar"  />
          </div>
        </el-upload>
      </el-form-item>
     <!-- <el-dialog :visible.sync="dialogVisible_img">
        <img width="100%" :src="suserInfo.logoIamgeUrls" >
      </el-dialog>-->

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
  export default {
    name: 'suserAdd',
    props: [],
    data() {
      return {
        img_names:[],
        img_url:[],
        img_msg:'只能上传jpg/png文件，且不超过3M',
        dialogVisible_img:false,
        upobject:{
          fileType:1
        },
        ismultiple:false,
        upLoadUrl:prefix+'/file/uploadProductImg',
        dialogImageUrl: '',
        dialogVisible: false,
        // 先写死 页面载入动态设置
        crrur_userid:6666666,
        title: `新增仓库`,
        pageType: `add`,
        suserInfo: {
          //店铺名称
          shopName:'',
          //手机号
          phone:'',
          //店铺logo
          logoIamgeUrls:'',
          //店铺描述
          instruction:'',
          //类型 默认0  带走1经销商
          type:'',
          //密码
          password:'',
          //名称
          name:'',
        },
        dealerList: [],
        productList: [],
        loading: false,
        //经销商  弹框
        dialogVisible:false
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
          this.img_names.splice(val,1)
          this.img_url.splice(val,1)
          console.log(JSON.stringify(this.img_names));
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
        console.log(JSON.stringify(fileList));
        let imgs_ = fileList;
        if(imgs_.length > 0){
          if(imgs_[0].status == "success"){
            if(imgs_[0].response.data == undefined){
              this.img_url.push(imgs_[0].response);
              this.suserInfo.logoIamgeUrls = imgs_[0].response
            }else{
              this.img_url.push(imgs_[0].response.data);
              this.suserInfo.logoIamgeUrls = imgs_[0].response.data
            }
        //    this.dialogVisible_img = true;
            this.img_names.push(imgs_[0].name)
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
        console.log("上传的时候:"+JSON.stringify(this.img_names));
        console.log("上传的时候:"+JSON.stringify(this.img_url));
        //上传完之后 清空组件缓存的上传信息
        this.$refs.upload.clearFiles();
      },
      //根据不同的状态  弹出对应的  from 表单
      changeFrom(val){
          //目前只处理 经销商
          if(val == 1){
            this.dialogVisible = true;
          }else{
            this.suserInfo.type = '';
            this.img_msg='只能上传jpg/png文件，且不超过3M';
            this.img_names=[];
            this.img_url = [];
          }
      },
      submitForm() {
        this.loading = true;
        let params = Object.assign({}, this.suserInfo)
        params.create_user = this.crrur_userid;
        params.update_user = this.crrur_userid;
        if(this.valiFromObj(params)){
          params.logoIamgeUrls = this.img_url;

          https_f.addUserAndDer(params).then(data => {
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
        }else{
          // this.$message(`请输入提示项`)
          this.loading = false;
        }
      },
      resetForm() {
        if (this.pageType === 'edit') {
        } else {
          this.suserInfo={
            //店铺名称
             shopName:'',
              //手机号
              phone:'',
              //店铺logo
              logoIamgeUrls:'',
              //店铺描述
              instruction:'',
              //类型 默认0  带走1经销商
              type:'',
              //密码
              password:'',
              //名称
              name:'',
          },
            this.img_msg='只能上传jpg/png文件，且不超过3M';
           this.img_names=[];
          this.img_url = [];
        }
      },
      valiFromObj(jsonobj){
        // 验证数据合法性
        if (jsonobj.name == null || jsonobj.name == undefined || jsonobj.name == '') {
          this.$message(`请输入经销商名称`)
          return false;
        }
        if (jsonobj.phone == null || jsonobj.phone == undefined || jsonobj.phone == '') {
          this.$message(`请输入手机号`)
          return false;
        }else{
          if(!(/^1[34578]\d{9}$/.test(jsonobj.phone))){
            this.suserInfo.phone = '';
            this.$message("手机号码有误，请重填");
            return false;
          }else{
            let phonearr = {
              phone:this.suserInfo.phone
            }
            https_f.suser_List(phonearr).then(data => {
              this.loading = false
              let suserList = data.dataList;
              try {
                if(suserList.length <= 0){
                  return true;
                }else{
                  this.$message(`手机号码已存在`)
                  this.suserInfo.phone = '';
                  this.loading = false
                  return false;
                }
              }catch(e){
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
        }else{
          if((jsonobj.password).length < 6 ){
            this.$message(`密码最少由6位字符串组成`)
            return false;
          }
        }

        if(this.suserInfo.type ==   '' || this.suserInfo.type == null || this.suserInfo.type == undefined){
          this.$message(`请选择用户类型`)
          return false;
        }
        if(jsonobj.shopName == null || jsonobj.shopName == undefined || jsonobj.shopName == ''){
          this.$message(`请输入店铺名称`)
          return false;
        }
        if(jsonobj.instruction == null || jsonobj.instruction == undefined || jsonobj.instruction == ''){
          this.$message(`请输入店铺描述`)
          return false;
        }

        if(this.img_names.length <= 0 && this.img_url.length <= 0 ){
          this.$message(`请上传店铺logo`)
          return false;
        }
        return true;
      },
      //
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    mounted:function(){
      this.suserInfo={
        //店铺名称
        shopName:'',
        //手机号
        phone:'',
        //店铺logo
        logoIamgeUrls:'',
        //店铺描述
        instruction:'',
        //类型 默认0  带走1经销商
        type:'',
        //密码
        password:'',
        //名称
        name:'',
      }, this.img_msg='只能上传jpg/png文件，且不超过3M';
      this.img_names=[];
      this.img_url = [];
      //获取当前用户ID   赋值
      if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
        let  userobj  =sessionStorage.getItem(`userInfo`);
        this.crrur_userid = (JSON.parse(userobj)).id;
      }else{
        //用户信息获取失败
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
  }  .avatar-uploader .el-upload {
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
    display:inline;
  }
  .imgsclass{
    white-space:nowrap;
  }


</style>
