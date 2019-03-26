<template>
<div>
  <bread-nav slot="up">
    <span>销售订单</span>
    <span></span>
  </bread-nav>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column >
      <template slot-scope="scope">
        <div>
          <!-- header -->
            <span>订单号:{{scope.row.orederNo}}</span>
            <span>下单时间:{{scope.row.date}}</span>
           <!-- header -->
           <!-- body -->
          <div class="order-info">
            <div>
              <ul>
                <li v-for="item in scope.row.goodsList">
                  <span>{{item.goodName}}</span>
                  <span>{{item.goodsBox}}</span>
                  <span>{{item.goodsUnit}}</span>
                  <span>{{item.goodsChest}}</span>
                  <span>{{item.goodsPrice}}</span>
                </li>
                
              </ul>
            </div>
            <!-- 客服信息 -->
            <div>
              <ul>
                <li><span>客服姓名: </span><span>曹灿</span></li>
                <li><span>客户手机号: </span><span>13545395760</span></li>
                <li><span>客户店铺: </span><span>可多超市</span></li>
                <li><span>订单总金额: </span><span>118元</span></li>
                <li><span>订单应付金额: </span><span>118元</span></li>
                <li><span>收货人: </span><span>别局</span></li>
                <li><span>收货人手机号: </span><span>13688888888</span></li>
                <li><span>地址: </span><span>湖北省武汉市花山大道软件新城</span></li>
              </ul>
            </div>
            <!-- 客服信息 -->
            <div>待审核</div>
            <div><span>详情</span><span>取消订单</span></div>
          </div>
          <!-- body -->
        </div>
      </template>
    </el-table-column>
     
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
</div>
  
</template>

<script>
  // import BreadNav from '../common/breadNav.vue'
  export default {
    data() {
      return {
        tableData: [{
            date: "2016-05-02",
            orederNo:'1008123',
            goodsList:[
              {
                goodName:'德国进口 雪夫小麦白啤酒550ml*24听',
                goodsBox:'118元/箱',
                goodsUnit:'24瓶/箱',
                goodsChest:'1箱',
                goodsPrice:'118元'
              },
              {
                goodName:'德国进口 雪夫小麦白啤酒550ml*24听',
                goodsBox:'118元/箱',
                goodsUnit:'24瓶/箱',
                goodsChest:'1箱',
                goodsPrice:'118元'
              }
            ],   
          },
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄",
            orederNo:'1008123',
             goodsList:[
              {
                goodName:'德国进口 雪夫小麦白啤酒550ml*24听',
                goodsBox:'118元/箱',
                goodsUnit:'24瓶/箱',
                goodsChest:'1箱',
                goodsPrice:'118元'
              },
              {
                goodName:'德国进口 雪夫小麦白啤酒550ml*24听',
                goodsBox:'118元/箱',
                goodsUnit:'24瓶/箱',
                goodsChest:'1箱',
                goodsPrice:'118元'
              }
            ],   
          }
        ],
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4
      };
    },
     methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
   
  };

</script>

<style lang="stylus" scoped>
  ul,li{
    list-style none 
  }
  .order-info{
    display flex
    >div{
      border 1px solid #ccc
      flex-grow: 2
      &:nth-child(-n+3){
       border-right none
      }
    }
    
  }
</style>

