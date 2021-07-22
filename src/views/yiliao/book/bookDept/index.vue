<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="科室名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入科室名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属医院" prop="hosId">
        <el-select
          v-model="queryParams.hosId"
          placeholder="所属医院"
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
      <el-form-item label="科室状态" prop="fgActive">
        <el-select
          v-model="queryParams.fgActive"
          placeholder="科室状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dictionary in statusOptions"
            :key="dictionary.data"
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
          v-hasPermi="['api:bookDept:add']"
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
          v-hasPermi="['api:bookDept:edit']"
          >修改</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['api:bookDept:remove']"
          >删除</el-button
        >
      </el-col> -->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['api:bookDept:export']"-->
<!--          >导出</el-button-->
<!--        >-->
<!--      </el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="bookDeptList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="平台科室ID" align="center" prop="deptId" /> -->
      <el-table-column label="科室名称" align="center" prop="deptName" />
      <!-- <el-table-column label="医院ID" align="center" prop="hosId" /> -->
      <el-table-column label="医院ID" align="center" prop="hosName" />
      <!-- <el-table-column label="医院内部科室ID" align="center" prop="hisDeptId" /> -->
      <!-- <el-table-column label="平台标准科室ID" align="center" prop="deptCode" /> -->
      <el-table-column label="平台标准科室ID" align="center" prop="gbDeptName" />
      <!-- <el-table-column label="科室描述" align="center" prop="des" /> -->
      <!-- <el-table-column label="年龄限制 0-无限制 1-14周岁以上 2-18周岁以下" align="center" prop="ageLimit" /> -->
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
      <!-- <el-table-column label="显示序号" align="center" prop="sort" /> -->
      <!-- <el-table-column label="预约成功数" align="center" prop="bookCount" /> -->
      <!-- <el-table-column label="科室图片" align="center" prop="deptPic" /> -->
      <!-- <el-table-column label="最大年龄" align="center" prop="maxAge" /> -->
      <!-- <el-table-column label="最小年龄" align="center" prop="minAge" /> -->
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
            v-hasPermi="['api:bookDept:edit']"
            >修改</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:bookDept:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改医院科室信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="科室名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入科室名称" />
        </el-form-item>
        <el-form-item label="所属医院" prop="hosId">
          <el-select
            v-model="form.hosId"
            placeholder="所属医院"
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
        <!-- <el-form-item label="医院内部科室ID" prop="hisDeptId">
          <el-input
            v-model="form.hisDeptId"
            placeholder="请输入医院内部科室ID"
          />
        </el-form-item> -->
        <el-form-item label="平台标准科室" prop="deptCode">
          <el-select
            v-model="form.deptCode"
            placeholder="请选择平台标准科室"
            clearable
            size="small"
          >
            <el-option
              v-for="dictionary in gbDeptNameOptions"
              :key="dictionary.deptCode"
              :label="dictionary.deptName"
              :value="dictionary.deptCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片上传" prop="deptPic">
          <!-- :on-change="fileChange"  -->
<!--          <el-upload ref="upload" :file-list="fileList" action="" :limit="1" :http-request="uploadImage" multiple-->
<!--           :before-upload="adUrlBeforeUpload" list-type="picture-card" accept="image/*">-->
<!--            <i class="el-icon-plus"></i>-->
<!--          </el-upload>-->

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
            <el-image v-if="!deptPic" :src="deptPic">
              <div slot="error" class="image-slot">
                <i class="el-icon-plus"/>
              </div>
            </el-image>
            <div v-else class="image">
              <el-image :src="deptPic" :style="`width:150px;height:150px;`" fit="fill"/>
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
            <img :src="deptPic" style="display: block; max-width: 100%; margin: 0 auto;"/>
          </el-dialog>
        </el-form-item>
        <el-form-item label="科室描述" prop="des">
          <el-input
            v-model="form.des"
            type="textarea"
            placeholder="请输入内容"
          />
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
  listBookDept,
  getBookDept,
  delBookDept,
  addBookDept,
  updateBookDept,
  exportBookDept,
} from "@/api/yiliao/book/bookDept";
import { listHosData } from "@/api/yiliao/base/hosData";
import { getDictionarys } from "@/api/system/dictionary";
import { listStandardDepartment} from "@/api/yiliao/base/standardDepartment";
import {uploadFile} from "@/api/monitor/upload"
//上传并修改
import { getToken } from '@/utils/auth'

export default {
  name: "BookDept",
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
      // 医院科室信息表格数据
      bookDeptList: [],
      // 状态数据字典
      hosIdOptions: [],
      gbDeptNameOptions: [],
      // 状态数据字典
      statusOptions: [],
      // 文件上传
      fileList: [],
      deptPic: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptName: null,
        des: null,
        ageLimit: null,
        hosIdOptions: null,
        sort: null,
        bookCount: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        hosId: [{ required: true, message: "医院ID不能为空", trigger: "blur" }],
        hisDeptId: [
          {
            required: true,
            message: "医院内部科室ID不能为空",
            trigger: "blur",
          },
        ],
        deptCode: [
          {
            required: true,
            message: "平台标准科室ID不能为空",
            trigger: "blur",
          },
        ],
        deptName: [
          { required: true, message: "科室名称不能为空", trigger: "blur" },
        ],
      },
      //上传并修改
      dialogVisible: false,
      // uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      uploadImgUrl:
        'http://qiniu.ctjk.net/2021-04-30 14:49:11_nAxytnj_18ouuV.jpg', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken()
      },

    };
  },
  created() {
    this.getList();
    listHosData().then((response) => {
      this.hosIdOptions = response.rows;
    });
    getDictionarys("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
    listStandardDepartment().then((response) => {
      this.gbDeptNameOptions = response.rows;
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
      this.deptPic = ''
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

    /** 查询医院科室信息列表 */
    getList() {
      this.loading = true;
      listBookDept(this.queryParams).then((response) => {
        this.bookDeptList = response.rows;
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
        deptId: null,
        hosId: null,
        hisDeptId: null,
        deptCode: null,
        deptName: null,
        des: null,
        ageLimit: null,
        fgActive: null,
        dtModify: null,
        sort: null,
        bookCount: null,
        deptPic: null,
        maxAge: null,
        minAge: null,
        dtCreate: null,
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
      this.ids = selection.map((item) => item.deptId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加医院科室信息";
      this.deptPic = null;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const deptId = row.deptId || this.ids;
      getBookDept(deptId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改医院科室信息";
        this.deptPic = response.data.deptPic;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.deptId != null) {
            updateBookDept(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.deptPic = this.deptPic;
            this.form.hisDeptId ='c891fb1d-bdc3-11e5-b2fd-550ba1f6ea8c';
            addBookDept(this.form).then((response) => {
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
      const deptIds = row.deptId || this.ids;
      this.$confirm(
        '是否确认删除医院科室信息编号为"' + deptIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delBookDept(deptIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有医院科室信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportBookDept(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.fgActive);
    },
    handleStatusChange(row) {
      let text = row.fgActive === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.deptName + '"分类吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateBookDept(row);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.fgActive = row.fgActive === "0" ? "1" : "0";
        });
    },
    adUrlBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 1
      if (!isRightSize) {
        this.$message.error('文件大小超过 1MB')
      }
      let isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择image/*类型的文件')
      }
      return isRightSize && isAccept
    },
    uploadImage(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      uploadFile(formData).then(response => {
        console.log('上传图片成功')
        this.deptPic = response.data;
        param.onSuccess()  // 上传成功的图片会显示绿色的对勾
      }).catch(response => {
        console.log('图片上传失败')
        param.onError()
      })
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
