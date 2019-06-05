<template>
  <div id="shopManage"  v-loading="loading">
    <el-form :inline="true" :model="shopInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="shopInfo">
        <el-form-item label="店铺名称">
            <el-input v-model="shopInfo.shopName" placeholder="请输入店铺名称" clearable></el-input>
          </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="shopInfo.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="shopInfo.state" placeholder="请选择状态">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="shoplist" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <el-button type="primary" class="add-warehouse" @click="addshop">新增店铺</el-button>
    <!--表格-->
    <el-table
      :data="shopList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column prop="shopName" label="店铺名称" width="250">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="150">
      </el-table-column>
      <el-table-column prop="address" label="店铺地址" width="250">
      </el-table-column>
      <el-table-column   label="状态"  width="120">
        <template slot-scope="scope">
          <span>{{scope.row.state===1?'启用': scope.row.state===0 ? '停用' :'异常'}}</span>
        </template>
      </el-table-column>

      <el-table-column   label="认证状态"  width="120">
        <template slot-scope="scope">
          <span>{{scope.row.shopType===1?'已认证': scope.row.shopType===0 ? '认证中' : scope.row.shopType===2 ? '未认证' : '未认证'}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" width="250">
      </el-table-column>
      <el-table-column fixed="right" label="操作"  >
        <template slot-scope="scope">
          <div v-if="scope.row.state == 0">
            <el-button type="text" size="small" @click="updateshop(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="statrorcloseShop(scope.row,1)">启用</el-button>
          </div>
          <div v-if="scope.row.state == 1">
            <el-button type="text" size="small" @click="updateshop(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="statrorcloseShop(scope.row,0)">停用</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
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

  /*
     店铺名称
     店铺类型
     手机号
     店铺地址
     创建时间
     状态
  */
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState} from 'vuex'
  import https_f from 'http/shopManageApi'
  import {formatDate} from './dateHandle'
  export default {
    name: "shopManage",
    data() {
      return {
        pageNum:1,
        pageSize:20,
        isChoose:null,
        sqr_title:'店铺列表',
        chargeDialog: false,
        totalCount: 0,
        shopList: [],
        loading: false,
        shopInfo:{
          shopName:'',
          phone:'',
          state:1
        }
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      //跳转新增
      addshop(){
        this.$router.push({name:'shopAdd'});
      },
      //跳转修改
      updateshop(row){
        this.$router.push({name:'shopUpdate', query:{row}})
      },
      //启用
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
        this.shopInfo={
          shopName:'',
          phone:'',
          state:1
        }
        this.shoplist();
      },
      toggleState(row, index) {
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      //执行
      handlePageNumChange(num) {
       this.pageNum = num
        this.shoplist();
      },
      shoplist(){
        this.loading = true;
        this.shopInfo.pageNum = this.pageNum;
        this.shopInfo.pageSize = this.pageSize;
        console.log(JSON.stringify(this.shopInfo));
        https_f.shopList(this.shopInfo).then(data => {
          this.loading = false
          console.log(JSON.stringify(data));
          this.shopList = data.dataList;
          for(let x=0;x<this.shopList.length;x++){
            this.shopList[x].createTime =  this.formatDate_(this.shopList[x].createTime);
          }
          this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`]),
        ...formatDate
    },
    mounted:function(){
      //載入
      this.pageSize = 20;
      this.pageNum = 1;
      this.shopInfo={
        shopName:'',
          phone:'',
          state:1
      }
      this.shoplist();
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

