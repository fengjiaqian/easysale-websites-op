<template>
  <el-cascader
    clearable
    :value="cleanCityFlag"
    :show-all-levels="false"
    :options="businessCities"
    @change="onSelectCity"
  >
  </el-cascader>
</template>

<!--业务城市选择器-->
<script>
  import http from 'http/cityApi'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "BusinessCitySelector",
    data() {
      return {
        cleanCityFlag: [],
      }
    },
    created() {
      //没有缓存则访问接口，先拿到第一级的省份列表
      if (!this.businessCities || !this.businessCities.length) {
        http.listBizCity()
          .then(data => {
            let provinceList = data || []
            let resultArr = []
            //provinceList是一个map，要使用需要先转换成array
            for (let key in provinceList) {
              let childen = provinceList[key].map(city => {
                city.value = city
                city.label = city.cityName
                return city
              })
              let resultArrItem = {value: key, label: key, children: childen}
              resultArr.push(resultArrItem)
            }
            //将省份列表缓存起来
            this.setBusinessCities(resultArr)
            console.log(`result`, resultArr)
          })
      }
    },
    methods: {
      onSelectCity(selectArr) {
        if (selectArr && !selectArr.length) {
          this.cleanCityFlag = []
          return this.$emit(`clean-biz-city`)
        } else {
          this.cleanCityFlag = selectArr
          this.$emit(`select-biz-city`, {province: selectArr[0], city: selectArr[1]})
        }
      },
      cleanCity() {
        this.cleanCityFlag = []
      },
      ...mapMutations(`cities`, [`setBusinessCities`])
    },
    computed: {
      ...mapState(`cities`, [`businessCities`])
    }
  }
</script>

<style scoped>

</style>
