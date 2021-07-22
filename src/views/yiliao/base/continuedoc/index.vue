<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="docName">
        <el-input
          v-model="queryParams.docName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属医院" prop="hosName">
        <el-select v-model="queryParams.hosName" placeholder="请选择所属医院" clearable size="small">
          <el-option
            v-for="hname in hosOptions"
            :key="hname"
            :label="hname"
            :value="hname"
          >{{hname}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室" prop="deptName">
        <el-select v-model="queryParams.deptName" placeholder="请选择所属科室" clearable size="small">
          <el-option
            v-for="dname in deptOptions"
            :key="dname"
            :label="dname"
            :value="dname"
          >{{dname}}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['api:hotdoctor:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ContinueDoctor" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" prop="id"/>
      <el-table-column label="姓名" align="center" prop="docName"/>
      <el-table-column label="所属医院" align="center" prop="hosName"/>
      <el-table-column label="所属科室" align="center" prop="deptName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:continuedoc:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改医生信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-table v-loading="loading" :data="ContinueDoc" @selection-change="handleSelectionChange1">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="序号" align="center" prop="id"/>
          <el-table-column label="hosid" align="center" prop="hosId"/>
          <el-table-column label="姓名" align="center" prop="docName"/>
          <el-table-column label="所属医院" align="center" prop="hosName"/>
          <el-table-column label="所属科室" align="center" prop="deptName"/>
        </el-table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          :disabled="multiple"
          @click="submitForm"
          v-hasPermi="['api:hotdoctor:add']">
          确 定
        </el-button>
        <!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listcontinuedoctor,
    listcontinuedoc,
    getcontinuedoc,
    addcontinuedoc,
    delcontinuedoc,
    getcontinuedochos,
    getcontinuedocdept
  } from '@/api/yiliao/base/continuedoc'

  export default {
    name: 'continuedoc',
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        docId: [],
        hosId: [],
        //医院字典
        hosOptions: [],
        ContinueDoc: [],
        //科室字典
        deptOptions: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 医生信息表格数据
        List: [],
        ContinueDoctor: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          docName: null,
          hosName: null,
          deptName: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      }
    },
    created() {
      this.getList()
      getcontinuedocdept().then(response => {
        this.deptOptions = response.data
      })
      getcontinuedochos().then(response => {
        this.hosOptions = response.data
      })
    },
    methods: {
      /** 查询续方信息列表 */
      getList() {
        this.loading = true
        listcontinuedoctor(this.queryParams).then(response => {
          this.ContinueDoctor = response.rows
          this.total = response.total
          this.loading = false
        })
      },

      getList1() {
        this.loading = true
        listcontinuedoc(this.queryParams).then(response => {
          this.ContinueDoc = response.rows
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
          docName: null,
          hosName: null,
          deptName: null

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
        this.ids = selection.map(item => item.hosId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      // 多选框选中数据
      handleSelectionChange1(selection) {
        this.docId = selection
        // this.docId = selection.map(item => item.id)
        // this.hosId = selection.map(item => item.hosid)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.getList1()
        this.reset()
        this.open = true
        this.title = '添加医生信息'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getcontinuedoc(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改医生信息'
        })
      },
      /** 提交按钮 */
      submitForm() {
        console.log(this.docId,2222)

        this.$refs['form'].validate(valid => {
          if (valid) {
            for (let i = 0; i < this.docId.length; i++) {
              this.form.docId = this.docId[i].id;
              this.form.hosId = this.docId[i].hosId;
              addcontinuedoc(this.form).then(response => {
                this.msgSuccess('新增成功')
              })
            }
            this.open = false
            this.getList()
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const Ids = row.id || this.ids
        this.$confirm('是否确认删除信息编号为"' + Ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delcontinuedoc(Ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      }

    }
  }
</script>
