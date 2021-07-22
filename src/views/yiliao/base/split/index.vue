<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="医院id" prop="hosId">
                <el-input
                    v-model="queryParams.hosId"
                    placeholder="请输入医院id"
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
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['base:split:add']"
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
                    v-hasPermi="['base:split:edit']"
                >修改
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="splitList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="编号" align="center" prop="id"/>
            <el-table-column label="医院" align="center" prop="hosId"/>
            <el-table-column label="业务类型" align="center" prop="bizType"/>
            <el-table-column label="分成归属" align="center" prop="shareAscription"/>
            <el-table-column label="分成" align="center" prop="share"/>
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
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['base:split:edit']"
                    >修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['base:split:remove']"
                    >删除
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

        <!-- 添加或修改分成管理对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="医院id" prop="hosId">
                    <el-input v-model="form.hosId" placeholder="请输入医院id"/>
                </el-form-item>
                <el-form-item label="业务类型" prop="bizType">
                    <el-select v-model="form.bizType" placeholder="请选择业务类型">
                        <el-option label="请选择字典生成" value=""/>
                    </el-select>
                </el-form-item>
                <el-form-item label="分成归属；doc/hos..." prop="shareAscription">
                    <el-input v-model="form.shareAscription" placeholder="请输入分成归属；doc/hos..."/>
                </el-form-item>
                <el-form-item label="分成小于等于1;" prop="share">
                    <el-input v-model="form.share" placeholder="请输入分成小于等于1;"/>
                </el-form-item>
                <el-form-item label="分成小于等于1;" prop="dtCreate">
                    <el-date-picker clearable size="small"
                                    v-model="form.dtCreate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择分成小于等于1;"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="分成小于等于1;" prop="dtModify">
                    <el-date-picker clearable size="small"
                                    v-model="form.dtModify"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择分成小于等于1;"
                    >
                    </el-date-picker>
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
import { listSplit, getSplit, delSplit, addSplit, updateSplit, exportSplit } from '@/api/yiliao/base/split'

export default {
    name: 'Split',
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
            // 分成管理表格数据
            splitList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hosId: null,
                bizType: null,
                shareAscription: null,
                share: null,
                dtCreate: null,
                dtModify: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                hosId: [
                    { required: true, message: '医院id不能为空', trigger: 'blur' }
                ],
                bizType: [
                    { required: true, message: '业务类型不能为空', trigger: 'change' }
                ],
                share: [
                    { required: true, message: '分成小于等于1;不能为空', trigger: 'blur' }
                ],
                dtCreate: [
                    { required: true, message: '分成小于等于1;不能为空', trigger: 'blur' }
                ],
                dtModify: [
                    { required: true, message: '分成小于等于1;不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        /** 查询分成管理列表 */
        getList() {
            this.loading = true
            listSplit(this.queryParams).then(response => {
                this.splitList = response.rows
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
                hosId: null,
                bizType: null,
                shareAscription: null,
                share: null,
                dtCreate: null,
                dtModify: null
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
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            this.open = true
            this.title = '添加分成管理'
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            getSplit(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改分成管理'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateSplit(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        addSplit(this.form).then(response => {
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
            this.$confirm('是否确认删除分成管理编号为"' + ids + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return delSplit(ids)
            }).then(() => {
                this.getList()
                this.msgSuccess('删除成功')
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有分成管理数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return exportSplit(queryParams)
            }).then(response => {
                this.download(response.msg)
            })
        }
    }
}
</script>
