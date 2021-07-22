<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="显示条数" prop="resultRow">
            <el-select v-model="queryParams.resultRow" placeholder="设置显示条数" clearable size="small">
            <el-option label="显示前两条" value="2">显示前两条</el-option>
            <el-option label="显示前四条" value="4">显示前四条</el-option>
            <el-option label="显示前六条" value="6">显示前六条</el-option>
            <el-option label="显示前八条" value="8">显示前八条</el-option>
            <el-option label="显示前十条" value="10">显示前十条</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">保存</el-button>
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
          v-hasPermi="['api:deptRecommend:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deptList">
      <el-table-column label="科室编号" align="center" prop="deptCode" />
      <el-table-column label="科室名称" align="center" prop="deptName" />
      <el-table-column label="显示序号" align="center" prop="sort" />
      <el-table-column label="科室图片" align="center" prop="deptPic" width="180">
        <template slot-scope="scope">
          <img  :src="scope.row.deptPic" alt="" style="width: 30px;height: 30px">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:deptRecommend:delete']"
          >移除推荐</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['api:deptRecommend:update']"
          >修改信息</el-button>
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

    <!-- 新增信息对话框 -->
    <el-dialog :title="title" :visible.sync="openByAdd" width="1000px" append-to-body>
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="标准科室名称" prop="deptName">
          <el-input v-model="queryParams.deptName" placeholder="请输入标准科室名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryByAdd">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryByAdd">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="deptNotHotList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="科室编号" align="center" prop="deptCode" />
        <el-table-column label="科室名称" align="center" prop="deptName" />
      </el-table>

      <pagination
        v-show="totalByAdd>0"
        :total="totalByAdd"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getNotHotDeptList"
      />

      <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="submitFormByAdd">确 定</el-button>
         <el-button @click="cancelByAdd">取 消</el-button>
      </div>
    </el-dialog>



     <!-- 修改信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="显示序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入显示序号" />
        </el-form-item>

        <el-form-item label="图片上传" prop="deptPic">
          <div class="component-upload-image">
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
              <el-image v-if="!form.deptPic" :src="form.deptPic">
                <div slot="error" class="image-slot">
                  <i class="el-icon-plus"/>
                </div>
              </el-image>
              <div v-else class="image">
                <el-image :src="form.deptPic" :style="`width:150px;height:150px;`" fit="fill"/>
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
              <img :src="form.deptPic" style="display: block; max-width: 100%; margin: 0 auto;"/>
            </el-dialog>
          </div>
        </el-form-item>

        <el-form-item label="描述" prop="deptDesc">
          <el-input type="textarea" v-model="form.deptDesc" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-hasPermi="['api:deptRecommend:add']">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { listDeptRecommend, addDeptRecommend, listRowDeptRecommend, updateDeptRecommend,deleteDeptRecommend,listByNotHotDept,queryDeptCodeList } from "@/api/yiliao/base/deptRecommend";
import {uploadFile} from "@/api/monitor/upload";
import { getToken } from '@/utils/auth'

export default {
  name: "Dept",
  components: {
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
      // 新增页总条数
      totalByAdd: 0,
      // 医院科室信息表格数据
      deptList: [],
      //非热门科室列表
      deptNotHotList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //新增弹出
      openByAdd : false,


      //文件上传参数
      fileList: [],
      //上传并修改
      dialogVisible: false,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },


      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        deptName: null,
        sort: null,
        deptPic: null,
        resultRow: null,
        deptCode: null,
        deptDesc: null,
        deptCodes:[],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询医院科室信息列表 */
    getList() {
      this.loading = true;
      listDeptRecommend(this.queryParams).then(response => {
        this.deptList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询医院科室信息列表 Codes */
    // getDeptCodeList() {
    //   queryDeptCodeList().then(response => {
    //     console.sensitiveLogs("data"+response.data)
    //     this.deptCodes = response.data;
    //     this.total = response.total;
    //   });
    // },
    /** 新增页非热门科室信息列表 */
    getNotHotDeptList() {
      this.loading = true;
      listByNotHotDept(this.queryParams).then(response => {
        this.deptNotHotList = response.rows;
        this.totalByAdd = response.total;
        this.loading = false;
      });
    },
    /** 查询固定信息列表 */
    getListRow() {
      listRowDeptRecommend(this.queryParams.resultRow).then(response => {
        this.deptList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 新增页取消按钮
    cancelByAdd() {
      this.openByAdd = false;
      this.resetQuery();
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        deptName: null,
        sort: null,
        deptPic: null,
        resultRow: null,
        deptCode: null,
        deptDesc: null,
      };
      this.resetForm("form");
      this.resetForm("queryForm");
    },
    /** 展示页保存按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getListRow();
    },
    /** 展示页列表 */
    handleQueryAll() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 展示页重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQueryAll();
    },
    /** 新增页的搜索按钮 */
    handleQueryByAdd(){
      this.queryParams.pageNum = 1;
      this.getNotHotDeptList();
    },
    /** 新增页重置按钮操作 */
    resetQueryByAdd() {
      this.resetForm("queryForm");
      this.getNotHotDeptList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deptCode)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改前查询操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "修改热门科室信息";
    },
    //新增
    async handleAdd() {
      this.reset();
      const response=  await queryDeptCodeList();
      this.queryParams.deptCodes = response.data;

      this.getNotHotDeptList(this.queryParams);
      this.openByAdd = true;
      this.title = "添加科室信息";
    },
    /** 修改按钮提交 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            console.log(this.form.id)
            updateDeptRecommend(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
              this.msgSuccess("修改失败");
              this.open = false;
              this.getList();
          }
        }
      });
    },
    /** 新增页 批量添加 */
    submitFormByAdd(row) {
      const ids = row.deptCode || this.ids;
      this.$confirm('是否确认将医院科室编号为"' + ids + '"的数据项添加到热门科室?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return addDeptRecommend(ids);
      }).then(() => {
        this.openByAdd = false;
        this.getList();
        this.msgSuccess("添加成功");
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$confirm('是否确认取消编号："' + id + '"为热门科室信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteDeptRecommend(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    //文件上传

    // 上传并修改
    removeImage() {
      this.$emit('input', '')
      this.form.deptPic = ''
    },
    // 判断图片大小
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
    // 图片上传
    uploadImage(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      uploadFile(formData)
        .then(response => {
          console.log(response, '上传图片成功')
          this.form.deptPic = response.data
          console.log(this.queryParams.deptPic, 33333333)
          // this.fileList = [{name: 'food.jpg', url: response.data}];
          // console.sensitiveLogs(this.fileList,111111111111);
          param.onSuccess() // 上传成功的图片会显示绿色的对勾
        })
        .catch(response => {
          console.log('图片上传失败')
          param.onError()
        })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.titles {
  border-bottom: 1px solid #e7eaec;
  padding: 15px;
  margin-bottom: 20px;
}

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
