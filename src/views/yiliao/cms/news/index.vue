<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >

      <el-form-item label="资讯标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入资讯标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input
          v-model="queryParams.author"
          placeholder="请输入作者"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['api:news:add']"
        >新增
        </el-button
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
          v-hasPermi="['api:news:edit']"
        >修改
        </el-button
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
          v-hasPermi="['api:news:remove']"
        >删除
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['api:news:export']"
        >导出
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
      :data="newsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <!-- <el-table-column label="编号" align="center" prop="id" /> -->
      <el-table-column label="资讯标题" align="center" prop="title"/>
      <el-table-column label="资讯模块" align="center" prop="moduleName"/>
      <el-table-column label="资讯来源" align="center" prop="sourceName"/>
      <el-table-column label="作者" align="center" prop="author"/>
<!--      <el-table-column label="是否置顶" align="center" prop="author"/>-->
      <el-table-column label="阅读次数" align="center" prop="readCount"/>
      <el-table-column label="资讯标签" align="center" prop="tagName"/>
      <!-- <el-table-column label="点赞次数" align="center" prop="likesCount" /> -->
      <el-table-column
        label="发布时间"
        align="center"
        prop="dtRelease"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtRelease, '{y}-{m}-{d}') }}</span>
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
            v-hasPermi="['api:news:edit']"
          >修改
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:news:remove']"
          >删除
          </el-button
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

    <!-- 添加或修改资讯对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入资讯标题"/>
        </el-form-item>
        <el-form-item label="资讯标签" prop="tagName">
          <el-input v-model="form.tagName" placeholder="请输入资讯标签,分割"/>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者"/>
        </el-form-item>
        <!-- <el-form-item label="资讯图片">
          <imageUpload v-model="form.titleImg"/>
        </el-form-item> -->
        <!-- multiple -->
        <el-form-item label="模块选择" prop="moduleId">
          <el-select
            v-model="form.moduleId"
            ref="clearSelect"
            placeholder="请选择下拉选择"
            clearable
            size="small"
            filterable
            default-first-option
          >
            <el-option
              v-for="dictionary in field101Options"
              :key="dictionary.id"
              :label="dictionary.moduleName"
              :value="dictionary.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="资讯图片" prop="titleImg">
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
            <el-image v-if="!titleImg" :src="titleImg">
              <div slot="error" class="image-slot">
                <i class="el-icon-plus"/>
              </div>
            </el-image>
            <div v-else class="image">
              <el-image :src="titleImg" :style="`width:150px;height:150px;`" fit="fill"/>
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
            <img :src="titleImg" style="display: block; max-width: 100%; margin: 0 auto;"/>
          </el-dialog>
        </el-form-item>
        <el-form-item label="资讯来源" prop="sourceName">
          <el-input v-model="form.sourceName" placeholder="请输入资讯来源"/>
        </el-form-item>
        <el-form-item label="来源地址" prop="sourceUrl">
          <el-input v-model="form.sourceUrl" placeholder="请输入来源地址"/>
        </el-form-item>
        <el-form-item label="资讯内容">
          <editor v-model="form.content" :min-height="192" placeholder="请输入资讯内容"/>
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
    listNews,
    listNewss,
    getNews,
    delNews,
    addNews,
    updateNews,
    exportNews
  } from '@/api/yiliao/cms/news'
  import ImageUpload from '@/components/ImageUpload'
  import { listHosData } from '@/api/yiliao/base/hosData'
  import Editor from '@/components/Editor'
  import { uploadFile } from '@/api/monitor/upload'
  import { listNewsModule } from '@/api/yiliao/cms/newsModule'

  //上传并修改
  import { getToken } from '@/utils/auth'

  export default {
    name: 'News',
    components: {
      ImageUpload,
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
        // 资讯表格数据
        newsList: [],
        // 弹出层标题
        title: '',
        // 状态数据字典
        hosIdOptions: [],
        field101Options: [],
        // 是否显示弹出层
        open: false,
        // 文件上传
        fileList: [],
        titleImg: null,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          sourceName: null,
          tagName: null,
          fgTop: null,
          author: null,
          hosId: null,
          fgActive: null,
          dtRelease: null,
          releaseId: null,
          createBy: null,
          updateTime: null,
          updateBy: null,
          moduleId:'cms_news_type'
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          fgActive: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          ],
          moduleId: [
            {
              required: true,
              message: '请选择下拉选择',
              trigger: 'change'
            }
          ]
        },

        //上传并修改
        dialogVisible: false,
        headers: {
          Authorization: 'Bearer ' + getToken()
        },

      }
    },
    created() {
      this.getList()
      listHosData().then((response) => {
        this.hosIdOptions = response.rows
      })

      listNewsModule({ 'parId': 'cms_news_type' }).then((response) => {
        this.field101Options = response.rows
      })
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
        this.titleImg = ''
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
      /** 查询资讯列表 */
      getList() {
        this.loading = true
        listNewss(this.queryParams).then((response) => {
          this.newsList = response.rows
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
          moduleId: null,
          title: null,
          titleImg: null,
          sourceName: null,
          tagName: null,
          sourceUrl: null,
          videoUrl: null,
          voiceUrl: null,
          content: null,
          readCount: null,
          likesCount: null,
          fgTop: 0,
          sort: null,
          author: null,
          hosId: null,
          fgActive: null,
          dtRelease: null,
          releaseId: null,
          createBy: null,
          updateTime: null,
          updateBy: null
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加资讯'
        this.titleImg = null;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getNews(id).then((response) => {
          this.form = response.data
          if (response.data.titleImg != null) {
            this.fileList = [{ name: 'food.jpg', url: response.data.titleImg }]
            this.titleImg = response.data.titleImg;
          }
          if (response.data.titleImg == null) {
            this.fileList = []
          }
          this.open = true
          this.title = '修改资讯'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id != null) {
              this.form.titleImg = this.titleImg
              updateNews(this.form).then((response) => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              // var mokuan = this.field101Options;
              // this.form.moduleId = mokuan.toString();
              this.form.titleImg = this.titleImg
              addNews(this.form).then((response) => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除资讯编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return delNews(ids)
          })
          .then(() => {
            this.getList()
            this.msgSuccess('删除成功')
          })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有资讯数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return exportNews(queryParams)
          })
          .then((response) => {
            this.download(response.msg)
          })
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
        uploadFile(formData)
          .then((response) => {
            this.titleImg = response.data
            param.onSuccess() // 上传成功的图片会显示绿色的对勾
          })
          .catch((response) => {
            param.onError()
          })
      }
    }
  }
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
