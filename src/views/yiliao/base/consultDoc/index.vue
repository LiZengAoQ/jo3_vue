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
                        :label="hname"
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
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
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
                    v-hasPermi="['api:consultdoc:add']"
                >添加医生
                </el-button>
            </el-col>

            <!--      <el-col :span="1.5">-->
            <!--        <el-button-->
            <!--          type="warning"-->
            <!--          plain-->
            <!--          icon="el-icon-download"-->
            <!--          size="mini"-->
            <!--          @click="handleExport"-->
            <!--          v-hasPermi="['api:consultdoc:export']"-->
            <!--        >导出</el-button>-->
            <!--      </el-col>-->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="DocRecommendList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="序号" align="center" prop="id"/>
            <el-table-column label="是否启用" align="center" prop="fgactive">
                <template slot-scope="scope">
                    <span v-if="scope.row.fgactive == '0'">否</span>
                    <span v-if="scope.row.fgactive == '1'">是</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" align="center" prop="docname"/>
            <el-table-column label="医生头像" align="center" prop="docavatar" width="180">
                <template slot-scope="scope">
                    <img :src="scope.row.docavatar" alt="" style="width: 30px;height: 30px">
                </template>
            </el-table-column>
            <el-table-column label="所属科室" align="center" prop="deptname"/>
            <el-table-column label="职称" align="center" prop="doctitle"/>
            <el-table-column label="用户编号" align="center" prop="docId" v-if="show"/>
            <el-table-column label="服务编号" align="center" prop="svcId" v-if="show"/>
            <el-table-column label="服务模块" align="center" prop="svcName">
            </el-table-column>
            <el-table-column label="是否置顶" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.fgrecommend == '0'">否</span>
                    <span v-if="scope.row.fgrecommend == '1'">是</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['api:consultdoc:service']"
                    >编辑
                    </el-button>

                    <el-button
                        size="mini"
                        type="text"
                        @click="canceltop(scope.row)"

                    >
                        <div v-if="scope.row.fgrecommend=='0'">
                            置顶
                        </div>
                        <div v-if="scope.row.fgrecommend=='1'">
                            取消置顶
                        </div>
                    </el-button>
                    <!--          <el-button-->
                    <!--            size="mini"-->
                    <!--            type="text"-->
                    <!--            @click="canceltop(scope.row)"-->
                    <!--            v-hasPermi="['api:consultdoc:edit']"-->
                    <!--          >取消顶置</el-button>-->
                    <!--          -->

                    <!--          <el-button-->
                    <!--            size="mini"-->
                    <!--            type="text"-->
                    <!--            @click="cancelstart(scope.row)"-->
                    <!--            v-hasPermi="['api:consultdoc:edit']"-->
                    <!--          >停用</el-button>-->

                    <el-button
                        size="mini"
                        type="text"
                        @click="cancelstart(scope.row)"
                        v-hasPermi="['api:consultdoc:edit']"
                    >
                        <div v-if="scope.row.fgactive=='0'">
                            启用
                        </div>
                        <div v-if="scope.row.fgactive=='1'">
                            停用
                        </div>
                    </el-button>

                    <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['api:consultdoc:remove']"
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

        <!-- 添加或修改医生信息对话框 -->
        <el-dialog :title="title" :visible.sync="open1" width="1200px" append-to-body>

            <el-form
                :model="queryParams1"
                ref="queryForms"
                :inline="true"
                v-show="showSearch"
                label-width="68px"
            >
                <el-form-item label="医生名称" prop="docName">
                    <el-input
                        v-model="queryParams1.docName"
                        placeholder="请输入医生名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="所属医院" prop="hosId">
                    <el-select
                        v-model="queryParams1.hosId"
                        ref="clearSelect"
                        placeholder="所属医院"
                        clearable
                        size="small"
                        filterable
                        default-first-option
                    >
                        <el-option
                            v-for="dictionary in hosIdOptions"
                            :key="dictionary.hosId"
                            :label="dictionary.hosName"
                            :value="dictionary.hosId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属科室" prop="deptId">
                    <el-select
                        v-model="queryParams1.deptId"
                        placeholder="所属科室"
                        clearable
                        size="small"
                        filterable
                        default-first-option
                    >
                        <el-option
                            v-for="dictionary in deptIdOptions"
                            :key="dictionary.deptId"
                            :label="dictionary.deptName"
                            :value="dictionary.deptId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="handleQuery1"
                    >搜索
                    </el-button
                    >
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery1"
                    >重置
                    </el-button
                    >
                </el-form-item>
            </el-form>

            <el-table
                v-loading="loading"
                :data="docInfoList"
                @selection-change="handleSelectionChange1"
            >
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="医生姓名" align="center" prop="docName"/>
                <el-table-column label="医生头像" align="center" prop="docAvatar">
                    <template slot-scope="scope">
                        <img :src="scope.row.docAvatar" style="width: 70px; height: 70px"/>
                    </template>
                </el-table-column>
                <el-table-column label="所属医院" align="center" prop="hosName"/>
                <el-table-column label="所属科室" align="center" prop="deptName"/>
                <el-table-column label="医生职称" align="center" prop="docTitle"/>
                <el-table-column label="服务模块" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.svcId" placeholder="请输入模块" clearable :style="{width: '100%'}">
                            <el-option v-for="(item,index) in moOption" :key="index" :label="item.label"
                                       :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </template>

                </el-table-column>
            </el-table>

            <pagination
                v-show="totals > 0"
                :total="totals"
                :page.sync="queryParams1.pageNum"
                :limit.sync="queryParams1.pageSize"
                @pagination="getList1"
            />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm1">确 定</el-button>
                <el-button @click="cancel1">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加或修改医生信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="服务模块" prop="svcName">
                    <el-select v-model="form.svcName" placeholder="请输入模块" clearable :style="{width: '100%'}">
                        <el-option v-for="(item,index) in moOption" :key="index" :label="item.label" :value="item.label"
                                   :disabled="item.disabled"
                        >
                        </el-option>
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
    listconsult, getConsultDocService,
    delconsultdoc, addconsultdoc, updateconsultq, updateconsultt,
    updateFgreCommend,
    updateconsultservice, exportconsultdoc,
    getconsultdept, getconsulthos, getConsultDocId, addDocInfoService
} from '@/api/yiliao/base/consultDoc'
import {
    listDocInfo
} from '@/api/yiliao/doc/docInfo'
import { listHosData } from '@/api/yiliao/base/hosData'
import { listBookDept } from '@/api/yiliao/book/bookDept'

export default {
    name: 'consultDoc',
    components: {},
    data() {
        return {
            // 所属医院
            hosIdOptions: [],
            deptIdOptions: [],
            //隐藏猎
            show: false,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            docInfoList: [],
            docInfo: [],
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            totals: 0,
            // 医生信息表格数据
            DocRecommendList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            open1: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                docName: null,
                hosId: null,
                deptId: null,
                famousSort: null,
                fgRecommend: null,
                hosName: null
            },
            queryParams1: {
                pageNum: 1,
                pageSize: 10,
                fgActive: 1
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            hosOptions: [],
            deptOptions: [],
            //服务模块
            moOption: [{
                label: '图文咨询',
                value: 'CONSULT_PAID'
            }, {
                label: '视频咨询',
                value: 'CONSULT_VIDEO'
            }, {
                label: '电话咨询',
                value: 'CONSULT_TEL'
            }, {
                label: '加号',
                value: 'APPOINTMENT_OUTPATIENT'
            }, {
                label: '在线续方',
                value: 'CONSULT_CONTINUATION'
            }]
        }
    },

    created() {
        this.getList()
        getconsultdept().then(response => {
            this.deptOptions = response.data
        })
        getconsulthos().then(response => {
            this.hosOptions = response.data
        })

        listBookDept().then((response) => {
            this.deptIdOptions = response.rows
        })
        listHosData().then((response) => {
            this.hosIdOptions = response.rows
        })
    },

    methods: {
        /** 查询医生信息列表 */
        getList() {
            this.loading = true
            listconsult(this.queryParams).then(response => {
                this.DocRecommendList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        getList1() {
            this.loading = true
            listDocInfo(this.queryParams1).then((response) => {
                response.data.list.map(item => {
                    item.svcId = 'CONSULT_PAID'
                })
                this.docInfoList = response.data.list
                this.totals = response.data.total
                this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        cancel1() {
            this.open1 = false
            this.reset()
        },

        /** 多选框选中数据 */
        handleSelectionChange1(selection) {
            this.docInfo = selection.map(item => item)
        },
        /** 搜索按钮操作 */
        handleQuery1() {
            this.queryParams1.pageNum = 1
            this.getList1()
        },
        /** 重置按钮操作 */
        resetQuery1() {
            this.resetForm('queryForms')
            this.handleQuery1()
        },
        submitForm1() {

            this.docInfo.map(items => {
                this.moOption.map(item => {
                    if (items.svcId == item.value) {
                        items.svcName = item.label
                        return
                    }
                })
            })

            addDocInfoService(this.docInfo).then(response => {
                this.msgSuccess('修改成功')
                this.open1 = false
                this.getList()
            })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                docName: null,
                hosId: null,
                deptId: null,
                famousSort: null,
                fgRecommend: null

            }
            this.resetForm('form')
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
            this.open1 = true
            this.title = '添加医生信息'
            this.loading = true
            this.getList1()
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            getConsultDocService(row.docId, row.svcId).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valdocid => {
                if (valdocid) {
                    if (this.form.svcName != null) {
                        var svcname = this.form.svcName
                        var option = this.moOption
                        option.map(item => {
                            if (item.label == svcname) {
                                this.form.svcId = item.value
                            }
                        })
                        updateconsultservice(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })

                    } else {
                        this.form.fgrecommend = '0'
                        addconsultdoc(this.form).then(response => {
                            this.msgSuccess('添加成功')
                            this.open = false
                            this.getList()
                        })
                    }

                }
            })
        },
        /** 逻辑删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids
            row.fgactive = '0'
            this.$confirm('是否确认删除信息编号为"' + ids + '"的信息?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return delconsultdoc(row)
            }).then(() => {
                this.getList()
                this.msgSuccess('删除成功')
            })
        },

        /** 取消启用按钮操作 */
        cancelstart(row) {
            let text = row.fgactive == '0' ? '启用' : '停用'
            this.$confirm(
                '确认要"' + text + '""' + row.docname + '"分类吗?',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(function() {
                    if (text == '启用') {
                        row.fgactive = 1
                    } else {
                        row.fgactive = 0
                    }
                    // this.queryParams.id = row.id
                    // this.queryParams.fgactive = row.fgactive
                    return updateconsultt(row)
                })
                .then(() => {
                    this.msgSuccess(text + '成功')
                })
                .catch(function() {
                    row.fgactive = row.fgactive === '0' ? '1' : '0'
                })
        },

        /** 取消顶置按钮操作 */
        canceltop(row) {
            let text = row.fgrecommend == '0' ? '置顶' : '取消置顶'
            this.$confirm(
                '确认要"' + text + '""' + row.docname + '"分类吗?',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(function() {
                    if (text == '置顶') {
                        row.fgrecommend = 1
                    } else {
                        row.fgrecommend = 0
                    }
                    return updateFgreCommend(row)
                })
                .then(() => {
                    this.msgSuccess(text + '成功')
                })
                .catch(function() {
                    row.fgrecommend = row.fgrecommend === '0' ? '1' : '0'
                })

            // const ids = row.id || this.ids;
            // this.$confirm('是否确认取消顶置编号为"' + ids + '"的数据项?', "警告", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "warning"
            //   }).then(function() {
            //     return updateconsultt(ids);
            //   }).then(() => {
            //     this.getList();
            //     this.msgSuccess("取消成功");
            //   })
        }
        // /** 导出按钮操作 */
        // handleExport() {
        //   const queryParams = this.queryParams;
        //   this.$confirm('是否确认导出所有医生信息数据项?', "警告", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "warning"
        //   }).then(function() {
        //     return exportconsultdoc(queryParams);
        //   }).then(response => {
        //     this.download(response.msg);
        //   })
        // }
    }
}
</script>
