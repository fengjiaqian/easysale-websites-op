<template>
  <div id="app">
    <el-container style="border:1px solid #eee;top:0;bottom:0;width:100%;position: fixed;overflow-y: scroll;"
                  v-loading="menuLoading"
                  v-if="isLogin">
      <!--头部-->
      <el-header class="header-wrap">
        <div class="header-logo">
          <img src="./assets/icons/neibu.png"/>
          <span class="menu-header">易酒批仓配服务系统</span>
        </div>
        <div class="top-bar">
          <span>{{userInfo.trueName}},你好</span>
          <!--<el-select size="mini" :value="choosenRole" @change="changeRole" placeholder="请选择"
                     style="margin-right:20px;background-color: transparent">
            <el-option size="mini"
                       v-for="item in userInfo.userLoginAuth"
                       :key="item.roleCode"
                       :label="`${item.orgName}${item.role}`"
                       :value="item.roleCode"
            >
            </el-option>
          </el-select>-->
          <el-dropdown @command="changeRole" trigger="click">
            <span class="el-dropdown-link">
              {{`${choseRoleInfoList.orgName}${choseRoleInfoList.role}`}}<i
              class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in userInfo.userLoginAuth" :command="item.roleCode">
                {{`${item.orgName}${item.role}`}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span @click="logOut" class="cancel">注销</span>
        </div>
      </el-header>
      <!--主内容区-->
      <el-container>
        <!--侧边栏导航菜单-->
        <el-aside class="menu-wrap" style="width: 210px;">
          <el-menu style="flex: 1" :router="true"
                   background-color="rgb(54, 65, 80)"
                   text-color="#fff"
                   active-text-color="#fff">
            <div v-for="item in roleInfoList">
              <el-submenu :index="item.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  {{item.name}}
                </template>
                <el-menu-item-group v-for="itemNav in item.navList">
                  <el-menu-item :index="itemNav.id" :route="{name:itemNav.routePage}" @click="handleMenuClick(itemNav)">
                    {{itemNav.name}}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </div>
          </el-menu>


          <!--<el-menu :router="true">-->
          <!--<el-submenu index="1">-->
          <!--<template slot="title"><i class="iconfont icon-dingdan"></i>订单管理</template>-->
          <!--<el-menu-item index="1-1" :route="{name:`inboundOrder`}">第三方入库申请单</el-menu-item>-->
          <!--<el-menu-item index="1-2" :route="{name:`outboundOrder`}">第三方出库申请单</el-menu-item>-->
          <!--<el-menu-item index="1-3" :route="{name:`entrustDeliveryOrder`}">第三方委托配送单</el-menu-item>-->
          <!--</el-submenu>-->
          <!--</el-menu>-->
          <!--<el-menu :router="true">-->
          <!--<el-submenu index="2">-->
          <!--<template slot="title"><i class="iconfont icon-cangkucangchu"></i>仓库管理</template>-->
          <!--<el-menu-item index="2-1" :route="{name:`warehouseMessageManage`}">仓库信息管理</el-menu-item>-->
          <!--<el-menu-item index="2-2" :route="{name:`warehouseStock`}">仓库库存</el-menu-item>-->
          <!--</el-submenu>-->
          <!--</el-menu>-->
        </el-aside>
        <!--功能区-->
        <el-main>
          <el-tabs v-model="editableTabsValue" closable type="card" @edit="handleTabsEdit" @tab-click="handleTabsClick">
            <el-tab-pane
              :key="item.name"
              v-for="(item, index) in editableTabs"
              :label="item.title"
              :name="item.name"
            >
            </el-tab-pane>
          </el-tabs>
          <transition>
            <keep-alive>
              <router-view v-if="$route.meta.keepalive"></router-view>
            </keep-alive>
          </transition>
          <transition>
            <router-view v-if="!$route.meta.keepalive"></router-view>
          </transition>
        </el-main>

      </el-container>
    </el-container>
    <router-view v-else></router-view>
  </div>
</template>

<script>
  import {getCookie} from "./utils/CookieUtil";
  import {mapState, mapMutations, mapActions} from "vuex";
  import http from 'http/loginApi';

  export default {
    name: "app",
    data() {
      return {
        roleList: [],
        roleCode: ``,
        editableTabsValue: '1空页面',
        editableTabs: [{
          title: '新标签页',
          name: '1空页面',
        }],
        tabIndex: 1,
        menuLoading: false,
      }
    },
    //mounted() {
    //this.updateCheckState(getCookie(`checkState`))
    //},
    computed: {
      isLogin() {
        return !!this.token;
      },
      isGroupCompany() {
        return this.choseRoleInfoList.ruleOrgType === 2
      },
      ...mapState(`user`, [`token`, `userInfo`, `choosenRole`, `roleInfoList`, `originRole`, `choseRoleInfoList`])
    },
    watch: {
      editableTabsValue(newValue) {
        this.$router.push({name: newValue})
      },
    },
    methods: {
      logOut() {
        this.clearToken();
        window.location.reload()
      },
      //根据选中的角色找到对应的权限ID
      findAuthIdRole(code) {
        let findRole = this.userInfo.userLoginAuth.find(item => item.roleCode == code);
        this.setChoseRoleInfoList(findRole);
      },
      //点击标签页
      handleTabsClick(tab, event) {
        console.log(tab, event);
      },
      //添加或者删除标签页
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '空页面';
          this.editableTabs.push({
            title: '新标签页',
            name: newTabName,
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
      //点击菜单项
      handleMenuClick(itemNav) {
        //切换选中的标签页
        //先看已打开的标签页中有没有
        let index = this.editableTabs.findIndex(item => item.name === itemNav.routePage)
        //有的话切换
        if (index !== -1) {
          this.editableTabsValue = itemNav.routePage
        } else {
          //判断当前所在页面是不是空页面(空页面的title属性都是“新标签页”,name属性都是数字加“空页面”)
          //如果是空页面直接替换当前页面
          let isAtEmptyPage = this.editableTabsValue.indexOf(`空页面`) !== -1
          if (isAtEmptyPage) {
            let currentIndex = this.editableTabs.findIndex(item => item.name === this.editableTabsValue)
            this.editableTabs[currentIndex] = {title: itemNav.name, name: itemNav.routePage}
          } else {
            this.editableTabs.push({title: itemNav.name, name: itemNav.routePage})
          }
          this.editableTabsValue = itemNav.routePage
        }
      },

      // //获取菜单接口
      changeRole(selectRole) {
        console.log(selectRole)
        this.menuLoading = true;
        //1.声明一个变量保存原有的角色
        //2.vuex修改，切换到新角色
        this.setOriginRole(this.choosenRole)
        this.updateOriginRole(this.choosenRole)
        this.updateChoosenRole(selectRole);
        let roleCode = selectRole;
        http.getMenuList(roleCode).then(data => {
          //拿到菜单的原始数据的时候做一下修改，每个子菜单新增一个路由字段
          this.findAuthIdRole(selectRole);
          let resultMenuList = this.rebuildMenu(data)
          this.setRoleInfoList(resultMenuList);
          this.menuLoading = false;
          //切换角色成功时，将路由切到新菜单首页
          this.$router.replace(this.roleInfoList[0].navList[0].routePage);
          this.editableTabs = [{
            title: this.roleInfoList[0].navList[0].name,
            name: this.roleInfoList[0].navList[0].routePage
          }]
          this.editableTabsValue = this.roleInfoList[0].navList[0].routePage;
        }).catch(e => {
          this.menuLoading = false;
          //3.新角色没有配置菜单，弹出提示
          //4.将原有的角色重新存入vuex，恢复原状
          this.$message({message: `当前角色没有配置菜单`})
          this.updateChoosenRole(this.originRole);
          console.log(e)
        })
      },
      rebuildMenu(menuList) {
        if (!this.isGroupCompany) {
          menuList = menuList.filter(item => item.id !== `BaseDataManage`)
        }
        //根据namespace字段去设置一个新的字段routePage
        menuList.forEach(list => {
          this.rebuildList(list)
        })
        return menuList
      },
      rebuildList: function (listDemo) {
        /*if(listDemo.navList==null){
          return
        }*/
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
          } else if (menuItem.nameSpace === `/dealerAudit`) {//经销商审核
            menuItem.routePage = `dealerAudit`
          } else if (menuItem.nameSpace === `/shopAudit`) {//店铺审核
            menuItem.routePage = `shopAudit`
          }
          else if (menuItem.nameSpace === `applyWarehouseProduct`) {//产品
            menuItem.routePage = `applyWarehouseProduct`
          } else if (menuItem.nameSpace === `warehouseStock`) {//仓库库存
            menuItem.routePage = `warehouseStock`
          } else if (menuItem.nameSpace === `/warehouseControl`) {//仓库库存
            menuItem.routePage = `warehouseControl`
          }
        })
        //菜单过滤的时候，基础数据服务这个菜单一般公司就不显示
        // if (!this.isGroupCompany) {
        //  // listDemo.navList = listDemo.navList.filter(item => item.routePage !== `subCompanyManage`)
        //   listDemo=listDemo.filter(item=>item.id!==`BaseDataManage`)
        // }
        return listDemo
      },
      ...mapActions(`user`, [`updateOriginRole`, `clearToken`]),
      ...mapMutations(`user`, [`updateCheckState`, `updateChoosenRole`, `setRoleInfoList`, `setOriginRole`, `setChoseRoleInfoList`, `clearToken`]),
    }
  };

</script>

<style lang="scss" scoped>
  #app {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }

  .footer {
    text-align: center;
    border-top: 1px solid #eee;
    margin: 5px;
    padding: 20px;
  }

  .menu-wrap {
    width: 200px;
    display: flex;
    flex-direction: column;;
    justify-content: flex-start;;
    align-items: stretch;
  }

  .header-logo {
    display: flex;
    align-items: center;
    > img {
      margin-right: 8px;
    }
  }

  .header-wrap {
    max-height: 50px;
    line-height: 50px;
    background-color: #2B3643;
    color: #fff;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 60px 0 20px;

    > i {
      font-size: 20px;
      margin-right: 20px;
    }
  }

  .menu-header {
    height: 50px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    line-height: 50px;
  }

  .top-bar {
    display: flex;;
    flex-direction: row;;
    justify-content: center;
    align-items: center;
  }

  .el-dropdown {
    color: #fff;
    min-width: 150px;
    margin: 0 40px;
  }

  .el-dropdown-link {
    cursor: pointer;
  }

  .cancel {
    color: #409EFF;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
