<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="字典名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入字典名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典标识" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入字典标识"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择字典状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dictionary in statusOptions"
            :key="dictionary.name"
            :label="dictionary.name"
            :value="dictionary.data"
          />
        </el-select>
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
          v-hasPermi="['system:dictionary:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['system:dictionary:import']"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleClearCache"
          v-hasPermi="['system:dictionary:remove']"
          >清理缓存</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="visibleCancel"
          type="danger"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleHome"
          v-hasPermi="['system:dict:remove']"
          >返回顶级</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="dictionaryList"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- default-expand-all -->
      <!-- <el-table-column label="父级id" align="center" prop="parentid" /> -->
      <!-- <el-table-column label="祖级列表" align="center" prop="parentids" /> -->
      <el-table-column label="字典名称" align="center" prop="name" />
      <el-table-column label="显示顺序" align="center" prop="sort" />
      <el-table-column label="字典标识" align="center" prop="code" />
      <el-table-column label="字典数据" align="center" prop="data" />
      <!-- <el-table-column label="是否默认" align="center" prop="isDefault" /> -->
      <!-- <el-table-column label="表单中绑定样式class名" align="center" prop="formcss" /> -->
      <!-- <el-table-column label="列表中绑定样式class名" align="center" prop="listcss" /> -->
      <el-table-column label="字典状态" align="center" key="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
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
            v-hasPermi="['system:dictionary:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dictionary:remove']"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-list"
            @click="handleList(scope.row)"
            v-hasPermi="['system:dictionary:list']"
          >
            下一级</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改字典对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <!-- v-if="form.parentid !== 0" -->
          <el-col :span="24">
            <el-form-item label="上级字典" prop="parentid">
              <treeselect
                v-model="form.parentid"
                :options="dictionaryOptions"
                :show-count="true"
                :normalizer="normalizer"
                placeholder="选择上级字典,未选择为顶级"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入字典名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典标识" prop="code">
              <el-input v-model="form.code" placeholder="请输入字典标识" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典数据" prop="data">
              <el-input v-model="form.data" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dictionary in statusOptions"
                  :key="dictionary.name"
                  :label="dictionary.data"
                  >{{ dictionary.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否数据">
              <el-radio-group v-model="form.isData">
                <el-radio
                  v-for="dictionary in isDataOptions"
                  :key="dictionary.name"
                  :label="dictionary.data"
                  >{{ dictionary.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
          <el-link type="info" style="font-size: 12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDictionary,
  getDictionary,
  delDictionary,
  addDictionary,
  updateDictionary,
  exportDictionary,
  getDictionarys,
  clearCache,
  selectDictionaryById,
  importTemplate,
} from "@/api/system/dictionary";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dictionary",
  components: {
    Treeselect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 顶级设置
      visibleCancel: false,
      // 显示搜索条件
      showSearch: true,
      // 字典表格数据
      dictionaryList: [],
      // 字典树选项
      dictionaryOptions: [],
      // 状态数据字典
      statusOptions: [],
      isDataOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 父类状态值
      idData: 0,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentid: 0,
        parentids: null,
        name: null,
        sort: null,
        code: null,
        data: null,
        isDefault: null,
        formcss: null,
        listcss: null,
        status: null,
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/dictionary/importData",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentid: [
          { required: false, message: "上级为空，默认为顶级", trigger: "blur" },
        ],
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }],
        code: [
          { required: true, message: "字典状态不能为空", trigger: "blur" },
        ],
        data: [
          { required: true, message: "字典数据不能为空", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "字典备注不能为空", trigger: "blur" },
        ],
        isData: [
          { required: true, message: "是否数据不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    getDictionarys("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });

    getDictionarys("sys_yes_no").then((response) => {
      this.isDataOptions = response.data;
    });
  },
  methods: {
    /** 查询字典列表 */
    getList() {
      this.loading = true;
      this.queryParams.parentid = this.idData;
      listDictionary(this.queryParams).then((response) => {
        // this.dictionaryList = this.handleTree(response.data, "id");
        this.dictionaryList = response.data;
        // this.total = response.total;
        this.loading = false;
      });
    },
    /** 转换字典数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 查询节点下拉树结构 */
    getTreeselect() {
      listDictionary().then((response) => {
        this.dictionaryOptions = [];
        const data = { id: 0, name: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "id", "parentid");
        this.dictionaryOptions.push(data);
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
        parentid: this.idData,
        parentids: null,
        name: null,
        sort: null,
        code: null,
        data: null,
        isDefault: null,
        isData: "1",
        formcss: null,
        listcss: null,
        status: "1",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      // this.visibleCancel = false;
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentid = this.idData;
      }
      this.open = true;
      this.title = "添加字典";
      // listDictionary().then(response => {
      //   this.dictionaryOptions = this.handleTree(response.data, "id");
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentid = row.id;
      }
      getDictionary(row.id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDictionary(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDictionary(this.form).then((response) => {
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
      this.$confirm('是否确认删除字典编号为"' + row.id + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delDictionary(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 点击查看下一级 */
    handleList(row) {
      this.reset();
      selectDictionaryById(row.id).then((response) => {
        this.dictionaryList = this.handleTree(response.data, "id");
        this.loading = false;
      });
      this.visibleCancel = true;
      this.idData = row.id;
    },
    handleHome(row) {
      this.visibleCancel = false;
      this.idData = 0;
      this.getList();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有类型数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportDictionary(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    /** 清理缓存按钮操作 */
    handleClearCache() {
      clearCache().then((response) => {
        this.msgSuccess("清理成功");
      });
    },
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateDictionary(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>
