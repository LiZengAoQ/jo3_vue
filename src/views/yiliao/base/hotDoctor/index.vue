<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="姓名" prop="docname">
                <el-input
                    v-model="queryParams.docname"
                    placeholder="请输入姓名"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="所属医院" prop="hosname">
                <el-select v-model="queryParams.hosname" placeholder="请选择所属医院" clearable size="small">
                    <el-option
                        v-for="hname in hosOptions"
                        :key="hname"
                        :label="hosName"
                        :value="hname"
                    >{{ hname }}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属科室" prop="deptname">
                <el-select v-model="queryParams.deptname" placeholder="请选择所属科室" clearable size="small">
                    <el-option
                        v-for="dname in deptOptions"
                        :key="dname"
                        :label="dname"
                        :value="dname"
                    >{{ dname }}
                    </el-option>
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
                    v-hasPermi="['api:hotdoctor:add']"
                >新增
                </el-button>
            </el-col>
            <!--<el-col :span="1.5">-->
            <!--<el-button-->
            <!--type="warning"-->
            <!--plain-->
            <!--icon="el-icon-download"-->
            <!--size="mini"-->
            <!--@click="handleExport"-->
            <!--v-hasPermi="['api:hotdoctor:export']"-->
            <!--&gt;导出</el-button>-->
            <!--</el-col>-->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="DocRecommendList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="姓名" align="center" prop="docname"/>
            <el-table-column label="所属医院" align="center" prop="hosname"/>
            <el-table-column label="所属科室" align="center" prop="deptname"/>
            <el-table-column label="名医排序" align="center" prop="famoussort"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">

                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['api:hotdoctor:edit']"
                    >修改排序
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['api:hotdoctor:deit']"
                    >取消推荐
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

        <!-- 添加医生信息对话框 -->
        <el-dialog :title="title" :visible.sync="openadd" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                <el-table v-loading="loading" :data="hosdoctorList">
                    <!--        <el-table-column type="selection" width="55" align="center" />-->
                    <el-table-column label="姓名" align="center" prop="docname"/>
                    <el-table-column label="所属医院" align="center" prop="hosname"/>
                    <el-table-column label="所属科室" align="center" prop="deptname"/>
                    <el-table-column label="是否推荐" align="center" prop="fgmend">
                        <template slot-scope="scope">
                            <span v-if="scope.row.fgmend == '0'">否</span>
                            <span v-else>是</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                @click="handlesave(scope.row)"
                                v-hasPermi="['api:hotdoctor:deit']"
                            >推荐
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button @click="cancela">取 消</el-button>
            </div>
        </el-dialog>

        <!--修改医生信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                <el-form-item label="名医排序" prop="famoussort">
                    <el-input v-model="form.famoussort" placeholder="请输入名医排序"/>
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
    listhotDoctor,
    listhotDoctoradd,
    gethotdoctor,
    delhotdoctor,
    addhotdoctor,
    updatehotdoctor,
    exporthotdoctor,
    gethotdoctorhos,
    gethotdoctordept
} from '@/api/yiliao/base/hotDoctor'

export default {
    name: 'hotDoctor',
    components: {},
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            //医院字典
            hosOptions: [],
            //科室字典
            deptOptions: [],
            hosdoctorListadd: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 医生信息表格数据
            List: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                docName: undefined,
                hosName: undefined,
                deptName: undefined,
                famousSort: undefined,
                fgRecommend: undefined
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {}
        }
    },
    created() {
        this.getList()
        gethotdoctordept().then(response => {
            this.deptOptions = response.data
        })
        gethotdoctorhos().then(response => {
            this.hosOptions = response.data
        })
    },
    methods: {
        /** 查询医生信息列表 */
        getList() {
            this.loading = true
            listhotDoctor(this.queryParams).then(response => {
                this.DocRecommendList = response.rows
                this.total = response.total
                this.loading = false
            })
        },

        //查询添加列表
        getList1() {
            this.loading = true
            listhotDoctoradd(this.queryParams).then(response => {
                this.hosdoctorList = response.rows
                this.total = response.total
                this.loading = false
            })
        },

        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },

        // 取消按钮
        cancela() {
            this.openadd = false
            this.reset()
            this.getList()
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                docName: null,
                hosName: null,
                deptName: null,
                famousSort: null,
                fgRecommend: null
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
            this.getList1()
            this.reset()
            this.openadd = true
            const id = row.id || this.ids
            gethotdoctor(id).then(response => {
                this.form = response.data
                this.openadd = true
                this.title = '添加医生信息'
            })
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            gethotdoctor(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改医生信息'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updatehotdoctor(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        updatehotdoctor(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.openadd = false
                            this.getList1()
                        })
                    }
                }
            })
        },
        /** 取消按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids
            row.fgRecommend = '0'
            this.$confirm('是否确认不再推荐医生信息编号为"' + ids + '"的信息?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return updatehotdoctor(row)
            }).then(() => {
                this.getList()
                this.msgSuccess('取消成功')
            })
        },
        /** 推荐按钮操作 */
        handlesave(row) {
            const ids = row.id || this.ids
            row.fgRecommend = '0'
            this.$confirm('是否确认推荐医生信息编号为"' + ids + '"的信息?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return updatehotdoctor(row)
            }).then(() => {
                this.getList1()
                this.msgSuccess('推荐成功')
            })
        }

        // /** 导出按钮操作 */
        // handleExport() {
        //   const queryParams = this.queryParams;
        //   this.$confirm('是否确认导出所有医生信息数据项?', "警告", {
        //       confirmButtonText: "确定",
        //       cancelButtonText: "取消",
        //       type: "warning"
        //     }).then(function() {
        //       return exporthotdoctor(queryParams);
        //     }).then(response => {
        //       this.download(response.msg);
        //     })
        // }
    }

}
</script>
