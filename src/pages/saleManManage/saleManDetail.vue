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
              <ul>
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
              <ul>
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
                <li>入驻时间:<span>2018-04-08  18:06</span></li>
                <li>法人名称:<span>王然</span></li>
                <li>年营业额:<span>200-500万</span></li>
                <li>常用邮箱:<span>123@xyz.com</span></li>
                <li>联系人姓名:<span>王然</span></li>
                <li>营业执照（三证合一）:<span>百丽超市</span></li>
              </ul>
            </div>
          </el-tab-pane>
          <!-- 促销信息 -->
          <el-tab-pane label="操作记录" name="2">
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
        activeName: 0,
        value5: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        tableData: [
          {
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
        ]
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
        // http.getEnterSalerList(params).then(res => {});
      },
    }
  };
</script>

<style lang="stylus" scoped>
  ul, li {
    list-style: none;
  }

  .goodsInfo ul {
    letter-spacing: 2px;
    display: flex;
    width: 98%;
    flex-wrap: wrap;

    > li {
      width: 33%;
      margin: 26px 0;
    }
  }

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
        font-size: 15px;
      }
    }
  }

  .upGoodsInfo ul {
    letter-spacing: 2px;
    display: flex;
    width: 98%;
    flex-wrap: wrap;
    font-size: 15px;
    > li {
      width: 50%;
      margin: 10px 0;
    }
  }

  .el-pagination {
    margin-top:20px;
  }

  .gobackButton {
    margin: 40px 39%;
  }
</style>
