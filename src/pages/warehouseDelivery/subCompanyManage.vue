<template>
  <div>
    <el-form :inline="true"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="searchForm">
      <el-form-item label="城市">
        <el-select v-model="cityQuery" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="clickQuery" size="medium">查询</el-button>
      <el-button type="info" @click="emptyContent" size="medium">重置</el-button>
    </div>
    <el-button type="primary" class="addAd" @click="addCompany(1)">新增子公司</el-button>
    <el-table
      v-loading="loading"
      :data="companyList"
      border
      height="520"
      style="width: 100%;margin-top:16px;">
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="子公司ID"></el-table-column>
      <el-table-column prop="orgName" label="子公司名称"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="gotoDetail(scope.row.id)">查看</el-button>
          <el-button type="text" size="small" @click="editCompany(scope.row,2)">编辑</el-button>
          <el-button type="text" size="small" @click="changeState(scope.row,scope.$index)">{{scope.row.state==1?'停用':'启用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handlePageNumChange($event)"
        :page-size="pageSize"
        :total="totalCount"
        v-show="totalCount>0">
      </el-pagination>
    </div>
    <!--设置对话框-->
    <el-dialog title="新增子公司" top="25px" :modal="false" :visible.sync="stockDialogVisible" width="35%" center>
      <el-form :label-width="formLabelWidth" :model="ruleForm" :rules="rules" ref="ruleForm">

        <el-form-item label="子公司名称" prop="orgName">
          <el-input v-model="ruleForm.orgName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <!--状态(1:启用,2:停用,3:作废)-->
          <el-select v-model="ruleForm.state" style="width: 100%" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
            <!--<el-option label="作废" value="3"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model="ruleForm.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人名称" prop="contacterName">
          <el-input v-model="ruleForm.contacterName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机" prop="contacterPhone">
          <el-input v-model="ruleForm.contacterPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构地址" prop="orgAddress">
          <el-input v-model="ruleForm.orgAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在省份" prop="province">
          <el-input v-model="ruleForm.province" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="ensure('ruleForm')">确定</el-button>
        <el-button @click="stockDialogVisible = false;">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import http from 'http/subCompanyApi';
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: "subCompanyManage",
    data() {
      return {
        toggleForm: '',//判断是编辑还是新增 1是新增  2是编辑
        totalCount: 0,
        ruleForm: {
          orgName: '',//子公司名称
          state: '',//状态(1:启用,2:停用,3:作废)
          orgAddress: '',//组织机构地址
          city: '',
          province: '',//所在省份
          contacterName: '',//联系人名称
          contacterPhone: '',//联系人手机
        },
        loading:true,
        pageSize: 20,
        currentPage: 1,
        orgNo: null,//子公司编号
        optUserId: 0,//操作人Id,没有传0
        cityQuery: '',//城市搜索框输入的city值
        parentOrgId: ``,
        orgClass: 2,//组织机构级别 1:一级,2:二级-子级别
        stockDialogVisible: false,
        feeForm: '',
        companyForm: {},
        formLabelWidth: '120px',
        options: [],
        companyList: [],
        id: '',//子公司Id
        rules: {
          orgName: [
            {required: true, message: '请输入子公司名称', trigger: 'blur'},
          ],
          state: [
            {required: true, message: '请选择状态', trigger: 'blur'},
          ],
          city: [
            {required: true, message: '请输入城市', trigger: 'blur'},
          ],
          contacterName: [
            {required: true, message: '请输入联系人名称', trigger: 'blur'},
          ],
          contacterPhone: [
            {required: true, message: '请输入联系人手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '号码长度必须为11位', trigger: 'blur'}
          ],
          orgAddress: [
            {required: true, message: '请输入组织机构地址', trigger: 'blur'},
          ],
          province: [
            {required: true, message: '请输入所在省份', trigger: 'blur'},
          ]
        },
      }
    },
    components: {},
    methods: {
      //分页查找子公司
      getCompanyList() {
        let {currentPage, pageSize, parentOrgId} = this;
        let city = this.cityQuery;
        http.getCompanyList({city, currentPage, pageSize, parentOrgId}).then(data => {
          this.companyList = data || [];
          this.totalCount = data ? data.totalCount : 0;
          this.loading=false;
          console.log('total1', data.totalCount)
        }).catch(e => {
          console.log(e)
        })
      },
      //查询城市接口
      getCompanyCity() {
        let {parentOrgId} = this;
        http.getCompanyCity({parentOrgId}).then(data => {
          this.options = this.removeDuplicatedItem(data);//去掉重复的城市
        }).catch(e => {
          console.log(e)
        })
      },
      //新增子公司接口
      addNewCompany() {
        let {city, contacterName, contacterPhone, orgAddress, orgName, province, state} = this.ruleForm;
        let {optUserId, orgClass, orgNo, parentOrgId} = this;
        http.addNewCompany({
          city,
          contacterName,
          contacterPhone,
          optUserId,
          orgAddress,
          orgClass,
          orgName,
          orgNo,
          parentOrgId,
          province,
          state,
        }).then(data => {
          this.$message('新增成功');
          this.getCompanyList();
        }).catch(e => {
          console.log(e)
        })

      },
      //编辑子公司接口
      editSubCompany() {
        let {city, contacterName, contacterPhone, orgAddress, orgName, province, state} = this.ruleForm;
        let {optUserId, orgClass, orgNo, parentOrgId, id} = this;
        http.editSubCompany({
          city,
          contacterName,
          contacterPhone,
          optUserId,
          orgAddress,
          orgClass,
          orgName,
          orgNo,
          parentOrgId,
          province,
          state,
          id
        }).then(data => {
          this.$message('编辑成功');
          this.getCompanyList();
        }).catch(e => {
          console.log(e)
        })
      },

      //清空新增子公司表单
      emptyForm() {
        this.ruleForm.orgName = '';
        this.ruleForm.state = '';
        this.ruleForm.city = '';
        this.ruleForm.contacterName = '';
        this.ruleForm.contacterPhone = '';
        this.ruleForm.orgAddress = '';
        this.ruleForm.province = '';
      },
      ensure(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            //判断是新增还是编辑，调相应接口
            if (this.toggleForm == 1) {
              this.addNewCompany();
            } else {
              this.editSubCompany();
            }
            this.stockDialogVisible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        this.getCompanyList()
      },
      //根据城市查询子公司
      clickQuery() {
        this.ruleForm.city = this.cityQuery;
        this.getCompanyList();
      },
      gotoDetail(id) {
        this.$router.push({name: 'subCompanyDetail', query: {id}})
      },
      //新增子公司
      addCompany(value) {
        this.toggleForm = value
        this.emptyForm();
        this.stockDialogVisible = true
      },
      //编辑子公司
      editCompany(row, value) {
        this.emptyForm();
        this.toggleForm = value
        this.stockDialogVisible = true;
        //根据子公司Id找到相应子公司信息进行编辑
        this.id = row.id;
        this.ruleForm.orgName = row.orgName;
        this.ruleForm.state = row.state;
        this.ruleForm.city = row.city;
        this.ruleForm.contacterName = row.contacterName;
        this.ruleForm.contacterPhone = row.contacterPhone;
        this.ruleForm.orgAddress = row.orgAddress;
        this.ruleForm.province = row.province;
      },
      //切换状态
      changeState(row,index) {
        console.log(index)
        this.loading=true;
        let state = row.state === 1 ? 2 : 1;
        this.id = row.id;
        //编辑和切换状态用的同一个接口，切换状态时除了Id和state，其他字段传null
        this.ruleForm.orgName = null;
        this.ruleForm.city = null;
        this.ruleForm.contacterName = null;
        this.ruleForm.contacterPhone = null;
        this.ruleForm.orgAddress = null;
        this.ruleForm.province = null;
        let {city, contacterName, contacterPhone, orgAddress, orgName, province} = this.ruleForm;
        let {optUserId, orgClass, orgNo, parentOrgId, id} = this;
        http.editSubCompany({
          city,
          contacterName,
          contacterPhone,
          optUserId,
          orgAddress,
          orgClass,
          orgName,
          orgNo,
          parentOrgId,
          province,
          state,
          id
        }).then(data => {
          this.loading=false;
          this.companyList[index].state =this.companyList[index].state === 1 ? 2 : 1;
          this.$message('编辑成功');
        }).catch(e => {
          console.log(e)
        })
        //this.getCompanyList();
      },
      indexMethods(index) {
        return (this.currentPage - 1) * this.pageSize + index + 1
      },
      //重置
      emptyContent() {
        this.cityQuery = '';
        this.getCompanyList()
      },
      //数组去重
      removeDuplicatedItem(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
              arr.splice(j, 1);//console.log(arr[j]);
              j--;
            }
          }
        }
        return arr;
      },
      //取出vuex中userInfo中的部分可用信息
      getPartUserInfo() {
        //parentOrgId取登录人当前角色的ruleOrgId
        this.parentOrgId = this.choseRoleInfoList.ruleOrgId;
        if (this.$store.state.user.userInfo.userId) {
          this.optUserId = this.$store.state.user.userInfo.userId;
        }
      },
      handlePageNumChange(num) {
        this.currentPage = num;
        this.getCompanyList();
      }

    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`])
    },
    created() {
      this.getPartUserInfo();
      this.getCompanyCity();//获取城市
      this.getCompanyList();//获取子公司列表
    }
  }
</script>

<style lang="stylus" scoped>
  .header {
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .addAd {
    padding: 10px 24px;
    margin-top: 16px;
  }

  .pager {
    margin-top 15px;
    display flex;
    flex-direction row;
    justify-content flex-end;
  }

  .query-btn {
    text-align center
    padding: 20px 0
    border-bottom: 1px solid #ededed
  }

</style>
