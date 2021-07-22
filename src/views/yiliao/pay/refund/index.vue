<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="创建时间" prop="time">
                <el-date-picker type="daterange" v-model="time" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                range-separator="至" clearable
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="退款编号" prop="pay_refund_id">
                <el-input
                    v-model="queryParams.pay_refund_id"
                    placeholder="退款编号"
                    clearable
                    size="small"
                />
            </el-form-item>
            <el-form-item label="退款状态" prop = "refund_status">
                <el-select
                    v-model="queryParams.refund_status"
                    placeholder="请选择"
                    clearable
                    size="small"
                >
                <el-option
                    v-for="item in options"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"/>
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
                >重置</el-button
                >
            </el-form-item>
        </el-form>

        <p style="text-align: center;">退款订单信息</p>
        <el-table
            v-loading="loading"
            :data="listData"
            @selection-change="handleSelectionChange"
        >
            <el-table-column label="业务类型" align="center" prop="subject"/>
            <el-table-column label="退款金额" align="center" prop="refund_amount">
                <template slot-scope="scope">
                    <span v-if="scope.row.refund_amount != null">
                        {{scope.row.refund_amount * 0.01}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="支付渠道" align="center" prop="pay_way">
                <template slot-scope="scope">
                    <span v-if="scope.row.pay_way == 11">微信</span>
                    <span v-if="scope.row.pay_way == 12">支付宝</span>
                </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="payer_name"/>
            <el-table-column label="医生姓名" align="center" prop="payee_name"/>
            <el-table-column label="创建时间" align="center" prop="dtCreate"/>
            <el-table-column label="退款状态" align="center" prop="refund_status">
                <template slot-scope="scope">
                    <span v-if="scope.row.refund_status == 0">退款中</span>
                    <span v-if="scope.row.refund_status == 1">成功</span>
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
                    </el-button
                    >
                    <!--                    v-hasPermi="['system:diagnosis:edit']"&ndash;&gt;-->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    listYhgx,
    listYhgxPlus
} from '@/api/monitor/tongji'

export default {
    name: 'Sch',
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
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            time: null,
            date: null,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                code: '退款订单管理',
                value: null,
                // 'ru.dt_create':"between '2021-04-20 21:16:28' and '2021-04-21 17:32:25'"
                'pr.dt_create': null,
                time: null,
                pay_refund_id: null,
                refund_status: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            hosIdOptions: [], //所属医院
            listData: [],
            testArr1: [],
            testPosition1: 0,
            options: [{
                value: '退款中',
                label: '0'
            }, {
                value: '成功',
                label: '1'
            },],
            value: ''
        }
    },
    created() {
        this.getNowTime()
        this.getList()
    },
    methods: {
        // 表单重置
        reset() {

        },
        /** 查询基础服务_排班 v1.3.2 A列表 */
        getList() {
            this.loading = true
            listYhgxPlus(this.queryParams).then((response) => {
                this.listData = response.rows
                this.loading = false
            })
        },
        getList1() {
            this.loading = true
            // "between '2021-04-20 21:16:28' and '2021-04-21 17:32:25'"
            // var aa = "between '2021-04-20' and '2021-04-21'";
            var aa = 'between \'' + this.time[0] + '\' and \'' + this.time[1] + '\''
            this.$set(this.queryParams, 'pr.dt_create', aa)

            listYhgxPlus(this.queryParams).then((response) => {
                this.listData = response.rows
                this.loading = false
            })
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.time = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        getNowTime() {
            var now = new Date()
            var year = now.getFullYear() //得到年份
            var month = now.getMonth() //得到月份
            var date = now.getDate() //得到日期
            month = month + 1
            month = month.toString().padStart(2, '0')
            date = date.toString().padStart(2, '0')
            var defaultDate = `${year}-${month}-${date}`
            var aa = 'between \'' + defaultDate + '\' and \'' + defaultDate + '\''
            this.time = aa
            this.$set(this.queryParams, 'pr.dt_create', aa)
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList1()
            this.nowDate()
        },
        nowDate() {
            var now = new Date()
            var year = now.getFullYear() //得到年份
            var month = now.getMonth() //得到月份
            var date = now.getDate() //得到日期
            month = month + 1
            month = month.toString().padStart(2, '0')
            date = date.toString().padStart(2, '0')
            this.date = `${year}-${month}-${date}`
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.id || this.ids

            this.$router.push({
                path: "/finance/order/refundDetails",
                query: { id: row.id }
            });
        }
    }
}
</script>
