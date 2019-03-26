<template>
  <div>
    <el-input
      style="margin-bottom: 15px;"
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree
      class="filter-tree"
      :data="dataList"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      ref="tree">
    </el-tree>
  </div>
</template>


<script>
  import HttpUtil from '../../utils/HttpUtil'

  export default {
    name: 'memberTree',
    props: [],
    created() {
      HttpUtil.getMemberList({pageNum: 1, pageSize: 100})
        .then(data => {
          if (data.data.data && data.data.data.length) {
            let arr = [{
              customerName: `会员列表`,
              children: [{customerName: `全部`, id: `all`}, ...data.data.data]
            }]
            this.dataList = arr
          }
        })
    },
    data() {
      return {
        dataList: [],
        filterText: ``,
        defaultProps: {
          label: `customerName`
        }
      }
    },
    components: {},
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.customerName.indexOf(value) !== -1;
      },
      handleNodeClick(data) {
        if (!data.id) return
        this.$emit('node-click', data)
      }
    },
    computed: {},
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

  }
</script>


<style lang="stylus" scoped>


</style>
