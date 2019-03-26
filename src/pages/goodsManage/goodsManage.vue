<template>
  <div>
    <div>
      <bread-nav>
        <span slot="up">/产品管理</span>
      </bread-nav>
      <h1>申请上架产品</h1>
      <!-- table -->
      <el-tabs v-model="activeName">
        <!-- =============================待审核待审核待审核============================================================ -->
        <el-tab-pane label="待审核" name="first">
          <!-- 待审核search -->
          <div class="search">
            <el-row type="flex">
              <el-col :span="2">
                <span>产品名称：</span>
              </el-col>
              <el-col :span="4" >
                <el-input v-model="customerName" placeholder="请输入客户名称" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="2">
                <span>品牌：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="principalName" placeholder="请输入负责人姓名" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2" :offset="1">
                <span>销售城市：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="phone" placeholder="请输入负责人手机号" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2" :offset="1">
                <span>配送方式：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="2" style="margin-left: 20px;">
                <span>新增方式：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="6" :offset="1">
                <el-button type="primary" size="mini">查询</el-button>
                <el-button type="info" size="mini">清空</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 待审核search -->
          <!-- 待审核表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="date" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="品牌" width="130">
            </el-table-column>
            <el-table-column prop="province" label="产品名称" width="170">
            </el-table-column>
            <el-table-column prop="city" label="销售城市" width="130">
            </el-table-column>
            <el-table-column prop="address" label="经销商" width="130">
            </el-table-column>
            <el-table-column prop="zip" label="包装规格" width="130">
            </el-table-column>
            <el-table-column prop="saleType" label="销售规格" width="130">
            </el-table-column>
            <el-table-column prop="saleModel" label="价格模式" width="130">
            </el-table-column>
            <el-table-column prop="wholesale" label="批价" width="130">
            </el-table-column>
            <el-table-column prop="retailPrice" label="零售指导价" width="130">
            </el-table-column>
            <el-table-column prop="addModel" label="商品新增方式" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                <el-button type="text" size="small">通过</el-button>
                <el-button type="text" @click="open3" size="small">驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 待审核表格 -->
        </el-tab-pane>
        <!-- =============================已审核已审核已审核============================================================ -->
        <el-tab-pane label="已审核" name="second">
          <!-- 已审核search -->
          <div class="search">
            <el-row type="flex">
              <el-col :span="2">
                <span>产品名称：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="customerName" placeholder="请输入客户名称" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="2">
                <span>品牌：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="principalName" placeholder="请输入负责人姓名" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2">
                <span>类目：</span>
              </el-col>
              <el-col :span="4    ">
                <el-input v-model="phone" placeholder="请输入负责人手机号" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2" :offset="1">
                <span>销售城市：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="2">
                <span>新增方式：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="2">
                <span>状态：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="4" :offset="1">
                <el-button type="primary" size="mini">查询</el-button>
                <el-button type="info" size="mini">清空</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 已审核search -->
          <!-- 已审核的表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="date" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="addModel" label="展示类目" width="100">
            </el-table-column>
            <el-table-column prop="name" label="品牌" width="100">
            </el-table-column>
            <el-table-column prop="province" label="产品名称" width="170">
            </el-table-column>
            <el-table-column prop="city" label="销售城市" width="100">
            </el-table-column>
            <el-table-column prop="address" label="经销商" width="100">
            </el-table-column>
            <el-table-column prop="zip" label="包装规格" width="100">
            </el-table-column>
            <el-table-column prop="saleType" label="销售规格" width="110">
            </el-table-column>
            <el-table-column prop="saleModel" label="价格模式" width="100">
            </el-table-column>
            <el-table-column prop="wholesale" label="批价" width="100">
            </el-table-column>
            <el-table-column prop="retailPrice" label="零售指导价" width="120">
            </el-table-column>
            <el-table-column prop="addModel" label="商品新增方式" width="120">
            </el-table-column>
            <el-table-column prop="addModel" label="状态" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClickChecked(scope.row)" type="text" size="small">详情</el-button>
                <el-button @click="dialogFormVisible = true" type="text" size="small">调整类目</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 已审核表格 -->
        </el-tab-pane>
        <!-- =============================已拒绝已拒绝已拒绝============================================================ -->
        <el-tab-pane label="已拒绝" name="third">
          <!-- 已拒绝search -->
          <div class="search">
            <el-row type="flex">
              <el-col :span="2">
                <span>产品名称：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="customerName" placeholder="请输入客户名称" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="2">
                <span>品牌：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="principalName" placeholder="请输入负责人姓名" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2" :offset="1">
                <span>销售城市：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="phone" placeholder="请输入负责人手机号" clearable size="mini"></el-input>
              </el-col>

              <el-col :span="2" :offset="1">
                <span>配送方式：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="2">
                <span>经销商：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="2">
                <span>新增方式：</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="state" placeholder="请选择" style="width: 100%;" size="mini">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="6" :offset="1">
                <el-button type="primary" size="mini">查询</el-button>
                <el-button type="info" size="mini">清空</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 已拒绝search -->
          <!-- 已拒绝表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="date" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="品牌" width="130">
            </el-table-column>
            <el-table-column prop="province" label="产品名称" width="170">
            </el-table-column>
            <el-table-column prop="city" label="销售城市" width="130">
            </el-table-column>
            <el-table-column prop="address" label="经销商" width="130">
            </el-table-column>
            <el-table-column prop="zip" label="包装规格" width="130">
            </el-table-column>
            <el-table-column prop="saleType" label="销售规格" width="130">
            </el-table-column>
            <el-table-column prop="saleModel" label="价格模式" width="130">
            </el-table-column>
            <el-table-column prop="wholesale" label="批价" width="130">
            </el-table-column>
            <el-table-column prop="retailPrice" label="零售指导价" width="130">
            </el-table-column>
            <el-table-column prop="addModel" label="商品新增方式" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 已拒绝表格 -->
        </el-tab-pane>
      </el-tabs>

      <div class="pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[100, 200, 300, 400]"
          :page-size="100" layout="total,  prev, pager, next" :total="400">
        </el-pagination>
      </div>
    </div>
    <!-- 弹出对话框 -->
    <el-dialog title="调整目录" :modal="false" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <p>展示类目*</p>
        <el-form-item label="烟酒店" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域" class="setWidth">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-select v-model="form.region" placeholder="请选择活动区域" class="setWidth">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="便利店" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域" class="setWidth">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-select v-model="form.region" placeholder="请选择活动区域" class="setWidth">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餐饮店" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域" class="setWidth">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-select v-model="form.region" placeholder="请选择活动区域" class="setWidth">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <p>统计目录*</p>
        <el-form-item label="" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域" class="setWidth">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-select v-model="form.region" placeholder="请选择活动区域" class="setWidth">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import BreadNav from "../common/BreadNav.vue";
  export default {
    data() {
      return {
        principalName: '',
        customerName: '',
        phone: '',
        state: '',
        activeName: "first",
        tableData: [{
          date: '01',
          name: '酒鬼',
          province: '国藏酒鬼52度500ml...',
          city: '武汉市',
          address: '百丽超市',
          zip: '10瓶/件',
          saleType: '10瓶/件',
          saleModel: '统一售价',
          wholesale: '17.00元/瓶',
          retailPrice: '17.00元/瓶',
          addModel: '导入的'
        }, {
          date: '02',
          name: '酒鬼',
          province: '国藏酒鬼52度500ml...',
          city: '武汉市',
          address: '百丽超市',
          zip: '10瓶/件',
          saleType: '10瓶/件',
          saleModel: '统一售价',
          wholesale: '17.00元/瓶',
          retailPrice: '17.00元/瓶',
          addModel: '导入的'
        }, {
          date: '03',
          name: '酒鬼',
          province: '国藏酒鬼52度500ml...',
          city: '武汉市',
          address: '百丽超市',
          zip: '10瓶/件',
          saleType: '10瓶/件',
          saleModel: '统一售价',
          wholesale: '17.00元/瓶',
          retailPrice: '17.00元/瓶',
          addModel: '导入的'
        }, {
          date: '04',
          name: '酒鬼',
          province: '国藏酒鬼52度500ml...',
          city: '武汉市',
          address: '百丽超市',
          zip: '10瓶/件',
          saleType: '10瓶/件',
          saleModel: '统一售价',
          wholesale: '17.00元/瓶',
          retailPrice: '17.00元/瓶',
          addModel: '导入的'
        }],
        stateOptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      };
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleClick(tab, event) {
        console.log(tab, event);
        this.$router.push({
          path: '/goodsDetail'
        })
      },
      handleClickChecked() {
        this.$router.push({
          path: '/checkedGoodsDetail'
        })
      },
      open3() {
        this.$prompt(`拒绝该产品上架申请，则产品不能进行销售，你还要继续吗 ? 拒绝用户申请原因? `, '确定拒绝该用户申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({
          value
        }) => {
          this.$message({
            type: 'success',
            message: '已成功拒绝'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消驳回'
          });
        });
      }
    }
  };

</script>


<style lang="stylus" scoped>
  .search {
    margin: 12px 0 24px 0;
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size:15px;
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
    width: 5.333%;
    justify-content: flex-end;
  }

  .setWidth {
    width: 192px;
  }

</style>
