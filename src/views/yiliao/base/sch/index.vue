<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="所属医院" prop="hosId">
                <el-select
                    v-model="queryParams.hosId"
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

            <el-form-item label="医生名称" prop="docId">
                <el-select
                    v-model="queryParams.docId"
                    placeholder="请输入医生名称"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dictionary in docOptions"
                        :key="dictionary.id"
                        :label="dictionary.docName"
                        :value="dictionary.id"
                        @keyup.enter.native="handleQuery"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="科室名称" prop="deptId">
                <el-select
                    v-model="queryParams.deptId"
                    placeholder="请输入科室名称"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dictionary in deptIdOptions"
                        :key="dictionary.deptId"
                        :label="dictionary.deptName"
                        :value="dictionary.deptId"
                        @keyup.enter.native="handleQuery"
                    />
                </el-select>
            </el-form-item>

            <!-- <el-form-item label="排班服务 consult..." prop="schSvc">
        <el-input
          v-model="queryParams.schSvc"
          placeholder="请输入排班服务 consult..."
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排班日期" prop="schDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.schDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择排班日期">
        </el-date-picker>
      </el-form-item> -->

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

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['system:sch:add']"
                    >新增
                </el-button>
            </el-col>
            <!--      <el-col :span="1.5">-->
            <!--        <el-button-->
            <!--          type="success"-->
            <!--          plain-->
            <!--          icon="el-icon-edit"-->
            <!--          size="mini"-->
            <!--          :disabled="single"-->
            <!--          @click="handleUpdate"-->
            <!--          v-hasPermi="['system:sch:edit']"-->
            <!--          >修改</el-button-->
            <!--        >-->
            <!--      </el-col>-->
            <!--      <el-col :span="1.5">-->
            <!--        <el-button-->
            <!--          type="danger"-->
            <!--          plain-->
            <!--          icon="el-icon-delete"-->
            <!--          size="mini"-->
            <!--          :disabled="multiple"-->
            <!--          @click="handleDelete"-->
            <!--          v-hasPermi="['system:sch:remove']"-->
            <!--          >删除</el-button-->
            <!--        >-->
            <!--      </el-col>-->
            <!--      <el-col :span="1.5">-->
            <!--        <el-button-->
            <!--          type="warning"-->
            <!--          plain-->
            <!--          icon="el-icon-download"-->
            <!--          size="mini"-->
            <!--          @click="handleExport"-->
            <!--          v-hasPermi="['system:sch:export']"-->
            <!--          >导出</el-button-->
            <!--        >-->
            <!--      </el-col>-->
            <right-toolbar
                :showSearch.sync="showSearch"
                @queryTable="getList"
            ></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="schList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <!-- <el-table-column label="排班ID" align="center" prop="schId" /> -->
            <!-- <el-table-column label="引用排班ID" align="center" prop="refSchId" /> -->
            <el-table-column label="医院名称" align="center" prop="hosName" />
            <el-table-column label="医生名称" align="center" prop="docName" />
            <el-table-column label="科室名称" align="center" prop="deptName" />
            <!-- <el-table-column label="排班服务 consult..." align="center" prop="schSvc" /> -->
            <!-- <el-table-column label="排班日期" align="center" prop="schDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.schDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
            <!-- <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
            <!-- <el-table-column label="星期 1-7" align="center" prop="weekNo" /> -->
            <el-table-column label="排班午别 " align="center" prop="schType">
                <template slot-scope="scope">
                    <p v-if="scope.row.schType == 1">上午</p>
                    <p v-if="scope.row.schType == 2">下午</p>
                </template>
            </el-table-column>
            <!-- 10 可预约
     20 约满
     30 停诊 -->
            <el-table-column label="排班状态" align="center" prop="schStatus">
                <template slot-scope="scope">
                    <p v-if="scope.row.schStatus == '10'">可预约</p>
                    <p v-if="scope.row.schStatus == '20'">约满</p>
                    <p v-if="scope.row.schStatus == '30'">停诊</p>
                </template>
            </el-table-column>
            <el-table-column
                label="号源总数"
                align="center"
                prop="ticketCount"
            />
            <el-table-column
                label="已约号源数"
                align="center"
                prop="ticketUsed"
            />
            <!-- <el-table-column label="生成规则 字典 排班规则  1 不自动生成 2 每周  3 每两周 4每月 自动排班：通过定时器查询任务日期=当前日期-1 的所有记录，然后根据生成规则生成下一阶段的排班" align="center" prop="schRule" /> -->
            <!-- <el-table-column label="任务日期

            正常排班时任务日期=排班日期
            如果计划生成的排班为节假日时，不生成排班，直接更新任务日期" align="center" prop="taskDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.taskDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
            <!-- <el-table-column label="生成排班日期" align="center" prop="genSchDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.genSchDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
            <!-- <el-table-column label="分时段类型" align="center" prop="minuteperiod" /> -->
            <el-table-column label="诊疗费" align="center" prop="treatFee" />
            <el-table-column label="挂号费" align="center" prop="regFee" />
            <!--      <el-table-column label="状态" align="center" prop="fgActive" >-->
            <!--        <template slot-scope="scope">-->
            <!--          <p v-if="scope.row.fgActive == 1">正常</p>-->
            <!--          <p v-if="scope.row.fgActive == 0">停用</p>-->
            <!--        </template>-->
            <!--      </el-table-column>-->

            <el-table-column label="状态" align="center" key="fgActive">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.fgActive"
                        active-value="1"
                        inactive-value="0"
                        @change="handleStatusChange(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>

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
            <!--      <el-table-column-->
            <!--        label="操作"-->
            <!--        align="center"-->
            <!--        class-name="small-padding fixed-width"-->
            <!--      >-->
            <!--        <template slot-scope="scope">-->
            <!--          <el-button-->
            <!--            size="mini"-->
            <!--            type="text"-->
            <!--            icon="el-icon-edit"-->
            <!--            @click="handleUpdate(scope.row)"-->
            <!--            v-hasPermi="['system:sch:edit']"-->
            <!--            >修改</el-button-->
            <!--          >-->
            <!--          <el-button-->
            <!--            size="mini"-->
            <!--            type="text"-->
            <!--            icon="el-icon-delete"-->
            <!--            @click="handleDelete(scope.row)"-->
            <!--            v-hasPermi="['system:sch:remove']"-->
            <!--            >删除</el-button-->
            <!--          >-->
            <!--        </template>-->
            <!--      </el-table-column>-->
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改基础服务_排班 v1.3.2 A对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            width="900px"
            append-to-body
        >
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="100px"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="医院名称" prop="hosId">
                            <el-select
                                v-model="form.hosId"
                                placeholder="请输入医院名称"
                                clearable
                                style="width:260px"
                            >
                                <el-option
                                    v-for="dictionary in hosIdOptions"
                                    :key="dictionary.hosId"
                                    :label="dictionary.hosName"
                                    :value="dictionary.hosId"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="医生名称" prop="docId">
                            <el-select
                                v-model="form.docId"
                                placeholder="请输入医生名称"
                                clearable
                                style="width:260px"
                            >
                                <el-option
                                    v-for="dictionary in docOptions"
                                    :key="dictionary.id"
                                    :label="dictionary.docName"
                                    :value="dictionary.id"
                                />
                            </el-select>
                            <!-- <el-input v-model="form.docId" placeholder="请输入医生名称" /> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="科室名称" prop="deptId">
                            <el-select
                                v-model="form.deptId"
                                placeholder="请输入科室名称"
                                clearable
                                style="width:260px"
                            >
                                <el-option
                                    v-for="dictionary in deptIdOptions"
                                    :key="dictionary.deptId"
                                    :label="dictionary.deptName"
                                    :value="dictionary.deptId"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-form-item label="排班服务 consult..." prop="schSvc">
            <el-input v-model="form.schSvc" placeholder="请输入排班服务 consult..." />
          </el-form-item> -->
                    <el-col :span="12">
                        <el-form-item label="排班日期" prop="schDate">
                            <el-date-picker
                                clearable
                                v-model="form.schDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择排班日期"
                                :picker-options="pickerOptions"
                                style="width:260px"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开始时间" prop="startTime">
                            <!-- selectableRange: '18:30:00 - 20:30:00' -->
                            <el-time-picker
                                style="width:260px"
                                v-model="form.startTime"
                                value-format="HH:mm:ss"
                                :picker-options="{
                                    selectableRange: ''
                                }"
                                placeholder="选择开始时间"
                            >
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间" prop="endTime">
                            <el-time-picker
                                v-model="form.endTime"
                                value-format="HH:mm:ss"
                                :picker-options="{
                                    selectableRange: ''
                                }"
                                style="width:260px"
                                placeholder="选择结束时间"
                            >
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="排班午别 " prop="schType">
                            <el-select
                                v-model="form.schType"
                                placeholder="请选择排班午别"
                                clearable
                                style="width:260px"
                            >
                                <el-option
                                    v-for="dictionary in wubieOptions"
                                    :key="dictionary.data"
                                    :label="dictionary.name"
                                    :value="dictionary.data"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排班状态">
                            <el-select
                                v-model="form.schStatus"
                                placeholder="请选择排班状态"
                                clearable
                                style="width:260px"
                            >
                                <el-option
                                    v-for="dictionary in statusOptions"
                                    :key="dictionary.data"
                                    :label="dictionary.name"
                                    :value="dictionary.data"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="号源总数" prop="ticketCount">
                            <el-input
                                v-model="form.ticketCount"
                                placeholder="请输入号源总数"
                                style="width:260px"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="已约号源数" prop="ticketUsed">
                            <el-input
                                v-model="form.ticketUsed"
                                placeholder="请输入已约号源数"
                                style="width:260px"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 字典 排班规则 1 不自动生成 2 每周  3 每两周 4每月 自动排班：通过定时器查询任务日期=当前日期-1 的所有记录，然后根据生成规则生成下一阶段的排班 -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="生成规则" prop="schRule">
                            <!-- <el-input v-model="form.schRule" placeholder="请输入生成规则" /> -->
                            <el-select
                                v-model="form.schRule"
                                placeholder="请输入生成规则"
                                clearable
                                style="width:260px"
                            >
                                <el-option
                                    v-for="(item, index) in field101Options"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="诊疗费" prop="treatFee">
                            <el-input
                                v-model="form.treatFee"
                                placeholder="请输入诊疗费"
                                style="width:260px"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="挂号费" prop="regFee">
                    <el-input
                        v-model="form.regFee"
                        placeholder="请输入挂号费"
                        style="width:690px"
                    />
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
    listSch,
    getSch,
    delSch,
    addSch,
    updateSch,
    exportSch
} from "@/api/yiliao/base/sch";
import { listHosData } from "@/api/yiliao/base/hosData";
import { listDictionary } from "@/api/system/dictionary";
import { listDocInfo } from "@/api/yiliao/doc/docInfo";
import { listBookDept } from "@/api/yiliao/book/bookDept";

export default {
    name: "Sch",
    components: {},
    data() {
        return {
            // 设置只能选择当前日期及之后的日期
            pickerOptions: {
                disabledDate(time) {
                    let _now = Date.now(),
                        seven = 9 * 24 * 60 * 60 * 1000,
                        sevenDays = _now + seven;
                    return (
                        time.getTime() < _now - 24 * 60 * 60 * 1000 ||
                        time.getTime() > sevenDays
                    );
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
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                refSchId: null,
                hosId: null,
                docId: null,
                deptId: null,
                schSvc: null,
                schDate: null,
                startTime: null,
                endTime: null,
                weekNo: null,
                schType: null,
                schStatus: null,
                ticketCount: null,
                ticketUsed: null,
                schRule: null,
                taskDate: null,
                genSchDate: null,
                minuteperiod: null,
                treatFee: null,
                regFee: null,
                fgActive: null,
                dtCreate: null,
                dtModify: null,
                modifyUserId: null,
                modifyUser: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                hosId: [
                    {
                        required: true,
                        message: "医院名称不能为空",
                        trigger: "blur"
                    }
                ],
                schType: [
                    {
                        required: true,
                        message: "排班午别不能为空",
                        trigger: "blur"
                    }
                ],
                docId: [
                    {
                        required: true,
                        message: "医生名称不能为空",
                        trigger: "blur"
                    }
                ],
                deptId: [
                    {
                        required: true,
                        message: "科室名称不能为空",
                        trigger: "blur"
                    }
                ],
                schDate: [
                    {
                        required: true,
                        message: "排班日期不能为空",
                        trigger: "blur"
                    }
                ],
                startTime: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "blur"
                    }
                ],
                endTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur"
                    }
                ],
                schRule: [
                    {
                        required: true,
                        message: "生成规则不能为空",
                        trigger: "blur"
                    }
                ],
                ticketCount: [
                    {
                        required: true,
                        message: "号源总数不能为空",
                        trigger: "blur"
                    }
                ]
            },
            hosIdOptions: [], //所属医院
            deptIdOptions: [], //科室
            statusOptions: [], //排班状态
            wubieOptions: [], //排班午别
            docOptions: [], //医生
            // 生成规则
            field101Options: [
                {
                    label: "无",
                    value: 1
                },
                {
                    label: "每周",
                    value: 2
                },
                {
                    label: "每两周",
                    value: 3
                },
                {
                    label: "每月",
                    value: 4
                }
            ]
        };
    },
    created() {
        this.getList();
        listHosData({ hosType: "HOS" }).then(response => {
            this.hosIdOptions = response.rows;
        });
        listBookDept().then(response => {
            this.deptIdOptions = response.rows;
        });
        listDictionary({ code: "base_sch_status", isData: "1" }).then(
            response => {
                this.statusOptions = response.data;
            }
        );
        listDictionary({ code: "base_sch_type", isData: "1" }).then(
            response => {
                this.wubieOptions = response.data;
            }
        );

        listDocInfo({ docType: "DOC" }).then(response => {
            this.docOptions = response.data.list;
        });
    },
    methods: {
        /** 查询基础服务_排班 v1.3.2 A列表 */
        getList() {
            this.loading = true;
            listSch(this.queryParams).then(response => {
                this.schList = response.rows;
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
                schId: null,
                refSchId: null,
                hosId: null,
                docId: null,
                deptId: null,
                schSvc: null,
                schDate: null,
                startTime: null,
                endTime: null,
                weekNo: null,
                schType: null,
                schStatus: null,
                ticketCount: null,
                ticketUsed: null,
                schRule: 1,
                taskDate: null,
                genSchDate: null,
                minuteperiod: null,
                treatFee: null,
                regFee: null,
                fgActive: null,
                dtCreate: null,
                dtModify: null,
                modifyUserId: null,
                modifyUser: null
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
            this.ids = selection.map(item => item.schId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加排班";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const schId = row.schId || this.ids;
            getSch(schId).then(response => {
                this.form = response.data[0];
                this.open = true;
                this.title = "修改排班";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.schId != null) {
                        updateSch(this.form).then(response => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        // this.form.deptId = this.form.deptCode;
                        addSch(this.form).then(response => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const schIds = row.schId || this.ids;
            this.$confirm(
                '是否确认删除基础服务_排班 v1.3.2 A编号为"' +
                    schIds +
                    '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function() {
                    return delSch(schIds);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm(
                "是否确认导出所有基础服务_排班 v1.3.2 A数据项?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function() {
                    return exportSch(queryParams);
                })
                .then(response => {
                    this.download(response.msg);
                });
        },
        //状态
        handleStatusChange(row) {
            let text = row.fgActive === "1" ? "启用" : "停用";
            this.$confirm(
                '确认要"' + text + '""' + row.docName + '"分类吗?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function() {
                    return updateSch(row);
                })
                .then(() => {
                    this.msgSuccess(text + "成功");
                })
                .catch(function() {
                    row.fgActive = row.fgActive === "0" ? "1" : "0";
                });
        }
    }
};
</script>
