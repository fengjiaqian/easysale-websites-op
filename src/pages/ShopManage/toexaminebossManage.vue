<template>
  <div id="toexaminebossManage"  v-loading="loading">
    <el-form :inline="true" :model="toexamineInfo"
             size="medium"
             label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="toexamineInfo">

      <el-form-item label="手机号">
        <el-input v-model="toexamineInfo.phone" placeholder="请输入搜索手机号" clearable></el-input>
      </el-form-item>
  <!--    <el-form-item label="申请人名称">
        <el-input v-model="toexamineInfo.name" placeholder="请输入搜索名称" clearable></el-input>
      </el-form-item>-->
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getToexamineList_" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button>
    </div>

    <!--表格-->
    <el-table
      :data="toexamineList"
      border
      height="520"
      style="width: 100%;margin-top:20px;">
      <el-table-column prop="wxNickName" label="微信昵称">
      </el-table-column>
      <el-table-column prop="shopName" label="店铺名称" ></el-table-column>
      <el-table-column prop="phone" label="手机号" ></el-table-column>

      <el-table-column prop="name" label="申请人" ></el-table-column>

      <el-table-column prop="updateDate" label="申请时间" ></el-table-column>

      <el-table-column fixed="right" label="操作"  >
        <template slot-scope="scope">
          <div v-if="scope.row.dealerId > 0 && scope.row.userId > 0 && scope.row.shopId > 0">
            <el-button type="text" size="small" @click="to_examine(scope.row)">审核</el-button>
            <el-button type="text" size="small" @click="refuse_examine(scope.row)">拒绝</el-button>
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
    <!--设置费用弹框-->
    <el-dialog
      :title="sqr_title"
      :visible.sync="chargeDialog"
      :modal-append-to-body="isXz"
    >
      <el-form :model="applyInfo" label-width="148px" class="el-form-product">
        <el-form-item label="申请人：">
          <el-input v-model="applyInfo.name" size="mini" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="申请手机号：">
          <el-input v-model="applyInfo.phone" size="mini" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称：">
          <el-input v-model="applyInfo.shopName" size="mini" disabled="disabled"></el-input>
        </el-form-item>
        <!-- <el-form-item label="店铺地址：">
           <el-input v-model="applyInfo.address" size="mini" disabled="disabled"></el-input>
         </el-form-item>-->
        <el-form-item label="申请时间：">
          <el-input v-model="applyInfo.createDate" size="mini" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="营业执照：" >
          <div class="el-upload__tip imgsclass"  v-for="index in applyInfo.logoIamgeUrls">
            <el-popover
              placement="right"
              title=""
              trigger="hover">
              <img :src="index" class="avatar"/>
              <img slot="reference" :src="index"  style="max-height: 178px;max-width: 178px">
            </el-popover>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qxshck">取 消</el-button>
        <el-button type="primary" @click="ckto_examine">通过审核</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import https_f from 'http/suserManageApi'
  import {formatDate} from './dateHandle'

  export default {
    name: "toexaminebossManage",
    data() {
      return {
        isXz:false,
        isshow:false,
        fdimg:'',
        isChoose:null,
        pageSize:20,
        pageNum:1,
        sqr_title:'申请人信息',
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        toexamineInfo: {
          name:'',
          phone:'',
        },
        applyInfo:{
          shopName:'',
          phone:'',
          address:'',
          name:'',
          createDate:'',
          logoIamgeUrls:[],
          userId:'',
          dealerId:'',
          userType:'',
          shopId:'',
          type:''
        },
        chargeDialog: false,
        totalCount: 0,
        toexamineList: [],
        loading: false,
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      refuse_examine(row){
        if(row.shopId && row.dealerId && row.userId){
          this.$confirm('确定要拒绝审核当前用户吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.chargeDialog = false;
            let par = {
              userId:row.userId,
              dealerId:row.dealerId,
              shopId:row.shopId,
              text:'AAAA'
            }

              https_f.refusebossapply(par).then(data => {
                console.log(JSON.stringify(data));
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '拒绝审核成功'
                });
                //变更成经销商   这个只能改变当条数据  经销商的值  改变不了  状态 所以调用重新获取刷新页面
                this.chargeDialog = false;
                this.getToexamineList_();
              }).catch(e => {
                this.$message(e)
                this.loading = false
              })

          }).catch(() => {
          });
        }else{
          this.$message('数据异常缺少用户ID/经销商ID/店铺ID')
        }
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
        if(row.shopId && row.dealerId && row.userId){
          let parm = {
            shopId:row.shopId,
            dealerId:row.dealerId
          }
          https_f.dealerbossapplyinfo(parm).then(data => {
            this.loading = false
            console.log(JSON.stringify(data));
            // this.applyInfo  = data;
            // return false;
            let ctimes = '';
            if(data.updateDate){
              ctimes =this.formatDate_(data.updateDate);
            }
            this.applyInfo  = {
              shopName:data.shopName,
              phone:data.phone,
              address:data.address,
              name:data.name,
              createDate:ctimes,
              logoIamgeUrls:data.logoIamgeUrls,
              userId:data.userId,
              dealerId:data.dealerId,
              shopId:data.shopId,
              userType:'',
              type:''
            };
            this.chargeDialog = true;
          }).catch(e => {
            this.$message('数据异常')
            this.loading = false
          })
        }else{
          this.$message('数据异常缺少用户ID/经销商ID/店铺ID')
        }

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
              userId:this.applyInfo.userId,
              dealerId:this.applyInfo.dealerId,
              shopId:this.applyInfo.shopId,
              userType:1,
              type:1,
            }
            if(this.applyInfo.userId != null && this.applyInfo.dealerId != null && this.applyInfo.userType != null && this.applyInfo.type != null && this.applyInfo.shopId != null){
              https_f.dealerbossapply(par).then(data => {
                console.log(JSON.stringify(data));
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '审核成功'
                });
                //变更成经销商   这个只能改变当条数据  经销商的值  改变不了  状态 所以调用重新获取刷新页面
                this.chargeDialog = false;
                this.getToexamineList_();
              }).catch(e => {
                this.$message(e)
                this.loading = false
              })
            }else{
              this.$message('数据异常')
            }
          }).catch(() => {
          });
        }
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
            this.getToexamineList_();
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
        newarr.pageNum = this.pageNum;
        newarr.pageSize = this.pageSize;
        return newarr;
      },
      /*获取功能数据列表*/
      getToexamineList_() {
        this.loading = true;
        https_f.dealerbossapplylist(this.param_handle(this.toexamineInfo)).then(data => {
          this.loading = false
          console.log(JSON.stringify(data));
          this.toexamineList = data.dataList;
          for(let x=0;x<this.toexamineList.length;x++){
            if(this.toexamineList[x].updateDate){
              this.toexamineList[x].updateDate =  this.formatDate_(this.toexamineList[x].updateDate);
            }
          }
          this.totalCount = data.pager.recordCount;
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      resetForm() {
        this.toexamineInfo= {
          name:'',
          phone:'',
        }
        this.null =0;
        this.applyInfo={
          shopName:'',
          phone:'',
          address:'',
          name:'',
          createDate:'',
          logoIamgeUrls:[],
          userId:'',
          dealerId:'',
          userType:'',
          shopId:'',
          type:''
        }
      },
      getSelectDate(value) {
        this.suserInfo.startTime = value[0]
        this.suserInfo.endTime = value[1]
      },
      //  修改
      updateuser(row) {
        // let id = row.id;
        this.$router.push({name:`suserUpdate`, query:{row}})
      },
      //详情
      goToDetail(row){
        let id = row.id;
        this.$router.push({name:`suserInfo`, query:{id}})
      },
      toggleState(row, index) {
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      //执行
      handlePageNumChange(num) {
        this.pageNum = num
        this.getToexamineList_();
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
      this.pageSize = 20;
      this.pageNum = 1;
      this.toexamineInfo = {
        name:'',
        phone:'',
      }
      this.applyInfo={
        shopName:'',
        phone:'',
        address:'',
        name:'',
        createDate:'',
        logoIamgeUrls:[],
        userId:'',
        dealerId:'',
        userType:'',
        shopId:'',
        type:''
      }
      this.getToexamineList_();
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
    width: 650px;
    height: 100%;
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

