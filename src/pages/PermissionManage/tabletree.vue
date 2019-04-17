<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
    <el-table-column v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        <span>
             {{ scope.row[column.value] }}
        </span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" v-if="treeType === 'normal'" width="250">
      <template slot-scope="props">
        <el-button type="primary" size="small" @click="gotoEditFunction(props.row)" plain>编辑</el-button>
        <el-button type="primary" size="small" @click="gotoFunctionInfo(props.row)" plain>详情</el-button>
        <el-button type="primary" size="small" @click="isChangeState(props.row)" plain>{{props.row.state == 1 ? '停用':'启用'}}</el-button>
      </template>
    </el-table-column>
    <slot/>

  </el-table>
</template>

<script>
  //引入 vue 后台发请求api接口
  import https_f from 'http/functionManageApi'
  import functionManage from './functionManage.vue'
  import treeToArray from "./eval";
  export default {
    name: "TreeTable",
    props: {
      // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      /* eslint-disable */
      data: {
        type: [Array, Object],
        required: true
      },
      columns: {
        type: Array,
        default: () => []
      },
      evalFunc: Function,
      evalArgs: Array,
      expandAll: {
        type: Boolean,
        default: false
      },
      // 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    computed: {
      // 格式化数据源
      formatData: function() {
        let tmp;
        if (!Array.isArray(this.data)) {
          tmp = [this.data];
        } else {
          tmp = this.data;
        }
        const func = this.evalFunc || treeToArray;
        const args = this.evalArgs
          ? Array.concat([tmp, this.expandAll], this.evalArgs)
          : [tmp, this.expandAll];
        return func.apply(null, args);
      }
    },
    filters: {
      btnType (value) {
        if(value === 'M') {
          return'菜单'
        } else if (value === 'B'){
          return '按钮'
        } else {
          return value
        }
      }
    },
    components: {
      functionManage
    },
    methods: {
      respage(){
        console.log("刷新页面");
        https_f.getTreeFunctions({}).then(data => {
          this.loading = false
          functionManage.resetPage(data);
        }).catch(e => {
          console.log("失败");
          this.loading = false
        })
        //上面传递参数 没有改变状态   先刷新
        this.$router.go(0);
      },
      showRow: function(row) {
        const show = row.row.parent
          ? row.row.parent._expanded && row.row.parent._show
          : true;
        row.row._show = show;
        return show
          ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
          : "display:none;";
      },
      // 切换下级是否展开
      toggleExpanded: function(trIndex) {
        const record = this.formatData[trIndex];
        record._expanded = !record._expanded;
      },
      // 图标显示
      iconShow(index, record) {
        return index === 0 && record.children && record.children.length > 0;
      },
      //改变状态
      isChangeState(val){
        this.$confirm('确定要改变当前数据状态吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            updateUser:this.crr_uid,
            id:val.id
          }
          if(val.state == 1){
            param .state = 0;
          }else{
            param .state = 1;
          }
          console.log(JSON.stringify(param));
          https_f.updateFuctionObj(param).then(data => {
            this.$message({
              type: 'success',
              message: '执行成功!'
            });
            //刷新数据来源页面
            this.respage();
          }).catch(e => {
            console.log(JSON.stringify(e));
            this.$message("执行失败!");
          })
        }).catch(() => {
          console.log("取消");
        });
      },
      //跳转页面 修改
      gotoEditFunction(val){
        // console.log(row.id);
        let id = val.id;
        this.$router.push({name:`functionUpdate`, query:{id}})
      },
      //跳转详情
      gotoFunctionInfo(val){
        let id = val.id;
        this.$router.push({name:`functionInfo`, query:{id}})
      }
    },
    data(){
      return {
        //当前操作用户
        crr_uid:6666,
      }
    },
    //页面载入  数据处理
    mounted:function(){
      //获取当前登录人信息  设置当前操作人ID
      if(sessionStorage.getItem(`userInfo`) != null || sessionStorage.getItem(`userInfo`) != undefined){
        let  userobj  =sessionStorage.getItem(`userInfo`);
        this.crr_uid = ((JSON.parse(userobj)).id);
      }else{
        //用户信息获取失败
        this.$message("网络异常获取用户信息失败!");
      }
    }
  };
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @-webkit-keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

<style scoped>
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }
  .ms-tree-space::before {
    content: "";
  }
  .processContainer {
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }
  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: #2196f3;
    margin-left: -18px;
  }
</style>
