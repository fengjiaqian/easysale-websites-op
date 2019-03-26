<template>
  <div id="operator">
    <!--搜索-->
    <el-form :inline="true"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="产品名称">
        <el-input v-model="productName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="经销商">
        <el-select v-model="ownerId" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="item in dealerList"
            :key="item.dealerId"
            :label="item.dealerName"
            :value="item.dealerId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务城市">
        <business-city-selector
          ref="businessCitySelector"
          @select-biz-city="onSelectBusinessCity"
          @clean-biz-city="onCleanBusinessCity"
        ></business-city-selector>
      </el-form-item>
      <el-form-item label="仓库">
        <el-select v-model="warehouseId" size="medium"  placeholder="请选择仓库">
          <el-option
            v-for="item in warehouseList"
            :key="item.warehouseId"
            :label="item.name"
            :value="item.warehouseId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货主类型">
        <!--ownerType:``,//	酒批：0 合作商：1 入驻商：2-->
        <el-select v-model="ownerType" placeholder="请选择">
          <el-option label="酒批" value="0"></el-option>
          <el-option label="合作商" value="1"></el-option>
          <el-option label="入驻商" value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="query-btn">
      <el-button type="primary"  size="medium" @click="clickQuery">查询</el-button>
      <el-button type="info" @click="emptyContent" size="medium">重置</el-button>
    </div>

    <!--表格 商品-->
    <el-table
      v-loading="loading"
      :data="productStockList"
      border
      height="520"
      style="width: 100%;margin-top:28px;">
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="productBrand" label="品牌"></el-table-column>
      <el-table-column prop="specificationName" label="包装规格"></el-table-column>
      <el-table-column prop="ownerName" label="货主"></el-table-column>
      <el-table-column label="货主类型">
        <template slot-scope="scope">
          <!--ownerType:``,//	酒批：0 合作商：1 入驻商：2-->
          <span>{{scope.row.ownerType==0?'酒批':scope.row.ownerType==1?'合作商':'入驻商'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockNum" label="库存"></el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="pageSize"
      :total="totalCount"
      v-if="totalCount>0"
    >
    </el-pagination>
  </div>
</template>

<script>
  import http from 'http/warehouseMessageApi'
  import BusinessCitySelector from 'common/BusinessCitySelector';
  import {mapState, mapGetters} from 'vuex';
  export default {
    name: "warehouseStock",
    filters: {
      formatTime(timestrap) {
        let date = new Date(timestrap)
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      }
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 20,
        loading: true,
        //activeName:`first`,
        state: null,
        productName:``,
        stockDialogVisible:false,
        formLabelWidth: `100px`,
        totalCount: 0,
        ownerType:``,//	酒批：0 合作商：1 入驻商：2
       // city:``,
        cityId:``,
        warehouseId: ``,
        warehouseList:[],
        ownerId:``,//经销商IdS
        dealerList:[],
        productStockList:[],

      }
    },
    components: {
      BusinessCitySelector
    },
    mounted() {
      this.listWarehouseInventory();
      this.handleGetWarehouseList();
      this.selectDealerChargeList();
    },
    methods: {
      //仓库查询接口
      listWarehouseInventory(){
        let facilitatorId = this.choseRoleInfoList.ruleOrgId;
        let {cityId,ownerId,ownerType,pageNum,pageSize,productName,warehouseId}=this;
        http.listWarehouseInventory({facilitatorId,cityId,ownerId,ownerType,pageNum,pageSize,productName,warehouseId}).then(data=>{
          this.loading=false;
          let dataResultList=data.dataList;
          dataResultList.forEach(item=>{
            item.stockNum=item.packageCount+''+item.packageName+''+item. unitCount+''+item.unitName;
          })
          this.productStockList=dataResultList;
          this.totalCount=data.pager.recordCount
        }).catch(e=>{
          this.loading=false;
          console.log(e)
        })
      },
      //查询仓库信息
      handleGetWarehouseList(){
        //let city=this.city;
        let city=``
        let pageNum=1;
        let pageSize=1000;
        //ruleOrgType=2是集团公司，ruleOrgType=1是一般公司
        //如果是集团公司，就只传到parentcityId
        //如果是一般公司，就parentcityId和cityId都穿服务商Id
        let checkCompany=this.choseRoleInfoList.ruleOrgType||'';
        let serviceId=this.choseRoleInfoList.ruleOrgId;
        //把服务商id传到parentcityId里面去可以查服务商及子服务商的仓库,
        //如果只查一个服务商的仓库，那就把id同时传到parentcityId和’cityId里面
        //分页参数是必须填的，parentcityId必填，其它的不用的话都可以不填
        let cityId=``;
        let parentCityId=``;
        if(checkCompany===1){//一般公司
          cityId=serviceId;
          parentCityId=serviceId;
        }else{//集团公司
          cityId=``;
          parentCityId=serviceId;
        }
        http.getWarehouseList({city,cityId,parentCityId,pageNum,pageSize}).then(data=>{
          this.warehouseList=data;
        }).catch(e=>{
          console.log(e)
        })
      },
      //经销商查询接口
      selectDealerChargeList(){
        let facilitatorId = this.choseRoleInfoList.ruleOrgId;
        http.selectDealerChargeList({facilitatorId}).then(data=>{
          this.dealerList=data.dataList;
        }).catch(e=>{
          console.log(e)
        })
      },
      handlePageNumChange(num){
        this.pageNum=num;
        this.listWarehouseInventory();
      },
      indexMethods(index) {
        return (this.pageNum - 1) * this.pageSize + index + 1
      },
      addWarehouse(){
        this.stockDialogVisible=true
      },
      //查询
      clickQuery(){
        this.listWarehouseInventory();
      },
      //清空
      emptyContent() {
        this.cityId=``;
        this.city=``;
        this.ownerId=``;
        this.ownerType=``;
        this.productName=``;
        this.warehouseId=``;
        this.$refs[`businessCitySelector`].cleanCity()
        this.listWarehouseInventory();
      },
      onSelectBusinessCity(valueArr) {
        console.log('valueArr',valueArr);
        this.cityId = valueArr.city.cityId;
        //this.city=valueArr.city.city;
      },
      onCleanBusinessCity() {
        //this.city=``;
        this.cityId = ``
      },
      gotoDetail(){
        this.$router.replace('/stockDetail')
      }

    },
    computed:{
      ...mapState(`user`, [`choseRoleInfoList`])
    }

  }
</script>

<style scoped lang="stylus">
  #operator {
    .header {
      border-bottom: 1px solid #ededed;
      padding-bottom: 20px;
    }
    .el-col {
      display: flex;
      flex-direction: row;
      align-items center;
    }
    .el-row {
      display: flex;
      align-items center;
      padding-bottom: 15px;
      padding-left: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .addAd {
      padding: 10px 24px;
      margin-top: 30px;
    }
    .el-pagination {
      float right;
      margin-top 20px;
    }
  }

  .query-btn{
    text-align center
    border-bottom:1px solid #ededed
    padding-bottom:20px
  }

</style>


