<template>
  <div id="ztreetable">
    <tree-table :data="data" :columns="columns" border/>
  </div>
</template>

<script>
  import treeTable from "./tabletree";

    /*"id": "169840639200985755",
    "wholeId": "169840639200985755",
    "label": "首页",
    "type": 1,
    "systemType": 1,
    "url": "wqewqewq",
    "imageUrl": "wqewqewq",
    "state": 1,
    "createUser": "1",
    "createTime": "2019-04-09 16:13:00",
    "updateUser": "1",
    "updateTime": 1555308165000,*/

    export default {
        name: "ztreetable",
      data() {
        return {
          msg:'AAAAAAAAAA',
          columns: [
            {
              text: "功能名称",
              value: "label"
            },
            {
              text: "功能url",
              value: "url"
            },
            {
              text: "图标imageUrl",
              value: "imageUrl"
            },
            {
              text: "功能类型",
              value: "type"
            },{
              text: "系统类型",
              value: "systemType",
            },
            {
              text: "状态",
              value: "state",
            },
            {
              text: "创建时间",
              value: "createTime",
              width: 180
            },
          ],
          data: [
            {
              "id": "169840639200985755",
              "wholeId": "169840639200985755",
              "label": "首页",
              "type": 1,
              "systemType": 1,
              "url": "wqewqewq",
              "imageUrl": "wqewqewq",
              "state": 1,
              "createUser": "1",
              "createTime": "2019-04-09 16:13:00",
              "updateUser": "1",
              "updateTime": 1555308165000,
              "children": []
            },
            {
              "id": "169840639200985756",
              "wholeId": "169840639200985756",
              "label": "服务",
              "type": 1,
              "systemType": 1,
              "state": 1,
              "createUser": "1",
              "createTime": "2019-04-09 16:13:46",
              "updateUser": "1",
              "updateTime": 1554797626000,
              "children": []
            },
            {
              "id": "169840639200985757",
              "wholeId": "169840639200985757",
              "label": "订单",
              "type": 1,
              "systemType": 1,
              "state": 1,
              "createUser": "1",
              "createTime": "2019-04-09 16:14:24",
              "updateUser": "1",
              "updateTime": 1554797664000,
              "children": []
            },
            {
              "id": "169840639200985758",
              "wholeId": "169840639200985758",
              "label": "我的",
              "type": 1,
              "systemType": 1,
              "state": 1,
              "createUser": "1",
              "createTime": "2019-04-09 16:14:32",
              "updateUser": "1",
              "updateTime": 1554797672000,
              "children": []
            },
            {
              "id": "170201722721927171",
              "wholeId": "170201722721927171",
              "label": "父子联动",
              "type": 2,
              "systemType": 1,
              "url": "父子联动",
              "imageUrl": "www.yijiupi.com/but/add.png",
              "state": 1,
              "createUser": "666666666666",
              "createTime": "2019-04-12 16:46:53",
              "updateUser": "115511",
              "updateTime": 1555492275000,
              "children": [
                {
                  "id": "170201722721927172",
                  "parentId": "170201722721927171",
                  "wholeId": "170201722721927171#170201722721927172",
                  "label": "子级联动",
                  "type": 1,
                  "systemType": 2,
                  "url": "子级联动",
                  "imageUrl": "www.baidu.com/img/but.png",
                  "state": 1,
                  "createUser": "666666666666",
                  "createTime": "2019-04-12 16:49:15",
                  "updateUser": "115511",
                  "updateTime": 1555492301000,
                  "children": [
                    {
                      "id": "170201722721927173",
                      "parentId": "170201722721927172",
                      "wholeId": "170201722721927171#170201722721927172#170201722721927173",
                      "label": "324",
                      "type": 1,
                      "systemType": 1,
                      "url": "32432",
                      "imageUrl": "32432432",
                      "state": 1,
                      "createUser": "666666666666",
                      "createTime": "2019-04-12 16:54:29",
                      "updateUser": "666666666666",
                      "updateTime": 1555059269000,
                      "children": []
                    }
                  ]
                },
                {
                  "id": "170201722721927562",
                  "parentId": "170201722721927171",
                  "label": "21321",
                  "type": 2,
                  "systemType": 1,
                  "url": "213213",
                  "imageUrl": "2132131",
                  "state": 1,
                  "createUser": "115511",
                  "createTime": "2019-04-15 17:52:04",
                  "updateUser": "115511",
                  "updateTime": 1555321924000,
                  "children": []
                }
              ]
            },
            {
              "id": "170201722721927539",
              "label": "測試自動獲取腹肌",
              "type": 1,
              "systemType": 1,
              "url": "測試自動獲取腹肌",
              "imageUrl": "測試自動獲取腹肌",
              "state": 1,
              "createUser": "115511",
              "createTime": "2019-04-15 17:44:08",
              "updateUser": "115511",
              "updateTime": 1555321448000,
              "children": []
            },
            {
              "id": "170201722721927557",
              "label": "測試自動獲取腹肌",
              "type": 1,
              "systemType": 1,
              "url": "測試自動獲取腹肌",
              "imageUrl": "測試自動獲取腹肌",
              "state": 1,
              "createUser": "115511",
              "createTime": "2019-04-15 17:50:05",
              "updateUser": "115511",
              "updateTime": 1555321805000,
              "children": []
            },
            {
              "id": "170201722721927558",
              "label": "測試自動獲取腹肌",
              "type": 1,
              "systemType": 1,
              "url": "測試自動獲取腹肌",
              "imageUrl": "測試自動獲取腹肌",
              "state": 1,
              "createUser": "115511",
              "createTime": "2019-04-15 17:50:05",
              "updateUser": "115511",
              "updateTime": 1555321805000,
              "children": []
            },
            {
              "id": "170201722721927559",
              "label": "測試自動獲取腹肌",
              "type": 1,
              "systemType": 1,
              "url": "測試自動獲取腹肌",
              "imageUrl": "測試自動獲取腹肌",
              "state": 1,
              "createUser": "115511",
              "createTime": "2019-04-15 17:50:05",
              "updateUser": "115511",
              "updateTime": 1555321805000,
              "children": []
            },
            {
              "id": "170201722721927561",
              "label": "測試自動獲取腹肌",
              "type": 1,
              "systemType": 1,
              "url": "測試自動獲取腹肌",
              "imageUrl": "測試自動獲取腹肌",
              "state": 1,
              "createUser": "115511",
              "createTime": "2019-04-15 17:51:33",
              "updateUser": "115511",
              "updateTime": 1555321893000,
              "children": []
            },
            {
              "id": "170201722721927569",
              "label": "測試自動獲取腹肌",
              "type": 1,
              "systemType": 1,
              "url": "測試自動獲取腹肌",
              "imageUrl": "測試自動獲取腹肌",
              "state": 1,
              "createUser": "115511",
              "createTime": "2019-04-15 18:02:03",
              "updateUser": "115511",
              "updateTime": 1555322523000,
              "children": []
            }
          ]
        };
      },
      methods:{

      },
      components: { treeTable },
    }
</script>

<style scoped>

</style>
