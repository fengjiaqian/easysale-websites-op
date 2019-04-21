
<template>
  <div id="accountSetting">

    <el-form :inline="true"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <!--<el-form-item label="角色名称">-->
        <!--<el-input v-model="scanInfo.function_name" placeholder="请输入角色名称" ></el-input>-->
        <!--&nbsp;<el-button type="primary" @click="scanFunctionName" size="medium">定位</el-button>-->
      <!--</el-form-item>-->

      <el-form-item label="角色名称">
        <el-input v-model="scanInfo.function_name" placeholder="请输入角色名称" ></el-input>
      </el-form-item>

      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="primary" @click="scanRoleName" size="medium">定位</el-button>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="searchRoleTreeList" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" size="medium">重置</el-button>
    </div>
    <el-button type="primary" class="addAd" @click="addRole">新增角色</el-button>
    <!--<el-table-->
      <!--v-loading="loading"-->
      <!--:data="accountList"-->
      <!--border-->
      <!--height='520'-->
      <!--style="width: 100%;margin-top:16px;">-->
      <!--<el-table-column label="序号">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{indexMethods(scope.$index)}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="角色名称" prop="roleName" ></el-table-column>-->
      <!--<el-table-column label="父角色名称"  prop="parentName"></el-table-column>-->
      <!--<el-table-column label="创建时间"  prop="createTime"></el-table-column>-->
      <!--<el-table-column label="状态" >-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.state==0?'停用':'启用'}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column fixed="right" label="操作">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="small" @click="gotoRoleDetail(scope.row)">详情</el-button>-->
          <!--<el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>-->
          <!--<el-button type="text" size="medium" @click="toggleRoleState(scope.row,scope.$index)">-->
            <!--{{scope.row.state===0?'启用':'停用'}}-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
    <tree-table :data="data" :columns="columns" border/>
    <!--<div class="pagination">-->
      <!--&lt;!&ndash;<p>每页{{pageSize}}条 | 共{{totalCount}}条记录 | 当前第{{currentPage}}/{{pageCount}}页 | 共{{pageCount}}页</p>&ndash;&gt;-->
      <!--<el-pagination-->
        <!--background-->
        <!--layout="prev, pager, next"-->
        <!--@current-change="handlePageNumChange($event)"-->
        <!--:page-size="pageSize"-->
        <!--:total="totalCount"-->
        <!--v-if="totalCount>0"-->
      <!--&gt;-->
      <!--</el-pagination>-->
    <!--</div>-->

  </div>
</template>

<script>
  import http from 'http/roleSetApi';
  import {mapState} from 'vuex';
  import treeTable from "./TreeTable";

  let parentNode = null;
  let node = null;

  export default {
    name: "roleSetting",

    data() {

      return {
        scanInfo:{
          function_name:'',
          searchName:''
        },
        functionname:'',
            loading: false,
            columns: [
              {
                text: "角色名称",
                value: "roleName",
                bjys:"bjys",
              },

              {
                text: "状态",
                value: "state",
                width:200,
                bjys:"bjys",
              },
              {
                text: "创建时间",
                value: "createTime",
                width: 300,
                bjys:"bjys",
              },
            ],
            data: [],

        //账户查询字段
        roleName: null,
        state: null,
        currentPage: 1,
        pageSize: 20,
        dictionaryCode: 'userRole',//后台接口要求写死
        queryRoleList: '',
        totalCount: 0,
        roleListData: [],//角色清单
        resetDialogVisible: false,
        accountList: [],
        resetFormLabelWidth: '130px',
        cityRoleOptions: [],
        cityId: ``,
        serviceList: [],//服务商列表
        parentOrgId: ``,
        showServiceSelector: false,
      }
    },
    mounted() {
      console.log(`生命周期mounted`)
      // this.getRoleList();
      this.getRoleTreeList();
    },
    //keepalive组件每次进都会触发的方法
    activated() {
      this.cityId = ``
      // this.getRoleList();
      this.getRoleTreeList();
      console.log(`生命周期activated`)
    },
    components: { treeTable },
    methods: {

      //搜索指定名称
      scanRoleName(){
        //进来默认还原数据
        parentNode = null;
        node = null;
        let datas = this.data;
        console.log(this.data);
        for(let x=0;x<datas.length;x++){
          datas[x].bjys = "";
        }
        this.data = datas;
        if(this.scanInfo.function_name != ''){
          let obj = getNode(this.data, this.scanInfo.function_name);
          if(obj.parentNode == null){
            if(obj.node != null){
              let id = obj.node.id;
              this.resetData(id);
            }else{
              this.$message("无匹配结果!");
            }
          }else{
            let id = obj.parentNode.id;
            this.resetData(id);
          }
        }
      },
      resetData(id){
        let objs = this.data;
        if(objs.length > 0){
          for(let x=0;x<objs.length;x++){
            if(objs[x].id == id){
              objs[x].bjys = "background: rgba(0, 158, 250, 0.219) !important;";
              break;
            }
          }
          this.data = objs;
        }else{
          this.$message("出现异常!");
        }
      },

      //搜索指定名称
      scanRoleName(){
        //进来默认还原数据
        parentNode = null;
        node = null;
        let datas = this.data;
        for(let x=0;x<datas.length;x++){
          datas[x].bjys = "";
        }
        this.data = datas;
        if(this.scanInfo.function_name != ''){
          let obj = getNode(this.data, this.scanInfo.function_name);
          if(obj.parentNode == null){
            if(obj.node != null){
              let id = obj.node.id;
              this.resetData(id);
            }else{
              this.$message("无匹配结果!");
            }
          }else{
            let id = obj.parentNode.id;
            this.resetData(id);
          }
        }
      },
      resetData(id){
        console.log(id)
        let objs = this.data;
        console.log(objs);
        if(objs.length > 0){
          for(let x=0;x<objs.length;x++){
            if(objs[x].id == id){
              // alert (objs[x].roleName);
              objs[x].bjys = "background: rgba(0, 158, 250, 0.219) !important;";
              break;
            }
          }
          this.data = objs;
        }else{
          this.$message("出现异常!");
        }
      },

      /*模糊查询获取角色数据列表*/
      searchRoleTreeList() {
        this.loading = true;
        this.scanInfo.searchName = this.scanInfo.function_name
        http.getRoleTreeList( this.scanInfo ).then(data => {
          this.loading = false;
          this.data = data;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      /*获取角色数据列表*/
      getRoleTreeList() {
        this.loading = true;
        http.getRoleTreeList({}).then(data => {
          this.loading = false;
          for(let x= 0;x<data.length;x++){
            data[x].bjys = "";
          }
          this.data = data;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },


      //获取账户接口
      getRoleList() {
        let roleOrgId = this.choseRoleInfoList.ruleOrgId
        let {currentPage, mobileNo, pageSize, roleName, state,userInfo} = this;
        let cityId = this.cityId || this.parentOrgId||''
        //let cityId = cityInfoList[1];
        http.getRoleList({cityId, currentPage, mobileNo, pageSize, roleName, state, roleOrgId,userInfo}).then(data => {
          this.accountList = data || [];
          this.totalCount = data ? data.totalCount : 0;
          this.roleListData = data.authList;

          this.loading = false;
        }).catch(e => {
          console.log(e)
        })
      },

      resetForm() {
        this.roleName = null;
        this.mobileNo = null;
        this.parentOrgId = null;
        this.cityId = null;
        this.state = null;
        // this.getRoleList();
        this.getRoleTreeList();
      },


      ensureReset() {
        if (this.resetRuleForm.newPass === this.resetRuleForm.newPassRepeat) {
          this.changePasswordByOld();
        } else {
          this.$message.error(`两次密码输入不一致`)
        }

        this.resetDialogVisible = false;
      },


      indexMethods(index) {
        return (this.currentPage - 1) * this.pageSize + index + 1
      },
      addRole() {
        //只有OPAdmin,HR这个角色可以新增账户
          this.$router.push({name: `addRole`})

      },
      handlePageNumChange(num) {
        this.currentPage = num;
        this.getRoleList();
      },
      handleSelectService() {
        this.findAllCityList();
      }
    },
    computed: {
      canSelectSecondSelector() {
        return (this.showServiceSelector && this.parentOrgId) || !this.showServiceSelector
      },
      ...mapState(`user`, [`choseRoleInfoList`,`choosenRole`])
    },
    watch: {
      choseRoleInfoList(newValue) {
        this.getRoleList();
        this.getRoleTreeList();
        this.showServiceSelector = !this.choseRoleInfoList.ruleOrgId;
      },
      parentOrgId(newValue) {
        this.cityId = ``
      }
    },
  }
  function getNode(json, nodeId) {
    //1.第一层 root 深度遍历整个JSON
    for (var i = 0; i < json.length; i++) {
      if (node) {
        break;
      }
      var obj = json[i];
      console.log(obj);
      //没有就下一个
      if (!obj || !obj.roleName) {
        continue;
      }
      //2.有节点就开始找，一直递归下去
      if (obj.roleName == nodeId) {
        //找到了与nodeId匹配的节点，结束递归
        node = obj;
        break;
      } else {
        //3.如果有子节点就开始找
        if (obj.children) {
          //4.递归前，记录当前节点，作为parent 父亲
          parentNode = obj;
          //递归往下找
          getNode(obj.children, nodeId);
        } else {
          //跳出当前递归，返回上层递归
          continue;
        }
      }
    }

    //5.如果木有找到父节点，置为null，因为没有父亲
    if (!node) {
      parentNode = null;
    }

    //6.返回结果obj
    return {
      parentNode: parentNode,
      node: node
    };
  }
</script>

<style lang="stylus" scoped>

  .el-header {
    span {
      color: #999;
      font-size: 14px;
    }
  }

  .el-main {
    margin-top: 20px;
  }

  .el-row {
    font-size: 14px;
    align-items: center
  }

  .check {
    padding: 20px 20px;
  }

  .addAd {
    padding: 10px 24px;
    margin-top: 16px;
  }

  .query-btn{
    text-align center
    border-bottom:1px solid #ededed
    padding-bottom:20px
  }
  .pagination {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
    color: #999;
    float: right
  }
</style>
