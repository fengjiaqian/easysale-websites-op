<template>
  <div id="applyWarehouseProduct" v-loading="loading">


    <el-form :inline="true" :model="scanInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline">

      <el-form-item label="功能名称">
        <el-input v-model="scanInfo.function_name" placeholder="请输入功能名称" ></el-input>
      </el-form-item>

      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="primary" @click="scanFunctionName" size="medium">定位</el-button>
    </el-form>

    <div class="query-btn">
      <el-button type="primary" @click="getFunctionList_" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>
    <el-button type="primary" class="add-warehouse" @click="addFunction">新增功能</el-button>
    <!--表格-->
      <tree-table :data="data" :columns="columns"  border/>
  </div>
</template>

<script>

  /****
   *   增加 搜索条件  按功能名称  搜索数据   然后 定位到 对应的 table  表格行上
   */
  import treeTable from "./tabletree.vue";
  import {mapState, mapMutations} from 'vuex'
  //引入 vue 后台发请求api接口
  import https_f from 'http/functionManageApi'

  let parentNode = null;
  let node = null;
  let isExitsArr = [];
  export default {
    name: "functionManage",
    data() {
      //页面取值的数据
      return {
        scanInfo:{
          function_name:''
        },
        functionname:'',
        loading: false,
        columns: [
          {
            text: "功能名称",
            value: "label",
            bjys:"bjys",
          },
          {
            text: "功能url",
            value: "url",
            bjys:"bjys",
          },
          {
            text: "图标imageUrl",
            value: "imageUrl"
          , bjys:"bjys",
          },
          {
            text: "功能类型",
            value: "type",
            width:90,
            bjys:"bjys",
          },{
            text: "系统类型",
            value: "systemType",
            width:90,
            bjys:"bjys",
          },
          {
            text: "状态",
            value: "state",
            width:90,
            bjys:"bjys",
          },
          {
            text: "创建时间",
            value: "createTime",
            width: 180,
            bjys:"bjys",
          },
        ],
        data:[],
      }
    },
    components: {
      treeTable
    },
    methods: {
      //递归处理 原始数据data
      handleYData(arr){
        for(let x=0;x<arr.length;x++){
            arr[x].bjys = "";
            if((arr[x].children).length > 0){
              this.handleYData(arr[x].children);
            }
        }
        return arr;
      },
      setBJYS(arr,id){
        for(var x=0;x<arr.length;x++){
          if(arr[x].id == id){
            arr[x].bjys = "background: rgba(0, 158, 250, 0.219) !important;";
            if((arr[x].children).length > 0){
              this.setBJYS(arr[x].children,id);
            }
          }else{
            if((arr[x].children).length > 0){
              this.setBJYS(arr[x].children,id);
            }
          }
        }
        return arr;
      },
      //搜索指定名称
      scanFunctionName(){
        //进来默认还原数据
         parentNode = null;
         node = null;
         isExitsArr = [];
        // let datas = this.data;
        this.handleYData(this.data);
        // for(let x=0;x<datas.length;x++){
        //   datas[x].bjys = "";
        // }
        // this.data = datas;
        if(this.scanInfo.function_name != ''){
          let obj = getNode(this.data, this.scanInfo.function_name);
          if(obj.length > 0){
            let ids = [];
            for(let x=0;x<obj.length;x++){
              ids.push(obj[x].node.id);
            }
            for(let x=0;x<ids.length;x++){
              this.setBJYS(this.data,ids[x])
            }
          }else{
            isExitsArr = [];
            parentNode = null;
            node = null;
            this.$message("无匹配结果!");
          }

          // if(obj.parentNode == null){
          //    if(obj.node != null){
          //       let id = obj.node.id;
          //      this.resetData(id);
          //    }else{
          //      this.$message("无匹配结果!");
          //    }
          // }else{
          //   let id = obj.parentNode.id;
          //   this.resetData(id);
          // }
        }else{
          this.$message("请输入要搜索的内容!");
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
      //update_
      update_state(param){
        // console.log(JSON.stringify(param));
        https_f.updateFuctionObj(param).then(data => {
          this.getFunctionList_();
          this.$message({
            type: 'success',
            message: '执行成功!'
          });
        }).catch(e => {
          this.$message("执行失败!");
        })
        // this.alertInfoState = false;
        //刷新页面shuj
        this.getFunctionList_();
      },
      //确认修改状态
      ensureCharge(){
        if(this.up_state == 6){
          this.$message("网络异常!");
          return false;
        }
        if(this.up_pid == 6){
          this.$message("网络异常!");
          return false;
        }
        let param = {
          updateUser:this.crrur_userid,
          id:this.up_pid,
        }
        //以上正常不触发 执行下面
        if(this.up_state == 1){
          param .state = 0;
        }else{
          param .state = 1;
        }
        this.update_state(param);
      },
      //停用或启动
      close_start_state(state,id){
        // this.alertInfoState = true;
        this.up_state = state;
        this.up_pid  = id;
        this.$confirm('确定要改变当前数据状态吗, 是否继续?', '提示', {
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
      //简单处理传递到后台的数据
      param_handle(arr){
        let newarr = arr;
        if(newarr.type == 6){
          delete newarr['type'];
        }
        if(newarr.systemType == 6){
          delete newarr['systemType'];
        }
        if(newarr.state == 6){
          delete newarr['state'];
        }
        return newarr;
      },
      /*新增功能 */
      addFunction(){
        this.$router.push({name: `functionAdd`})
      },
      /*获取功能数据列表*/
      getFunctionList_() {
        this.loading = true;
        https_f.getTreeFunctions({}).then(data => {
          this.loading = false
          // console.log(JSON.stringify(data));
          for(let x= 0;x<data.length;x++){
            data[x].bjys = "";
          }
          this.data = data;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      //刷新页面
      resetForm() {
        this.scanInfo.function_name = '';
      },
      //  修改
      updateFunction(row) {
        // console.log(row.id);
        let id = row.id;
        this.$router.push({name:`functionUpdate`, query:{id}})
      },
      // 详情
      goToDetail(row){
        let id = row.id;
        this.$router.push({name:`functionInfo`, query:{id}})
      },
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`])
    },
    //页面载入  数据处理
    mounted:function(){
      this.getFunctionList_();
    },
    resetPage(datas){
      this.data = datas;
    }

  }

  function getNode(json, nodeId) {

    //1.第一层 root 深度遍历整个JSON
    for (let i = 0; i < json.length; i++) {
      if (node) {
        break;
      }
      let obj = json[i];
      //没有就下一个
      if (!obj || !obj.label) {
        continue;
      }

      //if (obj.label == nodeId) {
      if ((obj.label).search(nodeId) != -1) {
        //找到了与nodeId匹配的节点，结束递归
        node = obj;
        let result_arr = {
          parentNode: parentNode,
          node: node
        };
        isExitsArr.push(result_arr);
        node = null;
        parentNode = null;
        //如果当前节点存在字节  继续递归
        if((obj.children).length >0){
          parentNode = obj;
          //递归往下找
          getNode(obj.children, nodeId);
        }
        //    break;
      } else {
        //3.如果有子节点就开始找
        if ((obj.children).length >0) {
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
    let result_arr = {
      parentNode: parentNode,
      node: node
    };
    if(result_arr.parentNode != null || result_arr.node != null){
      isExitsArr.push(result_arr);
    }
    return isExitsArr;

  }
</script>

<style scoped lang="stylus">
  .el-form {
    .el-form-item {
      margin-bottom: 20px
    }
    .el-input {
      width 250px;
    }
    .el-select {
      width 250px;
    }
  }

  .query-btn {
    text-align: center
    border-bottom: 1px solid #ededed
    padding-bottom: 20px
  }

  .el-pagination {
    float: right
    margin-top: 20px
  }

  .el-form-product {
    .el-form-item {
      margin-bottom: 12px
    }
  }

  .add-warehouse {
    padding: 10px 24px;
    margin-top: 16px
    margin :20px;
  }
</style>
