<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="开方机构" prop="hosId">
                <el-select
                    v-model="queryParams.hosId"
                    placeholder="开方机构"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dictionary in hosIdOptions"
                        :key="dictionary.hosId"
                        :label="dictionary.hosName"
                        :value="dictionary.hosId"
                        @keyup.enter.native="handleQuery"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="处方状态" prop="orderStatus">
                <el-select
                    v-model="queryParams.orderStatus"
                    placeholder="处方状态"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dictionary in statusOptions"
                        :key="dictionary.value"
                        :label="dictionary.label"
                        :value="dictionary.value"
                        @keyup.enter.native="handleQuery"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="开方医生" prop="docName">
                <el-input
                    v-model="docName"
                    placeholder="请输入开方医生"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>

            <el-form-item label="患者姓名" prop="visitName">
                <el-input
                    v-model="visitName"
                    placeholder="请输入患者姓名"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="处方单号" prop="orderNo">
                <el-input
                    v-model="orderNo"
                    placeholder="请输入处方单号"
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
                </el-button
                >
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置
                </el-button
                >
            </el-form-item>
        </el-form>

        <el-table
            v-loading="loading"
            :data="schList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="处方类型" align="center" prop="orderType">
                <template slot-scope="scope">
                    <p v-if="scope.row.orderType == 'WESTERN_RECIPE'">西药方</p>
                    <p v-if="scope.row.orderType == 'CHINESE_RECIPE'">中药方</p>
                </template>
            </el-table-column>
            <el-table-column label="处方单号" align="center" prop="orderNo"/>
            <el-table-column label="处方状态" align="center" prop="orderStatus">
                <template slot-scope="scope">
                    <p v-if="scope.row.orderStatus == 'WAIT_SIGN'">待签名</p>
                    <p v-if="scope.row.orderStatus == 'ISSUE'">待审核</p>
                    <p v-if="scope.row.orderStatus == 'AUDIT'">待支付</p>
                    <p v-if="scope.row.orderStatus == 'WAITTAKE'">待配送</p>
                    <p v-if="scope.row.orderStatus == 'SHIPPING'">配送中</p>
                    <p v-if="scope.row.orderStatus == 'COMPLETE'">已完成</p>
                    <p v-if="scope.row.orderStatus == 'CANCEL'">已作废</p>
                    <p v-if="scope.row.orderStatus == 'REFUSE'">已拒绝</p>
                    <p v-if="scope.row.orderStatus == 'RECALL'">已召回</p>
                </template>
            </el-table-column>
            <el-table-column label="开方医院" align="center" prop="hosName"/>
            <el-table-column label="开方医生" align="center" prop="docName"/>
            <el-table-column label="开方时间" align="center" prop="dtCreate">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.dtCreate, '{y}-{m}-{d} {h}:{m}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核药师" align="center" prop="shName"/>
            <el-table-column label="审核时间" align="center" prop="shTime">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.shTime, '{y}-{m}-{d} {h}:{m}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" align="center" prop="visitName"/>
            <el-table-column label="性别" align="center" prop="visitGender"/>
            <el-table-column label="年龄" align="center" prop="visitAge"/>

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
                    </el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    listYhgx
} from '@/api/monitor/tongji'
import { listHosData } from '@/api/yiliao/base/hosData'

export default {
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
            // 基础服务_排班 v1.3.2 A表格数据
            schList: [],
            //处方状态
            statusOptions: [{
                label: '待签名',
                value: 'WAIT_SIGN'
            }, {
                label: '待审核',
                value: 'ISSUE'
            }, {
                label: '待支付',
                value: 'AUDIT'
            }, {
                label: '待配送',
                value: 'WAITTAKE'
            }, {
                label: '配送中',
                value: 'SHIPPING'
            }, {
                label: '已完成',
                value: 'COMPLETE'
            }, {
                label: '已作废',
                value: 'CANCEL'
            }, {
                label: '已拒绝',
                value: 'REFUSE'
            }, {
                label: '已召回',
                value: 'RECALL'
            }],
            docName: null,
            visitName: null,
            orderNo: null,
            // 查询参数
            queryParams: {
                code: '处方信息记录',
                hosId: null,
                orderStatus: null,
                docName: null,
                visitName: null,
                orderNo: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            hosIdOptions: [], //所属医院
        }
    },
    created() {
        this.getList()
        listHosData({ hosType: 'HOS' }).then((response) => {
            this.hosIdOptions = response.rows
        })
    },
    methods: {
        /** 统计接口 */
        getList() {
            this.loading = true
            listYhgx(this.queryParams).then((response) => {
                this.schList = response.data
                // this.total = response.total;
                this.loading = false
            })
        },
        getList1() {
            this.loading = true
            var docName = 'like ' + this.docName
            var visitName = 'like ' + this.visitName
            var orderNo = 'like ' + this.orderNo
            if (this.docName) {
                this.$set(this.queryParams, 'docName', docName)
            } else {
                this.$set(this.queryParams, 'docName', this.docName)
            }
            if (this.visitName) {
                this.$set(this.queryParams, 'visitName', visitName)
            } else {
                this.$set(this.queryParams, 'visitName', this.visitName)
            }
            if (this.orderNo) {
                this.$set(this.queryParams, 'orderNo', orderNo)
            } else {
                this.$set(this.queryParams, 'orderNo', this.orderNo)
            }

            listYhgx(this.queryParams).then((response) => {
                this.schList = response.data
                this.loading = false
            })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            // this.queryParams.pageNum = 1;
            this.getList1()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm')
            this.docName = null
            this.visitName = null
            this.orderNo = null
            this.handleQuery()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.rId)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.rId || this.ids

            this.$router.push({
                path: "/pharmacy/dingdan/prescriptionOrderDetails",
                query: { id: id }
            });

        },
    }
}
</script>
