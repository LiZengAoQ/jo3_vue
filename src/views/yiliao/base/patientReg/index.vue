<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="患者名称" prop="realName">
                <el-input
                    v-model="queryParams.realName"
                    placeholder="请输入患者名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="手机号" prop="mobilePhone">
                <el-input
                    v-model="queryParams.mobilePhone"
                    placeholder="请输入手机号"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="证件号码" prop="cardNo">
                <el-input
                    v-model="queryParams.cardNo"
                    placeholder="请输入证件号码"
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
                </el-button>
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                >重置
                </el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
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
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="姓名" align="center" prop="realName"/>
            <el-table-column label="头像" align="center" prop="avatar">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.avatar"
                        style="width: 70px; height: 70px"
                    />
                </template>
            </el-table-column>
            <el-table-column label="手机号" align="center" prop="mobilePhone"/>

            <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{
                            parseTime(scope.row.createTime, '{y}-{m}-{d}')
                        }}</span>
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
                    >详情
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="passwordUpdate(scope.row)"
                    >修改密码
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-document"
                        @click="diagnosisTreatment(scope.row)"
                        v-hasPermi="['api:patientreg:query']"
                    >诊疗记录
                    </el-button>
                    <el-button
                        size="mini" type="text"
                        icon="el-icon-document"
                        @click="consultTreatment(scope.row)"
                        v-hasPermi="['api:patientreg:query']"
                    >咨询记录
                    </el-button>
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
        <el-dialog
            :title="title"
            :visible.sync="open"
            width="700px"
            append-to-body
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="realName">
                            <el-input
                                v-model="form.realName"
                                placeholder="请输入姓名"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input
                                v-model="form.mobilePhone"
                                placeholder="请输入手机号"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="证件类型" prop="cardType">
                            <el-select
                                v-model="cardType"
                                placeholder="请选择证件类型"
                                clearable
                                :style="{ width: '100%' }"
                            >
                                <el-option
                                    v-for="(item, index) in field101Options"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件号码" prop="cardNo">
                            <el-input
                                v-model="form.cardNo"
                                placeholder="请输入证件号码"
                                @blur="getName(form.cardNo)"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="年龄" prop="age">
                            <el-input
                                v-model="age"
                                placeholder="请输入年龄"
                                :disabled="true"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="gender">
                            <el-input
                                v-model="form.gender"
                                placeholder=""
                                :disabled="true"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="家族史" prop="familyHistory">
                    <el-input
                        v-model="form.familyHistory"
                        type="textarea"
                        placeholder="请输入家族史"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        :style="{ width: '100%' }"
                    ></el-input>
                </el-form-item>
                <el-form-item label="过敏史" prop="allergyHistory">
                    <el-input
                        v-model="form.allergyHistory"
                        type="textarea"
                        placeholder="请输入过敏史"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        :style="{ width: '100%' }"
                    ></el-input>
                </el-form-item>
                <el-form-item label="现患史" prop="beIll">
                    <el-input
                        v-model="form.beIll"
                        type="textarea"
                        placeholder="请输入现患史"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        :style="{ width: '100%' }"
                    ></el-input>
                </el-form-item>
                <el-form-item label="既往史" prop="pastHistory">
                    <el-input
                        v-model="form.pastHistory"
                        type="textarea"
                        placeholder="请输入既往史"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        :style="{ width: '100%' }"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!--  修改密码  -->
        <el-dialog
            :title="title"
            :visible.sync="open2"
            width="700px"
            append-to-body
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="密码" prop="pwd">
                    <el-input
                        type="password"
                        v-model="form.pwd"
                        placeholder="密码需8至20位，包括字母和数字"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listDocInfo,
    getDocInfo,
    delDocInfo,
    addDocInfo,
    updateDocInfo,
    exportDocInfo,
    updateDocInfoPassword
} from '@/api/yiliao/base/patientReg'
import { getDictionarys, listDictionary } from '@/api/system/dictionary'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listHosData } from '@/api/yiliao/base/hosData'
import { listBookDept } from '@/api/yiliao/book/bookDept'
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
            docInfoList: [],
            deptIdOptions: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            open2: false,
            // 所属医院
            hosIdOptions: [],
            // 文件上传
            fileList: [],
            avatar: null,

            age: null, //年龄
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                realName: null,
                createTime: null,
                updateTime: null,
                fg_active: null,
                mobilePhone: null, //手机号
                cardNo: null //证件号码
            },
            //证件类型
            field101Options: [
                {
                    label: '大陆身份证',
                    value: 1
                }
                // , {
                //   'label': '港澳居民来往内地通行证',
                //   'value': 2
                // }, {
                //   'label': '台湾居民来往大陆通行证',
                //   'value': 3
                // }, {
                //   'label': '护照',
                //   'value': 4
                // }
            ],
            //性别
            bieOptions: [
                {
                    label: '女',
                    value: '1'
                },
                {
                    label: '男',
                    value: '2'
                },
                {
                    label: '未知',
                    value: '3'
                }
            ],
            cardType: null,
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                //下拉框
                hosId: [
                    {
                        required: true,
                        message: '请选择医院',
                        trigger: 'change'
                    }
                ],
                deptId: [
                    {
                        required: true,
                        message: '请选择科室',
                        trigger: 'change'
                    }
                ],
                //文本
                realName: [
                    {
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }
                ],
                mobilePhone: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^1(3|4|5|7|8|9)\d{9}$/,
                        message: '手机号格式错误',
                        trigger: 'blur'
                    }
                ],
                cardNo: [
                    {
                        required: false,
                        message: '请输入身份证ID',
                        trigger: 'blur'
                    },
                    {
                        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                        message: '请输入合法的身份证号码'
                    }
                ],
                pwd: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                ]
            },

            //医生职称字典
            doctorTitle: [],

            //上传并修改
            dialogVisible: false,
            // uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
            // uploadImgUrl:
            //   'http://qiniu.ctjk.net/2021-04-30 14:49:11_nAxytnj_18ouuV.jpg', // 上传的图片服务器地址
            headers: {
                Authorization: 'Bearer ' + getToken()
            }
        }
    },
    created() {
        this.getList()
        listHosData().then(response => {
            this.hosIdOptions = response.rows
        })

        listBookDept().then(response => {
            this.deptIdOptions = response.rows
        })

        getDictionarys('doc_data_type').then(response => {
            this.doctorTitle = response.data
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
            this.avatar = ''
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
            listDocInfo(this.queryParams).then(response => {
                this.docInfoList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.open2 = false
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
                avatar: null,
                createTime: null,
                createBy: null,
                updateTime: null,
                updateBy: null,
                fgActive: null,
                hosId: null,
                deptId: null,
                mobilePhone: null, //手机号
                recipeAuth: [], //处方权限
                bizAuth: [], //业务查询权限
                doctorTitle: null //医生职称
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
            this.fileList = []
            this.title = '添加医生'

            this.avatar = null
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            this.getName(row.cardNo)
            this.cardType = this.cardType
            const id = row.id || this.ids
            getDocInfo(id).then(response => {
                this.form = response.data
                if (response.data.avatar != null) {
                    this.avatar = response.data.avatar
                    this.fileList = [
                        { name: 'food.jpg', url: response.data.avatar }
                    ]
                }
                if (response.data.avatar == null) {
                    this.fileList = []
                }
                this.open = true
                this.title = '修改基本信息/健康档案'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        this.form.avatar = this.avatar
                        updateDocInfo(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.open2 = false
                            this.getList()
                        })
                    } else {
                        var chufang = this.form.recipeAuth
                        var chufang2 = chufang.toString()

                        var yewu = 1
                        if (
                            this.form.bizAuth == null ||
                            this.form.bizAuth == '' ||
                            this.form.bizAuth == undefined
                        ) {
                            var yewu = 0
                        }
                        var yewu2 = yewu.toString()

                        this.form.avatar = this.avatar
                        this.form.docType = 'DOC'
                        this.form.recipeAuth = chufang2
                        this.form.bizAuth = yewu2
                        addDocInfo(this.form).then(response => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.open2 = false
                            this.getList()
                        })
                    }
                }
            })
        },
        diagnosisTreatment(row) {
            this.$router.push({
                path: '/operat/patient/diagnosis',
                query: { id: row.id }
            })
        },
        consultTreatment(row) {
            this.$router.push({
                path: '/jiuzhen/consult/info',
                query: { id: row.id }
            })
        },
        //修改密码
        passwordUpdate(row) {
            this.reset()
            this.getName(row.cardNo)
            this.cardType = this.cardType
            const id = row.id || this.ids
            getDocInfo(id).then(response => {
                this.form = response.data
                this.form.pwd = null //清空密码
                if (response.data.avatar != null) {
                    this.avatar = response.data.avatar
                    this.fileList = [
                        { name: 'food.jpg', url: response.data.avatar }
                    ]
                }
                if (response.data.avatar == null) {
                    this.fileList = []
                }
                this.open2 = true
                this.title = '测试密码 密码修改'
            })
        },
        //修改密码提交
        submitForm2() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        this.form.avatar = this.avatar
                        updateDocInfoPassword(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.open2 = false
                            this.getList()
                        })
                    } else {
                        var chufang = this.form.recipeAuth
                        var chufang2 = chufang.toString()

                        var yewu = 1
                        if (
                            this.form.bizAuth == null ||
                            this.form.bizAuth == '' ||
                            this.form.bizAuth == undefined
                        ) {
                            var yewu = 0
                        }
                        var yewu2 = yewu.toString()

                        this.form.avatar = this.avatar
                        this.form.docType = 'DOC'
                        this.form.recipeAuth = chufang2
                        this.form.bizAuth = yewu2
                        addDocInfo(this.form).then(response => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.open2 = false
                            this.getList()
                        })
                    }
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
            this.$confirm(
                '确认要"' + text + '""' + row.realName + '"吗?',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
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
        uploadImage(param) {
            const formData = new FormData()
            formData.append('file', param.file)
            uploadFile(formData)
                .then(response => {
                    console.log(response, '上传图片成功')
                    this.avatar = response.data
                    param.onSuccess() // 上传成功的图片会显示绿色的对勾
                })
                .catch(response => {
                    console.log('图片上传失败')
                    param.onError()
                })
        },
        getName(iden) {
            let val
            if (iden == null){
                val = 0
            }else {
                val = iden.length;
            }
            let sex = null
            let myDate = new Date()
            let month = myDate.getMonth() + 1
            let day = myDate.getDate()
            let age = 0

            if (val === 18) {
                age = myDate.getFullYear() - iden.substring(6, 10) - 1
                sex = iden.substring(16, 17)
                if (
                    iden.substring(10, 12) < month ||
                    (iden.substring(10, 12) == month &&
                        iden.substring(12, 14) <= day)
                ) {
                    age++
                }
            }
            if (val === 15) {
                age = myDate.getFullYear() - iden.substring(6, 8) - 1901
                sex = iden.substring(13, 14)
                if (
                    iden.substring(8, 10) < month ||
                    (iden.substring(8, 10) == month &&
                        iden.substring(10, 12) <= day)
                ) {
                    age++
                }
            }
            this.age = age
            if (sex % 2 === 0) {
                sex = '女'
            } else {
                sex = '男'
            }
            if (val > 17) {
                this.form.gender = sex
            }
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
