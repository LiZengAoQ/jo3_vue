<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="医生名称" prop="docName">
        <el-input
          v-model="queryParams.docName"
          placeholder="请输入医生名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属医院" prop="hosId">
        <el-select
          v-model="queryParams.hosId"
          ref="clearSelect"
          placeholder="所属医院"
          clearable
          size="small"
          filterable
          default-first-option
        >
          <el-option
            v-for="dictionary in hosIdOptions"
            :key="dictionary.hosId"
            :label="dictionary.hosName"
            :value="dictionary.hosId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="所属科室"
          clearable
          size="small"
          filterable
          default-first-option
        >
          <el-option
            v-for="dictionary in deptIdOptions"
            :key="dictionary.deptId"
            :label="dictionary.deptName"
            :value="dictionary.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="primary"-->
      <!--          plain-->
      <!--          icon="el-icon-plus"-->
      <!--          size="mini"-->
      <!--          @click="handleAdd"-->
      <!--          v-hasPermi="['api:docInfo:add']"-->
      <!--        >新增-->
      <!--        </el-button-->
      <!--        >-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['api:docInfo:edit']"
        >详情
        </el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="docInfoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="医生姓名" align="center" prop="docName"/>
      <el-table-column label="医生头像" align="center" prop="docAvatar">
        <template slot-scope="scope">
          <img :src="scope.row.docAvatar" style="width: 70px; height: 70px"/>
        </template>
      </el-table-column>
      <el-table-column label="所属医院" align="center" prop="hosName"/>
      <el-table-column label="所属科室" align="center" prop="deptName"/>
      <el-table-column label="医生职称" align="center" prop="docTitle"/>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['api:docInfo:edit']"
          >详情
          </el-button
          >
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['api:docInfo:remove']"-->
          <!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或医生对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="医生姓名" prop="docName">
          <el-input v-model="form.docName" placeholder="医生姓名" :disabled="true"/>
        </el-form-item>
        <el-form-item label="选择角色" prop="roleId">
          <el-checkbox-group v-model="role" size="medium">
            <el-checkbox
              v-for="(item, index) in roleIdOptions"
              :key="index"
              :label="item.id">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {
    listDocInfo,
    getDocInfo,
    delDocInfo,
    addDocInfo,
    updateDocInfo,
    updateDocInfoRole,
    exportDocInfo,
  } from '@/api/yiliao/doc/docInfo'
  import { getDictionarys, listDictionary } from '@/api/system/dictionary'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { listHosData } from '@/api/yiliao/base/hosData'
  import { listBookDept } from '@/api/yiliao/book/bookDept'

  export default {
    name: 'Setting',
    components: {
      Treeselect
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        role:[],
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
        // 系统_广告_设置表格数据
        docInfoList: [],
        deptIdOptions: [],
        roleIdOptions: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 所属医院
        hosIdOptions: [],
        // 角色表格数据
        dictionaryList: [],
        // 文件上传
        fileList: [],
        docAvatar: null,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          docName: null,
          createTime: null,
          updateTime: null,
          fg_active: null
        },
        queryParams1: {
          pageNum: 1,
          pageSize: 10,
          type: 'api_doc_type',
          parentid: 567
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          //下拉框
          // hosId: [
          //   {
          //     required: true,
          //     message: '请选择医院',
          //     trigger: 'change'
          //   }
          // ]
        },
        //医生职称字典
        doctorTitle: [],
      }
    },
    created() {
      this.getList()
      listHosData().then((response) => {
        this.hosIdOptions = response.rows
      })

      listBookDept().then((response) => {
        this.deptIdOptions = response.rows
      })

      getDictionarys('doc_data_type').then((response) => {
        this.doctorTitle = response.data
      })
    },

    methods: {
      /** 查询医生列表 */
      getList() {
        this.loading = true
        listDocInfo(this.queryParams).then((response) => {
          this.docInfoList = response.data.list
          this.total = response.data.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // change($event) {
      //   this.$refs.clearSelect.query = ''
      //   this.$emit('change', $event)
      // },
      // 表单重置
      reset() {
        this.form = {
          docName: null,
          docId: null
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
        this.ids = selection.map((item) => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        this.role = [];
        const id = row.id || this.ids
        this.open = true
        this.title = '修改医生角色'
        listDictionary(this.queryParams1).then((response) => {
          this.roleIdOptions = response.data
        })
        getDocInfo(id).then((response) => {
          this.form.docName = response.data.docName;
          this.form.id = response.data.id;
          this.role = response.roles;
        })
        this.loading = false
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id != null) {
              this.form.roleIds = this.role;
              updateDocInfoRole(this.form).then((response) => {
                this.msgSuccess('修改成功')
                this.open = false
                this.open2 = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return delDocInfo(ids)
          })
          .then(() => {
            this.getList()
            this.msgSuccess('删除成功')
          })
      }
    }
  }
</script>
