<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="被评价人" prop="objUname">
        <el-input
          v-model="queryParams.objUname"
          placeholder="请输入评价对象名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="evaluateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="id" align="center" prop="id" />-->
      <!--      <el-table-column label="评价对象Id" align="center" prop="objUid" />-->
      <el-table-column label="被评价人" align="center" prop="objUname"/>
      <!--      评价类型1-用户评价医生  2-医生评价用户-->
      <el-table-column label="被评价人类型" align="center" prop="evaluateType">
        <template slot-scope="scope">
          <p v-if="scope.row.evaluateType == 1">医生</p>
          <p v-if="scope.row.evaluateType == 2">用户</p>
        </template>
      </el-table-column>
      <!--      <el-table-column label="被评价人类型" align="center" prop="evaluateType" />-->
      <el-table-column label="评分" align="center" prop="score"/>
      <el-table-column label="模块类型" align="center" prop="bizType">
        <template slot-scope="scope">
          <p v-if="scope.row.bizType == 'CONSULT_GRAB'">悬赏咨询</p>
          <p v-if="scope.row.bizType == 'CONSULT_PAID'">图文咨询</p>
          <p v-if="scope.row.bizType == 'CONSULT_TEAM'">团队咨询</p>
          <p v-if="scope.row.bizType == 'CONSULT_TEL'">电话咨询</p>
          <p v-if="scope.row.bizType == 'CONSULT_VIDEO'">视频咨询</p>
          <p v-if="scope.row.bizType == 'CONSULT_CONTINUATION'">续方咨询</p>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" prop="content"/>
      <!--      1 待审核、2 已发布、3 审核未通过-->
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <p v-if="scope.row.status == 1">待审核</p>
          <p v-if="scope.row.status == 2">已发布</p>
          <p v-if="scope.row.status == 3">审核未通过</p>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import {
    listEvaluate,
    getEvaluate,
    delEvaluate,
    addEvaluate,
    updateEvaluate,
    exportEvaluate
  } from '@/api/yiliao/base/evaluate'
  import Editor from '@/components/Editor'

  export default {
    name: 'Evaluate',
    components: {
      Editor
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 评价业务表格数据
        evaluateList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          id: null,
          objUid: null,
          objUname: null,
          title: null,
          bizId: null,
          bizType: null,
          userId: null,
          uname: null,
          score: null,
          dtCreate: null,
          content: null,
          status: null,
          evaluateType: null,
          extraJson: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          bizId: [
            { required: true, message: '评价业务ID不能为空', trigger: 'blur' }
          ],
          bizType: [
            { required: true, message: '评价业务类型不能为空', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      let id = this.$route.query.content
      if (id != undefined || id != null) {
        this.loading = true
        this.queryParams.content = id;
        listEvaluate(this.queryParams).then(response => {
          this.evaluateList = response.rows
          this.total = response.total
          this.loading = false
        })
      } else {
        this.getList()
      }
    },
    methods: {
      /** 查询评价业务列表 */
      getList() {
        this.loading = true
        listEvaluate(this.queryParams).then(response => {
          this.evaluateList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          objUid: null,
          objUname: null,
          title: null,
          bizId: null,
          bizType: null,
          userId: null,
          uname: null,
          score: null,
          dtCreate: null,
          content: null,
          status: '0',
          evaluateType: null,
          extraJson: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      }
    }
  }
</script>
