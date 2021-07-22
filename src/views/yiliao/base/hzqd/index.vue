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
            <el-form-item label="时间" prop="time">
                <el-date-picker
                    type="daterange"
                    v-model="time"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :style="{ width: '100%' }"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="至"
                    clearable
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

        <p style="text-align: center;">患者渠道统计</p>
        <el-table
            v-loading="loading"
            :data="schList"
            :span-method="objectSpanMethod"
            show-summary
            style="width:70%;margin: 0 auto;"
        >
            <el-table-column label="日期" align="center" prop="dtCreate"/>
            <el-table-column label="渠道来源" align="center" prop="name"/>
            <el-table-column label="人数" align="center" prop="count"/>
        </el-table>
        <p style="text-align: center;">制表时间：{{ this.date }}</p>
    </div>
</template>

<script>
import { listYhgx } from '@/api/monitor/tongji'
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
            // 基础服务_排班 v1.3.2 A表格数据
            schList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            time: null,
            // 查询参数
            queryParams: {
                // pageNum: 1,
                // pageSize: 10,
                code: '患者渠道统计',
                // 'ru.dt_create':"between '2021-04-20 21:16:28' and '2021-04-21 17:32:25'"
                'ru.dt_create': null,
                time: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            //所属医院
            hosIdOptions: [],
            testArr1: [],
            testPosition1: 0,
            date: null
        }
    },
    created() {
        this.getNowTime()
        this.nowDate()
        this.getList()
    },
    methods: {
        /** 查询基础服务_排班 v1.3.2 A列表 */
        getList() {
            this.loading = true
            // this.$set(this.queryParams, "ru.dt_create", );
            let that = this
            listYhgx(this.queryParams).then(response => {
                var data = response.data
                var arr = []
                data.map((item, index) => {
                    if (item.ios != 0 || item.wx != 0 || item.android != 0) {
                        arr.push(item)
                    }
                })
                var ass = []
                arr.map((item, index) => {
                    if (item.ios != 0) {
                        ass.push({ count: item.ios, dtCreate: item.dtCreate, name: 'ios' })
                    }
                    if (item.wx != 0) {
                        ass.push({ count: item.wx, dtCreate: item.dtCreate, name: '微信' })
                    }
                    if (item.android != 0) {
                        ass.push({ count: item.android, dtCreate: item.dtCreate, name: '安卓' })
                    }
                })
                // return
                that.schList = ass
                that.rowspan(that.testArr1, that.testPosition1, 'dtCreate')
                this.loading = false
            })
        },
        getList1() {
            this.loading = true
            var aa = 'between \'' + this.time[0] + '\' and \'' + this.time[1] + '\''
            this.$set(this.queryParams, 'dt_create', aa)
            let that = this
            listYhgx(this.queryParams).then(response => {
                var data = response.data
                var arr = []
                data.map((item, index) => {
                    if (item.ios != 0 || item.wx != 0 || item.android != 0) {
                        arr.push(item)
                    }
                })
                var ass = []
                arr.map((item, index) => {
                    if (item.ios != 0) {
                        ass.push({ count: item.ios, dtCreate: item.dtCreate, name: 'ios' })
                    }
                    if (item.wx != 0) {
                        ass.push({ count: item.wx, dtCreate: item.dtCreate, name: '微信' })
                    }
                    if (item.android != 0) {
                        ass.push({ count: item.android, dtCreate: item.dtCreate, name: '安卓' })
                    }
                })
                // return
                that.schList = ass
                that.rowspan(that.testArr1, that.testPosition1, 'dtCreate')
                this.loading = false
            })
        },
        rowspan(spanArr, position, spanName) {
            this.schList.forEach((item, index) => {
                if (index === 0) {
                    spanArr.push(1)
                    position = 0
                } else {
                    if (this.schList[index][spanName] === this.schList[index - 1][spanName]) {
                        spanArr[position] += 1
                        spanArr.push(0)
                    } else {
                        spanArr.push(1)
                        position = index
                    }
                }
            })
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.testArr1[rowIndex]
                const _col = _row > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
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
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList1()
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
        }
    }
}
</script>
