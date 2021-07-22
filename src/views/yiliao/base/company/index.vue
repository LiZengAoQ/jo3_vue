<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物流公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入物流公司名称"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['api:company:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['api:company:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['api:company:remove']"
        >删除
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['api:company:export']"-->
      <!--        >导出-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="companyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="物流公司code. 字典dict.express_company" align="center" prop="companyCode"/>-->
      <el-table-column label="物流公司名称" align="center" prop="companyName"/>
      <el-table-column label="物流价格" align="center" prop="companyPrice"/>
      <el-table-column label="是否有效" align="center" prop="fgActive" >
        <template slot-scope="scope">
          <p v-if="scope.row.fgActive == 1">正常</p>
          <p v-else>停用</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['api:company:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:company:remove']"
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

    <!-- 添加或修改快递信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="物流公司名称" prop="companyName">
          <el-select v-model="form.companyName" :disabled="disabled" placeholder="请选择物流公司名称" clearable size="small">
            <el-option
              v-for="dictionary in companyOptions"
              :key="dictionary.data"
              :label="dictionary.name"
              :value="dictionary.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司价格" prop="companyPrice">
          <el-input v-model="form.companyPrice" placeholder="物流公司价格"/>
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
    listCompany,
    getCompany,
    delCompany,
    addCompany,
    updateCompany,
    exportCompany
  } from '@/api/yiliao/base/company';
  import { getDictionarys} from "@/api/system/dictionary";

  export default {
    name: 'Company',
    components: {},
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
        disabled: false,
        // 总条数
        total: 0,
        // 快递信息表格数据
        companyList: [],
        // 状态数据字典
        companyOptions: [],

        code: null,
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          companyName: null,
          companyPrice: null,
          fgActive: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          fgActive: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询快递信息列表 */
      getList() {
        this.loading = true
        listCompany(this.queryParams).then(response => {
          this.companyList = response.rows
          this.total = response.total
          this.loading = false
        })

        getDictionarys('dict.express_company').then(response => {
          this.companyOptions = response.data
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
          companyCode: null,
          companyName: null,
          companyPrice: null,
          fgActive: null,
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
        this.ids = selection.map(item => item.companyCode)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.disabled = false
        this.title = '添加快递信息'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.disabled = true
        this.reset()
        const companyCode = row.companyCode || this.ids
        getCompany(companyCode).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改快递信息'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.companyCode != null) {
              updateCompany(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              getDictionarys('dict.express_company').then(response => {
                for (let i = 0; i < response.data.length; i++) {
                  if (this.form.companyName == response.data[i].name){
                    this.form.companyCode = response.data[i].data;
                    addCompany(this.form).then(response => {
                      this.msgSuccess('新增成功')
                      this.open = false
                      this.getList()
                    })
                    this.code = null;
                  }
                }
              });
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const companyCodes = row.companyCode || this.ids
        this.$confirm('是否确认删除快递信息编号为"' + companyCodes + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delCompany(companyCodes)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有快递信息数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportCompany(queryParams)
        }).then(response => {
          this.download(response.msg)
        })
      }
    }
  }
</script>
