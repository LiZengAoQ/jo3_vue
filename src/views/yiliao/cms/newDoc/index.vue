<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="模块名" prop="moduleName">
        <el-input
          v-model="queryParams.moduleName"
          placeholder="请输入模块名"
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
          v-hasPermi="['api:newsModule:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['api:newsModule:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['api:newsModule:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['api:newsModule:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="newsModuleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="编号" align="center" prop="id" /> -->
      <el-table-column label="模块名" align="center" prop="moduleName" />
      <el-table-column label="模块所属系统" align="center" prop="sysModule" />
      <!-- <el-table-column label="是否系统模块" align="center" prop="fgSys" /> -->
      <!-- <el-table-column label="模块位置;order/consult/doc/" align="center" prop="modulePath" /> -->
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
      <!-- <el-table-column label="创建人" align="center" prop="createrBy" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
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
            v-hasPermi="['api:newsModule:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:newsModule:remove']"
            >删除</el-button
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

    <!-- 添加或修改资讯_模块对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模块名" prop="moduleName">
          <el-input v-model="form.moduleName" placeholder="请输入模块名" />
        </el-form-item>
        <!-- <el-form-item label="模块所属系统" prop="sysModule">
          <el-input v-model="form.sysModule" placeholder="模块所属系统" />
        </el-form-item> -->
        <el-form-item label="模块所属系统" prop="sysModule">
          <el-select
            v-model="form.sysModule"
            placeholder="请选择下拉选择"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in field101Options"
              :key="index"
              :label="item.label"
              :value="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
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
  listNewsModule,
  getNewsModule,
  delNewsModule,
  addNewsModule,
  updateNewsModule,
  exportNewsModule,
} from "@/api/yiliao/cms/newsDocs";

export default {
  name: "NewsDoc",
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
      // 资讯_模块表格数据
      newsModuleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parId: 'doc_news_type',
        moduleName: null,
        sysModule: null,
        fgSys: null,
        modulePath: null,
        fgActive: null,
        createTime: null,
        createrBy: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fgActive: [
          { required: true, message: "是否有效不能为空", trigger: "blur" },
        ],
      },
      field101Options: [
        {
          label: "系统基础",
          value: 1,
        },
        {
          label: "体验文章",
          value: 2,
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询资讯_模块列表 */
    getList() {
      this.loading = true;
      listNewsModule(this.queryParams).then((response) => {
        this.newsModuleList = response.rows;
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
        parId: null,
        moduleName: null,
        sysModule: null,
        fgSys: null,
        hosId: null,
        modulePath: null,
        fgActive: null,
        createTime: null,
        createrBy: null,
        updateTime: null,
        updateBy: null,
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
      this.title = "添加资讯_模块";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getNewsModule(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资讯_模块";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateNewsModule(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.parId = 'doc_news_type';
            addNewsModule(this.form).then((response) => {
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
        '是否确认删除资讯_模块编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delNewsModule(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有资讯_模块数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportNewsModule(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    handleStatusChange(row) {
      let text = row.fgActive === "1" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.moduleName + '"分类吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateNewsModule(row);
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
