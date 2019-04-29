<template>
  <div class="productAdd">
    <el-button @click="$router.go(-1)">返回</el-button>
    <el-form class="content" :model="customerInfo"
             ref="productDetailForm" label-width="115px"
             label-suffix="：" size="medium"
             :rules="rules"
             style="width:50%">

      <el-form-item label="客户名称" prop="name">
        <el-input v-model="customerInfo.name" :disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input v-model="customerInfo.phone" :disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="店铺名称" prop="customerShopName">
        <el-input v-model="customerInfo.customerShopName" :disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="地址" prop="address">
        <el-input v-model="customerInfo.address" :disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="客户标签" prop="label">
        <el-input v-model="customerInfo.label" :disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="维护销售人员" prop="salesmen">
        <el-input v-model="customerInfo.salesmen" :disabled="true"></el-input>
        <el-button type="text" @click="getDealerList(1)" v-if="!disabled">选择维护销售人员</el-button>
        <el-dialog title="收货地址" :visible.sync="dialogTableVisible" :modal="false">
          <el-table :data="gridData">
            <el-table-column property="date" label="日期" width="150"></el-table-column>
            <el-table-column property="name" label="姓名" width="200"></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleSelect(scope.$index, scope.row)">选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currentPage"
                         :page-sizes="[8]"
                         :page-size="pageSize"
                         layout="total, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </el-dialog>
      </el-form-item>

      <el-form-item label="下单总数" prop="totalOrders">
        <el-input v-model="customerInfo.totalOrders" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="下单总额" prop="totalOrderPrices">
        <el-input v-model="customerInfo.totalOrderPrices" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="customerInfo.state" :disabled="disabled">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <div v-if="disabled">
          <el-button type="primary" @click="handleEdit()">编辑</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="submitForm('customerInfo')">保存</el-button>
        </div>
        <!--<el-button @click="resetForm()">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import customerHttp from 'http/customerApi';
  import dealerHttp from 'http/dealerManageApi';

  export default {
    name: 'customerDetail',
    props: [],
    data() {
      return {
        customerInfo: {},
        disabled: true,
        currentUser: {},
        gridData: [],
        currentPage: 1,
        pageSize: 8,
        total: 0,
        dialogTableVisible: false
      }
    },
    mounted() {
      //获取当前登录人信息  设置当前操作人ID
      if (sessionStorage.getItem(`userInfo`) != null && sessionStorage.getItem(`userInfo`) !== undefined) {
        let userObj = sessionStorage.getItem(`userInfo`);
        this.currentUser = JSON.parse(userObj);
      } else {
        //用户信息获取失败
        this.$message("网络异常获取用户信息失败!");
      }
      this.customerInfo = this.$route.query.customerInfo;
      if (this.customerInfo.id) {
        this.getCustomerInfo();
      } else {
        this.disabled = false;
      }
    },
    activated() {
      //console.log(this.$route.query);
    },
    methods: {
      getCustomerInfo() {
        let param = {
          id: this.customerInfo.id
        }
        customerHttp.findCustomerInfo(param).then(data => {
          console.log(data)
          this.customerInfo = data;
        });
        console.log(this.customerInfo.totalOrders);
      },
      getDealerList(pageNum, pageSize) {
        if (pageNum) {
          this.currentPage = pageNum;
        }
        if (pageSize) {
          this.pageSize = pageSize;
        }
        this.loading = true;
        let param = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          type: 2
        }
        this.dialogTableVisible = true;
        dealerHttp.findDealerList(param).then(data => {
          if (data != null) {
            if (data != null) {
              this.gridData = data.dataList;
              this.total = data.pager.recordCount;
            }
            this.loading = false;
          }
          console.log(data);
        }).catch(e => {
          this.$message(e)
          this.loading = false;
        })
      },
      submitForm(obj) {
        this.$confirm('是否确认保存用户信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = Object.assign({}, this.customerInfo)
          if (params.id) {
            customerHttp.updateCustomer(params).then(data => {
              this.$message({
                type: 'success',
                message: '执行成功!'
              });
              this.disabled = true;
              //状态如果改变成功 直接通过传递的 对象改变当前表格绑定的数据值
              // row.state = row.state == 1 ? 0 : 1;
            }).catch(e => {
              console.log(JSON.stringify(e));
              this.$message("执行失败!");
            })
          } else {

          }
        }).catch(() => {
          console.log("取消");
        });
      },
      handleEdit() {
        this.disabled = false;
      },
      //分页方法
      handleSizeChange(val) {
        this.getDealerList(1, val);
      },
      handleCurrentChange(val) {
        this.getDealerList(val);
      },
      handleSelect(index, row) {
        this.customerInfo.salesmen = row.name;
        this.customerInfo.salesPersonUserId = row.id;
        this.dialogTableVisible = false;
      }
    },
    computed: {
      rules() {
        let baseRules = {
          name: [{required: true, message: '请输入客户名', trigger: 'change'}],
          state: [{required: true, message: '请选择状态', trigger: 'change'}],
        }
        return baseRules
      },
    }
  }
</script>
<style lang="stylus">
  .productAdd {

    .el-form {
      margin-top 40px;
      width 50%;
    }

    .el-select {
      width 100%;

      > .el-input__inner {
        cursor: text !important
      }
    }

    input {
      cursor: text !important
    }

    .el-cascader {
      width 100%;
    }

    .el-input.is-disabled > .el-input__inner {
      color: #333 !important
    }
  }

</style>
