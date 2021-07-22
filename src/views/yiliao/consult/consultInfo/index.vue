<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="关键字" prop="keys">
                <el-input
                    v-model="queryParams.keys"
                    placeholder="请输入姓名/电话号码"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="咨询类型" prop="consultType">
                <el-select
                    v-model="queryParams.consultType"
                    placeholder="请选择咨询类型"
                    clearable
                    size="small"
                >
                    <el-option label="悬赏咨询" value="GRAB" />
                    <el-option label="图文咨询" value="PAID" />
                    <el-option label="团队咨询" value="TEAM" />
                    <el-option label="电话咨询" value="TEL" />
                    <el-option label="视频咨询" value="VIDEO" />
                    <el-option label="复诊续方" value="CONTINUATION" />
                </el-select>
            </el-form-item>
            <el-form-item label="咨询状态" prop="consultStatus">
                <el-select
                    v-model="queryParams.consultStatus"
                    placeholder="请选择咨询状态"
                    clearable
                    size="small"
                >
                    <el-option label="待受理" value="0" />
                    <el-option label="进行中" value="1" />
                    <el-option label="已结束" value="2" />
                    <el-option label="已取消" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                    v-model="dateRange"
                    size="small"
                    style="width: 240px"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索
                </el-button>
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置
                </el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="infoList">
            <el-table-column label="状态" align="center" prop="consultStatus">
                <template slot-scope="scope">
                    <span v-if="scope.row.consultStatus == 0">待受理</span>
                    <span v-else-if="scope.row.consultStatus == 1">进行中</span>
                    <span v-else-if="scope.row.consultStatus == 2">已结束</span>
                    <span v-else-if="scope.row.consultStatus == 3">已取消</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" align="center" prop="visitName" />
            <el-table-column label="性别" align="center" prop="visitGender" />
            <el-table-column label="年龄" align="center" prop="visitAge" />
            <el-table-column label="咨询类型" align="center" prop="consultType">
                <template slot-scope="scope">
                    <span v-if="scope.row.consultType == 'GRAB'">悬赏咨询</span>
                    <span v-else-if="scope.row.consultType == 'PAID'"
                        >图文咨询</span
                    >
                    <span v-else-if="scope.row.consultType == 'TEAM'"
                        >团队咨询</span
                    >
                    <span v-else-if="scope.row.consultType == 'TEL'"
                        >电话咨询</span
                    >
                    <span v-else-if="scope.row.consultType == 'VIDEO'"
                        >视频咨询</span
                    >
                    <span v-else-if="scope.row.consultType == 'CONTINUATION'"
                        >复诊续方</span
                    >
                </template>
            </el-table-column>
            <el-table-column label="是否精选" align="center" prop="fgSelected">
                <template slot-scope="scope">
                    <span v-if="scope.row.fgSelected == 1">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <!--            <el-table-column label="手机号" align="center" prop="userMobile" />-->
            <el-table-column label="科室名称" align="center" prop="deptName" />
            <el-table-column label="处理医生" align="center" prop="docName" />
            <!--            (1-悬赏 ,2-付费,3-团队)-->

            <el-table-column label="金额" align="center" prop="totalPrice" />
            <!--            <el-table-column label="提成金额" align="center" prop="commPrice" />-->
            <!--            <el-table-column label="支付状态" align="center" prop="payStatus" />-->
            <el-table-column
                label="发布渠道"
                align="center"
                prop="consultChannel"
            />
            <el-table-column
                label="接单时间"
                align="center"
                prop="dtGrab"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{
                        parseTime(scope.row.dtGrab, "{y}-{m}-{d} {h}:{m}:{s}")
                    }}</span>
                </template>
            </el-table-column>
            <!--            <el-table-column label="是否有效" align="center" prop="fgActive" />-->

            <el-table-column
                label="创建时间"
                align="center"
                prop="dtCreate"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{
                        parseTime(scope.row.dtCreate, "{y}-{m}-{d} {h}:{m}:{s}")
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
                        v-hasPermi="['api:consult:edit']"
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
    </div>
</template>

<script>
import {
    listInfo,
    getInfo,
    delInfo,
    addInfo,
    updateInfo,
    exportInfo
} from "@/api/yiliao/consult/consultInfo";
import Editor from "@/components/Editor";

export default {
    name: "Info",
    components: {
        Editor
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
            // 咨询订单记录表格数据
            infoList: [],
            // 日期范围
            dateRange: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                consultType: null,
                dtCreate: null,
                consultStatus: null,
                keys: null
            }
        };
    },
    created() {
        let id = this.$route.query.id;
        if (id == null || id == undefined || id == ''){
            this.getList();
        }else {
            this.loading = true;
            this.queryParams.visitId = id;
            listInfo(this.addDateRange(this.queryParams, this.dateRange)).then(
                response => {
                    this.infoList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        }
    },
    methods: {
        /** 查询咨询订单记录列表 */
        getList() {
            this.loading = true;
            listInfo(this.addDateRange(this.queryParams, this.dateRange)).then(
                response => {
                    this.infoList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.$router.push({
                path: "/operat/business/consultInfo",
                query: { content: row.consultId }
            });
        }
    }
};
</script>
