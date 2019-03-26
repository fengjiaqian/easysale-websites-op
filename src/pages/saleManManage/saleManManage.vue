<template>
  <div>
    <div>
      <bread-nav>
        <span slot="saleMan">/入驻经销商</span>
      </bread-nav>
      <h1>入驻经销商</h1>
      <!-- table -->
      <el-tabs v-model="activeName" @tab-click="changeTab">
        <el-tab-pane label="待审核" name="0">
          <!-- ===============================待审核========================================== -->
          <!-- search -->
          <div class="search">
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商名称：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="dealerName" placeholder="请输入经销商名称" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="2">
                <span>联系人： </span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="dealerContact" placeholder="请输入经销商名称" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2">
                <span>手机号： </span>
              </el-col>
              <el-col :span="4    ">
                <el-input v-model="dealerPhoneNo" placeholder="请输入经销商手机号" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2">
                <span>业务城市： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerCity" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商类型： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerType" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="2">
                <span>状态： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerState" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="6" :offset="1">
                <el-button type="primary" @click="getSaleMan" size="medium">查询</el-button>
                <el-button type="info" @click="onClean" size="medium">清空</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="date" label="序号" min-width="130">
            </el-table-column>
            <el-table-column prop="name" label="经销商名称" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="联系人" min-width="130">
            </el-table-column>
            <el-table-column prop="city" label="联系人手机号" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="商贸" min-width="130">
            </el-table-column>
            <el-table-column prop="city" label="申请开通业务城市" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="申请时间" min-width="130">
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row,'notChecked')" type="text" size="small">详情</el-button>
                <el-button type="text" size="small">通过</el-button>
                <el-button type="text" @click="open" size="small">驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- ===============================待审核========================================== -->
        </el-tab-pane>
        <el-tab-pane label="已审核" name="1">
          <!-- ===============================已审核========================================== -->
          <!-- search -->
          <div class="search">
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商名称：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="dealerName" placeholder="请输入经销商名称" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="2">
                <span>联系人： </span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="dealerContact" placeholder="请输入经销商名称" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2">
                <span>手机号： </span>
              </el-col>
              <el-col :span="4    ">
                <el-input v-model="dealerPhoneNo" placeholder="请输入经销商手机号" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2">
                <span>业务城市： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerCity" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商类型： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerType" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="2">
                <span>状态： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerState" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="6" :offset="1">
                <el-button type="primary" @click="getSaleMan" size="medium">查询</el-button>
                <el-button type="info" @click="onClean" size="medium">清空</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="date" label="序号" min-width="130">
            </el-table-column>
            <el-table-column prop="name" label="经销商名称" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="联系人" min-width="130">
            </el-table-column>
            <el-table-column prop="city" label="联系人手机号" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="商贸" min-width="130">
            </el-table-column>
            <el-table-column prop="city" label="业务城市" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="入驻时间" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="是否首页推荐" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="排序号" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="状态" min-width="130">
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row,'checked')" type="text" size="small">详情</el-button>
                <el-button type="text" size="small">编辑</el-button>
                <el-button type="text" @click="stopUse" size="small">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- ===============================已审核========================================== -->
        </el-tab-pane>
        <el-tab-pane label="拒绝的" name="2">
          <!-- ===============================已拒绝========================================== -->
          <!-- search -->
          <div class="search">
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商名称：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="dealerName" placeholder="请输入经销商名称" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="2">
                <span>联系人： </span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="dealerContact" placeholder="请输入经销商名称" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2">
                <span>手机号： </span>
              </el-col>
              <el-col :span="4    ">
                <el-input v-model="dealerPhoneNo" placeholder="请输入经销商手机号" clearable></el-input>
              </el-col>

              <el-col :span="2">
                <span>业务城市： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerCity" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商类型： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerType" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="2">
                <span>状态： </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="dealerState" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="6" :offset="1">
                <el-button type="primary" @click="getSaleMan" size="medium">查询</el-button>
                <el-button type="info" @click="onClean" size="medium">清空</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="date" label="序号" min-width="130">
            </el-table-column>
            <el-table-column prop="name" label="经销商名称" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="联系人" min-width="130">
            </el-table-column>
            <el-table-column prop="city" label="联系人手机号" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="商贸" min-width="130">
            </el-table-column>
            <el-table-column prop="city" label="申请开通业务城市" min-width="130">
            </el-table-column>
            <el-table-column prop="province" label="申请时间" min-width="130">
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row,'deny')" type="text" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- ===============================已拒绝========================================== -->
        </el-tab-pane>
      </el-tabs>

      <!-- 分页 -->
      <div class="pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="400">
        </el-pagination>
      </div>
    </div>
    <!-- 分页 -->
  </div>
</template>

<script>
  import BreadNav from "../common/BreadNav.vue";
  import http from "../../assets/models/saleManApi.js";
  export default {
    data() {
      return {
        checkState: '',
        value: '',
        activeName: 0,
        dealerName: "cc",
        dealerContact: "cc",
        dealerPhoneNo: "13545395760",
        dealerCity: "",
        dealerType: "",
        dealerState: "",
        page: 1,
        pageSize: 10,
        stateOptions: [{
            value: "选项1",
            label: "黄金糕"
          },
          {
            value: "选项2",
            label: "双皮奶"
          },
          {
            value: "选项3",
            label: "蚵仔煎"
          },
          {
            value: "选项4",
            label: "龙须面"
          },
          {
            value: "选项5",
            label: "北京烤鸭"
          }
        ],
        tableData: [{
            date: "2016-05-03",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "1518 弄",
            zip: 200333,

          },
          {
            date: "2016-05-02",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "1518 弄",
            zip: 200333
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "1518 弄",
            zip: 200333
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "1518 弄",
            zip: 200333
          }
        ]
      };
    },
    created() {
      this.getSaleMan();
    },
    methods: {
      //切换table
      changeTab() {
        this.getSaleMan();
      },
      //分组组件的点击事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page = val;
      },
      handleClick(tab,type) {
        if(type=='notChecked' || type=='deny'){
           this.$router.push({
            path: "/saleManDetail"
          });
        }else if(type=='checked'){
          this.$router.push({
            path: "/saleManCheckedDetail"
          });
        }

      },
      //清楚输入框内容
      onClean() {
        this.dealerName = '';
        this.dealerContact = '';
        this.dealerPhoneNo = '';
        this.dealerCity = '';
        this.dealerType = '';
        this.dealerState = '';
      },
      //驳回点击的弹窗
      open() {
        this.$prompt("拒绝用户申请原因?", "确定拒绝该用户申请", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
          .then(({
            value
          }) => {
            this.$message({
              type: "success",
              message: "已成功拒绝"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消驳回"
            });
          });
      },
      stopUse(){
        this.$confirm('产品分组禁用，相应的价格调整也会禁用', '确定禁用', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '禁用成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          });
        });
      },
      //获取入驻经销商列表数据
      getSaleMan() {
        let params = {
          param: {
            checkState: this.activeName,
            dealerName: this.dealerName,
            dealerContact: this.dealerContact,
            dealerPhoneNo: this.dealerPhoneNo,
            dealerCity: this.dealerCity,
            dealerType: this.dealerType,
            dealerState: this.dealerState,
            page: this.page,
            pageSize: this.pageSize
          }
        };
        // http.getEnterSalerList(params).then(res => {});
      }
    }
  };

</script>


<style lang="stylus" scoped>
  .search {
    margin-bottom: 20px;
    .el-col{
      span{
        font-size:15px;
      }
    }
  }

  .el-row {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    >span {
      text-align: right;
    }
  }

  .pager {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .el-col-2 {
    width: 6.333%;
    justify-content: flex-end;
  }


</style>
