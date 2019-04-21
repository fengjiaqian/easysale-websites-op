<template>
  <div id="suser_roleAuthorization" >

    <el-tree
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      :default-checked-keys="default_ck"
      highlight-current
      :props="defaultProps">
    </el-tree>

    <div class="query-btn" style="margin:0 auto">
      <el-button type="primary" size="medium" @click="getCheckedKeys">角色授权</el-button>   <el-button @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>
<script>

  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import https_f from 'http/suserRoleAuthorizationApi'
  export default {
    name: "suser_roleAuthorization",
    data() {
      return {
        isup:false,
        //操作人
        crrur_userid:666666,
        //即将被授权人
        crrud_auth_uid:0,
        //被选中的角色
        default_ck:[],
        msg:'suser_roleAuthorization',
        data:  [],
        defaultProps: {
          children: 'children',
          label: 'roleName'
        }
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
      //获取 选中的节点 key  id
      getCheckedKeys() {
        let ck_arr =  this.$refs.tree.getCheckedKeys();
        if(ck_arr.length > 0){
          this.$confirm('您确定授权这些角色给用户吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.ensureCharge(ck_arr);
          }).catch(() => {
          });
        }else{
         this.$message({
             type: 'info',
             message: '请选择要授权的角色'
           });
        }
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }]);
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      //获取当前用户拥有的树节点
      getCrrUserZtreeKeys(cid){
        let param_ = {
          userId: cid
        }
        https_f.getUserAuthRoleIds(param_).then(data => {
          this.loading = false;
          if(data.length > 0){
            this.isup = false;
          }else{
            this.isup = true;
          }
          this.default_ck = data;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      //获取当前后台拥有的角色树形
      getCrrSysZtreeRoles(){
        https_f.getZtrrRole({}).then(data => {
          this.loading = false;
          this.data = data;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      // 确定修改
      ensureCharge(ck_arr){
        let cdparam = {
          roleIdList:ck_arr,
          userId:this.crrud_auth_uid
        }
        // 执行用户角色授权
        this.loading = true;
        //保存   根据状态 走修改 还是保存
        if(this.isup){
          https_f.add_authuser_role(cdparam).then(data => {
            this.loading = false;
            this.$message({
              type: 'success',
              message: '授权成功'
            });
            //获取当前用户有的角色
            this.getCrrUserZtreeKeys(this.crrud_auth_uid);
            //获取树形角色
            this.getCrrSysZtreeRoles();
          }).catch(e => {
            this.$message(e)
            this.loading = false
          })
        }else{
          //修改
          https_f.update_authuser_role(cdparam).then(data => {
            this.loading = false;
            this.$message({
              type: 'success',
              message: '修改授权成功'
            });
            //获取当前用户有的角色
            this.getCrrUserZtreeKeys(this.crrud_auth_uid);
            //获取树形角色
            this.getCrrSysZtreeRoles();
          }).catch(e => {
            this.$message(e)
            this.loading = false
          })
        }
      },
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`])
    },
    mounted:function(){
      this.crrud_auth_uid = this.$route.query.id;
      try{
        if(this.crrud_auth_uid > 0) {
          this.loading = true;
          // 初始化userid  crrur_userid
          if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
            let  userobj  =sessionStorage.getItem(`userInfo`);
            this.crrur_userid = (JSON.parse(userobj)).id;
          }else{
            // this.$message("网络异常获取用户信息失败!");
          }
          //获取当前用户有的角色
          this.getCrrUserZtreeKeys(this.crrud_auth_uid);
          //获取树形角色
          this.getCrrSysZtreeRoles();
        }else{
          this.$message("获取用户信息失败!");
        }
      }catch (e) {
        this.$message("网络异常!");
        console.log(e);
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>

