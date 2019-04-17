<template>
  <div id="applyWarehouseProduct" v-loading="loading">
    <!--搜索条件-->
    <el-form :inline="true" :model="functionInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="functionInfo">
      <el-form-item label="功能名称">
        <el-input v-model="functionInfo.name" placeholder="请输入" clearable></el-input>
      </el-form-item>

      <el-form-item label="功能类型" prop="type">
        <el-select v-model="functionInfo.type" placeholder="请选择功能类型">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="模型" :value="1"></el-option>
          <el-option label="菜单" :value="2"></el-option>
          <el-option label="功能" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统类型" prop="systemType">
        <el-select v-model="functionInfo.systemType" placeholder="请选择系统类型">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="小程序" :value="1"></el-option>
          <el-option label="PC端" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="functionInfo.state" placeholder="请选择状态">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="停用" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getFunctionList_" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <el-button type="primary" class="add-warehouse" @click="addFunction">新增功能</el-button>
    <!--表格-->
    <el-table
      :data="productList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <!-- <el-table-column label="序号" width="58">
         <template slot-scope="scope">
           <span>{{indexMethods(scope.$index)}}</span>
         </template>
       </el-table-column>-->
      <!--      prop="parentId"-->
      <el-table-column prop="parentId"  label="创建时间" width="180">
        <template slot-scope="scope">
          <div @click="treeClick(scope.row,scope.$index)" style="cursor: pointer;">
            <template v-if="scope.row.children && scope.row.children.length > 0">
              <i class="el-icon-arrow-down" :style="'margin-left:'+(scope.row.level-1)*2+'em;'" v-if="scope.row.open"></i>
              <i class="el-icon-arrow-right" :style="'margin-left:'+(scope.row.level-1)*2+'em;'" v-else></i>
              <span >{{ scope.row.createTime }}</span>
            </template>
            <span v-else :style="'margin-left:'+(scope.row.level-1)*2+'em;'">{{ scope.row.createTime }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="功能类型" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.type===1?'模型':scope.row.type===2?'菜单':'功能'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="systemType" label="系统类型" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.systemType===1?'小程序':'PC'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="功能名称">
      </el-table-column>
      <el-table-column prop="url" label="url路径" >
      </el-table-column>
      <el-table-column prop="state" label="状态" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.state===0?'停用':'启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="父级节点">
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" >
      </el-table-column>
      <!--<el-table-column prop="firstInStockTime" label="首次入库时间">
      </el-table-column>-->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateFunction(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="goToDetail(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="close_start_state(scope.row.state,scope.row.id)">{{scope.row.state===0?'启用':'停用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="functionInfo.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>

    <!--设置费用弹框-->
    <el-dialog
      :title="alertInfo.status==0?'提示信息':'提示信息'"
      :visible.sync="alertInfoState"
      width="30%"
      :append-to-body="true"
    >
      <el-form label-width="148px" class="el-form-product">
        <el-form-item >
          <span>您确定要变更状态吗!</span>
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
  //引入 vue 后台发请求api接口
  import https_f from 'http/functionManageApi'

  //处理 树形数组
  let util = {};
  util.treeTableXcode = function(data,xcode){
    xcode = xcode || "";
    for(var i=0;i<data.length;i++){
      var item = data[i];
      item.xcode = xcode + i;
      if(item.children && item.children.length > 0){
        util.treeTableXcode(item.children,item.xcode+"-");
      }
    }
  };

  //传递数组 以及对象  删除
  function removeByValue(arr, val) {
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  export default {
    name: "functionManage",
    data() {
      //页面取值的数据
      return {
        newFunction_arr:[],
        //当前操作用户
        crrur_userid:6666666,
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        //6为页面默认状态
        functionInfo: {
          type:6,	// 权限类型（1：模型 2：菜单 3：功能）
          systemType:6,//系统类型（1：小程序 2：pc端）
          name:'', //权限名称
          state:6,//状态（0:停用 1：启用）,
          pageSize:20,
          pageNum:1,
        },
        chargeDialog: false,
        totalCount: 0,
        productList: [],
        loading: false,
        alertInfoState:false,
        alertInfo:{
          status:0,
        },
        up_state:6,
        up_pid:6,
      }
    },
    components: {
      AdminCitySelector
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
        https_f.functionList(this.param_handle(this.functionInfo)).then(data => {
          this.loading = false
          let list = data.dataList;
          let list_ = data.dataList;
          for(let x=0;x<list.length;x++){
            //初始化 每条等级都是1级
            //存在上级的
            if(list[x].parentId != undefined && list[x].parentId != null && list[x].parentId != ''){
              //设定存放上级数据的数组
              list[x].children = [];
            }
          }

          //要被删除的 obj  因为下级联动的时候  父级可能会重复  在重复 并且当前还不带子级的时候  需要被删除
          let del_ids = [];
          //循环 处理 设置 当前节点的 父级节点
          for(let x=0;x<list.length;x++){
            if(list[x].parentId != undefined && list[x].parentId != null && list[x].parentId != ''){
              for(let i=0;i<list_.length;i++){
                if(list[x].parentId == list_[i].id){
                  //如果 父级ID  跟当前ID一样  重新赋值对象 设置等级 2
                  let nobj ={
                    "id": list_[i].id,
                    "parentId": list_[i].parentId,
                    "name": list_[i].name,
                    "type": list_[i].type,
                    "systemType":list_[i].systemType,
                    "url":list_[i].url,
                    "imageUrl":list_[i].imageUrl,
                    "state":list_[i].state,
                    "createUser": list_[i].createUser,
                    "createTime": list_[i].createTime,
                    "updateUser":list_[i].updateUser,
                    "updateTime":list_[i].updateTime,
                    //联动级别
                  }
                  list[x].children.push(nobj);
                  del_ids.push(list_[i].id);
                }
              }
            }
          }

          //删除 没有父级节点  并且重复的数据
          for(let x=0;x<list.length;x++){
            for(let i=0;i<del_ids.length;i++){
              if(list[x].id == del_ids[i]){
                if(list[x].children == undefined || list[x] == null){
                  removeByValue(list,list[x]);
                }
              }
            }
          }
          // console.log(JSON.stringify(list));
          this.newFunction_arr = list;
          util.treeTableXcode(this.newFunction_arr);
          this.productList = this.newFunction_arr;
          this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      //刷新页面
      resetForm() {
        this. functionInfo= {
          type:6,	// 权限类型（1：模型 2：菜单 3：功能）
          systemType:6,//系统类型（1：小程序 2：pc端）
          name:'', //权限名称
          state:6,//状态（0:停用 1：启用）
          pageSize:20,
          pageNum:1,
        }
        // this.getProductList()
      },
      getSelectDate(value) {
        this.functionInfo.startTime = value[0]
        this.functionInfo.endTime = value[1]
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
      /*设置状态*/
      toggleState(row, index) {
      },
      indexMethods(index) {
        return (this.functionInfo.pageNum - 1) * this.functionInfo.pageSize + index + 1
      },
      handlePageNumChange(num) {
        this.functionInfo.pageNum = num
        this.getFunctionList_();
      },
      //开始时间小于结束时间
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            if (self.endTime) {
              return new Date(self.endTime).getTime() < time.getTime()
            }
          }
        }
      },
      //结束时间必须大于开始时间
      processDate() {
        let self = this
        return {
          disabledDate(time) {
            if (self.startTime) {
              return new Date(self.startTime).getTime() > time.getTime()
            }
          }
        }
      },
      treeClick:function(item,index){
        if(item.open){
          this.collapse(item,index);
        }else{
          this.expand(item,index);
        }
      },
      expand:function(item,index){
        if(!item.children){
          return index;
        }
        //展开
        for(var i=0;item.children && i<item.children.length;i++){
          var child = item.children[i];
          this.productList.splice(++index,0,child);
          if(child.children && child.children.length > 0 && child.open){
            index = this.expand(child,index);
          }
        }
        item.open = true;
        return index;
      },
      collapse:function(item,index){
        if(!item.children){
          return index;
        }
        //收缩
        item.open = false;
        var len = 0;
        for(var i=index+1;i<this.productList.length-1;i++){
          var xcode = this.productList[i].xcode;
          if(xcode.startsWith(item.xcode+"-")){
            len ++;
          }else{
            break;
          }
        }
        this.productList.splice(index+1,len);
      }
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`])
    },
    //页面载入  数据处理
    mounted:function(){
      this.functionInfo.pageNum = 1;
      this.functionInfo.pageSize = 20;
      this.functionInfo.type=6;
      this.functionInfo.systemType=6;
      this.functionInfo.state=6;
      this.functionInfo.name='';
      //获取用户信息  设置当前操作人的ID
      if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
        let  userobj  =sessionStorage.getItem(`userInfo`);
        this.crrur_userid = (JSON.parse(userobj)).id;
      }else{
        //用户信息获取失败
        this.$message("网络异常获取用户信息失败!");
      }
      this.getFunctionList_();
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
