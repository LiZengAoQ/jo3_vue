<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="应用系统" prop="type">
                <el-select v-model="queryParams.type" placeholder="请选择应用系统" clearable size="small">
                    <el-option label="安卓" value="1"/>
                    <el-option label="ios" value="2"/>
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
                    v-hasPermi="['api:version:add']"
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
                    v-hasPermi="['api:version:edit']"
                >修改
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="versionList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="版本号" align="center" prop="version"/>
            <el-table-column label="说明" align="center" prop="explains"/>
            <el-table-column label="应用系统" align="center" prop="type">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == '1'">安卓</span>
                    <span v-else-if="scope.row.type == '2'">ios</span>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" align="center" prop="dt_create" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.dt_create, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="下载地址" align="center" prop="url"
            />
            <el-table-column label="是否强制" align="center" prop="isMandatory">
                <template slot-scope="scope">
                    <span v-if="scope.row.isMandatory == '1'">是</span>
                    <span v-else-if="scope.row.isMandatory == '0'">否</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['api:version:edit']"
                    >修改
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

        <!-- 添加或修改版本管理对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="版本号" prop="version">
                    <el-input v-model="form.version" placeholder="请输入版本号"/>
                </el-form-item>
                <el-form-item label="应用系统" prop="type">
<!--                    <el-select v-model="form.type" placeholder="请选择应用系统">-->
<!--                        <el-option label="安卓" value="1"/>-->
<!--                        <el-option label="ios" value="2"/>-->
<!--                    </el-select>-->
                    <el-select v-model="form.type" placeholder="请选择应用系统" clearable>
                        <el-option v-for="(item, index) in typeList" :key="index" :label="item.label"
                                   :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下载地址" prop="url"
                >
                    <el-input v-model="form.url" placeholder="请输入下载地址"
                    />
                </el-form-item>
                <el-form-item label="是否强制" prop="isMandatory">
                    <el-select v-model="form.isMandatory" placeholder="请选择强制是否是否强制" clearable>
                        <el-option v-for="(item, index) in mandatoryList" :key="index" :label="item.label"
                                   :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" prop="explains">
                    <el-input v-model="form.explains" placeholder="请输入说明"/>
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
import { listVersion, getVersion, delVersion, addVersion, updateVersion, exportVersion } from '@/api/system/version'

export default {
    name: 'Version',
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
            // 版本管理表格数据
            versionList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                id: null,
                version: null,
                explains: null,
                type: null,
                dtCreate: null,
                url: null,
                isMandatory: null,
                tableName: 'sys_app_version'
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                version: [
                    { required: true, message: '版本号不能为空', trigger: 'blur' }
                ],
                isMandatory: [
                    { required: true, message: '是否强制不能为空', trigger: 'blur' }
                ],
                url: [
                    { required: true, message: '下载地址不能为空', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '应用系统不能为空', trigger: 'blur' }
                ]
            },
            mandatoryList: [{
                "label": "是",
                "value": 1
            }, {
                "label": "否",
                "value": 0
            }],
            typeList: [{
                "label": "安卓",
                "value": 1
            }, {
                "label": "ios",
                "value": 2
            }],

        }
    },
    created() {
        this.getList()
    },
    methods: {
        /** 查询版本管理列表 */
        getList() {
            this.loading = true
            listVersion(this.queryParams).then(response => {
                this.versionList = response.data.rows
                this.total = response.data.total
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
                version: null,
                explains: null,
                type: null,
                dtCreate: null,
                url: null,
                isMandatory: null
            }
            this.resetForm('form')
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.queryParams.id = null
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams.id = null
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
            this.open = true
            this.title = '添加版本管理'
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            this.queryParams.id = id
            getVersion(this.queryParams).then(response => {
                this.form = response.data
                this.form.dt_create = null;
                this.open = true
                this.title = '修改版本管理'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        var query = {};
                        query = this.form;
                        query.tableName = 'sys_app_version';
                        updateVersion(query).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.queryParams.id = null
                            this.getList()
                        })
                    } else {
                        var query = {};
                        query = this.form;
                        query.tableName = 'sys_app_version';
                        addVersion(query).then(response => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.queryParams.id = null
                            this.getList()
                        })
                    }
                }
            })
        }
    }
}
</script>
