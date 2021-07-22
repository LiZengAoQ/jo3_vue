<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="医院名称" prop="hosName">
                <el-input
                    v-model="queryParams.hosName"
                    placeholder="请输入医院名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="医院状态" prop="fgActive">
                <el-select v-model="queryParams.fgActive" placeholder="医院状态" clearable size="small">
                    <el-option
                        v-for="dictionary in statusOptions"
                        :key="dictionary.data"
                        :label="dictionary.name"
                        :value="dictionary.data"
                    />
                </el-select>
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
                    v-hasPermi="['api:hosData:add']"
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
                    v-hasPermi="['api:hosData:edit']"
                >修改
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="hosDataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <!-- <el-table-column label="咨询医院id" align="center" prop="hosId" /> -->
            <el-table-column label="医院名称" align="center" prop="hosName"/>
            <el-table-column label="医院简称" align="center" prop="shortName"/>
            <!-- <el-table-column label="医院介绍" align="center" prop="description" /> -->
            <!-- <el-table-column label="医院等级" align="center" prop="hosLevel" /> -->
            <el-table-column label="医院性质" align="center" prop="hosNature"/>
            <el-table-column label="医院类型" align="center" :formatter="clientTypeFormat"/>
            <el-table-column label="医院地址" align="center" prop="addr"/>
            <el-table-column label="医院电话" align="center" prop="hosTel"/>
            <!-- <el-table-column label="医院网址" align="center" prop="webSite" /> -->
            <!-- <el-table-column label="医院图片" align="center" prop="hosPic" /> -->
            <!-- <el-table-column label="咨询量" align="center" prop="consultCount" /> -->
            <!-- <el-table-column label="预约量" align="center" prop="bookCount" /> -->
            <!-- <el-table-column label="显示序号" align="center" prop="sort" /> -->
            <!-- <el-table-column label="国标省级代码" align="center" prop="province" /> -->
            <!-- <el-table-column label="国标市级代码" align="center" prop="city" /> -->
            <!-- <el-table-column label="国标地区代码" align="center" prop="district" /> -->
            <!-- <el-table-column label="医院状态 " align="center" prop="fgActive" /> -->
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
            <el-table-column label="创建时间" align="center" prop="dtCreate" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.dtCreate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center" prop="dtModify" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.dtModify, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="修改人" align="center" prop="modifier"/>
            <!-- <el-table-column label="是否热门 1-热门 0-不热门" align="center" prop="fgHot" /> -->
            <!-- <el-table-column label="是否首页 1-是 0-否" align="center" prop="fgIndex" /> -->
            <!-- <el-table-column label="经度" align="center" prop="longitude" /> -->
            <!-- <el-table-column label="纬度" align="center" prop="latitude" /> -->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['api:hosData:edit']"
                    >修改
                    </el-button>
                    <!-- <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['api:hosData:remove']"
                    >删除</el-button> -->
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

        <!-- 添加或修改医院信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="医院名称" prop="hosName">
                    <el-input v-model="form.hosName" placeholder="请输入医院名称"/>
                </el-form-item>
                <el-form-item label="医院简称" prop="shortName">
                    <editor v-model="form.shortName" :min-height="192"/>
                </el-form-item>
                <el-form-item label="医院介绍" prop="description">
                    <el-input v-model="form.description" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="医院等级" prop="hosLevel">
                    <el-input v-model="form.hosLevel" placeholder="请输入医院等级"/>
                </el-form-item>
                <el-form-item label="医院性质" prop="hosNature">
                    <el-input v-model="form.hosNature" placeholder="请输入医院性质"/>
                </el-form-item>
                <el-form-item label="医院地址" prop="addr">
                    <el-input v-model="form.addr" placeholder="请输入医院地址"/>
                </el-form-item>
                <el-form-item label="医院电话" prop="hosTel">
                    <el-input v-model="form.hosTel" placeholder="请输入医院电话"/>
                </el-form-item>
                <el-form-item label="医院网址" prop="webSite">
                    <el-input v-model="form.webSite" placeholder="请输入医院网址"/>
                </el-form-item>
                <el-form-item label="医院图片" prop="hosPic">
                    <!--          <el-input v-model="form.hosPic" placeholder="请输入医院图片" />-->
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
                        <el-image v-if="!hosPic" :src="hosPic">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-plus"/>
                            </div>
                        </el-image>
                        <div v-else class="image">
                            <el-image :src="hosPic" :style="`width:150px;height:150px;`" fit="fill"/>
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
                        <img :src="hosPic" style="display: block; max-width: 100%; margin: 0 auto;"/>
                    </el-dialog>

                </el-form-item>
                <el-form-item label="咨询量" prop="consultCount">
                    <el-input v-model="form.consultCount" placeholder="请输入咨询量"/>
                </el-form-item>
                <el-form-item label="预约量" prop="bookCount">
                    <el-input v-model="form.bookCount" placeholder="请输入预约量"/>
                </el-form-item>
                <el-form-item label="显示序号" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入显示序号"/>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="form.longitude" placeholder="请输入经度"/>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="form.latitude" placeholder="请输入纬度"/>
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
    listHosData,
    getHosData,
    delHosData,
    addHosData,
    updateHosData,
    exportHosData
} from '@/api/yiliao/base/hosData'
import { getDictionarys } from '@/api/system/dictionary'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { uploadFile } from '@/api/monitor/upload'
//上传并修改
import { getToken } from '@/utils/auth'
import Editor from '@/components/Editor'

export default {
    name: 'HosData',
    components: {
        Treeselect,
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
            // 医院信息表格数据
            hosDataList: [],
            // 状态数据字典
            statusOptions: [],
            // 医院类型数据字典
            hosOptions: [],
            // 文件上传
            fileList: [],
            hosPic: null,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hosName: null,
                hosType: null,
                hosTel: null,
                fgActive: null,
                longitude: null,
                latitude: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                hosName: [
                    { required: true, message: '医院名称不能为空', trigger: 'blur' }
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
        getDictionarys('sys_normal_disable').then(response => {
            this.statusOptions = response.data
        })

        getDictionarys('api_hospital_type').then(response => {
            this.hosOptions = response.data
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
            this.hosPic = ''
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
        /** 查询医院信息列表 */
        getList() {
            this.loading = true
            listHosData(this.queryParams).then(response => {
                this.hosDataList = response.rows
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
                hosId: null,
                hosName: null,
                shortName: null,
                description: null,
                hosLevel: null,
                hosNature: null,
                hosType: null,
                addr: null,
                hosTel: null,
                webSite: null,
                hosPic: null,
                consultCount: null,
                bookCount: null,
                sort: null,
                province: null,
                city: null,
                district: null,
                fgActive: null,
                dtCreate: null,
                dtModify: null,
                modifier: null,
                fgHot: null,
                fgIndex: null,
                hotSort: null,
                thirdChannelId: null,
                thirdHosId: null,
                longitude: null,
                latitude: null
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
            this.ids = selection.map(item => item.hosId)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            this.open = true
            this.title = '添加医院信息'
            this.hosPic = null
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const hosId = row.hosId || this.ids
            getHosData(hosId).then(response => {
                this.form = response.data

                // if (response.data.hosPic != null) {
                //   this.fileList = [{ name: 'food.jpg', url: response.data.hosPic }]
                //   this.hosPic = response.data.hosPic;
                // }
                // if (response.data.hosPic == null) {
                //   this.fileList = []
                // }

                this.open = true
                this.title = '修改医院信息'
                this.hosPic = response.data.hosPic

            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.hosId != null) {
                        this.form.hosPic = this.hosPic
                        updateHosData(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        this.form.hosId = 0
                        this.form.hosPic = this.hosPic
                        addHosData(this.form).then(response => {
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
            const hosIds = row.hosId || this.ids
            this.$confirm('是否确认删除医院信息编号为"' + hosIds + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return delHosData(hosIds)
            }).then(() => {
                this.getList()
                this.msgSuccess('删除成功')
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有医院信息数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return exportHosData(queryParams)
            }).then(response => {
                this.download(response.msg)
            })
        },
        // 字典状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.fgActive)
        },
        clientTypeFormat(row, column) {
            return this.selectDictLabel(this.hosOptions, row.hosType)
        },
        handleStatusChange(row) {
            let text = row.fgActive === '1' ? '启用' : '停用'
            this.$confirm('确认要"' + text + '""' + row.hosName + '"分类吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return updateHosData(row)
            }).then(() => {
                this.msgSuccess(text + '成功')
            }).catch(function() {
                row.fgActive = row.fgActive === '0' ? '1' : '0'
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
                console.log('上传图片成功')
                this.hosPic = response.data
                param.onSuccess()  // 上传成功的图片会显示绿色的对勾
            }).catch(response => {
                console.log('图片上传失败')
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
