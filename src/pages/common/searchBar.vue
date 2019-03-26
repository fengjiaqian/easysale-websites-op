<template>
    <!-- search -->
      <div class="search">
        <el-row type="flex">
          <el-col :span="2">
            <span>经销商名称：</span>
          </el-col>
          <el-col :span="4">
            <el-input v-model="dealerName" placeholder="请输入经销商名称" clearable></el-input>
          </el-col>
          <el-col :span="2">
            <span>联系人： </span>
          </el-col>
          <el-col :span="4">
            <el-input v-model="dealerContact" placeholder="请输入经销商名称" clearable></el-input>
          </el-col>

          <el-col :span="2">
            <span>手机号： </span>
          </el-col>
          <el-col :span="4    ">
            <el-input v-model="dealerPhoneNo" placeholder="请输入经销商手机号" clearable></el-input>
          </el-col>

          <el-col :span="2">
            <span>业务城市： </span>
          </el-col>
          <el-col :span="4">
            <el-select v-model="dealerCity" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="2">
            <span>经销商类型： </span>
          </el-col>
          <el-col :span="4">
            <el-select v-model="dealerType" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="2">
            <span>状态： </span>
          </el-col>
          <el-col :span="4">
            <el-select v-model="dealerState" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6" :offset="1">
            <el-button type="primary" @click="getSaleMan">查询</el-button>
            <el-button type="info" @click="onClean">清空</el-button>
          </el-col>
        </el-row>
      </div>
</template>
<script>
export default {
    
}
</script>

<style lang="stylus" scoped>
.search {
    margin-bottom: 20px;
}

.el-row {
    margin-bottom: 15px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    >span {
        text-align: right;
    }
}

.pager {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.el-col-2 {
    width: 6.333%;
    justify-content: flex-end;
}
</style>

