<template>
    <div class="app-container" style="padding: 60px;">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
            style="text-align: center"
        >
            <el-form-item label="所属医院" prop="value">
                <el-select
                    v-model="queryParams.value"
                    placeholder="医院状态"
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

            <el-form-item label="时间" prop="time">
                <el-date-picker type="daterange" v-model="time" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                range-separator="至" clearable
                ></el-date-picker>
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
            </el-form-item>
        </el-form>

        <p style="text-align: center;">医患关系统计</p>
        <el-table
            v-loading="loading"
            :data="listData"
            :span-method="objectSpanMethod"
            show-summary
            style="width:70%;margin: 0 auto;"
        >
            <el-table-column label="医院名称" align="center" prop="hos_name"/>
            <el-table-column label="科室名称" align="center" prop="dept_name"/>
            <el-table-column label="医生姓名" align="center" prop="doc_name"/>
            <el-table-column label="关注人数" align="center" prop="r_id"/>
        </el-table>
        <p style="text-align: center;">制表时间：{{this.date}}</p>
    </div>
</template>

<script>
import {
    listYhgx
} from '@/api/monitor/tongji'
import { listHosData } from '@/api/yiliao/base/hosData'

export default {
    name: 'Sch',
    components: {},
    data() {
        return {
            // 设置只能选择当前日期及之后的日期
            pickerOptions: {
                disabledDate(time) {
                    let _now = Date.now(),
                        seven = 10 * 24 * 60 * 60 * 1000,
                        sevenDays = _now + seven
                    return time.getTime() < _now || time.getTime() > sevenDays
                    //大于当前的禁止，小于7天前的禁止
                }
            },
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
                // pageNum: 1,
                // pageSize: 10,
                code: '医患关系统计',
                value: null,
                // 'ru.dt_create':"between '2021-04-20 21:16:28' and '2021-04-21 17:32:25'"
                'ru.dt_create': null,
                time: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            hosIdOptions: [], //所属医院
            listData: [],
            testArr1: [],
            testPosition1: 0,
        }
    },
    created() {
        this.getNowTime()
        this.nowDate();
        listHosData({ hosType: 'HOS' }).then((response) => {
            this.hosIdOptions = response.rows
            if (response.total != 0) {
                if (response.rows[0]) {
                    this.queryParams.value = response.rows[0].hosId
                    this.getList()
                }
            }
        })

    },
    methods: {
        /** 查询基础服务_排班 v1.3.2 A列表 */
        getList() {
            this.loading = true
            // this.$set(this.queryParams, "ru.dt_create", );
            let that = this
            listYhgx(this.queryParams).then((response) => {
                that.listData = response.data
                that.rowspan(that.testArr1, that.testPosition1, "hos_name")
                this.loading = false
            })
        },
        getList1() {
            this.loading = true
            // "between '2021-04-20 21:16:28' and '2021-04-21 17:32:25'"
            // var aa = "between '2021-04-20' and '2021-04-21'";
            var aa = 'between \'' + this.time[0] + '\' and \'' + this.time[1] + '\''
            this.$set(this.queryParams, 'ru.dt_create', aa)
            let that = this
            listYhgx(this.queryParams).then((response) => {
                that.listData = response.data
                that.rowspan(that.testArr1, that.testPosition1, "hos_name")
                that.loading = false
            })
        },
        rowspan(spanArr, position, spanName) {
            this.listData.forEach((item, index) => {
                if (index === 0) {
                    spanArr.push(1);
                    position = 0;
                } else {
                    if (this.listData[index][spanName] === this.listData[index - 1][spanName]) {
                        spanArr[position] += 1;
                        spanArr.push(0);
                    } else {
                        spanArr.push(1);
                        position = index;
                    }
                }
            });
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.testArr1[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col,
                };
            }
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
            this.$set(this.queryParams, 'ru.dt_create', aa)
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList1()
            this.nowDate();
        },
        nowDate(){
            var now = new Date()
            var year = now.getFullYear() //得到年份
            var month = now.getMonth() //得到月份
            var date = now.getDate() //得到日期
            month = month + 1
            month = month.toString().padStart(2, '0')
            date = date.toString().padStart(2, '0')
            this.date = `${year}-${month}-${date}`
        }
    }
}
</script>
