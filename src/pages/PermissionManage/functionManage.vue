<template>
  <div id="applyWarehouseProduct" v-loading="loading">

    <el-button type="primary" class="add-warehouse" @click="addFunction">新增功能</el-button>
    <!--表格-->
      <tree-table :data="data" :columns="columns" border/>
  </div>
</template>

<script>
  import treeTable from "./tabletree";
  import {mapState, mapMutations} from 'vuex'
  //引入 vue 后台发请求api接口
  import https_f from 'http/functionManageApi'
  export default {
    name: "functionManage",
    data() {
      //页面取值的数据
      return {
        loading: false,
        columns: [
          {
            text: "功能名称",
            value: "label"
          },
          {
            text: "功能url",
            value: "url"
          },
          {
            text: "图标imageUrl",
            value: "imageUrl"
          },
          {
            text: "功能类型",
            value: "type"
          },{
            text: "系统类型",
            value: "systemType",
          },
          {
            text: "状态",
            value: "state",
          },
          {
            text: "创建时间",
            value: "createTime",
            width: 180
          },
        ],
        data:[],
      }
    },
    components: {
      treeTable
    },
    methods: {
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
        this.alertInfoState = false;
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
          this.data = data;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      //刷新页面
      resetForm() {
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
  }
</style>
