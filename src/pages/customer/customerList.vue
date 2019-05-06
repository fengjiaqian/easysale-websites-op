<template>
  <div id="accountSetting">

    <el-form :inline="true"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="客户名称">
        <el-input></el-input>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getCustomerList(1)" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" size="medium">重置</el-button>
    </div>
    <el-button type="primary" class="addAd" @click="getCustomerList">新增客户</el-button>

    <template>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="label"
          label="标签"
          width="180">
        </el-table-column>
        <el-table-column
          prop="customerShopName"
          label="客户店铺"
          width="240">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.state==1?'启用':'停用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleStatus(scope.$index, scope.row)">{{scope.row.state===1?'停用':'启用'}}</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 50, 100, 200]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </template>
  </div>
</template>
<script>
  import http from 'http/customerApi';
  export default {
    name: "customerList",
    data() {
      return {
        currentUser:{},
        loading: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: []
      }
    },
    mounted() {
      //获取当前登录人信息  设置当前操作人ID
      if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
        let  userobj  =sessionStorage.getItem(`userInfo`);
        this.currentUser = JSON.parse(userobj);
      }else{
        //用户信息获取失败
        this.$message("网络异常获取用户信息失败!");
      }
      this.getCustomerList();
    },
    //keepalive组件每次进都会触发的方法
    activated() {
      // this.getRoleList();
      //this.getRoleTreeList();
      console.log(`生命周期activated`)
    },
    //components: { treeTable },
    methods: {
      getCustomerList(pageNum, pageSize){
        if(pageNum){
          this.currentPage = pageNum;
        }
        if(pageSize){
          this.pageSize = pageSize;
        }
        this.loading = true;
        let param = {
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }
        http.findCustomerListByParam(param).then(data => {
          if(data != null){
            this.tableData = data.dataList;
            this.total = data.pager.recordCount;
          }
          this.loading = false;
        }).catch(e => {
          this.$message(e)
          this.loading = false;
        })
      },
      resetForm() {

      },
      //table操作列
      handleStatus(index, row) {
        let str = row.state == 1 ? '停用' : '启用';
        this.$confirm('是否确认' + str + '该用户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            updateUser:this.currentUser.id,
            id:row.id
          }
          param.state = row.state == 1 ? 0 : 1;
          http.updateCustomer(param).then(data => {
            this.$message({
              type: 'success',
              message: '执行成功!'
            });
            //状态如果改变成功 直接通过传递的 对象改变当前表格绑定的数据值
            row.state = row.state == 1 ? 0 : 1;
          }).catch(e => {
            console.log(JSON.stringify(e));
            this.$message("执行失败!");
          })
        }).catch(() => {
          console.log("取消");
        });
      },
      handleDetail(index, row) {
        this.$router.push({path: '/customerDetail', query: {customerInfo: row}})
      },
      //分页方法
      handleSizeChange(val){
        this.getCustomerList(1, val);
      },
      handleCurrentChange(val){
        this.getCustomerList(val);
      }
    },
    computed: {

    },
    watch: {
      // choseRoleInfoList(newValue) {
      //   this.getRoleList();
      //   this.getRoleTreeList();
      //   this.showServiceSelector = !this.choseRoleInfoList.ruleOrgId;
      // }
    },
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
</style>
