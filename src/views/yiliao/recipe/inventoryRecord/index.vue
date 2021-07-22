<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="所属医院" prop="hosName">
                <el-select v-model="queryParams.hosName" placeholder="请选择所属医院" clearable size="small">
                    <el-option
                        v-for="(dictionary,index) in hosOptions"
                        :key="index"
                        :label="dictionary"
                        :value="dictionary"
                    >{{ dictionary }}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="药品名称" prop="drugName">
                <el-input
                    v-model="queryParams.drugName"
                    placeholder="请输入药品名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>

            <el-form-item label="创建人" prop="docName">
                <el-select v-model="queryParams.docName" placeholder="请选择创建人" clearable size="small">
                    <el-option
                        v-for="(dictionary,index) in createOptions"
                        :key="index"
                        :label="dictionary"
                        :value="dictionary"
                    >{{ dictionary }}
                    </el-option>
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
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['api:inventoryRecord:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="changeRecordList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="药房名称" align="center" prop="hosName"/>
            <el-table-column label="药品类型" align="center" prop="drugType">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.drugType=='WESTERN_MEDICINE'">西药</el-tag>
                    <el-tag v-if="scope.row.drugType=='HERBAL_MEDICINE'">草药</el-tag>
                    <el-tag v-if="scope.row.drugType=='PATENT_MEDICINE'">成药</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="药品名称" align="center" prop="drugName"/>
            <el-table-column label="药品编码" align="center" prop="drugCode"/>
            <el-table-column label="药品产地" align="center" prop="drugOrigin"/>
            <el-table-column label="操作人" align="center" prop="docName"/>
            <el-table-column label="库存变化量" align="center" prop="changeNum"/>
            <el-table-column label="操作时间" align="center" prop="dtCreate" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.dtCreate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['api:inventoryRecord:edit']"
                    >详情
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

        <!-- 添加或修改变更记录对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="药品名称" prop="drugName">
                    <el-input v-model="form.drugName" readonly/>
                </el-form-item>
                <el-form-item label="药品类型" prop="drugType">
                    <el-input v-model="form.drugType" readonly/>
                </el-form-item>
                <el-form-item label="药品编码" prop="drugCode">
                    <el-input v-model="form.drugCode" readonly/>
                </el-form-item>
                <el-form-item label="药品产地" prop="drugOrigin">
                    <el-input v-model="form.drugOrigin" readonly/>
                </el-form-item>
                <el-form-item label="创建时间" prop="dtCreate">
                    <el-date-picker clearable size="small"
                                    v-model="form.dtCreate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择创建时间" readonly
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="创建人" prop="createrId">
                    <el-input v-model="form.docName" readonly/>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listInventoryRecord,
    getHosNameList,
    getCreateNameList,
    exportChangeRecord
} from '@/api/yiliao/recipe/inventoryRecord'

export default {
    name: 'ChangeRecord',
    components: {},
    data() {
        return {
            readonly: true,
            // 遮罩层
            loading: true,
            //医院字典
            hosOptions: [],
            //创建人字典
            createOptions: [],
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
            // 变更记录表格数据
            changeRecordList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                tradeName: null,
                drugName: null,
                drugType: null,
                drugCode: null,
                dtCreate: null,
                createrId: null,
                createrType: null,
                hosName: null,
                docName: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                fgActive: [
                    { required: true, message: '是否有效不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getList()
        getHosNameList().then(response => {
            this.hosOptions = response.data
        })
        getCreateNameList().then(response => {
            this.createOptions = response.data
        })
    },
    methods: {
        /** 查询变更记录列表 */
        getList() {
            this.loading = true
            listInventoryRecord(this.queryParams).then(response => {
                this.changeRecordList = response.rows
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
                tradeName: null,
                drugName: null,
                drugType: null,
                drugCode: null,
                createrId: null,
                createrType: null,
                hosName: null,
                docName: null
            }
            this.resetForm('form')
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        /** 详情 */
        handleUpdate(row) {
            this.reset()
            this.form = row
            this.open = true
            this.title = '库存变更详情'
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
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateChangeRecord(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        addChangeRecord(this.form).then(response => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.getList()
                        })
                    }
                }
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有变更记录数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return exportChangeRecord(queryParams)
            }).then(response => {
                this.download(response.msg)
            })
        }
    }
}
</script>
