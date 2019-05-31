<template>
  <div id="logManage"  v-loading="loading">
    <el-form :inline="true" :model="logInfo"
             size="medium"
             label-width="130px"
             label-suffix="："
             class="demo-form-inline"
             ref="logInfo">
        <el-form-item label="操作用户名称">
            <el-input v-model="logInfo.uname" placeholder="请输入名称" clearable></el-input>
          </el-form-item>

      <el-form-item label="操作用户手机号">
        <el-input v-model="logInfo.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>

    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="loglist" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <!--表格-->
    <el-table
      :data="logList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column prop="userName" label="操作人名称" width="250">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="150">
      </el-table-column>
      <el-table-column prop="dataType" label="操作数据类型" width="290">
      </el-table-column>
      <el-table-column   label="用户类型"  width="120">
        <template slot-scope="scope">
          <span>{{scope.row.userType=== 1?'店老板': scope.row.userType===2 ? '店员' : scope.row.userType===3 ? '客户' : '系统默认'}}</span>
        </template>
      </el-table-column>
      <el-table-column   label="用户来源"  width="130">
        <template slot-scope="scope">
          <span>{{scope.row.sysType === 1 ?'易经商': scope.row.sysType ===2 ? 'OP管理后台' :  '系统默认'}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="shopName" label="所属店铺" width="250">
      </el-table-column>

      <el-table-column prop="ctime" label="创建时间" width="250">
      </el-table-column>
      <el-table-column fixed="right" label="操作"  >
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
    <!-- ECharts图表测试 -->

    <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
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
  import https_f from 'http/logManageApi'
  import {formatDate} from './dateHandle'

/*  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')*/

  export default {
    name: "logManage",
    data() {
      return {
        pageNum:1,
        pageSize:20,
        isChoose:null,
        sqr_title:'日志列表',
        chargeDialog: false,
        totalCount: 0,
        logList: [],
        loading: false,
        logInfo:{
          uname:'',
          phone:'',
        }
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      formatDate_(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss');
      },
      resetForm() {
        this.pageSize = 20;
        this.pageNum = 1;
        this.logInfo={
          uname:'',
          phone:'',
        }
        this.loglist();
      },
      toggleState(row, index) {
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      //执行
      handlePageNumChange(num) {
       this.pageNum = num
        this.loglist();
      },
      loglist(){
        this.loading = true;
        this.logInfo.pageNum = this.pageNum;
        this.logInfo.pageSize = this.pageSize;
        https_f.loglist(this.logInfo).then(data => {

          console.log(JSON.stringify(data));

          this.loading = false
          this.logList = data.dataList;
          for(let x=0;x<this.logList.length;x++){
            this.logList[x].ctime =  this.formatDate_(this.logList[x].ctime);
          }
          this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: { text: 'ECharts 入门示例' },
          tooltip: {},
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        });
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
      this.logInfo={
        uname:'',
        phone:'',
      }
      this.loglist();
      this.drawLine();
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
    float:left

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

