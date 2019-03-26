<template>
  <div>
    <bread-nav>
      <span slot="up">/产品管理</span>
      <span slot="detail">/产品详情</span>
    </bread-nav>
    <h3>产品详情</h3>
    <div>
      <!-- 产品信息头部 -->
      <div>
        <h4>产品信息</h4>
        <div class="goodsInfo">
          <ul>
            <li>产品名称: <span> 剑南春12年400ml</span></li>
            <li>产品品牌: <span> 剑南春</span></li>
            <li>产品展示类目: <span> 百丽超市</span></li>
            <li>统计类目: <span> 酒水</span></li>
            <li>产品类型: <span> 入驻商产品</span></li>
            <li>销售城市: <span> 武汉市</span></li>
            <li>经销商: <span> 百丽超市</span></li>
            <li>商贸: <span> 百丽超市</span></li>
            <li>包装规格: <span> 10瓶/件</span></li>
            <li>首次上架时间: <span> 2018-04-09</span></li>
            <li>SKU状态: <span> 产品申请上架</span></li>
          </ul>
        </div>
      </div>
      <!-- 产品信息头部 -->
      <!-- 产品上架信息头部 -->
      <div>
        <el-tabs type="border-card">
          <!-- 产品上架信息 -->
          <el-tab-pane label="产品上架信息">
            <div class="upGoodsInfo">
              <ul>
                <li>产品名称:<span>剑南春12年400ml</span></li>
                <li>包装规格:<span>10瓶/件</span></li>
                <li>销售规格:<span>10瓶/件</span></li>
                <li>价格模式:<span>统一售价</span></li>
                <li>零售指导价:<span>17.00元/瓶</span></li>
                <li>配送方式:<span>易久批配送</span></li>
                <li>取货仓库:<span>武汉易久批仓库1号库</span></li>
                <li>库存:<span>10件</span></li>
                <li>生产日期:<span>2018-04-09</span></li>
                <li>起购:<span>10件</span></li>
                <li>限购:<span>每10天限购5件，永久有效</span></li>
                <li>促销信息:<span>百丽超市</span></li>
              </ul>
            </div>
          </el-tab-pane>
          <!-- 促销信息 -->
          <el-tab-pane label="促销信息">
            <span style="font-size: 15px; margin: 12px;">时间:</span>
            <!-- 时间选择器 -->
            <el-date-picker v-model="value6"  value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" style="margin: 12px 0;" size="mini">
            </el-date-picker>
            <!-- 时间选择器 -->
            <el-button type="primary" size="mini">查询</el-button>
            <el-button type="info"  size="mini">重置</el-button>
            <!-- table表格 -->
            <el-table :data="tableData" style="width: 100%">
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
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 产品上架信息头部 -->
    </div>
    <el-button class="gobackButton" type="primary" @click="goback">返回</el-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value6: '',
        tableData: [{
            date: "01",
            name: "每满50件赠3件农夫山泉",
            address: "2018-04-11~2018-05-12",
            type: "定向产品券"
          },
          {
            date: "02",
            name: "每满50件赠3件农夫山泉",
            address: "2018-04-11~2018-05-12",
            type: "定向产品券"
          },
          {
            date: "03",
            name: "每满50件赠3件农夫山泉",
            address: "2018-04-11~2018-05-12",
            type: "定向产品券"
          },
          {
            date: "04",
            name: "每满50件赠3件农夫山泉",
            address: "2018-04-11~2018-05-12",
            type: "定向产品券"
          }
        ]
      };
    },
    methods: {
      goback() {
        this.$router.push({
          path: "/goodsManage"
        });
      }
    }
  };

</script>

<style lang="stylus" scoped>
  ul,
  li {
    list-style: none;
  }

  .goodsInfo ul {
    display: flex;
    width: 98%;
    flex-wrap: wrap;

    >li {
      width: 33%;
      margin: 10px 0;
      font-size:15px;
    }
  }

  .upGoodsInfo ul {
    display: flex;
    width: 98%;
    flex-wrap: wrap;

    >li {
      width: 50%;
      margin: 10px 0;
      font-size:15px;
    }
  }

  .gobackButton{
    margin: 40px 39%;
  }
  .el-pagination{
    margin:20px 0 ;
  }
</style>
