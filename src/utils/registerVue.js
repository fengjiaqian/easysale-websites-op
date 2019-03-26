import Vue from 'vue'

const srcContext = require.context('./../pages/common', false, /\.vue$/)

srcContext.keys().forEach(fileName => {

  const componentConfig = srcContext(fileName)

  const componentName = fileName.replace(/^\.\//, '').replace(/\.vue/, '')

  Vue.component(

    componentName,

    // 如果这个组件选项是通过 `export default` 导出的， 那么就会优先使用 `.default`

    // 否则回退到使用模块的根。

    componentConfig.default || componentConfig

  )

})



