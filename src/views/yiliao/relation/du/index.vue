<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="关注时间">
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
            <el-form-item label="医生姓名" prop="docName">
                <el-input
                    v-model="queryParams.docName"
                    placeholder="请输入医生姓名"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="患者姓名" prop="realName">
                <el-input
                    v-model="queryParams.realName"
                    placeholder="请输入患者姓名"
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
            :data="duList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="医生" align="center" prop="docName" />
            <el-table-column label="患者" align="center" prop="realName" />
            <el-table-column
                label="患者备注名"
                align="center"
                prop="userNoteName"
            />
            <el-table-column
                label="最后会话时间"
                align="center"
                prop="lastMsgTime"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{
                        parseTime(scope.row.lastMsgTime, "{y}-{m}-{d}")
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column label="VIP状态" align="center" prop="vipStatus">
                <template slot-scope="scope">
                    <span v-if="scope.row.vipStatus == 1">是</span>
                    <span v-else-if="scope.row.vipStatus == 0">否</span>
                </template>
            </el-table-column>
            <el-table-column
                label="关注时间"
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
                    <!--          @click="handleDelete(scope.row)" -->
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['system/yiliao/relation:du:remove']"
                        >查看回话消息</el-button
                    >
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

        <el-dialog
            :title="title"
            :visible.sync="open"
            width="700px"
            append-to-body
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <div>11111111</div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { listDu } from "@/api/yiliao/relation/du";

export default {
    name: "Du",
    components: {},
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 日期范围
            dateRange: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 医患关系表格数据
            duList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                docId: null,
                hosId: null,
                userId: null,
                userNoteName: null,
                vipStatus: null,
                vipExpireTime: null,
                lastMsgId: null,
                lastMsgTime: null,
                docUnreadCount: null,
                patUnreadCount: null,
                fgActive: null,
                dtCreate: null,
                docName: null,
                realName: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                fgActive: [
                    {
                        required: true,
                        message: "是否有效不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询医患关系列表 */
        getList() {
            this.loading = true;
            listDu(this.addDateRange(this.queryParams, this.dateRange)).then(
                response => {
                    this.duList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
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
                docId: null,
                hosId: null,
                userId: null,
                userNoteName: null,
                vipStatus: 0,
                vipExpireTime: null,
                lastMsgId: null,
                lastMsgTime: null,
                docUnreadCount: null,
                patUnreadCount: null,
                fgActive: null,
                dtCreate: null,
                docName: null,
                realName: null
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
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },

        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.rdId;
            this.$router.push({
                path: "/jiuzhen/relation/duMessage",
                query: { rdId: id }
            });
        }
    }
};
</script>
