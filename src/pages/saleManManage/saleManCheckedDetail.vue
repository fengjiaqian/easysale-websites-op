<template>
  <div>
    <bread-nav>
      <span slot="up">/申请上架产品/</span>
      <span slot="detail">产品详情</span>
    </bread-nav>
    <h2>经销商详情</h2>
    <div>
      <!-- 产品上架信息头部 -->
      <div>
        <el-tabs type="border-card" v-model="activeName" @tab-click="changeTab">
          <!-- 产品上架信息 -->
          <el-tab-pane label="基本信息" name="0">
            <div class="upGoodsInfo">
              <ul style="font-size: 15px;">
                <li>经销商名称:<span>百丽超市</span></li>
                <li>详细地址:<span>西藏藏族自治区拉萨市城关区城关南路</span></li>
                <li>联系人手机:<span>18524625478</span></li>
                <li>经销商类型:<span>普通经销商</span></li>
                <li>备注:<span>百丽超市</span></li>
                <li>用户所在城市:<span>西藏藏族自治区拉萨市</span></li>
                <li>联系人:<span>王然</span></li>
                <li>公司logo:<span>百丽超市</span></li>
                <li>申请开通的业务城市:<span>南京市</span></li>
              </ul>
            </div>
          </el-tab-pane>
          <!-- 开店信息 -->
          <el-tab-pane label="开店信息" name="1">
            <div class="openStoreInfo">
              <ul style="font-size:15px;">
                <li>商贸名称:<span>百丽超市</span></li>
                <li>支付方式:<span>经销商收款</span></li>
                <li>是否首页推荐:<span>是</span></li>
                <li>商贸logo:<span>百丽超市</span></li>
                <li>商贸状态:<span>启用</span></li>
                <li>经销商性质:<span>个体户</span></li>
                <li>身份证号:<span>658478596685478547</span></li>
                <li>联系电话:<span>18542457845</span></li>
                <li>地址:<span>南京市-江北区</span></li>
                <li>联系人电话:<span>18542457845</span></li>
                <li>身份证（正反面:<span>百丽超市</span></li>
              </ul>
              <ul>
                <li>开通业务城市:<span>南京市-江北区</span></li>
                <li>配送方式:<span>支持易久批配送</span></li>
                <li>排序号:<span>123</span></li>
                <li>商贸介绍:<span>中百超市是一家百货店，属于山东潍坊百货集团股份有限公司，以立足潍坊市区、辐射周边县市为发展思路，基本实现对潍坊市场的网络覆盖。</span></li>
                <li>入驻时间:<span>2018-04-08 18:06</span></li>
                <li>法人名称:<span>王然</span></li>
                <li>年营业额:<span>200-500万</span></li>
                <li>常用邮箱:<span>123@xyz.com</span></li>
                <li>联系人姓名:<span>王然</span></li>
                <li>营业执照（三证合一）:<span>百丽超市</span></li>
              </ul>
            </div>
          </el-tab-pane>
          <!-- 员工信息 -->
          <el-tab-pane label="员工信息" name="2">
            <!-- search -->
            <div class="search">
              <el-row type="flex">
                <el-col :span="2">
                  <span>店员姓名：</span>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="dealerName" placeholder="请输入经销商名称" clearable size="mini"></el-input>
                </el-col>
                <el-col :span="2">
                  <span>手机号： </span>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="dealerContact" placeholder="请输入经销商名称" clearable size="mini"></el-input>
                </el-col>

                <el-col :span="2">
                  <span>店员类型： </span>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="dealerCity" placeholder="请选择" style="width: 100%;" size="mini">
                    <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                    </el-option>
                  </el-select>
                </el-col>

                <el-col :span="2">
                  <span>状态： </span>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="dealerCity" placeholder="请选择" style="width: 100%;" size="mini">
                    <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-button type="primary"  size="medium">查询</el-button>
                  <el-button type="info"  size="medium">清空</el-button>
                </el-col>
              </el-row>
            </div>
            <!-- table表格 -->
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="序号" width="180"></el-table-column>
              <el-table-column prop="name" label="操作人ID" width="180"></el-table-column>
              <el-table-column prop="address" label="操作人"></el-table-column>
              <el-table-column prop="date" label="操作人电话" width="180"></el-table-column>
              <el-table-column prop="name" label="内容" width="180"></el-table-column>
              <el-table-column prop="address" label="数据类型"></el-table-column>
              <el-table-column prop="date" label="操作时间" width="180"></el-table-column>
              <el-table-column prop="name" label="操作" width="180"></el-table-column>
            </el-table>
            <!-- table表格 -->
            <!-- 分页 -->
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </el-tab-pane>
          <!-- 生意信息 -->
          <el-tab-pane label="生意信息" name="3">
            <!-- table表格 -->
            <span style="font-size:15px;margin-left: 16px;">时间:</span>
            <!-- 时间选择器 -->
            <el-date-picker v-model="value5" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" size="mini"style="margin: 16px 16px 0 0;">
            </el-date-picker>
            <!-- 时间选择器 -->
            <el-button type="primary"  size="medium">查询</el-button>
            <el-button type="info"  size="medium">重置</el-button>
            <!-- table表格 -->
            <el-table :data="tableData" style="width: 100%;margin: 16px 0;">
              <el-table-column prop="date" label="序号">
              </el-table-column>
              <el-table-column prop="name" label="活动名称">
              </el-table-column>
              <el-table-column prop="address" label="活动时间">
              </el-table-column>
              <el-table-column prop="address" label="活动类型">
              </el-table-column>
            </el-table>
            <!-- table表格 -->
            <!-- 分页 -->
            <el-pagination background layout="total,  prev, pager, next" :total="1000">
            </el-pagination>
            <!-- table表格 -->
          </el-tab-pane>
          <!-- 配送范围设置 -->
          <el-tab-pane label="配送范围设置" name="4">
            <el-row type="flex" style="margin: 16px 0;">
              <el-col :span="2">
                <span>街道名称：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="customerName" placeholder="请输入街道名称" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-button type="primary" size="medium">查询</el-button>
                <el-button type="info" size="medium">清空</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-button type="primary" size="mini" style="margin-bottom: 16px;">+新增街道</el-button>
            </el-row>
            <!-- table表格 -->
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="序号" width="180"></el-table-column>
              <el-table-column prop="name" label="操作人ID" width="180"></el-table-column>
              <el-table-column prop="address" label="操作人"></el-table-column>
              <el-table-column prop="date" label="操作人电话" width="180"></el-table-column>
              <el-table-column prop="name" label="内容" width="180"></el-table-column>
              <el-table-column prop="address" label="数据类型"></el-table-column>
              <el-table-column prop="date" label="操作时间" width="180"></el-table-column>
              <el-table-column prop="name" label="操作" width="180"></el-table-column>
            </el-table>
            <!-- table表格 -->
            <!-- 分页 -->
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </el-tab-pane>
          <!-- 经销商会员 -->
          <el-tab-pane label="经销商会员" name="5">
            <el-row type="flex" style="margin: 16px 0;">
              <el-col :span="2">
                <span>会员名称：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="customerName" placeholder="请输入会员名称" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="2">
                <span>手机号：</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="customerName" placeholder="请输入手机号" clearable size="mini"></el-input>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-button type="primary" size="medium">查询</el-button>
              </el-col>
            </el-row>
            <!-- table表格 -->
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="序号" width="180"></el-table-column>
              <el-table-column prop="name" label="操作人ID" width="180"></el-table-column>
              <el-table-column prop="address" label="操作人"></el-table-column>
              <el-table-column prop="date" label="操作人电话" width="180"></el-table-column>
              <el-table-column prop="name" label="内容" width="180"></el-table-column>
              <el-table-column prop="address" label="数据类型"></el-table-column>
              <el-table-column prop="date" label="操作时间" width="180"></el-table-column>
              <el-table-column prop="name" label="操作" width="180"></el-table-column>
            </el-table>
            <!-- table表格 -->
            <!-- 分页 -->
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </el-tab-pane>
          <!-- 产品信息 -->
          <el-tab-pane label="产品信息" name="6">
            <!-- table表格 -->
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

                <el-col :span="2">
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

                <el-col :span="4" >
                  <el-button type="primary" size="medium">查询</el-button>
                  <el-button type="info" size="medium">清空</el-button>
                </el-col>
              </el-row>
            </div>
            <!-- search -->
            <!-- 表格 -->
            <el-table :data="tableData1" border style="width: 100%">
              <el-table-column fixed prop="date" label="序号" width="80">
              </el-table-column>
              <el-table-column prop="addModel" label="展示类目" width="100">
              </el-table-column>
              <el-table-column prop="name" label="品牌" min- width="100">
              </el-table-column>
              <el-table-column prop="province" label="产品名称" min-width="170">
              </el-table-column>
              <el-table-column prop="city" label="销售城市" min-width="100">
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
            </el-table>
            <!-- 表格 -->
            <!-- table表格 -->
            <!-- 分页 -->
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </el-tab-pane>
          <!-- 操作记录 -->
          <el-tab-pane label="操作记录" name="7">
            <!-- table表格 -->
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="序号" width="180"></el-table-column>
              <el-table-column prop="name" label="操作人ID" width="180"></el-table-column>
              <el-table-column prop="address" label="操作人"></el-table-column>
              <el-table-column prop="date" label="操作人电话" width="180"></el-table-column>
              <el-table-column prop="name" label="内容" width="180"></el-table-column>
              <el-table-column prop="address" label="数据类型"></el-table-column>
              <el-table-column prop="date" label="操作时间" width="180"></el-table-column>
              <el-table-column prop="name" label="操作" width="180"></el-table-column>
            </el-table>
            <!-- table表格 -->
            <!-- 分页 -->
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 产品上架信息头部 -->
    </div>
    <el-button class="gobackButton" type="primary" @click="goback">返回</el-button>
  </div>
</template>
<script>
  import http from "../../assets/models/saleManApi.js";

  export default {
    data() {
      return {
        dealerName: '',
        dealerContact: '',
        dealerCity: '',
        activeName: 0,
        customerName: '',
        principalName: '',
        value5: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        tableData: [{
          date: "01",
          name: "8974",
          address: "上海市普陀区金沙江路 1518 弄"
        },
          {
            date: "02",
            name: "8974",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            date: "03",
            name: "8974",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: "04",
            name: "8974",
            address: "上海市普陀区金沙江路 1516 弄"
          }
        ],
        tableData1: [{
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
      };
    },
    created() {
      this.getBasicInfo();
    },
    methods: {
      goback() {
        this.$router.push({
          path: "/saleManManage"
        });
      },
      changeTab() {
        this.getBasicInfo();
      },
      getBasicInfo() {
        let params = {
          param: {
            id: this.activeName
          }
        };
        //   http.getEnterSalerList(params).then(res => {});
      },
    }
  };

</script>

<style lang="stylus" scoped>
  ul,
  li {
    list-style: none;
  }

  /*  .goodsInfo ul {
      letter-spacing: 2px;
      display: flex;
      width: 98%;
      flex-wrap: wrap;
      >li {
        width: 33%;
        margin: 10px 0;
        font-size:15px;
      }
    }*/

  .openStoreInfo {
    letter-spacing: 2px;
    display: flex;
    width: 98%;
    flex-wrap: wrap;

    ul {
      width: 47%;
      > li {
        width: 91%;
        margin: 26px 0;
      }
    }
  }

  .upGoodsInfo ul {
    letter-spacing: 2px;
    display: flex;
    width: 98%;
    flex-wrap: wrap;
    > li {
      width: 50%;
      margin: 10px 0;
      font-size: 15px;
    }
  }

  .el-col {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    font-size: 15px;
    > span {
      text-align: right;
    }
  }

  .el-col-2 {
    width: 7.33%;
  }

  .gobackButton {
    margin: 40px 39%;
  }

  .el-pagination {
    margin-top: 20px;
  }

  .search {
    .el-row{
      margin: 16px 0;
    }

  }

</style>
