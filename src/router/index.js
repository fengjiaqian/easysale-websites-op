import Vue from 'vue'
import Router from 'vue-router'
//import {memberList} from './memberManageModule'
import login from '../pages/login/login'
import userManage from '../pages/warehouseDelivery/userManage'
import saleOrders from '../pages/saleOrders/saleOrders'
import homePage from '../pages/homePage/homePage'
import goodsManage from '../pages/goodsManage/goodsManage'
import goodsDetail from '../pages/goodsManage/goodsDetail'
import checkedGoodsDetail from '../pages/goodsManage/checkedGoodsDetail'
import saleManManage from '../pages/saleManManage/saleManManage'
import saleManDetail from '../pages/saleManManage/saleManDetail'
import saleManCheckedDetail from '../pages/saleManManage/saleManCheckedDetail.vue'
import dealerDetail from '../pages/warehouseDelivery/dealerDetail'
import productManage from '../pages/warehouseDelivery/productManage'
import productDetail from '../pages/warehouseDelivery/productDetail'
import accountSetting from '../pages/sysSeting/accountSetting.vue'
import addAccount from '../pages/sysSeting/addAccount.vue'
import inboundOrder from '../pages/warehouseDelivery/inboundOrder'
import outboundOrder from '../pages/warehouseDelivery/outboundOrder'
import entrustDeliveryOrder from '../pages/warehouseDelivery/entrustDeliveryOrder'
import inboundDetail from '../pages/warehouseDelivery/inboundDetail'
import outboundDetail from '../pages/warehouseDelivery/outboundDetail'
import entrustDeliveryDetail from '../pages/warehouseDelivery/entrustDeliveryDetail'
import warehouseMessageManage from '../pages/warehouseDelivery/warehouseMessageManage'
import warehouseMessageDetail from '../pages/warehouseDelivery/warehouseMessageDetail'
import warehouseMessageAdd from '../pages/warehouseDelivery/warehouseMessageAdd'
import warehouseStock from '../pages/warehouseDelivery/warehouseStock'
import stockDetail from '../pages/warehouseDelivery/stockDetail'
import subCompanyManage from '../pages/warehouseDelivery/subCompanyManage'
import subCompanyDetail from '../pages/warehouseDelivery/subCompanyDetail'
import warehouseControl from '../pages/warehouseDelivery/warehouseControl'  //仓库管控
import addStrategy from '../pages/warehouseDelivery/addStrategy'  //添加策略
import servicerManage from '../pages/servicerManage/servicerManage'
import servicerManageDetail from '../pages/servicerManage/servicerManageDetail'
import addServicerManage from '../pages/servicerManage/addServicerManage'
//经销商详情
import userDetail from '../pages/warehouseDelivery/userDetail'
import accountDetail from '../pages/sysSeting/accountDetail'
//经销商管理 ---  仓配经销商
import wareHouseDealer from '../pages/dealerManage/wareHouseDealer'
//经销商审核
import dealerAudit from '../pages/dealerManage/dealerAudit'
//经销商审核详情
import dealerAuditDetail from '../pages/dealerManage/dealerAuditDetail'
//店铺审核
import shopAudit from '../pages/dealerManage/shopAudit'
//店铺审核详情
import shopAuditDetail from '../pages/dealerManage/shopAuditDetail'
//产品管理
import applyWarehouseProduct from '../pages/productManage/applyWarehouseProduct'
//新增产品
import productAdd from '../pages/productManage/productAdd'
//产品详情
import warehouseProductDetail from '../pages/productManage/warehouseProductDetail'
import chooseProduct from '../pages/warehouseDelivery/chooseProduct'
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/userManage",
      name: "userManage",
      component: userManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/saleOrders',
      name: 'saleOrders',
      component: saleOrders,
      meta: {
        keepalive: true
      }
    },
    {
      path: "/dealerDetail",
      name: 'dealerDetail',
      component: dealerDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/goodsManage',
      name: 'goodsManage',
      component: goodsManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/goodsDetail',
      name: 'goodsDetail',
      component: goodsDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/checkedGoodsDetail',
      name: 'checkedGoodsDetail',
      component: checkedGoodsDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/saleManManage',
      name: 'saleManManage',
      component: saleManManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/saleManDetail',
      name: 'saleManDetail',
      component: saleManDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/saleManCheckedDetail',
      name: 'saleManCheckedDetail',
      component: saleManCheckedDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: homePage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/productManage',
      name: 'productManage',
      component: productManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: productDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/accountSetting',
      name: 'accountSetting',
      component: accountSetting,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/accountDetail/id/cityId',
      name: 'accountDetail',
      component: accountDetail,

    },
    {
      path: '/addAccount',
      name: 'addAccount',
      component: addAccount,

    },
    {
      path: '/editAccount',
      name: 'editAccount',
      component: addAccount,
    },
    {
      path: '/inboundOrder',
      name: 'inboundOrder',
      component: inboundOrder,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/outboundOrder',
      name: 'outboundOrder',
      component: outboundOrder,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/entrustDeliveryOrder',
      name: 'entrustDeliveryOrder',
      component: entrustDeliveryOrder,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/inboundDetail/:stockNo/:dealerId',
      name: 'inboundDetail',
      component: inboundDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/outboundDetail/:stockNo/:dealerId',
      name: 'outboundDetail',
      component: outboundDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/entrustDeliveryDetail/:stockNo/:dealerId',
      name: 'entrustDeliveryDetail',
      component: entrustDeliveryDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/warehouseMessageManage',
      name: 'warehouseMessageManage',
      component: warehouseMessageManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/warehouseMessageDetail',
      name: 'warehouseMessageDetail',
      component: warehouseMessageDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/warehouseMessageAdd',
      name: 'warehouseMessageAdd',
      component: warehouseMessageAdd,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/warehouseStock',
      name: 'warehouseStock',
      component: warehouseStock,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/stockDetail',
      name: 'stockDetail',
      component: stockDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/subCompanyManage/',
      name: 'subCompanyManage',
      component: subCompanyManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/subCompanyDetail',
      name: 'subCompanyDetail',
      component: subCompanyDetail,
    },
    {
      path: '/servicerManage',
      name: 'servicerManage',
      component: servicerManage,
      meta: {
        keepalive: true
      },

    },
    {
      path: '/servicerManageDetail',
      name: 'servicerManageDetail',
      component: servicerManageDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addServicerManage',
      name: 'addServicerManage',
      component: addServicerManage,
      meta: {
        keepalive: true
      }
    },
    /*仓库管控*/
    {
      path: '/warehouseControl',
      name: 'warehouseControl',
      component: warehouseControl,
      meta: {
        keepalive: true
      }
    },
    //添加策略
    {
      path: '/addStrategy',
      name: 'addStrategy',
      component: addStrategy,
      meta: {
        keepalive: true
      }
    },
    //经销商详情
    {
      path: '/userDetail',
      name: 'userDetail',
      component: userDetail,
      meta: {
        keepalive: true
      }
    },
    //经销商管理   ----  仓配经销商
    {
      path: '/wareHouseDealer',
      name: 'wareHouseDealer',
      component: wareHouseDealer,
      meta: {
        keepalive: true
      }
    },
    //经销商审核
    {
      path: '/dealerAudit',
      name: 'dealerAudit',
      component: dealerAudit,
      meta: {
        keepalive: true
      }
    },
    //经销商审核详情
    {
      path: '/dealerAuditDetail',
      name: 'dealerAuditDetail',
      component: dealerAuditDetail,
      meta: {
        keepalive: true
      }
    },
    //店铺审核
    {
      path: '/shopAudit',
      name: 'shopAudit',
      component: shopAudit,
      meta: {
        keepalive: true
      }
    },

    //店铺审核详情
    {
      path: '/shopAuditDetail',
      name: 'shopAuditDetail',
      component: shopAuditDetail,
      meta: {
        keepalive: true
      }
    },

    //产品管理    -----   第三方申请入库产品
    {
      path: '/applyWarehouseProduct',
      name: 'applyWarehouseProduct',
      component: applyWarehouseProduct,
      meta: {
        keepalive: true
      }
    },
    /*新增产品*/
    {
      path: '/productAdd',
      name: 'productAdd',
      component: productAdd,
      meta: {
        keepalive: true
      }
    },
    //产品管理    -----   产品详情

    {
      path: '/chooseProduct',
      name: 'chooseProduct',
      component: chooseProduct,
    },
  ]
})
