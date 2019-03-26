<template>
  <div class="pagination">
    <!--分页-->
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handlePageNumChange($event)"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "pagination",
    props: {
      pageSize: {
        type: Number,
        required: true,
      },
      totalCount: {
        type: Number,
        required: true,
      },
      currentPage: {
        type: Number,
        required: true,
      }
    }
    ,
    data() {
      return {
        // pageNum: this.currentPage,
      }
    }
    ,
    methods: {
      handlePageNumChange($event) {
        this.$emit(`pageNumChange`, $event)
      },
    }
  }
</script>

<style scoped lang="stylus">
  .pagination{
    margin-top:20px
    text-align right
  }
</style>
