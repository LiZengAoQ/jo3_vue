<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <div class="titles">患者端启动页配置</div>
      <el-form-item label="启动页图片" prop="adUrl">
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
            <el-image v-if="!adUrl" :src="adUrl">
              <div slot="error" class="image-slot">
                <i class="el-icon-plus"/>
              </div>
            </el-image>
            <div v-else class="image">
              <el-image :src="adUrl" :style="`width:150px;height:150px;`" fit="fill"/>
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
            <img :src="adUrl" style="display: block; max-width: 100%; margin: 0 auto;"/>
          </el-dialog>
        </div>
      </el-form-item>
      <div class="titles">医生端启动页配置</div>

      <el-form-item label="启动页图片" prop="adUrl2">
        <div class="component-upload-image">
          <el-upload
            action
            list-type="picture-card"
            :before-upload="adUrlBeforeUpload"
            :http-request="uploadImage2"
            name="file"
            :show-file-list="false"
            :headers="headers"
            style="display: inline-block; vertical-align: top"
          >
            <el-image v-if="!adUrl2" :src="adUrl2">
              <div slot="error" class="image-slot">
                <i class="el-icon-plus"/>
              </div>
            </el-image>
            <div v-else class="image">
              <el-image :src="adUrl2" :style="`width:150px;height:150px;`" fit="fill"/>
              <div class="mask">
                <div class="actions">
                  <span title="预览" @click.stop="dialogVisible = true">
                    <i class="el-icon-zoom-in"/>
                  </span>
                  <span title="移除" @click.stop="removeImage1">
                    <i class="el-icon-delete"/>
                  </span>
                </div>
              </div>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
            <img :src="adUrl2" style="display: block; max-width: 100%; margin: 0 auto;"/>
          </el-dialog>
        </div>
      </el-form-item>

      <!-- </el-form> -->
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>-->
      <!-- </el-dialog> -->

      <el-form-item>
        <el-button type="primary" @click="submitForm" v-hasPermi="['api:launch:add']">保存</el-button>
        <!-- <el-button @click="cancel">取 消</el-button> -->

        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button> -->
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    listDocInfo,
    getDocInfo,
    delDocInfo,
    addDocInfo,
    updateDocInfo,
    exportDocInfo
  } from '@/api/yiliao/doc/docInfo'
  import { getDictionarys, listDictionary } from '@/api/system/dictionary'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { listHosData } from '@/api/yiliao/base/hosData'
  import {
    addLaunch,
    listLaunch,
    updateSetting,
    getSetting
  } from '@/api/yiliao/base/launch'
  import { listBookDept } from '@/api/yiliao/book/bookDept'
  import { uploadFile } from '@/api/monitor/upload'
  import ImageUpload from '@/components/ImageUpload'
  import Editor from '@/components/Editor'
  //上传并修改
  import { getToken } from '@/utils/auth'

  export default {
    name: 'Setting',
    components: {
      Treeselect,
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
        // 系统_广告_设置表格数据
        docInfoList: [],
        deptIdOptions: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 所属医院
        hosIdOptions: [],
        // 文件上传
        fileList: [],
        fileList2: [],
        adUrl: null,
        adUrl2: null,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          docName: null,
          createTime: null,
          updateTime: null,
          fg_active: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},

        //上传并修改
        dialogVisible: false,
        // uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
        uploadImgUrl:
          'http://qiniu.ctjk.net/2021-04-30 14:49:11_nAxytnj_18ouuV.jpg', // 上传的图片服务器地址
        headers: {
          Authorization: 'Bearer ' + getToken()
        },

        idall: ''
      }
    },
    created() {
      this.getList()
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
        this.adUrl = ''
      },
      removeImage1() {
        this.$emit('input', '')
        this.adUrl2 = ''
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
        this.loading = true
        //患者端
        getSetting('da24058b-9ec7-464a-b7f4-d9f2d19e').then(response => {
          var rows = response.data
          if (rows == null || rows == '' || rows == undefined) {
            this.fileList = []
          } else {
            this.adUrl = rows.adUrl
            this.fileList = [{ name: 'food.jpg', url: rows.adUrl }]
          }
          this.loading = false
        })
        //医生端
        getSetting('e0d9bd94-997d-4cb8-b5b5-11f3170f').then(response => {
          var rows = response.data
          if (rows == null || rows == '' || rows == undefined) {
            this.fileList2 = []
          } else {
            this.adUrl2 = rows.adUrl
            this.fileList2 = [{ name: 'food.jpg', url: rows.adUrl }]
          }
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      change($event) {
        this.$refs.clearSelect.query = ''
        this.$emit('change', $event)
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          key: null,
          adUrl: null,
          adUrl2: null,
          createTime: null,
          createBy: null,
          updateTime: null,
          updateBy: null,
          fgActive: null,
          hosId: null,
          deptId: null
        }
        this.resetForm('form')
      },
      /** 转换字典数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
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
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        // this.getTreeselect();
        this.open = true
        this.getList()
        this.title = '添加医生'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getSetting(id).then(response => {
          this.form = response.data
          if (response.data.adUrl != null) {
            this.fileList = [{ name: 'food.jpg', url: response.data.adUrl }]
          }
          if (response.data.adUrl == null) {
            this.fileList = []
          }
          this.open = true
          this.title = '修改广告页设置'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            var aa = [
              {
                adUrl: this.adUrl,
                adLayout: 'PATHOME',
                id: 'da24058b-9ec7-464a-b7f4-d9f2d19e'
              },
              {
                adUrl: this.adUrl2,
                adLayout: 'DOCHOME',
                id: 'e0d9bd94-997d-4cb8-b5b5-11f3170f'
              }
            ]
            for (var i in aa) {
              addLaunch(aa[i]).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
            // }
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
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有数据?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return exportDocInfo(queryParams)
          })
          .then(response => {
            this.download(response.msg)
          })
      },
      handleStatusChange(row) {
        let text = row.fgActive === '1' ? '启用' : '停用'
        this.$confirm('确认要"' + text + '""' + row.docName + '"吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return updateDocInfo(row)
          })
          .then(() => {
            this.msgSuccess(text + '成功')
          })
          .catch(function() {
            row.fgActive = row.fg_active === '0' ? '1' : '0'
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
      // 患者端
      uploadImage(param) {
        const formData = new FormData()
        formData.append('file', param.file)
        uploadFile(formData)
          .then(response => {
            this.adUrl = response.data
            this.idall = 1
            param.onSuccess() // 上传成功的图片会显示绿色的对勾
          })
          .catch(response => {
            console.log('图片上传失败')
            param.onError()
          })
      },
      // 医生端
      uploadImage2(param) {
        const formData = new FormData()
        formData.append('file', param.file)
        uploadFile(formData)
          .then(response => {
            console.log(response, '上传图片成功')
            this.adUrl2 = response.data
            // this.fileList = [{name: 'food.jpg', url: response.data}];
            param.onSuccess() // 上传成功的图片会显示绿色的对勾
          })
          .catch(response => {
            console.log('图片上传失败')
            param.onError()
          })
      }
    }
  }
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
