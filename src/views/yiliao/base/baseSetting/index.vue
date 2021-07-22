<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="广告名称" prop="adName">
                <el-input
                    v-model="queryParams.adName"
                    placeholder="请输入广告名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="客户端类型" prop="clientType" label-width="88px">
                <el-select
                    v-model="queryParams.clientType"
                    placeholder="请选择客户端类型"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dictionary in clientTypeOptions"
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
                    v-hasPermi="['api:baseSetting:add']"
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
                    v-hasPermi="['api:baseSetting:edit']"
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
                    v-hasPermi="['api:baseSetting:remove']"
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
                    v-hasPermi="['system:setting:export']"
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
            :data="settingList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"/>
            <!-- <el-table-column label="广告id" align="center" prop="id" /> -->
            <el-table-column label="广告名称" align="center" prop="adName"/>
            <el-table-column
                label="客户端类型"
                align="center"
                :formatter="clientTypeFormat"
            />
            <el-table-column label="广告位置" align="center" prop="adLayout" :formatter="ggwzFormat"/>
            <el-table-column label="创建人" align="center" prop="createBy"/>
            <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="修改人" align="center" prop="updateBy" /> -->
            <el-table-column
                label="是否有效"
                align="center"
                prop="fgActive"
                :formatter="fgActiveFormat"
            />
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
                        v-hasPermi="['api:baseSetting:edit']"
                    >修改
                    </el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['api:baseSetting:remove']"
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

        <!-- 添加或修改系统_广告_设置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="广告名称" prop="adName">
                    <el-input v-model="form.adName" placeholder="请输入广告名称"/>
                </el-form-item>
                <el-form-item label="客户端类型" prop="clientType">
                    <el-select
                        v-model="form.clientType"
                        placeholder="客户端类型"
                        clearable
                        size="small"
                    >
                        <el-option
                            v-for="dictionary in clientTypeOptions"
                            :key="dictionary.data"
                            :label="dictionary.name"
                            :value="dictionary.data"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位置" prop="adLayout">
                    <el-select
                        v-model="form.adLayout"
                        placeholder="广告位置"
                        clearable
                        size="small"
                    >
                        <el-option
                            v-for="dictionary in advertisementOptions"
                            :key="dictionary.data"
                            :label="dictionary.name"
                            :value="dictionary.data"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="图片上传" prop="adUrl">
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

                </el-form-item>

                <el-form-item label="点击事件" prop="clickType">
                    <el-select
                        v-model="form.clickType"
                        placeholder="点击事件"
                        clearable
                        size="small"
                    >
                        <el-option
                            v-for="dictionary in clickOptions"
                            :key="dictionary.data"
                            :label="dictionary.name"
                            :value="dictionary.data"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转位置" prop="clickLayout">
                    <el-input v-model="form.clickLayout" placeholder="请输入跳转位置"/>
                </el-form-item>
                <el-form-item label="点击值" prop="clickVal">
                    <el-input v-model="form.clickVal" placeholder="请输入点击值"/>
                </el-form-item>
                <el-form-item label="显示顺序" prop="showIndex">
                    <el-input-number
                        v-model="form.showIndex"
                        controls-position="right"
                        :min="0"
                    />
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
    listSetting,
    getSetting,
    delSetting,
    addSetting,
    updateSetting,
    exportSetting
} from '@/api/yiliao/base/baseSetting'
import { getDictionarys, listDictionary } from '@/api/system/dictionary'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listHosData } from '@/api/yiliao/base/hosData'
import { uploadFile } from '@/api/monitor/upload'
//上传并修改
import { getToken } from '@/utils/auth'

export default {
    name: 'Setting',
    components: {
        Treeselect
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
            settingList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 客户端类型字典
            clientTypeOptions: [],
            // 点击事件
            clickOptions: [],
            // 是否有效字典
            fgActiveOptions: [],
            // 广告位置
            advertisementOptions: [],
            // 状态数据字典
            hosIdOptions: [],
            // 文件上传
            fileList: [],
            adUrl: null,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                clientType: null,
                adName: null,
                createTime: null,
                updateTime: null,
                fgActive: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                adName: [
                    { required: true, message: '广告名称不能为空', trigger: 'blur' }
                ],
                clientType: [
                    { required: true, message: '客户端类型不能为空', trigger: 'blur' }
                ],
                adLayout: [
                    { required: true, message: '广告位置不能为空', trigger: 'blur' }
                ],
                clickType: [
                    { required: true, message: '点击事件不能为空', trigger: 'blur' }
                ],
                clickLayout: [
                    { required: true, message: '跳转位置不能为空', trigger: 'blur' }
                ],
                clickVal: [
                    { required: true, message: '点击值不能为空', trigger: 'blur' }
                ],
                hosId: [
                    { required: true, message: '所属医院不能为空', trigger: 'blur' }
                ]
            },

            //上传并修改
            dialogVisible: false,
            // uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
            uploadImgUrl:
                'http://qiniu.ctjk.net/2021-04-30 14:49:11_nAxytnj_18ouuV.jpg', // 上传的图片服务器地址
            headers: {
                Authorization: 'Bearer ' + getToken()
            }

        }
    },
    created() {
        this.getList()
        getDictionarys('sys_client_type').then((response) => {
            this.clientTypeOptions = response.data
        })
        getDictionarys('sys_data_status').then((response) => {
            this.fgActiveOptions = response.data
        })
        getDictionarys('sys_click_status').then((response) => {
            this.clickOptions = response.data
        })
        getDictionarys('sys_advertisement_type').then((response) => {
            this.advertisementOptions = response.data
        })
        listHosData().then((response) => {
            this.hosIdOptions = response.rows
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
            this.adUrl = ''
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
        /** 查询系统_广告_设置列表 */
        getList() {
            this.loading = true
            this.queryParams.adLayout = 'INDEX'
            listSetting(this.queryParams).then((response) => {
                this.settingList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        /** 查询节点下拉树结构 */
        getTreeselect() {
            listDictionary().then((response) => {
                // this.clientTypeOptions = [];
                // const data = { id: 0, name: '顶级节点', children: [] };
                const data = null
                data.children = this.handleTree(response.data, 'id', 'parentid')
                this.clientTypeOptions.push(data)
                this.clickOptions.push(data)
                this.advertisementOptions.push(data)
            })
        },
        // 客户端类型字典翻译
        clientTypeFormat(row, column) {
            return this.selectDictLabel(this.clientTypeOptions, row.clientType)
        },
        ggwzFormat(row, column) {
            return this.selectDictLabel(this.advertisementOptions, row.adLayout)
        },
        // 是否有效字典翻译
        fgActiveFormat(row, column) {
            return this.selectDictLabel(this.fgActiveOptions, row.fgActive)
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
                clientType: null,
                adName: null,
                adLayout: null,
                adUrl: null,
                clickType: null,
                clickLayout: null,
                clickVal: null,
                showIndex: null,
                createTime: null,
                createBy: null,
                updateTime: null,
                updateBy: null,
                hosId: null,
                sort: 0
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
            this.ids = selection.map((item) => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            this.getTreeselect()
            this.open = true
            this.title = '添加广告页设置'
            this.adUrl = null
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            getSetting(id).then((response) => {
                this.form = response.data
                if (response.data.adUrl != null) {
                    this.fileList = [{ name: 'food.jpg', url: response.data.adUrl }]
                    this.adUrl = response.data.adUrl
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
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        this.form.adUrl = this.adUrl
                        updateSetting(this.form).then((response) => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        this.form.adUrl = this.adUrl
                        addSetting(this.form).then((response) => {
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
            this.$confirm(
                '是否确认删除系统_广告_设置编号为"' + ids + '"的数据项?',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(function() {
                    return delSetting(ids)
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有系统_广告_设置数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(function() {
                    return exportSetting(queryParams)
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
            uploadFile(formData).then(response => {
                // console.sensitiveLogs('上传图片成功')
                this.adUrl = response.data
                // console.sensitiveLogs(this.adUrl,222222222222)
                // this.fileList = [{name: 'food.jpg', url: response.data}];
                // console.sensitiveLogs(this.fileList,111111111111);
                param.onSuccess()  // 上传成功的图片会显示绿色的对勾
            }).catch(response => {
                console.log('图片上传失败')
                param.onError()
            })
        }
        // fileChange(file){
        //   this.$refs.upload.clearFiles() //清除文件对象
        //   this.logo = file.raw // 取出上传文件的对象，在其它地方也可以使用
        //   // 重新手动赋值filstList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
        //   this.fileList = [{name: 'food.jpg', url: this.adUrl}];
        //   console.sensitiveLogs(this.fileList = [{adUrl: file.url}],9999999999)
        // },
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
