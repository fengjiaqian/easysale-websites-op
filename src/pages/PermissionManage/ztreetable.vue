<template>
  <div id="ztreetable">
    <tree-table :data="data" :columns="columns" border/>
  </div>
</template>
<!-- 树形主页   数据拉取页 -->
<script>
  import treeTable from "./TreeTable";
    export default {
        name: "ztreetable",
      data() {
        return {
          msg:'AAAAAAAAAA',
          columns: [
            {
              text: "角色名称",
              value: "roleName"
            },
            {
              text: "创建时间",
              value: "createTime"
            },
            {
              text: "创建人",
              value: "createUser"
            },
            {
              text: "状态",
              value: "state"
            },{
              text: "唯一编号",
              value: "id",
            },
          ],
          data:[
            {
              "children": [],
              "createTime": "2019-04-02 15:01:35",
              "createUser": 2,
              "id": "66125024155",
              "roleName": "烟酒店6",
              "state": 1,
              "updateTime": "2019-04-02 15:01:35",
              "updateUser": 2
            },
            {
              "children": [],
              "createTime": "2019-04-12 21:04:17",
              "id": "509809977262894348",
              "roleName": "橘色",
              "state": 1,
              "updateTime": "2019-04-12 21:04:17"
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "children": [],
                      "createTime": "2019-04-15 14:41:57",
                      "createUser": 970361,
                      "id": "4794874810657009342",
                      "parentId": "4809793945624642619",
                      "roleName": "温恩",
                      "state": 1,
                      "updateTime": "2019-04-15 14:41:57",
                      "updateUser": 970361
                    }
                  ],
                  "createTime": "2019-04-13 17:58:42",
                  "createUser": 8118051876142393000,
                  "id": "4809793945624642619",
                  "parentId": "661250242354700444",
                  "roleName": "23424",
                  "state": 1,
                  "updateTime": "2019-04-13 17:58:42",
                  "updateUser": 8118051876142393000
                }
              ],
              "createTime": "2019-04-02 15:01:35",
              "createUser": 2,
              "id": "661250242354700444",
              "roleName": "老板33",
              "state": 1,
              "updateTime": "2019-04-02 15:01:35",
              "updateUser": 2
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
