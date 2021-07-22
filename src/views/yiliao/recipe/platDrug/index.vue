<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="药品名称" prop="drugName">
                <el-input
                    v-model="queryParams.drugName"
                    placeholder="请输入药品名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="药品类型" prop="drugType">
                <el-select
                    v-model="queryParams.drugType"
                    placeholder="药品类型"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dictionary in typeOptions"
                        :key="dictionary.data"
                        :label="dictionary.name"
                        :value="dictionary.data"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="药品编码" prop="drugCode">
                <el-input
                    v-model="queryParams.drugCode"
                    placeholder="请输入药品编码"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="是否有效" prop="fgActive">
                <el-select
                    v-model="queryParams.fgActive"
                    placeholder="是否有效"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dictionary in statusOptions"
                        :key="dictionary.data"
                        :label="dictionary.name"
                        :value="dictionary.data"
                    />
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
                >重置
                </el-button
                >
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
                    v-hasPermi="['system:drug:add']"
                >新增
                </el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="info"
                    plain
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
                    v-hasPermi="['system:user:import']"
                >导入
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
            <!--          v-hasPermi="['system:drug:edit']"-->
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
            <!--          v-hasPermi="['system:drug:remove']"-->
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
            <!--          v-hasPermi="['system:drug:export']"-->
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
            :data="drugList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column
                label="药品类型"
                align="center"
                prop="drugType"
                :formatter="statusType"
            />
            <el-table-column label="药品名称" align="center" prop="drugName"/>
            <el-table-column label="药品编码" align="center" prop="drugCode"/>
            <el-table-column
                label="药品拼音码"
                align="center"
                prop="speedyCodePinyin"
            />
            <el-table-column label="药品单位" align="center" prop="drugUnit"/>
            <!--      :formatter="dosageFormat"-->
            <el-table-column prop="dosageForm" label="药品剂型" width="100"></el-table-column>
            <el-table-column label="产地名称" align="center" prop="drugOrigin"/>
            <el-table-column label="平台价格" align="center" prop="platPrice"/>
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
                        v-hasPermi="['system:drug:edit']"
                    >修改
                    </el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleExcludeDrug(scope.row)"
                        v-hasPermi="['system:drug:query']"
                    >互斥药品
                    </el-button
                    >

                    <!--          <el-button-->
                    <!--            size="mini"-->
                    <!--            type="text"-->
                    <!--            icon="el-icon-delete"-->
                    <!--            @click="handleDelete(scope.row)"-->
                    <!--            v-hasPermi="['system:drug:remove']"-->
                    <!--            >删除</el-button-->
                    <!--          >-->
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

        <!-- 添加或修改平台药品对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="药品类型" prop="drugType">
                            <el-select
                                v-model="form.drugType"
                                placeholder="药品类型"
                                clearable
                                size="small"
                            >
                                <el-option
                                    v-for="dictionary in typeOptions"
                                    :key="dictionary.data"
                                    :label="dictionary.name"
                                    :value="dictionary.data"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称" prop="tradeName">
                            <el-input v-model="form.tradeName" placeholder="请输入商品名称"/>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="药品名称" prop="drugName">
                            <el-input v-model="form.drugName" placeholder="请输入药品名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="药品剂型" prop="dosageForm">
                            <el-select
                                v-model="form.dosageForm"
                                placeholder="请输入药品剂型"
                                clearable
                                size="small"
                            >
                                <el-option
                                    v-for="dictionary in jixingOptions"
                                    :key="dictionary.name"
                                    :label="dictionary.name"
                                    :value="dictionary.name"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="药品编号" prop="drugCode">
                            <el-input v-model="form.drugCode" placeholder="请输入药品编号"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="药品包装单位" prop="drugUnit">
                            <el-select
                                v-model="form.drugUnit"
                                placeholder="请输入药品包装单位"
                                clearable
                                size="small"
                            >
                                <el-option
                                    v-for="dictionary in danweiOptions"
                                    :key="dictionary.name"
                                    :label="dictionary.name"
                                    :value="dictionary.name"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="剂量单位" prop="dosageUnit">
                            <el-select
                                v-model="form.dosageUnit"
                                placeholder="请输入剂量单位"
                                clearable
                                size="small"
                            >
                                <el-option
                                    v-for="dictionary in jiliangOptions"
                                    :key="dictionary.name"
                                    :label="dictionary.name"
                                    :value="dictionary.name"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="药品用法" prop="drugAdmission">
                            <el-select
                                v-model="form.drugAdmission"
                                placeholder="请输入药品用法"
                                clearable
                                size="small"
                            >
                                <el-option
                                    v-for="dictionary in yongOptions"
                                    :key="dictionary.name"
                                    :label="dictionary.name"
                                    :value="dictionary.name"
                                />
                            </el-select>
                        </el-form-item>


                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="平台价格" prop="platPrice">
                            <el-input placeholder="请输入平台价格" v-model="form.platPrice">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <!-- <el-form-item label="药品产地" prop="drugOrigin">
                          <el-input
                            v-model="form.drugOrigin"
                            placeholder="请输入药品产地"
                          />
                        </el-form-item> -->
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="药品产地" prop="drugOrigin">
                            <el-input
                                v-model="form.drugOrigin"
                                placeholder="请输入药品产地"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="药品规格" prop="drugSpecification">
                            <el-input
                                v-model="form.drugSpecification"
                                placeholder="请输入药品规格"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="拼音码" prop="speedyCodePinyin">
                            <el-input
                                v-model="form.speedyCodePinyin"
                                placeholder="请输入拼音码"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="五笔码" prop="speedyCodeWubi">
                            <el-input
                                v-model="form.speedyCodeWubi"
                                placeholder="请输入五笔码"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="药品英文名" prop="drugEnglishName">
                            <el-input
                                v-model="form.drugEnglishName"
                                placeholder="请输入药品英文名"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="其他码" prop="speedyCodeOther">
                            <el-input
                                v-model="form.speedyCodeOther"
                                placeholder="请输入其他码"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                  <el-form-item label="开方科室" prop="field101">
                    <el-select v-model="formData.field101" placeholder="请选择开方科室" multiple clearable
                      :style="{width: '100%'}">

                      <el-option v-for="(item, index) in field101Options" :key="index" :label="item.label"
                        :value="item.value" :disabled="item.disabled"></el-option>

                    </el-select>
                  </el-form-item>
                </el-row>-->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="高储值" prop="highStorage">
                            <el-input v-model="form.highStorage" placeholder="请输入高储值"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="低储值" prop="lowStorage">
                            <el-input v-model="form.lowStorage" placeholder="请输入低储值"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="药品描述" prop="description">
                        <el-input
                            v-model="form.description"
                            type="textarea"
                            placeholder="请输入内容"
                        />
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="药品说明" prop="drugExplain">
                        <el-input
                            v-model="form.drugExplain"
                            type="textarea"
                            placeholder="请输入内容"
                        />
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 药品互斥页-->
        <el-dialog :title="title" :visible.sync="openExcludeDrug" width="1000px" append-to-body>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                        type="primary"
                        plain
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleExcludeDrugByAdd"
                        v-hasPermi="['system:drug:query']"
                    >新增互斥药品
                    </el-button
                    >
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        type="danger"
                        plain
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['system:drug:remove']"
                    >批量删除
                    </el-button
                    >
                </el-col>
                <right-toolbar
                    :showSearch.sync="showSearch"
                    @queryTable="getListExcludeDrug"
                ></right-toolbar>
            </el-row>

            <el-table
                v-loading="loading"
                :data="excludeDrugList"
                @selection-change="handleSelectionChange1"
            >
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="药品编码" align="center" prop="drugCode"/>
                <el-table-column label="药品名称" align="center" prop="drugName"/>
                <el-table-column
                    label="药品拼音码"
                    align="center"
                    prop="speedyCodePinyin"
                />
                <el-table-column
                    label="操作"
                    align="center"
                    class-name="small-padding fixed-width"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:drug:remove']"
                        >删除
                        </el-button
                        >
                    </template>
                </el-table-column>
            </el-table>

            <pagination
                v-show="totalExcludeDrug > 0"
                :total="totalExcludeDrug"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getListExcludeDrug"
            />

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelExcludeDrug">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 互斥药品页 新增|修改 对话框 -->
        <el-dialog :title="titleExcludeDrugAdd" :visible.sync="openExcludeDrugByAdd" width="1000px" append-to-body>
            <el-form ref="form" :model="form" :inline="true" v-show="showSearch" label-width="90px">
                <el-form-item label="药品编码" prop="drugCode">
                    <el-input
                        v-model="drugCode"
                        placeholder="请输入药品编码"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="药品名称" prop="drugName">
                    <el-input
                        v-model="drugName"
                        placeholder="请输入药品名称"
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
                        @click="getListExcludeDrugByLike"
                    >搜索
                    </el-button
                    >
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQueryExcludeDrugByAdd"
                    >重置
                    </el-button
                    >
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                        type="danger"
                        plain
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple2"
                        @click="handleExcludeDrugBatchAdd"
                        v-hasPermi="['system:drug:edit']"
                    >新增
                    </el-button
                    >
                </el-col>
                <right-toolbar
                    :showSearch.sync="showSearch"
                    @queryTable="excludeDrugListByAdd"
                ></right-toolbar>
            </el-row>


            <el-table
                v-loading="loading"
                :data="excludeDrugListByAdd"
                @selection-change="handleSelectionChange2"
            >
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="药品编码" align="center" prop="drugCode"/>
                <el-table-column label="药品名称" align="center" prop="drugName"/>
                <el-table-column
                    label="药品拼音码"
                    align="center"
                    prop="speedyCodePinyin"
                />
            </el-table>

            <pagination
                v-show="totalExcludeDrugByAdd > 0"
                :total="totalExcludeDrugByAdd"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="excludeDrugListByAdd"
            />

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelExcludeDrugByAdd">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
            <el-upload
                ref="upload"
                :limit="1"
                accept=".xlsx, .xls"
                :headers="upload.headers"
                :disabled="upload.isUploading"
                :action="upload.url"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :auto-upload="false"
                drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    <!--                    <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据-->
                    <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import {
    listDrug,
    getDrug,
    addDrug,
    updateDrug,
    exportDrug,
    getDrugExclusionList, updateRecipeDrugExclude, deleteRecipeDrugExclude,
    importTemplate
} from '@/api/yiliao/recipe/drug'
import { getDictionarys, listDictionary } from '@/api/system/dictionary'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getToken } from '@/utils/auth'

export default {
    name: 'Drug',
    components: {
        Treeselect
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
            // 状态数据字典
            statusOptions: [],
            // 总条数
            total: 0,
            // 平台药品表格数据
            drugList: [],
            typeOptions: [],
            //药品剂型
            jixingOptions: [],
            //药品包装单位
            danweiOptions: [],
            //剂量单位
            jiliangOptions: [],
            //药品用法
            yongOptions: [],
            // 弹出层标题
            title: '',
            // 用户导入参数
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: '',
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                // updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: 'Bearer ' + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + '/system/drug/importData'
            },
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                id: null,
                queryCode: null,
                drugName: null,
                drugType: null,
                fgActive: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                fgActive: [
                    { required: true, message: '是否有效不能为空', trigger: 'blur' }
                ],
                drugType: [{
                    required: true,
                    message: '请选择药品类型',
                    trigger: 'change'
                }],
                drugName: [{
                    required: true,
                    message: '请输入药品名称',
                    trigger: 'blur'
                }],
                drugCode: [{
                    required: true,
                    message: '请输入药品编号',
                    trigger: 'blur'
                }],
                drugAdmission: [{
                    required: true,
                    message: '请选择药品用法',
                    trigger: 'change'
                }],
                speedyCodePinyin: [{
                    required: true,
                    message: '请输入药品请输入药品拼音码',
                    trigger: 'blur'
                }]
            },
            /** 互斥药品页*/
            openExcludeDrug: null,
            // 互斥页中的 新增 修改按钮
            openExcludeDrugByAdd: null,
            //互斥药品列表
            excludeDrugList: [],
            //互斥药品列表总条数
            totalExcludeDrug: 0,
            id: null,
            //互斥药品新增页列表
            excludeDrugListByAdd: [],
            totalExcludeDrugByAdd: 0,
            titleExcludeDrugAdd: '',
            drugName: null,
            drugNameExclude: null,
            drugCode: null,
            ids2: [],
            single2: true,
            multiple2: true
        }
    },
    created() {
        this.getList()

        getDictionarys('sys_normal_disable').then((response) => {
            this.statusOptions = response.data
        })
        getDictionarys('api_recipe_type').then((response) => {
            this.typeOptions = response.data
        })
        //药品剂型
        listDictionary({ code: 'dict.drugFormulation', isData: '1' }).then((response) => {
            this.jixingOptions = response.data
        })
        //药品包装单位
        listDictionary({ code: 'dict.drugPackSpecificationUnit', isData: '1' }).then((response) => {
            this.danweiOptions = response.data
        })
        //剂量单位
        listDictionary({ code: 'dict.drugRemindUnit', isData: '1' }).then((response) => {
            this.jiliangOptions = response.data
        })
        //药品用法
        listDictionary({ code: 'dict.drugUsePathwaysCodeChina', isData: '1' }).then((response) => {
            this.yongOptions = response.data
        })

    },
    methods: {
        /** 查询平台药品列表 */
        getList() {
            this.loading = true
            listDrug(this.queryParams).then((response) => {
                this.drugList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        // 字典状态字典翻译
        statusType(row, column) {
            return this.selectDictLabel(this.typeOptions, row.drugType)
        },

        // 药品剂型字典状态字典翻译
        // dosageFormat(row, column) {
        //   return this.selectDictLabel(this.jixingOptions, row.dosageForm);
        // },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                drugName: null,
                drugType: null,
                drugCode: null,
                drugEnglishName: null,
                drugSpecification: null,
                drugUnit: null,
                dosageUnit: null,
                drugAdmission: null,
                drugOrigin: null,
                dosageForm: null,
                platPrice: null,
                platInventory: null,
                speedyCodePinyin: null,
                speedyCodeWubi: null,
                speedyCodeOther: null,
                description: null,
                highStorage: null,
                lowStorage: null,
                fgActive: null,
                dtCreate: null,
                createrId: null,
                createrType: null,
                dtModify: null,
                dosage: null,
                tag: null,
                drugExplain: null
            }
            this.resetForm('form')
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm')
            this.handleQuery()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        // 多选框选中数据
        handleSelectionChange1(selection) {
            this.ids = selection.map((item) => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        // 多选框选中数据
        handleSelectionChange2(selection) {
            this.ids2 = selection.map((item) => item.id)
            this.single2 = selection.length !== 1
            this.multiple2 = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            this.open = true
            this.title = '添加平台药品'
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            getDrug(id).then((response) => {
                this.form = response.data
                this.open = true
                this.title = '修改平台药品'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateDrug(this.form).then((response) => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        addDrug(this.form).then((response) => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.getList()
                        })
                    }
                }
            })
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids
            const id = this.id
            this.$confirm(
                '是否确认删除药品编号为"' + ids + '"的数据项?',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(function() {
                    return deleteRecipeDrugExclude(id, ids)
                })
                .then(() => {
                    this.getListExcludeDrug()
                    this.msgSuccess('删除成功')
                })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有平台药品数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(function() {
                    return exportDrug(queryParams)
                })
                .then((response) => {
                    this.download(response.msg)
                })
        },
        handleStatusChange(row) {
            let text = row.fgActive === '1' ? '启用' : '停用'
            this.$confirm(
                '确认要"' + text + '""' + row.drugName + '"分类吗?',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(function() {
                    return updateDrug(row)
                })
                .then(() => {
                    this.msgSuccess(text + '成功')
                })
                .catch(function() {
                    row.fgActive = row.fgActive === '0' ? '1' : '0'
                })
        },
        //互斥药品按钮
        handleExcludeDrug(row) {
            this.reset()
            this.id = row.id
            this.drugName = row.drugName
            this.drugCode = row.drugCode
            this.getListExcludeDrug()
            this.title = row.drugName + '互斥药品列表'
            this.openExcludeDrug = true
        },

        // 互斥药品列表
        getListExcludeDrug() {
            this.loading = true
            this.queryParams.id = this.id
            this.drugName = null
            this.drugCode = null
            this.queryParams.drugName = null
            this.queryParams.drugCode = null
            this.queryParams.fgActive = '1'
            this.queryParams.pageNum = 1
            getDrugExclusionList(this.queryParams).then((response) => {
                this.excludeDrugList = response.rows
                this.totalExcludeDrug = response.total
                this.loading = false
            })
        },
        // 互斥列表搜索按钮  模糊查询
        getListExcludeDrugByLike() {
            this.queryParams.id = this.id
            this.queryParams.drugName = this.drugName
            this.queryParams.drugCode = this.drugCode
            this.queryParams.fgActive = '0'
            getDrugExclusionList(this.queryParams).then((response) => {
                this.excludeDrugListByAdd = response.rows
                this.totalExcludeDrugByAdd = response.total
            })
        },
        // 互斥药品页 取消按钮
        cancelExcludeDrug() {
            this.openExcludeDrug = false
            this.reset()
        },
        //互斥药品 新增按钮
        handleExcludeDrugByAdd() {
            const selectParam = {
                'id': this.id,
                'fgActive': '0'
            }
            getDrugExclusionList(selectParam).then((response) => {
                this.excludeDrugListByAdd = response.rows
                this.totalExcludeDrugByAdd = response.total
                this.loading = false
            })
            this.openExcludeDrugByAdd = true
            this.titleExcludeDrugAdd = '添加互斥药品'
            this.drugName = null
            this.drugCode = null
        },
        // 互斥药品页 新增按钮中的取消按钮
        cancelExcludeDrugByAdd() {
            this.openExcludeDrugByAdd = false
            //const selectId = {id:this.id};
            //this.getListExcludeDrug(selectId);
            this.reset()
        },
        /** 批量添加 */
        handleExcludeDrugBatchAdd(row) {
            const ids = row.id || this.ids2
            const id = this.id
            this.$confirm(
                '是否确认添加药品编号为"' + ids + '"的数据项?',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(function() {
                return updateRecipeDrugExclude(id, ids)
            }).then(() => {
                this.getListExcludeDrug()
                this.msgSuccess('添加成功')
                this.openExcludeDrugByAdd = false
            })
        },
        /** 重置按钮操作 */
        resetQueryExcludeDrugByAdd() {
            this.queryParams.id = this.id
            this.drugName = null
            this.drugCode = null
            this.queryParams.drugName = null
            this.queryParams.drugCode = null
            this.queryParams.fgActive = '0'
            this.queryParams.pageNum = 1
            getDrugExclusionList(this.queryParams).then((response) => {
                this.excludeDrugListByAdd = response.rows
                this.totalExcludeDrugByAdd = response.total
            })
        },
        /** 下载模板操作 */
        importTemplate() {
            importTemplate().then(response => {
                this.download(response.msg)
            })
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false
            this.upload.isUploading = false
            this.$refs.upload.clearFiles()
            this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
            this.getList()
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit()
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = '药品导入'
            this.upload.open = true
        }
    }
}
</script>
