<template>
  <el-cascader
    clearable
    :value="cleanCityFlag"
    :show-all-levels="showAllLevels"
    :options="administrativeCities"
    @active-item-change="onSelectFatherLevel"
    @change="onSelectChild"
    :props="cityChooseProps"
  ></el-cascader>
</template>

<!--行政城市选择器-->
<script>
  import http from 'http/cityApi'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "AdministrativeCitySelector",
    data() {
      return {
        cityChooseProps: {
          label: 'name',
          value: 'code',
          children: 'children'
        },
        cleanCityFlag: [],
        currentLevel: 1
      }
    },
    props: {
      targetLevel: {
        type: Number,
        default: 4
      },
      showAllLevels: {
        type: Boolean,
        default: false,
      },
    },
    created() {
      //没有缓存则访问接口，先拿到第一级的省份列表
      if (!this.administrativeCities || !this.administrativeCities.length) {
        http.listAdminCity(0)
          .then(data => {
            let provinceList = data || []
            //给每个省份添加一个空的children数组，用于存放下级数据
            provinceList.forEach(province => {
              province.children = []
            })
            //将省份列表缓存起来
            this.setAdministrativeCities(provinceList)
          })
          .catch(e => {
            this.$message(e)
          })
      }
    },
    methods: {
      getIndexAndValueFromListWithCodeArr(selectCodeArr) {
        let indexArr = []
        let valueArr = []
        let selectLevelIndex = -1
        let selectLevelItem = null
        selectCodeArr.forEach(code => {
          if (indexArr.length === 0) {
            selectLevelIndex = this.administrativeCities.findIndex(item => item.code === code)
            selectLevelItem = this.administrativeCities.find(item => item.code === code)
          } else if (indexArr.length === 1) {
            selectLevelIndex = this.administrativeCities[indexArr[0]].children.findIndex(item => item.code === code)
            selectLevelItem = this.administrativeCities[indexArr[0]].children.find(item => item.code === code)
          } else if (indexArr.length === 2) {
            selectLevelIndex = this.administrativeCities[indexArr[0]].children[indexArr[1]].children.findIndex(item => item.code === code)
            selectLevelItem = this.administrativeCities[indexArr[0]].children[indexArr[1]].children.find(item => item.code === code)
          } else if (indexArr.length === 3) {
            selectLevelIndex = this.administrativeCities[indexArr[0]].children[indexArr[1]].children[indexArr[2]].children.findIndex(item => item.code === code)
            selectLevelItem = this.administrativeCities[indexArr[0]].children[indexArr[1]].children[indexArr[2]].children.find(item => item.code === code)
          }
          indexArr.push(selectLevelIndex)
          valueArr.push(selectLevelItem)
        })
        return {indexArr, valueArr}
      },
      //选择父级菜单
      onSelectFatherLevel(selectCodeArr) {
        let moreInfo = this.getIndexAndValueFromListWithCodeArr(selectCodeArr)
        let indexArr = moreInfo.indexArr
        let valueArr = moreInfo.valueArr

        //选择的层级没到最后一级，继续请求下一级的数据
        if (selectCodeArr.length < this.targetLevel &&
          valueArr[valueArr.length - 1].children &&
          !valueArr[valueArr.length - 1].children.length) {
          http.listAdminCity(selectCodeArr[selectCodeArr.length - 1])
            .then(data => {
              let children = data || []
              if (selectCodeArr.length < this.targetLevel - 1&&children.length) {
                children.forEach(item => {
                  item.children = []
                })
              }
              this.updateCitiesOfProvince({indexArr, children})
            })
            .catch(e => {
              this.$message(e)
            })
        }
      },
      //选择最后一级
        onSelectChild(selectCodeArr) {
        if (selectCodeArr && !selectCodeArr.length) {
          this.cleanCityFlag = []
          return this.$emit(`clean-admin-city`)
        } else {
          this.cleanCityFlag = selectCodeArr
          let valueArr = this.getIndexAndValueFromListWithCodeArr(selectCodeArr).valueArr
          this.$emit(`select-admin-city`, valueArr)
        }
      },

      clean() {
        this.cleanCityFlag = []
      },
      ...mapMutations(`cities`, [`setAdministrativeCities`, `updateCitiesOfProvince`])
    },
    computed: {
      ...mapState(`cities`, [`administrativeCities`])
    }
  }
</script>

<style scoped>

</style>
