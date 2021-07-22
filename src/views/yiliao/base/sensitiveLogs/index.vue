<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="业务类型" prop="bizType">
                <el-select
                    v-model="queryParams.bizType"
                    placeholder="请选择业务类型"
                    clearable
                    size="small"
                >
                    <el-option label="咨询详情" value="consult_info" />
                    <el-option label="咨询回复" value="consult_reply" />
                    <el-option label="评价" value="evaluate" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                >
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>

        <el-table
            v-loading="loading"
            :data="logList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="业务类型" align="center" prop="bizType">
                <template slot-scope="scope">
                    <span v-if="scope.row.bizType == 'consult_info'"
                        >咨询详情</span
                    >
                    <span v-else-if="scope.row.bizType == 'consult_reply'"
                        >咨询回复</span
                    >
                    <span v-else-if="scope.row.bizType == 'evaluate'"
                        >评价</span
                    >
                </template>
            </el-table-column>
            <el-table-column label="内容" align="center" prop="content" />
            <el-table-column
                label="创建时间"
                align="center"
                prop="dtCreate"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{
                        parseTime(scope.row.dtCreate, "{y}-{m}-{d}")
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
                        v-hasPermi="['api:log:edit']"
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
import { listLog, getLog } from "@/api/yiliao/base/logs";

export default {
    name: "Logs",
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
            // 敏感词日志记录表格数据
            logList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                bizId: null,
                bizType: null,
                content: null,
                dtCreate: null
            },
            // 表单参数
            form: {},
            rules: {}
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询敏感词日志记录列表 */
        getList() {
            this.loading = true;
            listLog(this.queryParams).then(response => {
                this.logList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                bizId: null,
                bizType: null,
                content: null,
                dtCreate: null
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        handleUpdate(row) {
            // 跳转评价业务
            if (row.bizType == "evaluate") {
                this.$router.push({
                    path: "/operat/business/evaluate",
                    query: { content: row.content }
                });
                // 跳转咨询回复
            } else if (row.bizType == "consult_reply") {
                this.$router.push({
                    path: "/jiuzhen/relation/duMessage",
                    query: { rdId: row.bizId }
                });
                // 跳转咨询详情
            } else if (row.bizType == "consult_info") {
                this.$router.push({
                    path: "/operat/business/consultInfo",
                    query: { content: row.bizId }
                });
            }
        }
    }
};
</script>
