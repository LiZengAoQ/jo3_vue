<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
            <el-form-item label="中心科室名称" prop="deptName">
                <el-input
                    v-model="queryParams.deptName"
                    placeholder="请输入中心科室名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['api:standardDepartment:edit']"
                >新增
                </el-button>
            </el-col>

            <!--      <el-col :span="1.5">-->
            <!--        <el-button-->
            <!--          type="warning"-->
            <!--          plain-->
            <!--          icon="el-icon-download"-->
            <!--          size="mini"-->
            <!--          @click="handleExport"-->
            <!--          v-hasPermi="['api:standardDepartment:export']"-->
            <!--        >导出</el-button>-->
            <!--      </el-col>-->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="standardDepartmentList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="一级标准科室编号" align="center" prop="deptCode"/>
            <el-table-column label="标准科室名称" align="center" prop="deptName"/>
            <!-- <el-table-column label="中心科室图片" align="center" prop="deptPic" /> -->
            <!-- <el-table-column label="科室描述" align="center" prop="deptDesc" /> -->
            <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
            <!-- <el-table-column label="医院状态 " align="center" prop="fgActive" /> -->
            <el-table-column label="状态" align="center" key="fgActive">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.fgActive"
                        active-value="1"
                        inactive-value="0"
                        @change="handleByStatusChange(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['api:standardDepartment:edit']"
                    >修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleSecondLevel(scope.row)"
                        v-hasPermi="['api:standardDepartment:edit']"
                    >所属二级标准科室
                    </el-button>
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

        <!-- 修改对话框 -->
        <el-dialog :title="title" :visible.sync="openUpdate" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item v-if="showUpdateTypeOne" label="一级科室编号" prop="deptCode">
                    <el-input v-model="form.deptCode" placeholder="请输入标准科室编号" :disabled="disabled"/>
                </el-form-item>
                <el-form-item v-if="showUpdateTypeTow" label="二级科室编号" prop="deptCode">
                    <el-input v-model="form.deptCode" placeholder="请输入标准科室编号" :disabled="disabled"/>
                </el-form-item>
                <el-form-item label="标准科室名称" prop="deptName">
                    <el-input v-model="form.deptName" placeholder="请输入中心科室名称"/>
                </el-form-item>
                <!--        <el-form-item label="标准科室图片" prop="deptPic">-->
                <!--&lt;!&ndash;          <el-upload ref="upload" :file-list="fileList" action="" :limit="1" :http-request="uploadImage" multiple&ndash;&gt;-->
                <!--&lt;!&ndash;           :before-upload="adUrlBeforeUpload" list-type="picture-card" accept="image/*">&ndash;&gt;-->
                <!--&lt;!&ndash;            <i class="el-icon-plus"></i>&ndash;&gt;-->
                <!--&lt;!&ndash;          </el-upload>&ndash;&gt;-->

                <!--          <el-upload-->
                <!--            action-->
                <!--            list-type="picture-card"-->
                <!--            :before-upload="adUrlBeforeUpload"-->
                <!--            :http-request="uploadImage"-->
                <!--            name="file"-->
                <!--            :show-file-list="false"-->
                <!--            :headers="headers"-->
                <!--            style="display: inline-block; vertical-align: top"-->
                <!--          >-->
                <!--            <el-image v-if="!deptPic" :src="deptPic">-->
                <!--              <div slot="error" class="image-slot">-->
                <!--                <i class="el-icon-plus"/>-->
                <!--              </div>-->
                <!--            </el-image>-->
                <!--            <div v-else class="image">-->
                <!--              <el-image :src="deptPic" :style="`width:150px;height:150px;`" fit="fill"/>-->
                <!--              <div class="mask">-->
                <!--                <div class="actions">-->
                <!--                  <span title="预览" @click.stop="dialogVisible = true">-->
                <!--                    <i class="el-icon-zoom-in"/>-->
                <!--                  </span>-->
                <!--                  <span title="移除" @click.stop="removeImage">-->
                <!--                    <i class="el-icon-delete"/>-->
                <!--                  </span>-->
                <!--                </div>-->
                <!--              </div>-->
                <!--            </div>-->
                <!--          </el-upload>-->
                <!--          <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>-->
                <!--            <img :src="deptPic" style="display: block; max-width: 100%; margin: 0 auto;"/>-->
                <!--          </el-dialog>-->
                <!--        </el-form-item>-->
                <el-form-item label="科室描述" prop="deptDesc">
                    <el-input v-model="form.deptDesc" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancelTow">取 消</el-button>
            </div>
        </el-dialog>

        <!--    新增一级科室对话框-->
        <el-dialog :title="title" :visible.sync="openAddOne" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="一级科室名称" prop="deptName">
                    <el-input v-model="form.deptName" placeholder="请输入一级科室名称"/>
                </el-form-item>
                <el-form-item label="科室描述" prop="deptDesc">
                    <el-input v-model="form.deptDesc" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormOne">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!--    新增二级科室对话框-->
        <el-dialog :title="title" :visible.sync="openAddTwo" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="二级科室名称" prop="deptName">
                    <el-input v-model="form.deptName" placeholder="请输入二级科室名称"/>
                </el-form-item>
                <el-form-item label="科室描述" prop="deptDesc">
                    <el-input v-model="form.deptDesc" type="textarea" placeholder="请输入内容"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormTwo">确 定</el-button>
                <el-button @click="cancelBySecondLevelAdd">取 消</el-button>
            </div>
        </el-dialog>


        <!-- 二级科室对话框-->
        <el-dialog :title="title" :visible.sync="openSecondLevel" width="1400px" append-to-body>

            <el-form :model="queryParams" ref="queryFormBySecondLevel" :inline="true" v-show="showSearch"
                     label-width="100px"
            >
                <el-form-item label="二级科室名称" prop="deptName">
                    <el-input
                        v-model="queryParams.deptName"
                        placeholder="请输入二级科室名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryBySecondLevel">搜索
                    </el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQueryBySecondLevel">重置</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                        type="success"
                        plain
                        icon="el-icon-edit"
                        size="mini"
                        @click="handleAddSecondLevelDept"
                        v-hasPermi="['api:standardDepartment:add']"
                    >新增二级科室
                    </el-button>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="secondLevelListByFirst" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="二级标准科室编号" align="center" prop="deptCode"/>
                <el-table-column label="标准科室名称" align="center" prop="deptName"/>
                <!-- <el-table-column label="中心科室图片" align="center" prop="deptPic" /> -->
                <!-- <el-table-column label="科室描述" align="center" prop="deptDesc" /> -->
                <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
                <!-- <el-table-column label="医院状态 " align="center" prop="fgActive" /> -->
                <el-table-column label="状态" align="center" key="fgActive">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.fgActive"
                            active-value="1"
                            inactive-value="0"
                            @change="handleByStatusChange(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdateBySecondLevel(scope.row)"
                            v-hasPermi="['api:standardDepartment:edit']"
                        >修改
                        </el-button>
                        <!--            <el-button-->
                        <!--              size="mini"-->
                        <!--              type="text"-->
                        <!--              icon="el-icon-edit"-->
                        <!--              @click="handleSecondLevel(scope.row)"-->
                        <!--              v-hasPermi="['api:standardDepartment:edit']"-->
                        <!--            >所属二级标准科室</el-button>-->
                    </template>
                </el-table-column>
            </el-table>

            <pagination
                v-show="totalBySecondLevel>0"
                :total="totalBySecondLevel"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getSecondLevelListByFirst"
            />

            <div slot="footer" class="dialog-footer">
                <!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
                <el-button @click="cancelBySecondLevel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listStandardDepartment,
    addStandardDepartmentOne,
    addStandardDepartmentTwo,
    updateStandardDepartment,
    getSecondLevelListByFirstCode
} from '@/api/yiliao/base/standardDepartment'
import { getDictionarys, listDictionary } from '@/api/system/dictionary'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { uploadFile } from '@/api/monitor/upload'

//上传并修改
import { getToken } from '@/utils/auth'

export default {
    name: 'StandardDepartment',
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
            // 一级列表总条数
            total: 0,
            // 二级列表总条数
            totalBySecondLevel: 0,
            // 中心/标准科室.表格数据
            standardDepartmentList: [],
            //某一级下的二级科室列表
            secondLevelListByFirst: [],
            // 弹出层标题
            title: '',
            // 是否有效字典
            statusOptions: [],
            // 修改科室页
            openUpdate: false,
            //新增一级科室页
            openAddOne: false,
            //新增二级科室页
            openAddTwo: false,
            //二级科室页
            openSecondLevel: false,
            //二级科室新增页 待定
            openAddSecondLevel: false,
            //修改页，控制当前为第一科室
            showUpdateTypeOne: false,
            //修改页，控制当前为第二科室
            showUpdateTypeTow: false,
            fileList: [],
            deptPic: null,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deptCode: null,
                deptName: null,
                deptDesc: null,
                fgActive: null
            },
            // 表单参数
            form: {},
            queryForm: {},
            queryFormBySecondLevel: {},
            // 表单校验
            rules: {
                deptCode: [
                    { required: true, message: '标准科室编号不能为空', trigger: 'blur' }
                ],
                deptName: [
                    { required: true, message: '中心科室名称不能为空', trigger: 'blur' }
                ]
            },
            //是否可以修改
            disabled: false,

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

    },
    //上传并修改
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    methods: {
        handleByStatusChange(row) {
            let text = row.fgActive === '1' ? '启用' : '停用'
            this.$confirm('确认要"' + text + '""' + row.deptName + '"吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return updateStandardDepartment(row)
            }).then(() => {
                this.msgSuccess(text + '成功')
            }).catch(function() {
                row.fgActive = row.fgActive === '0' ? '1' : '0'
            })
        },
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
        /** 查询一级科室列表 */
        getList() {
            this.loading = true
            listStandardDepartment(this.queryParams).then(response => {
                this.standardDepartmentList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        /** 查询某一级科室下的二级科室列表 */
        getSecondLevelListByFirst() {
            this.loading = true
            getSecondLevelListByFirstCode(this.queryParams).then(response => {
                this.secondLevelListByFirst = response.rows
                this.totalBySecondLevel = response.total
                this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.openUpdate = false
            this.openAddOne = false
            this.reset()
        },
        // 二级科室取消按钮
        cancelBySecondLevelAdd() {
            this.openAddTwo = false
            this.resetQueryBySecondLevel()
        },
        // 二级科室中修改页的取消按钮
        cancelTow() {
            this.openUpdate = false
            this.resetQueryBySecondLevel()
        },
        // 二级科室取消按钮
        cancelBySecondLevel() {
            this.openSecondLevel = false
            this.reset()
        },
        // 表单重置
        reset() {
            this.form = {
                deptCode: null,
                deptName: null,
                deptPic: null,
                deptDesc: null,
                sort: null,
                fgActive: null
            }
            this.queryForm = {
                deptCode: null,
                deptName: null,
                deptPic: null,
                deptDesc: null,
                sort: null,
                fgActive: null
            }
            this.queryFormBySecondLevel = {
                deptCode: null,
                deptName: null,
                deptPic: null,
                deptDesc: null,
                sort: null,
                fgActive: null
            }
            this.resetForm('form')
            this.resetForm('queryForm')
            this.resetForm('queryFormBySecondLevel')
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm')
            this.queryParams.pageNum = 1
            this.queryParams.deptCode = null
            this.getList()
        },

        /** 二级科室页搜索按钮操作 */
        handleQueryBySecondLevel() {
            this.queryParams.pageNum = 1
            this.getSecondLevelListByFirst()
        },
        /** 二级科室页重置按钮操作 */
        resetQueryBySecondLevel() {
            this.resetForm('queryFormBySecondLevel')
            this.handleQueryBySecondLevel()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.deptCode)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 一级科室新增按钮操作 */
        handleAdd() {
            this.reset()
            this.openAddOne = true
            this.title = '添加一级科室.'
        },
        /** 一级科室修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            this.form = row
            this.openUpdate = true
            if (row.deptCode.length < 4) {
                this.showUpdateTypeTow = false
                this.showUpdateTypeOne = true
            }
            this.title = '修改一级标准科室.'
            this.disabled = true
        },
        /** 二级科室修改按钮 */
        handleUpdateBySecondLevel(row) {
            //this.reset();
            this.form = row
            console.log('row:' + row.deptCode)
            this.openUpdate = true
            if (row.deptCode.length > 3) {
                this.showUpdateTypeTow = true
                this.showUpdateTypeOne = false
            }
            this.title = '修改二级标准科室.'
        },

        /** 所属二级标准科室按钮 */
        handleSecondLevel(row) {
            this.reset()
            this.queryParams.deptCode = row.deptCode
            this.getSecondLevelListByFirst()
            this.form = row
            this.openSecondLevel = true
            this.title = '所属二级标准科室'
            this.deptPic = row.deptPic
            this.disabled = true
        },

        /** 新增二级标准科室按钮 */
        handleAddSecondLevelDept() {
            this.reset()
            console.log('deptCode::' + this.queryParams.deptCode)
            this.openAddTwo = true
            this.title = '新增二级科室'
        },

        /** 修改按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.form.deptPic = this.deptPic
                    updateStandardDepartment(this.form).then(response => {
                        this.msgSuccess('修改成功')
                        this.openUpdate = false
                        this.openSecondLevel = false
                        this.openAddTwo = false
                        this.reset()
                        this.getList()
                    })
                }
            })
        },
        //一级科室新增
        submitFormOne() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    addStandardDepartmentOne(this.form).then(response => {
                        this.msgSuccess('新增成功')
                        this.openAddOne = false
                        this.reset()
                        this.getList()
                    })
                }
            })
        },
        //二级科室新增
        submitFormTwo() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.form.deptCode = this.queryParams.deptCode
                    addStandardDepartmentTwo(this.form).then(response => {
                        this.msgSuccess('新增成功')
                        this.openAddTwo = false
                        this.resetQueryBySecondLevel()
                        this.reset()
                    })
                }
            })
        }
    },
    // 是否有效字典翻译
    fgActiveFormat(row, column) {
        return this.selectDictLabel(this.fgActiveOptions, row.fgActive)
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
            this.deptPic = response.data
            console.log(1111111111, this.deptPic = response.data)
            param.onSuccess()  // 上传成功的图片会显示绿色的对勾
        }).catch(response => {
            console.log('图片上传失败')
            param.onError()
        })
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
