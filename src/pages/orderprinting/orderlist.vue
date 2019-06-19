<template>
  <div id="orderlist" >
    <div class="query-btn">
      <el-button type="primary" @click="handlePrint" size="medium">打印</el-button>
    </div>
    <!--表格-->
    <div ref="print">
      <el-form :inline="true"
               label-suffix="：">
        <el-form-item label="易经商订单" style="display:flex; justify-content:center;">
          <span>[1]</span>
        </el-form-item>
        <br>
        <el-form-item label="订单号">
          <span>252015566314455</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span>2019-06-19 09:54:15</span>
        </el-form-item>
        <el-form-item label="打印日期">
          <span>2019-06-19 09:54:15</span>
        </el-form-item>    <div id="qrCode" ref="qrCodeDiv" style="float: right; margin-left:70px;margin-top: 4px;"></div>  <br>
        <el-form-item label="客户名称">
          <span>张三</span>
        </el-form-item>

        <el-form-item label="店铺名称">
          <span>农夫山泉商贸</span>
        </el-form-item>
        <el-form-item label="收货人">
          <span>李四</span>
        </el-form-item><br>
        <el-form-item label="收货地址">
          <span>武汉市南湖大道</span>
        </el-form-item>
      </el-form>
    <el-table
      :data="orderList"
      border
      style="width: 100%;height: auto;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="a6" label="商品品牌" >
      </el-table-column>
      <el-table-column prop="a1" label="商品名称" >
      </el-table-column>
      <el-table-column prop="a2" label="规格" >
      </el-table-column>
      <el-table-column prop="a3" label="单价" >
      </el-table-column>
      <el-table-column prop="a4"  label="数量" >
      </el-table-column>
      <el-table-column  prop="a5" label="合计金额" >
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
  import QRCode from 'qrcodejs2';
  export default {
    name: "orderlist",
    data() {
      return {
        pageNum:1,
        pageSize:20,
        orderList:[
          {
            "a1":"百岁山饮用天然矿泉水348ml（1*24）","a2":"24瓶/件","a3":"3/瓶","a4":"1瓶","a5":"3","a6":"百岁山"
          },
          {
            "a1":"景田百岁山矿泉水348ml（1*24）","a2":"24瓶/件","a3":"3/瓶","a4":"1瓶","a5":"3","a6":"百岁山"
          },
          {
            "a1":"统一ALKAQUA爱夸饮用天然矿泉水A水570ml（1*15）","a2":"15瓶/件","a3":"5/瓶","a4":"1瓶","a5":"5","a6":"统一"
          },
          {
            "a1":"康师傅优悦矿泉水550ml（1*12）","a2":"12瓶/件","a3":"1/瓶","a4":"1瓶","a5":"1","a6":"康师傅"
          }
        ],
      }
    },
    components: {
      QRCode
    },
    methods: {
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      printContent(e){
        this.$print(this.$refs.print)
      },
      handlePrint () {
        this.showBtn = false  // 隐藏因素
        setTimeout(() => {
          this.$print(this.$refs.print)
          this.showBtn = true // 显示元素
        }, 50)
      },
      bindQRCode: function () {
        new QRCode(this.$refs.qrCodeDiv, {
          text: 'AAAAAA',
          width: 100,
          height: 100,
          colorDark: "#333333", //二维码颜色
          colorLight: "#ffffff", //二维码背景色
          correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
        })

      },
    },
    computed: {
    },
    //載入
    mounted:function(){
      this.bindQRCode();
    }
  }
</script>

<style scoped lang="stylus">
  .el-form {
    .el-form-item {
      /*margin-bottom: 00px*/
    }
    .el-input {
      width 250px;
    }
    .el-select {
      width 250px;
    }
  }
  .el-form-item {
    margin-bottom:0px
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
      /*margin-bottom: 12px*/
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

