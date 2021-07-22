<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="创建时间" prop="dtCreate">
                <el-date-picker
                    v-model="dateRange"
                    size="small"
                    style="width: 240px"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="医院名称" prop="hosId">
                <el-select v-model="queryParams.hosId" placeholder="医院名称" clearable size="small">
                    <el-option
                        v-for="dictionary in hosIdOptions"
                        :key="dictionary.hosId"
                        :label="dictionary.hosName"
                        :value="dictionary.hosId"
                    />
                </el-select>
            </el-form-item>
            <!--      0-成功；1-取消；2-停诊；-->
            <el-form-item label="支付状态" prop="payStatus">
                <el-select v-model="queryParams.payStatus" placeholder="请选择支付状态" clearable size="small">
                    <el-option
                        v-for="dictionary in orderStatusOptions"
                        :key="dictionary.value"
                        :label="dictionary.label"
                        :value="dictionary.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="关键字" prop="key">
                <el-input
                    v-model="queryParams.key"
                    placeholder="患者姓名/证件号码"
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
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['api:paymentRecord:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="订单编号" align="center" prop="id"/>
            <el-table-column label="医院名称" align="center" prop="hosName"/>
            <el-table-column label="患者姓名" align="center" prop="payerName"/>
            <el-table-column label="证件号码" align="center" prop="cardNo"/>
            <el-table-column label="科室名称" align="center" prop="deptName"/>
            <el-table-column label="医生姓名" align="center" prop="docName"/>
            <el-table-column label="挂号费" align="center" prop="payAmount">
                <template>

                </template>
            </el-table-column>
            <el-table-column label="支付方式" align="center" prop="payWay">
                <template slot-scope="scope">
                    <span v-if="scope.row.payWay == '11'">微信</span>
                    <span v-if="scope.row.payWay == '12'">支付宝</span>
                </template>
            </el-table-column>
            <el-table-column label="支付状态" align="center" prop="payStatus">
                <template slot-scope="scope">
                    <span v-if="scope.row.payStatus == '0'">待支付</span>
                    <span v-if="scope.row.payStatus == '1'">已支付</span>
                    <span v-if="scope.row.payStatus == '2'">支付失败</span>
                    <span v-if="scope.row.payStatus == '3'">退款</span>
                    <span v-if="scope.row.payStatus == '4'">退款中</span>
                </template>
            </el-table-column>
            <el-table-column label="支付流水号" align="center" prop="payOrderId"/>
            <el-table-column label="创建时间" align="center" prop="dtCreate">
                <template slot-scope="scope">
                    <span>{{
                            parseTime(scope.row.dtCreate, '{y}-{m}-{d} {h}:{m}:{s}')
                        }}</span>
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
    </div>
</template>

<script>
import { listPaymentRecord,exportPaymentRecord } from '@/api/yiliao/book/zhifu'
import { listHosData } from '@/api/yiliao/base/hosData'

export default {
    name: 'zhifu',
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
            // 预约订单信息.表格数据
            orderList: [],
            // 日期范围
            dateRange: [],
            // 状态数据字典
            hosIdOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                key: null,
                orderId: null,
                userId: null,
                orderStatus: null,
                visitName: null,
                channel: null,
            },
            // 查询参数
            queryParam: {
                hosType: 'HOS'  //医院
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
            },
            orderStatusOptions: [{
                'label': '待支付',
                'value': 0
            },{
                'label': '已支付',
                'value': 1
            }, {
                'label': '取消',
                'value': 2
            }, {
                'label': '停诊',
                'value': 3
            }],
        }
    },
    created() {
        this.getList()
        //医院名称
        listHosData(this.queryParam).then(response => {
            this.hosIdOptions = response.rows
        })
    },
    methods: {
        /** 查询预约订单信息.列表 */
        getList() {
            this.loading = true
            listPaymentRecord(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.orderList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        // 表单重置
        reset() {
            this.form = {
                orderId: null,
                userId: null,
                orderStatus: '0',
                visitName: null,
                channel: null,
                dtCreate: null,
            }
            this.resetForm('form')
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
            // this.dateRange = []
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = []
            this.resetForm('queryForm')
            this.handleQuery()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.orderId)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有预约订单信息.数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return exportPaymentRecord(queryParams)
            }).then(response => {
                this.download(response.msg)
            })
        }
    }
}
</script>
