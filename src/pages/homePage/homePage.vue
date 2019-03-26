<template>
  <div>
    <div>
      <h4 class="home-title">待办</h4>
      <div class="home-icon" @click="gotoRouter(`applyWarehouseProduct`)">
        <el-badge :value="productAmount" class="item">
          <img src="../../assets/icons/homePage.png" alt=""/>
        </el-badge>
        <p>申请入库产品待办</p>
      </div>


    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import https from 'http/wareHouseDealerApi'
  export default {
    data(){
      return {
        facilitatorId:``,
        productAmount:``,
      }
    },
    created(){
      this.facilitatorId = this.choseRoleInfoList.ruleOrgId
      this.getApplyAmount()
    },
    methods: {
      gotoRouter(pathName) {
        this.$router.push({
          path: `/${pathName}`
        });
      },
      getApplyAmount(){
        let {facilitatorId} = this
        https.getApplyProductAmount({facilitatorId}).then(data=>{
          this.productAmount = data
        })
      },
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`, `userInfo`])
    }
  };
</script>

<style lang="stylus" scoped>
  .item {
    margin-top: 10px;
    margin-left:20px
  }

  .home-title {
    border-bottom: 1px solid #ededed
    padding-bottom: 12px
    margin: 0
  }

  .home-icon {
    margin:40px 20px
  }
</style>
