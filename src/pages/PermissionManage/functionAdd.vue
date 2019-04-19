<template>
  <div class="productAdd" v-loading="loading">
    <el-form class="content" :model="functionInfo"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             style="width:50%">
     <!-- <el-form-item label="父级WholeId" prop="parentWholeId">
        <el-input v-model="functionInfo.parentWholeId" placeholder="请输入父级节点WholeId"  class="disable-input"></el-input>
      </el-form-item>-->

      <el-form-item label="功能类型" prop="type">
        <el-select v-model="functionInfo.type" placeholder="请选择功能类型"  @change="typechange">
          <el-option label="模块" :value="1" ></el-option>
          <el-option label="菜单" :value="2"></el-option>
          <el-option label="功能" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="请选择模块" v-if="showPrise_1">
        <el-select v-model="model_arrselect" placeholder="请选择">
          <el-option
            v-for="item in model_arr"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="请选择菜单" v-if="showPrise_2">
        <el-select v-model="menu_arrselect" placeholder="请选择">
          <el-option
            v-for="item in menu_arr"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

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


      <el-form-item label="功能图标:" prop="imageUrl">
        <el-upload :action="upLoadUrl" :multiple="ismultiple"  :data="upobject"
                   ref="upload"
                   :show-file-list="false"
                   :on-success="upLoadSuccess"
                   :before-upload="beforeUpload"
        >
          <el-button @click="uploadPic()" size="small" type="primary">点击上传</el-button>
          &nbsp;&nbsp;&nbsp;<span style="color: red;" class="el-upload__tip" slot="tip">{{img_msg}}</span>
          <div class="el-upload__tip imgsclass" slot="tip" v-if="isshowimg" >
            <img @click="isDel" :src="functionInfo.imageUrl"  class="avatar"  />
          </div>

        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('functionInfo')">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'

  //引入 vue 后台发请求api接口
  import https_f from 'http/functionManageApi'

  import Urls from '../../assets/models/baseUrl'
  const prefix = Urls.supplyChainUrl
  export default {
    name: 'functionAdd',
    props: [],
    data() {
      return {
        isshowimg:false,
        img_names:'',
        img_msg:'只能上传jpg/png文件，且不超过3M',
        ck_types:1,
        upobject:{
          fileType:1
        },
        ismultiple:false,
        upLoadUrl:prefix+'/file/uploadProductImg',
        //控制  模型 菜单下拉选 隐藏显示
        showPrise_1:false,
        showPrise_2:false,
        parentId_show:'disabled',
        crrur_userid:6666666,
        title: `新增仓库`,
        pageType: `add`,
        // initAddressStr: ``,
        //控制  模型  菜单下拉选的 值
        model_arr:[],
        model_arrselect:'',
        menu_arrselect:'',
        menu_arr:[],
        functionInfo: {
          parentId:0,	 //父级节点
        //  parentWholeId:0,	 //父节点wholeId
          type:1,	// 权限类型（1：模型 2：菜单 3：功能）
          systemType:1,//系统类型（1：小程序 2：pc端）
          name:'', //权限名称
          url:'',//链接
          imageUrl:'',//      图标
          state:1,//状态（0:停用 1：启用）
          createUser:'',//	创建人
          updateUser:'',//更新人即创建人
        },
        dealerList: [],
        productList: [],
        loading: false
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
          this.img_names = '';
          this.img_url = '';
          this.functionInfo.imageUrl = '';
          this.isshowimg = false;
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
        console.log("上传的时候:"+JSON.stringify(this.img_names));
        console.log("上传的时候:"+JSON.stringify(this.img_url));
        //上传完之后 清空组件缓存的上传信息
        this.$refs.upload.clearFiles();
      },
      //动态触发 根据选择的类型 拉去对应类型上级数据
      typechange(val){
        if(val > 1){
          let params = {
            type:0
          }
          if(val == 2){
            this.model_arr = [];
            params.type = 1;
          }else{
            params.type = 2;
          }
          https_f.getFunctionObj(params).then(data => {
            if(val == 2){
              //如果选择的是 菜单  显示模型下拉选   隐藏 菜单下拉选 清空菜单下拉选
              this.model_arr = data.dataList;
              this.showPrise_1 = true;
              this.showPrise_2 = false;
              this.menu_arr = [];
              this.ck_types = 2;
            }else if(val == 3){
              //如果选择的是 功能   显示模型 菜单下拉选
              this.menu_arr = data.dataList;
              this.showPrise_1 = true;
              this.showPrise_2 = true;
              this.ck_types = 3;
            }
          }).catch(e => {
            this.$message(`获取父级节点失败`)
          })
          this.loading = false;
        }else{
          //如果选择的是模型   隐藏下拉选  并且清空选中的值
          this.showPrise_1 = false;
          this.showPrise_2 = false;
          this.model_arr = [];
          this.menu_arr = [];
          this.ck_types = 1;
        }
      },
      //提交
      submitForm(formName) {
        this.loading = true;
        let params = Object.assign({}, this.functionInfo)
        params.createUser = this.crrur_userid;
        params.updateUser = this.crrur_userid;
        //简单校验下数据
        if(this.valiFromObj(params)){
          if(this.ck_types == 2){
            if(this.model_arrselect.length != ''){
              params.parentId = this.model_arrselect;
            }
          }
          if(this.ck_types == 3){
            if(this.menu_arrselect != ''){
              params.parentId = this.menu_arrselect;
            }else{
              params.parentId = this.model_arrselect;
            }
          }
          this.loading = false;
          //调用新增
          console.log(JSON.stringify(params));
          return false;
          https_f.addFucntionObj(params).then(data => {
            this.$message(`新增成功`)
            this.resetForm();
            this.loading = false;
          }).catch(e => {
            this.$message(`新增失败`)
            this.resetForm();
            this.loading = false;
          })
        }else{
          this.loading = false;
        }
      },
      //刷新
      resetForm() {
        if (this.pageType === 'edit') {
          //TODO
        } else {
          this.functionInfo={
              parentId:0,	 //父级节点
           //   parentWholeId:0,	 //父节点wholeId
              type:1,	// 功能类型（1：模型 2：菜单 3：功能）
              systemType:1,//系统类型（1：小程序 2：pc端）
              name:'', //功能名称
              url:'',//链接
              imageUrl:'',//      图标
              state:1,//状态（0:停用 1：启用）
              createUser:'',//	创建人
              updateUser:'',//更新人即创建人
              ck_types:1,
              //控制  模型 菜单下拉选 隐藏显示
              showPrise_1:false,
              showPrise_2:false,
              //控制  模型  菜单下拉选的 值
              model_arr:[],
              model_arrselect:'',
              menu_arrselect:'',
              menu_arr:[],
              isshowimg:false,
            img_names:'',
          }
        }
      },
      //校验数据
      valiFromObj(jsonobj){
       /* functionInfo: {
            parentId:0,	 //父级节点
            parentWholeId:0,	 //父节点wholeId
            type:3,	// 权限类型（1：模型 2：菜单 3：功能）
            systemType:1,//系统类型（1：小程序 2：pc端）
            name:'', //权限名称
            url:'',//链接
            imageUrl:'',//      图标
            state:1,//状态（0:停用 1：启用）
            createUser:'',//	创建人
            updateUser:'',//更新人即创建人
        },*/
        if (jsonobj.name == null || jsonobj.name == undefined || jsonobj.name == '') {
          this.$message(`请输入功能名称`)
          return false;
        }
        if (jsonobj.url == null || jsonobj.url == undefined || jsonobj.url == '') {
          this.$message(`请输入功能路径`)
          return false;
        }
        if(this.ck_types == 3){
          //选择的功能     验证  模块 与 菜单  两者一者要有值
          if((this.model_arrselect == null || this.model_arrselect == undefined || this.model_arrselect == '') && (this.menu_arrselect == null || this.menu_arrselect == undefined || this.menu_arrselect == '')){
            this.$message(`请选择模块或者菜单`)
            this.functionInfo.parentId = 0;
            return false;
          }
        }else if(this.ck_types == 2){
          //如果是2  说明选择的菜单  那就验证下 选择的模块ID 是否为空
          if(this.model_arrselect == null || this.model_arrselect == undefined || this.model_arrselect == ''){
            this.$message(`请选择对应的模块`)
            return false;
          }
        }
        return true;
      },
    },
    computed: {
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    //页面载入
    mounted:function(){
      //获取当前登录人信息  设置当前操作人ID
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
  } .avatar-uploader .el-upload {
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
