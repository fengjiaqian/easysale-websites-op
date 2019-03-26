<template>
  <div class="page-wrap" v-loading.fullscreen.lock="fullscreenLoading">
    <img class="login-bg" src="../../assets/icons/bgPhoto@2x.png" alt=""/>
    <!--<div class="login-bg"></div>-->
    <img class="login-login" src="../../assets/icons/group31.png"/>
    <div class="title-header">
      <img src="../../assets/icons/neibu.png"/>
      易酒批仓配服务系统
    </div>
    <img class="login-shadow" src="../../assets/icons/shadow.png"/>
    <div class="login-input-block">
      <div class="title">用户登录</div>
      <div class="grid-content bg-purple">
        <el-input style="width: 363px;margin: 48px 0 24px 0;" placeholder="请输入用户名" prefix-icon="el-icon-mobile-phone"
                  v-model="account"></el-input>
      </div>
      <div class="grid-content bg-purple">
        <el-input style="width: 363px;" placeholder="请输入登陆密码" type="password" prefix-icon="el-icon-edit"
                  v-model="password"></el-input>
      </div>

      <el-button type="primary" style="width: 350px;margin-top: 24px;" @click="clickLogin">登录</el-button>
    </div>
  </div>
</template>

<script>
  import http from 'http/loginApi';
  import {mapState, mapActions, mapMutations} from 'vuex'

  export default {
    name: "login",
    data() {
      return {
        password: ``,
        account: ``,
        roleCode: ``,
        //设备版本信息
        appCode: ``,
        appVersion: ``,
        deviceId: ``,
        deviceOS: ``,
        deviceType: ``,
        userToken: '',
        fullscreenLoading: false
      }
    },
    methods: {
      //UA认证接口，拿到token之后,再调登陆接口
      getUALogin() {
        this.fullscreenLoading = true
        let {account, password, appCode, appVersion, deviceId, deviceOS, deviceType} = this
        http.getUALogin({account, password, appCode, appVersion, deviceId, deviceOS, deviceType}).then(data => {
          this.userToken = data.token
          this.setToken({token: this.userToken});
          this.updateToken(this.userToken);
          this.getLoginInfo()
          this.fullscreenLoading = false
        }).catch(e => {
          console.log(e)
          this.$message(e)
          this.fullscreenLoading = false
        })
      },
      //登录接口
      getLoginInfo() {
        this.fullscreenLoading = true
        let userToken = this.userToken;
        http.getLoginInfo({userToken}).then(data => {
          //将获取到的用户信息存在vuex中
          this.setUserInfo({userInfo: data});
          this.updateUserInfo(data);
          this.roleCode = data.userLoginAuth[0].roleCode;
          let choseRoleInfoList = data.userLoginAuth[0];//当前选中角色的信息
          this.setChoseRoleInfoList(choseRoleInfoList);
          this.updateChoseRoleInfoList(choseRoleInfoList);
          //this.roleCode=`Developer`
          this.updateChoosenRole(this.roleCode);//将角色列表中的第一角色存在vuex中
          this.updateChoseRole(this.roleCode);
          console.log('role', this.roleCode)
          this.$message('登录成功');
          this.getMenuList()
          this.$router.replace({path: `/emptyPage`})
          this.fullscreenLoading = false
        }).catch(e => {
          console.log(e)
          this.clearToken()
          this.$message(e)
          this.fullscreenLoading = false

        })
      },
      getMenuList() {
        let {roleCode} = this;
        http.getMenuList(roleCode).then(data => {
          //拿到菜单的原始数据的时候做一下修改，每个子菜单新增一个路由字段
          let resultMenuList = this.rebuildMenu(data)
          this.setRoleInfoList(resultMenuList)
          this.updateRoleInfoList(resultMenuList)
        }).catch(e => {
          console.log(e)
        })
      },
      rebuildMenu(menuList) {
        //如果不是集团公司账户，就隐藏基础数据管理
        if (!this.isGroupCompany) {
          menuList = menuList.filter(item => item.id !== `BaseDataManage`)
        }
        //根据namespace字段去设置一个新的字段routePage
        menuList.forEach(list => {
          this.rebuildList(list)
        })
        return menuList
      },
      rebuildList(listDemo) {
        listDemo.navList.forEach(menuItem => {
          if (menuItem.nameSpace === `/ServiceInfoManage`) {
            menuItem.routePage = `servicerManage`
          } else if (menuItem.nameSpace === `/WarehouseInfoManage`) {
            menuItem.routePage = `warehouseMessageManage`
          } else if (menuItem.nameSpace === `/OrgManage`) {
            menuItem.routePage = `subCompanyManage`
          } else if (menuItem.nameSpace === `/SystemSettings`) {
            menuItem.routePage = `accountSetting`
          } else if (menuItem.nameSpace === `/StockIn`) {//入库申请单
            menuItem.routePage = `inboundOrder`
          } else if (menuItem.nameSpace === `/StockOut`) {
            menuItem.routePage = `outboundOrder`
          } else if (menuItem.nameSpace === `/Delivery`) {
            menuItem.routePage = `entrustDeliveryOrder`
          } else if (menuItem.nameSpace === `/wareHouseDealer`) {//仓配经销商
            menuItem.routePage = `wareHouseDealer`
          } else if (menuItem.nameSpace === `/dealerAudit`) {  //经销商审核
            menuItem.routePage = `dealerAudit`
          } else if (menuItem.nameSpace === `/shopAudit`) {   //店铺审核
            menuItem.routePage = `shopAudit`
          } else if (menuItem.nameSpace === `applyWarehouseProduct`) {//产品
            menuItem.routePage = `applyWarehouseProduct`
          } else if (menuItem.nameSpace === `warehouseStock`) {//仓库库存
            menuItem.routePage = `warehouseStock`
          } else if (menuItem.nameSpace === `/warehouseControl`) {//仓库库存
            menuItem.routePage = `warehouseControl`
          }
        })
        //菜单过滤的时候，基础数据服务这个菜单一般公司就不显示
        // if (!this.isGroupCompany) {
        //   listDemo.navList = listDemo.navList.filter(item => item.routePage !== `subCompanyManage`)
        // }
        return listDemo
      },
      clickLogin() {
        this.getUALogin();
        localStorage.setItem("account", this.account);
        localStorage.setItem("password", this.password);
      },
      ...mapActions(`appConfig`, [`getVersionInfo`]),
      ...mapActions(`user`, [`updateToken`, `updateUserInfo`, `updateChoseRole`, `updateRoleInfoList`, `updateChoseRoleInfoList`,`clearToken`]),
      ...mapMutations(`user`, [`setUserInfo`, `setToken`, `updateChoosenRole`, `setRoleInfoList`, `setChoseRoleInfoList`,`clearToken`])
    },
    computed: {
      isGroupCompany() {
        return this.choseRoleInfoList.ruleOrgType === 2
      },
      ...mapState(`user`, [`userInfo`, `choseRoleInfoList`])
    },
    created() {
      //从vuex中获取版本信息
      this.getVersionInfo().then(data => {
        this.appCode = data.appCode;
        this.appVersion = data.appVersion;
        this.deviceId = data.deviceId;
        this.deviceOS = data.deviceOS;
        this.deviceType = data.deviceType;
      })
      // if(getCookie(`token`)){
      //   this.getLoginInfo();
      // }

      for (let i = localStorage.length - 1; i >= 0; i--) {
        if (localStorage.key(i) === 'account') {
          this.account = localStorage.getItem(localStorage.key(i))
        } else if (localStorage.key(i) === 'password') {
          this.password = localStorage.getItem(localStorage.key(i))
        }
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .el-row {
    margin-top 10px
  }

  .page-wrap {
    position relative;
    height 100%;
    width 100%;
  }

  .login-bg {
    position absolute;
    width 100%;
    height 900px;
    top 0;
    left 0;
    // background: url("../../assets/icons/bgPhoto@2x.png")
  }

  .login-login {
    position absolute;
    top 30px;
    left 40px;
  }

  .login-input-block {
    position absolute;
    background-color #fff;
    width 464px;
    height 393px;
    right 50%;
    top 50%;
    transform: translate(50%, 60%);
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items center
  }

  .title {
    width 100%;
    padding 18px;
    font-size 17px;
    border-bottom 1px solid #ededed;
    box-sizing border-box;
    text-align center;
  }

  .title-header {
    position: absolute;
    left: 50%;
    font-size: 30px;
    color: #fff;
    top: 155px;
    display: flex;
    align-items: center;
    transform: translate(-50%, 0);
    > img {
      margin-right: 8px;
      width: 48px;
      height: 35px;
    }
  }

  .login-shadow {
    right: 50%;
    top: 50%;
    transform: translate(50%, 50%);
    position: absolute;

  }
</style>
