<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="关键字" prop="diagnosisCode">
        <el-input
          v-model="queryParams.diagnosisCode"
          placeholder="诊断代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          v-hasPermi="['system:diagnosis:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="diagnosisList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="诊断代码" align="center" prop="diagnosisCode" />
      <el-table-column label="诊断名称" align="center" prop="diagnosis" />
      <el-table-column label="诊断拼音码" align="center" prop="diagnosisPym" />
      <el-table-column label="诊断ICD-10编码" align="center" prop="icd10" />
      <el-table-column label="状态" align="center" key="fgActive">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.fgActive"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
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
            v-hasPermi="['system:diagnosis:edit']"
            >详情</el-button
          >
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

    <!-- 添加或修改疾病诊断对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="诊断代码" prop="diagnosisCode">
          <el-input v-model="form.diagnosisCode" placeholder="请输入诊断代码" />
        </el-form-item>
        <el-form-item label="诊断内容" prop="diagnosis">
          <el-input v-model="form.diagnosis" placeholder="请输入诊断内容" />
        </el-form-item>
        <el-form-item label="诊断拼音码" prop="diagnosisPym">
          <el-input
            v-model="form.diagnosisPym"
            placeholder="请输入诊断拼音码"
          />
        </el-form-item>
        <el-form-item label="ICD-10编码" prop="icd10">
          <el-input v-model="form.icd10" placeholder="请输入ICD-10编码" />
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
  listDiagnosis,
  getDiagnosis,
  delDiagnosis,
  addDiagnosis,
  updateDiagnosis,
  exportDiagnosis,
} from "@/api/yiliao/recipe/diagnosis";

export default {
  name: "Diagnosis",
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
      // 总条数
      total: 0,
      // 疾病诊断表格数据
      diagnosisList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        diagnosisCode: null,
        diagnosis: null,
        diagnosisPym: null,
        icd10: null,
        fgActive: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fgActive: [
          { required: true, message: "是否有效不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询疾病诊断列表 */
    getList() {
      this.loading = true;
      listDiagnosis(this.queryParams).then((response) => {
        this.diagnosisList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        diagnosisCode: null,
        diagnosis: null,
        diagnosisPym: null,
        icd10: null,
        fgActive: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加疾病诊断";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDiagnosis(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改疾病诊断";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDiagnosis(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDiagnosis(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除疾病诊断编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delDiagnosis(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有疾病诊断数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportDiagnosis(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    handleStatusChange(row) {
      let text = row.fgActive === "1" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.diagnosis + '"诊断吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateDiagnosis(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.fgActive = row.fgActive === "0" ? "1" : "0";
        });
    },
  },
};
</script>
