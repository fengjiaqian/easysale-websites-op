<template>
  <div id="sysManage"  v-loading="loading">
    <el-form :inline="true" :model="configurationInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="configurationInfo">
        <el-form-item label="键">
            <el-input v-model="configurationInfo.contentKey" placeholder="请输入键" clearable></el-input>
          </el-form-item>

      <el-form-item label="机构号">
        <el-input v-model="configurationInfo.orgId" placeholder="请输入机构号" clearable></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="contentType">
        <el-select v-model="configurationInfo.contentType" placeholder="请选择类型">
          <!--<el-option label="请选择" ：></el-option>-->
          <el-option label="字符串" :value="0"></el-option>
          <el-option label="数字" :value="1"></el-option>
          <el-option label="Json" :value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="contentList" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <el-button type="primary" class="add-warehouse" @click="addconfiguration">新增</el-button>

    <el-table
      :data="configurationList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contentKey" label="键" width="250">
      </el-table-column>
      <el-table-column prop="contentValue" label="值" width="350">
      </el-table-column>
      <el-table-column prop="orgId" label="机构编号" width="250">
      </el-table-column>
      <el-table-column   label="类型"  width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.contentType == 0">字符串</span>
          <span v-if="scope.row.contentType == 1">数字</span>
          <span v-if="scope.row.contentType == 2">JSON</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="250">
      </el-table-column>
      <el-table-column fixed="right" label="操作"  >
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="updateconfiguration(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="toggleState(scope.row,scope.$index)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>

  </div>
</template>
<script>

  import {mapState} from 'vuex'
  import https_f from 'http/sysManageApi'
  import {formatDate} from './dateHandle'
  export default {
    name: "sysManage",
    data() {
      return {
        pageNum:1,
        pageSize:20,
        isChoose:null,
        sqr_title:'内容配置列表',
        chargeDialog: false,
        totalCount: 0,
        configurationList: [],
        loading: false,
        configurationInfo:{
          id:'',
          contentKey:'',
          contentValue:'',
          contentType:'',
          orgId:'',
          remark:'',
          createUser:'',
          createTime:'',
          updateUser:'',
          updateTime:''

        }
      }
    },
    components: {

    },
    methods: {
      //跳转新增
      addconfiguration(){
        this.$router.push({name:'configurationAdd'});
      },
      //跳转修改
      updateconfiguration(row){
        this.$router.push({name:'configurationUpdate', query:{row}})
      },
      statrorcloseShop(row,sta){
        this.$confirm('确定要变更当前店铺状态吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            id:row.id,
            state:sta,
          }
          console.log(JSON.stringify(param));
          https_f.shopupdtae(param).then(data => {
            this.$message({
              type: 'success',
              message: '执行成功!'
            });
            this.resetForm()
          }).catch(e => {
            this.$message("执行失败!");
          })
        }).catch(() => {
          console.log("取消");
        });
      },

      formatDate_(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss');
      },
      resetForm() {
        this.pageSize = 20;
        this.pageNum = 1;
        this.configurationInfo={
          configurationName:'',
          phone:'',
          state:1
        }
        this.contentList();
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      //执行
      handlePageNumChange(num) {
       this.pageNum = num
        this.contentList();
      },
      contentList(){
        this.loading = true;
        this.configurationInfo.pageNum = this.pageNum;
        this.configurationInfo.pageSize = this.pageSize;
        console.log(JSON.stringify(this.configurationInfo));
        https_f.contentList(this.configurationInfo).then(data => {
          this.loading = false
          console.log(JSON.stringify(data));
          this.configurationList = data.dataList;
          for(let x=0;x<this.configurationList.length;x++){
            this.configurationList[x].createTime =  this.formatDate_(this.configurationList[x].createTime);
          }
          this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },

      deleteCharge(row, index){
        console.log(row);
        let params = {
          id: row.id,
        }
        https_f.deleteContentConfiguration(params).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.contentList();
        }).catch(e => {
          this.$message("删除失败!");
        })
        this.loading = true;

      },

      /*设置状态*/
      toggleState(row, index) {
        this.$confirm('确定要删除当前数据吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行
          this.deleteCharge(row, index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取变更'
          });
        });
      }

    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`]),
        ...formatDate
    },
    mounted:function(){
      //載入
      this.pageSize = 20;
      this.pageNum = 1;
      // this.configurationInfo={
      //   configurationName:'',
      //     phone:'',
      //     state:1
      // }
      this.contentList();
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

  .avatar-uploader .el-upload {
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
    width: 300px;
    height: 300px;
    display: inline;
    border-radius: 15px;
  }

  .vueBox{
    text-align: center;
    margin-left: 300px;
    position: relative;
  }

  .active {
    transform: scale(3);          /*图片需要放大3倍*/
    position: absolute;           /*是相对于前面的容器定位的，此处要放大的图片，不能使用position：relative；以及float，否则会导致z-index无效*/
    z-index: 100;
    margin-top: -300px;
  }

  .shadow{
    width: 500px;
    height: 550px;
    /*background-color: #ffc0cb;*/
    position: absolute;
    left: -100px;
    top: -172px;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .shadow img{
    width:100%;
    height:100%;
  }
</style>

