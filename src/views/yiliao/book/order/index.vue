<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="选择时间" prop="field102">
                <el-select v-model="queryParams.field102" placeholder="请选择下拉选择" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                               :value="item.label" :disabled="item.disabled"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间" v-if="queryParams.field102 == '创建时间'" prop="dtCreate">
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

            <el-form-item label="预约时间" v-if="queryParams.field102 == '预约时间'" prop="schDate">
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
            <el-form-item label="订单状态" prop="orderStatus">
                <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable size="small">
                    <!--          <el-option label="请选择字典生成" value="" />-->
                    <el-option
                        v-for="dictionary in orderStatusOptions"
                        :key="dictionary.value"
                        :label="dictionary.label"
                        :value="dictionary.value"
                    />
                </el-select>
            </el-form-item>
            <!--      ：and,ios,web,wx-->
            <el-form-item label="预约渠道" prop="channel">
                <el-select v-model="queryParams.channel" placeholder="请选择订单状态" clearable size="small">
                    <!--          <el-option label="请选择字典生成" value="" />-->
                    <el-option
                        v-for="dictionary in channelOptions"
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
                    v-hasPermi="['api:order:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="订单编号" align="center" prop="orderId"/>
            <!--            <el-table-column label="订单类型" align="center" prop="orderId"/>-->
            <el-table-column label="取号密码" align="center" prop="takePass"/>
            <el-table-column label="姓名" align="center" prop="visitName"/>
            <el-table-column label="证件号码" align="center" prop="visitCardNo"/>
            <el-table-column label="医院名称" align="center" prop="hosName"/>
            <el-table-column label="科室名称" align="center" prop="deptName"/>
            <el-table-column label="医生姓名" align="center" prop="docName"/>
            <el-table-column label="预约时间" align="center" prop="schDate">
                <template slot-scope="scope">
                    <span>{{
                            parseTime(scope.row.schDate, '{y}-{m}-{d}')
                        }}</span>
                </template>
            </el-table-column>
            <el-table-column label="预约类型" align="center" prop="schType">
                <template slot-scope="scope">
                    <p v-if="scope.row.schType == '0'">全天</p>
                    <p v-if="scope.row.schType == '1'">上午</p>
                    <p v-if="scope.row.schType == '2'">下午</p>
                    <p v-if="scope.row.schType == '3'">晚上</p>
                    <p v-if="scope.row.schType == '4'">夜间</p>
                </template>
            </el-table-column>
            <!--      渠道：and,ios,web,wx-->
            <el-table-column label="预约渠道" align="center" prop="channel">
                <template slot-scope="scope">
                    <p v-if="scope.row.channel == 'and'">安卓</p>
                    <p v-if="scope.row.channel == 'ios'">ios</p>
                    <p v-if="scope.row.channel == 'web'">网页</p>
                    <p v-if="scope.row.channel == 'wx'">微信</p>
                </template>
            </el-table-column>
            <el-table-column label="订单状态" align="center" prop="orderStatus">
                <template slot-scope="scope">
                    <p v-if="scope.row.orderStatus == -1">进行中</p>
                    <p v-if="scope.row.orderStatus == 0">成功</p>
                    <p v-if="scope.row.orderStatus == 1">取消</p>
                    <p v-if="scope.row.orderStatus == 2">停诊</p>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="dtCreate" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.dtCreate, '{y}-{m}-{d}') }}</span>
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
import { listOrder, getOrder, delOrder, addOrder, updateOrder, exportOrder } from '@/api/yiliao/book/order'
import { listHosData } from '@/api/yiliao/base/hosData'

export default {
    name: 'Order',
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
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
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
                field102: '创建时间'
            },
            // 查询参数
            queryParam: {
                hosType: 'HOS'  //医院
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            //选择时间
            field102Options: [{
                'label': '创建时间',
                'value': 1
            }, {
                'label': '预约时间',
                'value': 2
            }],
            value: 1, //默认展示创建时间
            orderStatusOptions: [{
                'label': '进行中',
                'value': -1
            }, {
                'label': '成功',
                'value': 0
            }, {
                'label': '取消',
                'value': 1
            }, {
                'label': '停诊',
                'value': 2
            }],
            channelOptions: [{
                'label': '安卓',
                'value': 'and'
            }, {
                'label': 'ios',
                'value': 'ios'
            }, {
                'label': '微信',
                'value': 'wx'
            }, {
                'label': '网站',
                'value': 'web'
            }]
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
            listOrder(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
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
                dtCreate: null
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
                return exportOrder(queryParams)
            }).then(response => {
                this.download(response.msg)
            })
        }
    }
}
</script>
