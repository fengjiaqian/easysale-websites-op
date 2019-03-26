<template>
  <div id="warehouseControl" v-loading="loading">
    <!--搜索条件-->
    <el-form :inline="true" :model="strategySearchForm"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="strategySearchForm">
      <el-form-item label="所属公司">
        <el-input v-model="strategySearchForm.company" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="城市">
        <admin-city-selector
          ref="adminCitySelector"
          :targetLevel="2"
          @select-admin-city="onSelectAdminCity"
          @clean-admin-city="onCleanAdminCity"
        ></admin-city-selector>
      </el-form-item>
      <el-form-item label="仓库">
        <el-select v-model="strategySearchForm.warehouseIds" placeholder="请选择"
                   clearable :disabled="cityName?false:true" @change="selectWarehouse($event)">
          <el-option v-for="item in warehouseOptions"
                     :key="item.warehouseId"
                     :value="item.warehouseId"
                     :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getWarehouseList()" size="medium">查询</el-button>
      <el-button type="info" @click="resetForm()" style="margin-left:40px;" size="medium">重置</el-button>
    </div>
    <el-button type="primary" class="add-strategy" @click="addStrategy">添加策略</el-button>
    <el-table
      :data="strategyList"
      border
      style="width: 100%;margin-top:16px;">
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="configName" label="策略名称"></el-table-column>
      <el-table-column prop="company" label="所属公司"></el-table-column>
      <el-table-column prop="warehouseName" label="仓库"></el-table-column>
      <el-table-column label="强制抄码">
        <template slot-scope="scope">
          <el-switch
            class="switchStyle"
            v-model="scope.row.compulsoryCodeCopying"
            :active-value="1"
            :inactive-value="0"
            active-text="开"
            inactive-text="关"
            @change="changeCodeState($event,scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="默认策略">
        <template slot-scope="scope">
          <el-switch
            class="switchStyle"
            v-model="scope.row.defaultPolicy"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
            @change="changeStrategyState($event,scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editStrategy(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteWarehouseConfig(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="changeState(scope.row,scope.$index)">
            {{scope.row.status==1?'启用':'停用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination :page-size="strategySearchForm.pageSize" :current-page="strategySearchForm.pageNum"
                :total-count="totalCount"
                @pageNumChange="handlePageNumChange"
    ></pagination>
  </div>
</template>

<script>
  import http from 'http/warehouseControlApi'
  import https from 'http/warehouseMessageApi'
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState} from 'vuex'
  import pagination from 'common/pagination.vue'

  export default {
    name: "warehouseControl",
    data() {
      return {
        strategySearchForm: {
          company: ``,   //所属城市
          warehouseIds: ``,  //仓库名
          pageNum: 1,
          pageSize: 10,
        },
        loading: false,
        totalCount: 0,
        cityName: ``,    //城市
        warehouseOptions: [],
        strategyList: [],
        warehouseForm: {
          city: ``,
          cityId: ``,
          name: ``,
          pageNum: 1,
          pageSize: 100,
          parentCityId: ``,
          warehouseId: ``,
        },
      }
    },
    activated() {
      this.getWarehouseList()
    },
    components: {
      AdminCitySelector,
      pagination
    },
    methods: {
      changeState(row, index) {
        let id = row.id;
        let lastUpdateUser = row.lastUpdateUser;
        let status = row.status === 1 ? 0 : 1;
        http.updateWareHouseConfig({id, lastUpdateUser, status}).then(data => {
          this.$message(`修改状态成功`)
          this.strategyList[index].status = this.strategyList[index].status === 1 ? 0 : 1;
        }).catch(e => {
          this.$message(e)
        })
      },
      deleteWarehouseConfig(id) {
        http.deleteWarehouseConfig({id}).then(data => {
            this.$message(`删除成功`)
            this.getWarehouseList()
          }
        ).catch(e => {
          this.$message(e)
        })
      },

      getWarehouseList() {
        this.loading = true
        let {strategySearchForm} = this
        http.getWarehouseConfigList(strategySearchForm).then(data => {
          this.strategyList = data.dataList || []
          this.totalCount = data.pager.recordCount
          this.loading = false
        }).catch(e => {
          this.$message(e)
          this.loading = false
        })
      },
      resetForm() {
        this.strategySearchForm = {
          city: ``,
          warehouseIds: '',//仓库名称
          company: ``,
          pageNum: 1,
          pageSize: 10,
        }
        this.$refs[`adminCitySelector`].clean()
      },
      getWareHouseInfo() {
        console.log(`获取仓库信息`)
        if (this.choseRoleInfoList.ruleOrgType == 1) {
          this.warehouseForm.cityId = this.choseRoleInfoList.ruleOrgId
          this.warehouseForm.parentCityId = this.choseRoleInfoList.ruleOrgId
        } else {
          this.warehouseForm.cityId = ``
          this.warehouseForm.parentCityId = this.choseRoleInfoList.ruleOrgId
        }
        https.getWarehouseList(this.warehouseForm).then(data => {
          this.warehouseOptions = data
        })
      },
      /*分页*/
      handlePageNumChange(num) {
        this.strategySearchForm.pageNum = num
        this.getWarehouseList()
      },
      onSelectAdminCity(valueArr) {
        this.cityName = valueArr[valueArr.length - 1].name
        this.warehouseForm.city = valueArr[valueArr.length - 1].name   //TODO 仓库根据城市名搜索 暂时没数据
        // this.strategyForm.cityId = valueArr[valueArr.length - 1].id
        this.getWareHouseInfo()
      },
      onCleanAdminCity() {
        this.strategySearchForm.city = ``
      },
      addStrategy() { //添加策略
        this.$router.push({name: `addStrategy`})
      },
      indexMethods(index) {
        return (this.strategySearchForm.pageNum - 1) * this.strategySearchForm.pageSize + index + 1
      },
      /*编辑策略*/
      editStrategy(row) {
        let id = JSON.stringify(row.id)
        this.$router.push({name: `addStrategy`, query: {id}})
      },
      changeStrategyState(state, row) {
        this.loading = true
        let params = {
          defaultPolicy: state,
          id: row.id
        }
        http.updateWarehouseConfig(params).then(data => {
          this.$message(`修改成功`)
          this.loading = false
          this.getWarehouseList()
        }).catch(e => {
          this.$message(e)
          this.loading = false
          row.defaultPolicy = state == 0 ? 1 : 0
        })
      },
      changeCodeState(state, row) {
        this.loading = true
        let params = {
          compulsoryCodeCopying: state,
          id: row.id
        }
        http.updateWarehouseConfig(params).then(data => {
          this.$message(`修改成功`)
          this.loading = false
          this.getWarehouseList()
        }).catch(e => {
          this.$message(e)
          this.loading = false
          row.compulsoryCodeCopying = state == 0 ? 1 : 0
        })
      },
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`])
    }
  }
</script>

<style lang="stylus">
  #warehouseControl {
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

    .el-form {
      .el-form-item {
        .el-cascader, .el-select, .el-input {
          width 250px;
        }
      }
    }

    .query-btn {
      text-align center
      border-bottom: 1px solid #ededed
      padding-bottom: 20px
    }

    .add-strategy {
      padding: 10px 24px;
      margin-top: 16px
    }

    .demo .el-switch__label {
      position: absolute;
      display: none;
      color: #fff;
    }

    .switchStyle .el-switch__label {
      position: absolute;
      display: none;
      color: #fff;
    }

    .switchStyle .el-switch__label--left {
      z-index: 9;
      left: 27px;
    }

    .switchStyle .el-switch__label--right {
      z-index: 9;
      left: 0px;
    }

    .switchStyle .el-switch__label.is-active {
      display: block;
    }

    .switchStyle.el-switch .el-switch__core,
    .el-switch .el-switch__label {
      width: 52px !important;
      height: 22px;
    }
  }
</style>
