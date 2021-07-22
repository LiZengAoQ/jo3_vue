<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="药师名称" prop="docName">
        <el-input
          v-model="queryParams.docName"
          placeholder="请输入药师名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属药房" prop="hosId">
        <el-select
          v-model="queryParams.hosId"
          ref="clearSelect"
          placeholder="所属药房"
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
<!--      <el-form-item label="状态" prop="fgActive">-->
<!--        <el-select-->
<!--          v-model="queryParams.fgActive"-->
<!--          placeholder="状态"-->
<!--          clearable-->
<!--          size="small"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="dictionary in statusOptions"-->
<!--            :key="dictionary.data"-->
<!--            :label="dictionary.name"-->
<!--            :value="dictionary.data"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
          v-hasPermi="['api:docInfo:add']"
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
          v-hasPermi="['api:docInfo:edit']"
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
          v-hasPermi="['api:docInfo:remove']"
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
          v-hasPermi="['system:docInfo:export']"
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
      :data="docInfoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="docName" />
      <el-table-column label="性别" align="center" prop="docGender" />
      <el-table-column label="所属药房医院" align="center" prop="hosName" />
      <!-- <el-table-column label="医生类型" align="center" prop="docType" /> -->
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
        label="创建时间"
        align="center"
        prop="dtCreate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtCreate, "{y}-{m}-{d}") }}</span>
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
            v-hasPermi="['api:docInfo:edit']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleResetPwd(scope.row)"
            v-hasPermi="['api:docInfo:edit']"
          >修改密码</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:docInfo:remove']"
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

    <!-- 添加或医生对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属药房" prop="hosId">
          <el-select
            v-model="form.hosId"
            placeholder="所属药房"
            clearable
            size="small"
          >
            <el-option
              v-for="dictionary in hosIdOptions"
              :key="dictionary.hosId"
              :label="dictionary.hosName"
              :value="dictionary.hosId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="药师名称" prop="docName">
          <el-input v-model="form.docName" placeholder="请输入药师名称" />
        </el-form-item>
        <!-- <el-form-item label="证件号码" prop="docTitle">
          <el-input v-model="form.docTitle" placeholder="请输入证件号码" />
        </el-form-item> -->
        <el-form-item label="证件号码" prop="docCardNo">
          <el-input
            v-model="form.docCardNo"
            placeholder="请输入证件号码"
            @blur="getName(form.docCardNo)"
          />
        </el-form-item>
        <el-form-item label="药师头像" prop="docAvatar">
          <!-- :on-change="fileChange"  -->
          <el-upload
            action
            list-type="picture-card"
            :before-upload="adUrlBeforeUpload"
            :http-request="uploadImage"
            name="file"
            :show-file-list="false"
            :headers="headers"
            style="display: inline-block; vertical-align: top"
          >
            <el-image v-if="!docAvatar" :src="docAvatar">
              <div slot="error" class="image-slot">
                <i class="el-icon-plus"/>
              </div>
            </el-image>
            <div v-else class="image">
              <el-image :src="docAvatar" :style="`width:150px;height:150px;`" fit="fill"/>
              <div class="mask">
                <div class="actions">
                  <span title="预览" @click.stop="dialogVisible = true">
                    <i class="el-icon-zoom-in"/>
                  </span>
                  <span title="移除" @click.stop="removeImage">
                    <i class="el-icon-delete"/>
                  </span>
                </div>
              </div>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
            <img :src="docAvatar" style="display: block; max-width: 100%; margin: 0 auto;"/>
          </el-dialog>

        </el-form-item>
        <el-form-item label="药师介绍" prop="docDes">
          <el-input
            v-model="form.docDes"
            placeholder="请输入药师介绍"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="药师手机号" prop="docMobile">
          <el-input v-model="form.docMobile" placeholder="请输入药师手机号" />
        </el-form-item>
        <!-- <el-form-item label="初始密码" prop="docDes">
          <el-input v-model="form.docDes" placeholder="请输入初始密码" type="password" />
        </el-form-item> -->
        <el-form-item label="初始密码">
          <el-input placeholder="123456" :disabled="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

<!--    修改密码页-->
    <el-dialog :title="title" :visible.sync="openResetPwd" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="新密码">
            <el-input v-model="newPwd" placeholder="请输出新密码"  />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormByResetPwd">确 定</el-button>
        <el-button @click="cancelResetPwd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRecipeInfo,
  getRecipeInfo,
  delRecipeInfo,
  addRecipeInfo,
  updateRecipeInfo,
  exportRecipeInfo,
  updatePwd,
} from "@/api/yiliao/recipe/phar";
import { getDictionarys, listDictionary } from "@/api/system/dictionary";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listHosData } from "@/api/yiliao/base/hosData";
import { listBookDept } from "@/api/yiliao/book/bookDept";
import { uploadFile } from "@/api/monitor/upload";
//上传并修改
import { getToken } from '@/utils/auth'

export default {
  name: "Setting",
  components: {
    Treeselect,
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
      // 系统_广告_设置表格数据
      docInfoList: [],
      deptIdOptions: [],
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 所属医院
      hosIdOptions: [],
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
        fg_active: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        docMobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: "手机号格式错误",
            trigger: "blur",
          },
        ],
        docCardNo: [
          {
            required: false,
            message: "请输入身份证ID",
            trigger: "blur",
          },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: "请输入合法的身份证号码",
          },
        ],
      },
      //上传并修改
      dialogVisible: false,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      openResetPwd: false,
      newPwd:null,
    };
  },
  created() {
    this.getList();
    this.queryParams.hosType = "PHARMACY";
    listHosData(this.queryParams).then((response) => {
      this.hosIdOptions = response.rows;
    });

    listBookDept().then((response) => {
      this.deptIdOptions = response.rows;
    });

    getDictionarys("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });

  },
  //上传并修改
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 上传并修改
    removeImage() {
      this.$emit('input', '')
      this.docAvatar = ''
    },
    handleUploadSuccess(res) {
      this.$emit('input', res.url)
      this.loading.close()
    },
    handleBeforeUpload() {
      this.loading = this.$loading({
        lock: true,
        text: '上传中',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    handleUploadError() {
      this.$message({
        type: 'error',
        message: '上传失败'
      })
      this.loading.close()
    },
    /** 查询医生列表 */
    getList() {
      this.loading = true;
      listRecipeInfo(this.queryParams).then((response) => {
        this.docInfoList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    change($event) {
      this.$refs.clearSelect.query = "";
      this.$emit("change", $event);
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        key: null,
        docAvatar: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        fgActive: null,
        hosId: null,
        deptId: null,
      };
      this.resetForm("form");
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
      // this.getTreeselect();
      this.open = true;
      this.getList();
      this.title = "添加医生";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecipeInfo(id).then((response) => {
        this.form = response.data;
        if (response.data.docAvatar != null) {
          this.fileList = [{ name: "food.jpg", url: response.data.docAvatar }];
        }
        if (response.data.docAvatar == null) {
          this.fileList = [];
        }
        this.open = true;
        this.title = "修改医生信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            this.form.docAvatar = this.docAvatar;
            this.form.dtCreate = null;
            this.form.dtModify = null;
            updateRecipeInfo(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.docAvatar = this.docAvatar;
            addRecipeInfo(this.form).then((response) => {
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
      this.$confirm('是否确认删除"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delRecipeInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRecipeInfo(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    handleStatusChange(row) {
      let text = row.fgActive === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.docName + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateRecipeInfo(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.fgActive = row.fg_active === "0" ? "1" : "0";
        });
    },
    adUrlBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 1;
      if (!isRightSize) {
        this.$message.error("文件大小超过 1MB");
      }
      let isAccept = new RegExp("image/*").test(file.type);
      if (!isAccept) {
        this.$message.error("应该选择image/*类型的文件");
      }
      return isRightSize && isAccept;
    },
    uploadImage(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      uploadFile(formData)
        .then((response) => {
          console.log("上传图片成功");
          this.docAvatar = response.data;
          param.onSuccess(); // 上传成功的图片会显示绿色的对勾
        })
        .catch((response) => {
          console.log("图片上传失败");
          param.onError();
        });
    },
    getName(iden) {
      let val = iden.length;
      let sex = null;
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = 0;

      if (val === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1;
        sex = iden.substring(16, 17);
        if (
          iden.substring(10, 12) < month ||
          (iden.substring(10, 12) == month && iden.substring(12, 14) <= day)
        )
          age++;
      }
      if (val === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901;
        sex = iden.substring(13, 14);
        if (
          iden.substring(8, 10) < month ||
          (iden.substring(8, 10) == month && iden.substring(10, 12) <= day)
        )
          age++;
      }
      if (sex % 2 === 0) sex = "女";
      else sex = "男";
      console.log(sex, 6677);
      if (val > 17) {
        this.form.docGender = sex;
      }
    },
    /** 修改密码按钮 */
    handleResetPwd(row){
      this.reset();
      const id = row.id || this.ids;
      getRecipeInfo(id).then((response) => {
        this.form = response.data;
        if (response.data.docAvatar != null) {
          this.fileList = [{ name: "food.jpg", url: response.data.docAvatar }];
        }
        if (response.data.docAvatar == null) {
          this.fileList = [];
        }
        this.openResetPwd = true;
        this.title = "修改密码";
      });

    },
    /** 提交按钮 */
    submitFormByResetPwd() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            this.form.docAvatar = this.docAvatar;
            updatePwd(this.form.id,this.newPwd).then((response) => {
              this.msgSuccess("修改成功");
              this.openResetPwd = false;
              this.newPwd = null;
              this.getList();
            });
          } else {
            this.form.docAvatar = this.docAvatar;
            addRecipeInfo(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    // 取消按钮
    cancelResetPwd() {
      this.openResetPwd = false;
      this.reset();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">

  // 上传并修改
  .image {
    position: relative;

    .mask {
      opacity: 0;
      position: absolute;
      top: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      transition: all 0.3s;
    }

    &:hover .mask {
      opacity: 1;
    }
  }
</style>
