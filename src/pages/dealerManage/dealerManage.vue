<template>
  <div id="dealerManage"  v-loading="loading">
    <el-form :inline="true" :model="dealerInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="dealerInfo">

      <el-form-item label="手机号">
        <el-input v-model="dealerInfo.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>

      <el-form-item label="店铺名称">
        <el-input v-model="dealerInfo.shopName" placeholder="请输入店铺名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="店铺认证状态" prop="shopType">
        <el-select v-model="dealerInfo.shopType" placeholder="请选择用户类型">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="已认证" :value="1"></el-option>
          <el-option label="认证中" :value="0"></el-option>
          <el-option label="未认证" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="经销商类型" prop="type">
        <el-select v-model="dealerInfo.type" placeholder="请选择用户类型">
          <el-option label="请选择" :value="6"></el-option>
          <el-option label="经销商" :value="1"></el-option>
          <el-option label="销售人员" :value="2"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getdealerList_" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <!--表格-->
    <el-table
      :data="dealerList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="shopName" label="所属名称" width="250">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="150">
      </el-table-column>
      <el-table-column prop="shopType" label="所属店铺认证状态" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.shopType===1?'已认证':scope.row.shopType==0?'认证中':'未认证' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="经销商类型" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.type===1?'店老板':scope.row.type==2?'员工':'异常'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="permissionState" label="经销商级别" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.permissionState===1?'管理员':scope.row.type = 1 ?  '老板' : '普工'}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" width="250">
      </el-table-column>
      <el-table-column fixed="right" label="操作"  >
        <template slot-scope="scope">
          <!-- 经销商-->
          <div v-if="scope.row.userType == 0">
            <el-button type="text" size="small" @click="updateuser(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="closeorstrat(scope.row)">{{scope.row.state == 1 ? '停用' : '启用'}}</el-button>
            <el-button type="text" size="small" @click="deleteuser(scope.row)">刪除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="dealerInfo.pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>
  </div>
</template>
<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import https_f from 'http/deraler_ManageApi'
  import {formatDate} from './dateHandle'

  export default {
    name: "dealerManage",
    data() {
      return {
        isshow:false,
        fdimg:'',
        isChoose:null,
        sqr_title:'申请人信息',
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        dealerInfo: {
          shopName:'',
          shopType:6,
          type:6,
          name:'',
          pageSize:20,
          pageNum:1,
          phone:'',
          auditState:6,
        },
        applyInfo:{
          // shopName:'',
          phone:'',
          address:'',
          name:'',
          createDate:'',
          logoIamgeUrls:[],
          userId:'',
        },
        chargeDialog: false,
        totalCount: 0,
        dealerList: [],
        loading: false,
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      //店铺老板申请 审核
      toexamine_boss(){
        //toexaminebossManage
        this.$router.push({name:'toexaminebossManage'});
      },
      qxshck(){
        this.chargeDialog = false;
        this.fdimg = '';
        this.isshow = false;
      },
      isFD(inx){
        let imgs = this.applyInfo.logoIamgeUrls[inx];
        this.fdimg = imgs;
        this.isshow = true;
      },
      close_img(){
        this.fdimg = '';
        this.isshow = false;
      },
      formatDate_(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss');
      },
      //审核
      to_examine(row){
        let ids = {
          id:row.id,
        }

        https_f.findApplyDealer(ids).then(data => {
          this.loading = false
          console.log(JSON.stringify(data));
          // data.logoIamgeUrls.push('http://yjp-dev-articlesharing.ufile.ucloud.cn/easysale/2019/04/d7d3cd15abb548588a30949396491085.png');
          // data.logoIamgeUrls.push('http://yjp-dev-articlesharing.ufile.ucloud.cn/easysale/2019/04/5918cf19c9c348babfd3debcd9ee528a.png');
          this.applyInfo  = data;
          this.chargeDialog = true;
        }).catch(e => {
          this.$message('数据异常')
          this.loading = false
        })
      },
      // 确认审核
      ckto_examine(){
        if(this.applyInfo == null){
          this.fdimg = '';
          this.isshow = false;
          this.chargeDialog = false;
          this.$message("数据异常审核失败!");
        }else{
          this.$confirm('确定要审核当前用户吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.fdimg = '';
            this.isshow = false;
            this.chargeDialog = false;
            let par = {
              id:this.applyInfo.userId
            }
            https_f.userApplyDer(par).then(data => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '审核成功'
              });
              //变更成经销商   这个只能改变当条数据  经销商的值  改变不了  状态 所以调用重新获取刷新页面
              this.chargeDialog = false;
              this.getdealerList_();
            }).catch(e => {
              this.$message(e)
              this.loading = false
            })
          }).catch(() => {
          });
        }
      },
      // 删除用户
      deleteuser(row){
        this.$confirm('确定要删除当前数据吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let par = {
            id:row.id,
            state:3
          }
          https_f.updateSuserObj(par).then(data => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getdealerList_();
          }).catch(e => {
            this.$message(e)
            this.loading = false
          })
        }).catch(() => {
        });
      },
      //关闭或开启
      closeorstrat(row){
        this.$confirm('确定要改变当前数据状态吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            id:row.id
          }
          if(row.state == 1){
            param .state = 0;
          }else{
            param .state = 1;
          }
          https_f.updateSuserObj(param).then(data => {
            this.$message({
              type: 'success',
              message: '执行成功!'
            });
            this.getdealerList_();
            //状态如果改变成功 直接通过传递的 对象改变当前表格绑定的数据值
            if(row.state == 1){
              row.state = 0;
            }else{
              row.state = 1;
            }
          }).catch(e => {
            console.log(JSON.stringify(e));
            this.$message("执行失败!");
          })
        }).catch(() => {
          console.log("取消");
        });
      },
      param_handle(arr){
        let newarr = arr;
        if(newarr.type == 6){
          delete newarr['type'];
        }
        if(newarr.shopType == 6){
          delete newarr['shopType'];
        }
        if(newarr.phone == ''){
          delete newarr['phone'];
        }
        if(newarr.shopName == ''){
          delete newarr['shopName'];
        }
        delete newarr['wxNickName'];
        delete newarr['name'];
        delete newarr['wxAppId'];
        return newarr;
      },
      /*用户授权 AAAAAAAAAAAAAA*/
      userAuthRole(id){
        console.log('');
        this.$router.push({name:'suser_roleAuthorizationcp', query:{id}})
      },
      /*获取功能数据列表*/
      getdealerList_() {
        this.loading = true;
        https_f.dealer_List(this.param_handle(this.dealerInfo)).then(data => {
          this.loading = false
          console.log("传递参数："+JSON.stringify(this.param_handle(this.dealerInfo)));
          console.log("返回数据："+JSON.stringify(data));

          this.dealerList = data.dataList;
          for(let x=0;x<this.dealerList.length;x++){
            this.dealerList[x].createTime =  this.formatDate_(this.dealerList[x].createTime);
          }
          this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      resetForm() {
        this.dealerInfo= {
          shopName:'',
          shopType:6,
          type:6,
          name:'',
          pageSize:20,
          pageNum:1,
          phone:'',
          auditState:6,
        }
        this.null =0;
        this.applyInfo={
          // shopName:'',
          phone:'',
          address:'',
          name:'',
          createDate:'',
          logoIamgeUrls:[],
          userId:'',
        }
      },
      getSelectDate(value) {
        this.dealerInfo.startTime = value[0]
        this.dealerInfo.endTime = value[1]
      },
      //  修改
      updateuser(row) {
        // let id = row.id;
        this.$router.push({name:`suserUpdate`, query:{row}})
      },
      //详情
      goToDetail(row){
        let id = row.id;
        this.$router.push({name:`dealerInfo`, query:{id}})
      },
      toggleState(row, index) {
      },
      indexMethods(index) {
        return (this.dealerInfo.pageNum - 1) * this.dealerInfo.pageSize + index + 1
      },
      //执行
      handlePageNumChange(num) {
        this.dealerInfo.pageNum = num
        this.getdealerList_();
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
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`])
    },
    //載入
    mounted:function(){
      this.null =0;
      this.dealerInfo.pageNum = 1;
      this.dealerInfo.shopName  = '';
      this.dealerInfo.shopType=6;
      this.dealerInfo.pageSize = 20;
      this.dealerInfo.type=6;
      this.dealerInfo.name='';
      this.dealerInfo.phone='';
      this.applyInfo={
        // shopName:'',
        phone:'',
        address:'',
        name:'',
        createDate:'',
        logoIamgeUrls:[],
        userId:'',
      }
      this.getdealerList_();
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

