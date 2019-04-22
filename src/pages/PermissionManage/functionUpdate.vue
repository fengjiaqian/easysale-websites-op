<template>
  <div class="functionUpdate"  v-loading="loading">
    <el-form class="content" :model="functionInfo" :rules="rules"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">

      <el-form-item label="系统类型" prop="systemType">
        <el-select v-model="functionInfo.systemType" placeholder="请选择系统类型">
          <el-option label="小程序" :value="1"></el-option>
          <el-option label="PC端" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="functionInfo.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="功能名称" prop="name">
        <el-input v-model="functionInfo.name" placeholder="请输入功能名称"  class="disable-input"></el-input>
      </el-form-item>

      <el-form-item label="功能url" prop="url" >
        <el-input v-model="functionInfo.url" placeholder="请输入功能url"  class="disable-input"></el-input>
      </el-form-item>

   <!--   <el-form-item label="功能图标" prop="imageUrl" >
        <el-input v-model="functionInfo.imageUrl" placeholder="请输入功能图标"  class="disable-input"></el-input>
      </el-form-item>-->

      <el-form-item label="功能图标:" prop="imageUrl">
        <el-upload :action="upLoadUrl" :multiple="ismultiple"  :data="upobject"
                   ref="upload"
                   :show-file-list="false"
                   :on-success="upLoadSuccess"
                   :before-upload="beforeUpload"
        >
          <el-button @click="uploadPic()" size="small" type="primary">点击上传</el-button>
          &nbsp;&nbsp;&nbsp;<span style="color: red;" class="el-upload__tip" slot="tip">{{img_msg}}</span>
          <div class="el-upload__tip imgsclass" slot="tip" v-if="isshowimg">
            <img @click="isDel" :src="functionInfo.imageUrl"  class="avatar"  />
          </div>

        </el-upload>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
 <!--       <el-button @click="resetForm()">重置</el-button>-->
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

    <!--设置费用弹框-->
    <el-dialog
      :title="alertInfo.status==0?'提示信息':'提示信息'"
      :visible.sync="alertInfoState"
      width="30%"
      :append-to-body="true"
    >
      <el-form label-width="148px" class="el-form-product">
        <el-form-item >
          <span>您确定要修改吗!</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alertInfoState = false">取 消</el-button>
        <el-button type="primary" @click="ensureCharge">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>
<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import Urls from '../../assets/models/baseUrl'
  const prefix = Urls.supplyChainUrl
  //引入 vue 后台发请求api接口
  import https_f from 'http/functionManageApi'

  export default {
    name: 'functionUpdate',
    props: [],
    data() {
      return {
        isshowimg:true,
        img_names:'',
        img_msg:'只能上传jpg/png文件，且不超过3M',
        ck_types:1,
        upobject:{
          fileType:1
        },
        ismultiple:false,
        upLoadUrl:prefix+'/file/uploadProductImg',
        //当前操作人的ID  页面载入的时候 动态设置
        crrur_userid:6666666,
        // initAddressStr: ``,
        functionInfo: {
          id:0,
          parentId:0,	 //父级节点
          wholeId:0,	 //父节点wholeId
          type:3,	// 功能类型（1：模型 2：菜单 3：功能）
          systemType:1,//系统类型（1：小程序 2：pc端）
          name:'', //功能名称
          url:'',//链接
          imageUrl:'',//      图标
          state:1,//状态（0:停用 1：启用）
          createUser:'',//	创建人
          updateUser:'',//更新人即创建人
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
          name: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
          url: [{ required: true, message: '请输入功能url', trigger: 'blur' }],
        },
      }
    },
    components: {
      AdminCitySelector
    },
    //页面新加的方法
    methods: {
      //删除图片
      isDel(val){
        this.$confirm('确定要删除当前图片吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isshowimg = false;
          //在下标处开始删除,删除一位
          this.img_names = '';
          this.img_url = '';
          this.functionInfo.imageUrl = '';
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
        // console.log(JSON.stringify(fileList));
        let imgs_ = fileList;
        if(imgs_.length > 0){
          if(imgs_[0].status == "success"){
            if(imgs_[0].response.data == undefined){
              this.functionInfo.imageUrl  = imgs_[0].response;
            }else{
              this.functionInfo.imageUrl =imgs_[0].response.data;
            }
            //    this.dialogVisible_img = true;
            this.img_names=imgs_[0].name
            this.isshowimg = true;
          }else{
            //上传失败清空上传列表
            this.$message({
              showClose: true,
              message: "上传失败",
              type: 'error'
            });
            this.isshowimg = false;
          }
        }else{
          //上传失败清空上传列表
          this.$message({
            showClose: true,
            message: "上传失败",
            type: 'error'
          });
          this.isshowimg = false;
        }
        //上传完之后 清空组件缓存的上传信息
        this.$refs.upload.clearFiles();
      },
      //处理不需要传递到后台的参数
      param_handle(arr){
        let newarr = arr;
        delete newarr['parentId'];
        delete newarr['wholeId'];
        delete newarr['createUser'];
        delete newarr['parentId'];
        delete newarr['parentId'];
        // newarr.update_user = newarr.updateUser;
        // delete newarr['updateUser'];
        return newarr;
      },
      // 确定修改
      ensureCharge(){
        this.alertInfoState = false;
        // console.log(1231);
        this.loading = true;
        let params = Object.assign({}, this.functionInfo)
        params.createUser = this.crrur_userid;
        params.updateUser = this.crrur_userid;
        if(this.valiFromObj(params)){
          let new_ar =  this.param_handle(params);
          https_f.updateFuctionObj(new_ar).then(data => {
            this.$message({
              type: 'success',
              message: '修改成功能'
            });
          }).catch(e => {
            this.$message("修改失败!");
          })
          this.loading = false;
        }else{
          //alert("存在不合法数据!");
          this.loading = false;
        }
      },
      //弹出确认窗口
      submitForm() {
        // this.alertInfoState = true;
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
      //刷新表单
      resetForm() {
        // console.log(this.pageType)
        if (this.pageType === 'edit') {
        } else {
          this.functionInfo={
            parentId:0,	 //父级节点
            wholeId:0,	 //父节点wholeId
            type:3,	// 功能类型（1：模型 2：菜单 3：功能）
            systemType:1,//系统类型（1：小程序 2：pc端）
            name:'', //功能名称
            url:'',//链接
            imageUrl:'',//      图标
            state:1,//状态（0:停用 1：启用）
            createUser:'',//	创建人
            updateUser:''//更新人即创建人
          }
        }
      },
      //简单 验证数据合法性
      valiFromObj(jsonobj){
        if (jsonobj.name == null || jsonobj.name == undefined || jsonobj.name == '') {
          this.$message(`请输入功能名称`)
          return false;
        }
        if (jsonobj.url == null || jsonobj.url == undefined || jsonobj.url == '') {
          this.$message(`请输入功能路径`)
          return false;
        }
        return true;
      },
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    // 页面载入 触发
    mounted:function(){
      //进来之后刷新表单  防止页面缓存
      this.resetForm();
      //获取编辑修改的  功能ID
      let pid_ = this.$route.query.id;
      if(pid_.length > 0) {
        this.loading = true;
        let param_ = {
          id: pid_+""
        }
        https_f.getFunctionObj(param_).then(data => {
          let objs = data.dataList;
          if (objs.length == 1) {
            this.functionInfo = objs[0];
          } else {
            this.functionInfo = null;
            this.$message(`网络异常`)
          }
          this.loading = false;
          // 获取当前用户ID 设置当前操作人ID
          if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
            let  userobj  =sessionStorage.getItem(`userInfo`);
            this.crrur_userid = (JSON.parse(userobj)).id;
          }else{
            //用户信息获取失败
            this.$message("网络异常获取用户信息失败!");
          }
        }).catch(e => {
          this.$message(`网络异常`)
          this.loading = false;
        })
      }else{
        this.$message(`缺省功能ID网络异常`)
      }
    }
  }
</script>

<style lang="stylus">
  .productAdd {
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
</style>
