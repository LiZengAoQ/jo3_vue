<template>
    <div class="app-container">

        <el-table
            v-loading="loading"
            :data="docInfoList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="患者姓名" align="center" prop="realName"/>
            <el-table-column label="内容" align="center" prop="medicalContent"/>
            <el-table-column label="创建人" align="center" prop="createrId"/>
            <el-table-column
                label="创建时间"
                align="center"
                prop="dtCreate"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{
                            parseTime(scope.row.dtCreate, '{y}-{m}-{d}')
                        }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="编辑时间"
                align="center"
                prop="dtModify"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{
                            parseTime(scope.row.dtModify, '{y}-{m}-{d}')
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
                <el-form-item label="姓名" prop="realName">
                    <el-input
                        v-model="form.realName"
                        placeholder="请输入姓名"
                        :disabled="true"
                    />
                </el-form-item>
                <el-form-item label="内容" prop="medicalContent">
                    <el-input
                        v-model="form.medicalContent"
                        placeholder="请输入内容"
                    />
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
    getDiagnosis,
    getDiagnosisById,
    updateDiagnosis
} from '@/api/yiliao/base/patientReg'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

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
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10
            },
            cardType: null,
            // 表单参数
            form: {},
            // 表单校验
            rules: {}
        }
    },
    created() {
        let id = this.$route.query.id
        this.getList(id)
    },
    methods: {
        /** 查询医生列表 */
        getList(id) {
            this.loading = true
            getDiagnosis(id).then(response => {
                this.docInfoList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                realName: null,
                medicalContent: null
            }
            this.resetForm('form')
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            getDiagnosisById(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '诊疗记录详情'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateDiagnosis(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList(this.form.visitId)
                        })
                    }
                }
            })
        }
    }
}
</script>
