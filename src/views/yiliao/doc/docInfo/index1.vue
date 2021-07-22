<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="医生名称" prop="docName">
                <el-input
                    v-model="queryParams.docName"
                    placeholder="请输入医生名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="所属医院" prop="hosId">
                <el-select
                    v-model="queryParams.hosId"
                    ref="clearSelect"
                    placeholder="所属医院"
                    clearable
                    size="small"
                    filterable
                    default-first-option
                >
                    <el-option
                        v-for="dictionary in hosIdOptions"
                        :key="dictionary.hosId"
                        :label="dictionary.hosName"
                        :value="dictionary.hosId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属科室" prop="deptId">
                <el-select
                    v-model="queryParams.deptId"
                    placeholder="所属科室"
                    clearable
                    size="small"
                    filterable
                    default-first-option
                >
                    <el-option
                        v-for="dictionary in deptIdOptions"
                        :key="dictionary.deptId"
                        :label="dictionary.deptName"
                        :value="dictionary.deptId"
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
                    v-hasPermi="['api:docInfo:add']"
                >新增
                </el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['api:docInfo:edit']"
                >修改
                </el-button
                >
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['api:docInfo:remove']"
              >删除</el-button>
            </el-col> -->
            <!--      <el-col :span="1.5">-->
            <!--        <el-button-->
            <!--          type="warning"-->
            <!--          plain-->
            <!--          icon="el-icon-download"-->
            <!--          size="mini"-->
            <!--          @click="handleExport"-->
            <!--          v-hasPermi="['system:docInfo:export']"-->
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
            :data="docInfoList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="医生姓名" align="center" prop="docName"/>
            <el-table-column label="医生头像" align="center" prop="docAvatar">
                <template slot-scope="scope">
                    <img :src="scope.row.docAvatar" style="width: 70px; height: 70px"/>
                </template>
            </el-table-column>
            <el-table-column label="医生性别" align="center" prop="docGender"/>
            <el-table-column label="医院" align="center" prop="hosName"/>
            <el-table-column label="医院科室" align="center" prop="deptName"/>
            <el-table-column label="门诊时间" align="center" prop="outpatientTime"/>
            <el-table-column label="医生职称" align="center" prop="docTitle"/>
            <!-- <el-table-column label="医生类型" align="center" prop="docType" /> -->
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
                    <span>{{ parseTime(scope.row.dtCreate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                min-width="120"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['api:docInfo:edit']"
                    >详情
                    </el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="passwordUpdate(scope.row)"
                    >修改密码
                    </el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="gonggaoUpdate(scope.row)"
                    >医生公告
                    </el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="guahaoUpdate(scope.row)"
                    >绑定挂号医生
                    </el-button
                    >
                    <!--          <el-button-->
                    <!--            size="mini"-->
                    <!--            type="text"-->
                    <!--            icon="el-icon-edit"-->
                    <!--            @click="wangUpdate(scope.row)"-->
                    <!--          >绑定网络门诊医生</el-button-->
                    <!--          >-->
                    <!-- <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['api:docInfo:remove']"
                    >删除</el-button> -->
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

        <!-- 添加或医生对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属医院" prop="hosId">
                            <el-select
                                v-model="form.hosId"
                                placeholder="所属医院"
                                clearable
                                size="small"
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
                        <el-form-item label="所属科室" prop="deptId">
                            <el-select
                                v-model="form.deptId"
                                placeholder="所属科室"
                                clearable
                                size="small"
                                filterable
                                default-first-option
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
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="医生姓名" prop="docName">
                            <el-input v-model="form.docName" placeholder="请输入药师名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="医生职称" prop="docTitle">
                            <el-select
                                v-model="form.docTitle"
                                placeholder="医生职称"
                                clearable
                                size="small"
                                filterable
                                default-first-option
                            >
                                <el-option
                                    v-for="dictionary in doctorTitle"
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
                        <el-form-item label="处方权限" prop="recipeAuth">
                            <el-radio v-model="recipeAuth" label="OPEN">开处方</el-radio>
                            <el-radio v-model="recipeAuth" label="AUDIT">审核处方</el-radio>
                            <!--              <el-checkbox-group v-model="recipeAuth" size="medium">-->
                            <!--                <el-checkbox-->
                            <!--                  v-for="(item, index) in field101Options"-->
                            <!--                  :key="index"-->
                            <!--                  :label="item.value"-->
                            <!--                  >{{ item.label }}</el-checkbox-->
                            <!--                >-->
                            <!--              </el-checkbox-group>-->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="业务查询权限"
                            prop="bizAuth"
                            label-width="110px"
                        >
                            <el-checkbox-group v-model="bizAuth" size="medium">
                                <el-checkbox
                                    v-for="(item, index) in options"
                                    :key="index1"
                                    :label="item.value"
                                >{{ item.label }}
                                </el-checkbox
                                >
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="证件号码" prop="docCardNo">
                    <el-input
                        v-model="form.docCardNo"
                        placeholder="请输入证件号码"
                        @blur="getName(form.docCardNo)"
                    />
                </el-form-item>

                <el-form-item label="性别" prop="docGender">
                    <el-input v-model="form.docGender" placeholder="" :disabled="true"/>
                </el-form-item>

                <el-form-item label="医生头像" prop="docAvatar">
                    <el-upload
                        action
                        list-type="picture-card"
                        :before-upload="adUrlBeforeUpload"
                        :http-request="uploadImage"
                        name="file"
                        :show-file-list="false"
                        :headers="headers"
                        style="display: inline-block; vertical-align: top"
                    >
                        <el-image v-if="!docAvatar" :src="docAvatar">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-plus"/>
                            </div>
                        </el-image>
                        <div v-else class="image">
                            <el-image :src="docAvatar" :style="`width:150px;height:150px;`" fit="fill"/>
                            <div class="mask">
                                <div class="actions">
                  <span title="预览" @click.stop="dialogVisible = true">
                    <i class="el-icon-zoom-in"/>
                  </span>
                                    <span title="移除" @click.stop="removeImage">
                    <i class="el-icon-delete"/>
                  </span>
                                </div>
                            </div>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
                        <img :src="docAvatar" style="display: block; max-width: 100%; margin: 0 auto;"/>
                    </el-dialog>

                </el-form-item>

                <el-form-item label="医生擅长" prop="docGoodat">
                    <el-input
                        v-model="form.docGoodat"
                        type="textarea"
                        placeholder="请输入医生擅长"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        :style="{ width: '100%' }"
                    ></el-input>
                </el-form-item>
                <el-form-item label="医生介绍" prop="docDes">
                    <el-input
                        v-model="form.docDes"
                        type="textarea"
                        placeholder="请输入医生介绍"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        :style="{ width: '100%' }"
                    ></el-input>
                </el-form-item>
                <el-form-item label="门诊时间" prop="outpatientTime">
                    <el-input
                        v-model="form.outpatientTime"
                        type="textarea"
                        placeholder="请输入门诊时间"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        :style="{ width: '100%' }"
                    ></el-input>
                </el-form-item>

                <el-form-item label="医生手机号" prop="docMobile">
                    <el-input v-model="form.docMobile" placeholder="请输入医生手机号"/>
                </el-form-item>

                <el-form-item label="初始密码">
                    <el-input placeholder="123456" :disabled="true"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!--  修改密码  -->
        <el-dialog :title="title" :visible.sync="open2" width="700px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="密码" prop="docPwd">
                    <el-input type="password" v-model="form.docPwd" placeholder="密码需8至20位，包括字母和数字"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!--   医生公告-->
        <el-dialog :title="title" :visible.sync="open3" width="700px" append-to-body>
            <div v-if="form2">
                <div class="one" style="border-bottom: 1px solid #E7EAEC;">
                    <p>停诊公告</p>
                    <p>停诊开始时间： {{ parseTime(form2.noticeStartDate) }} 停诊结束时间： {{ parseTime(form2.noticeEndDate) }}</p>
                    <p>{{ form2.content }}</p>
                </div>
            </div>
            <div v-else>
                <div class="one" style="border-bottom: 1px solid #E7EAEC;">
                    <p>停诊公告</p>
                    <p>该医生没有发布停诊公告</p>
                </div>
            </div>
            <div v-if="form3">
                <div class="one">
                    <p>普通公告</p>
                    <p>{{ form3.content }}</p>
                </div>
            </div>
            <div v-else>
                <div class="one">
                    <p>普通公告</p>
                    <p>该医生没有发布停诊公告</p>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!--  绑定挂号医生  -->
        <el-dialog :title="title" :visible.sync="open4" width="1400px" append-to-body>
            <el-form
                :model="queryParams"
                ref="queryForm"
                :inline="true"
                v-show="showSearch"
                label-width="68px"
            >
                <el-form-item label="医生名称" prop="docName">
                    <el-input
                        v-model="queryParams.docName"
                        placeholder="请输入医生名称"
                        clearable
                        size="small"
                        @keyup.enter.native="guahaoUpdate"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="guahaoUpdate"
                    >搜索
                    </el-button
                    >
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery1"
                    >重置
                    </el-button
                    >
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="form4" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="医生姓名" align="center" prop="docName"/>
                <el-table-column label="所属医院" align="center" prop="hosName"/>
                <el-table-column label="所属科室" align="center" prop="deptName"/>
                <el-table-column label="医生职称" align="center" prop="docTitle"/>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!--  绑定网络门诊医生  -->
        <!--    <el-dialog :title="title" :visible.sync="open5" width="1400px" append-to-body>-->
        <!--      <el-table v-loading="loading" :data="form5" @selection-change="handleSelectionChange">-->
        <!--        <el-table-column label="医生姓名" align="center" prop="docName" />-->
        <!--        <el-table-column label="所属医院" align="center" prop="hosName" />-->
        <!--        <el-table-column label="所属科室" align="center" prop="deptName" />-->
        <!--        <el-table-column label="医生职称" align="center" prop="docTitle" />-->
        <!--      </el-table>-->
        <!--      <div slot="footer" class="dialog-footer">-->
        <!--        <el-button @click="cancel">取 消</el-button>-->
        <!--      </div>-->
        <!--    </el-dialog>-->
    </div>
</template>

<script>
import {
    listDocInfo,
    getDocInfo,
    delDocInfo,
    addDocInfo,
    updateDocInfo,
    exportDocInfo,
    updatePassword, //修改密码
    lookGongInfo, //查询公告
    bangdingInfo, //绑定挂号医生
    menzhenInfo //绑定网络门诊医生
} from '@/api/yiliao/doc/docInfo'
import { getDictionarys, listDictionary } from '@/api/system/dictionary'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listHosData } from '@/api/yiliao/base/hosData'
import { listBookDept } from '@/api/yiliao/book/bookDept'
import { uploadFile } from '@/api/monitor/upload'
//上传并修改
import { getToken } from '@/utils/auth'

export default {
    name: 'Setting',
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
            recipeAuth: '', //处方权限
            bizAuth: [], //业务查询权限
            // 总条数
            total: 0,
            // 系统_广告_设置表格数据
            docInfoList: [],
            deptIdOptions: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            open2: false,
            open3: false,
            open4: false,
            open5: false,
            // 所属医院
            hosIdOptions: [],
            // 文件上传
            fileList: [],
            docAvatar: null,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                docName: null,
                createTime: null,
                updateTime: null,
                fg_active: null
            },
            // 表单参数
            form: {},
            form2: {},  //停诊公告
            form3: {},  //普通公告
            form4: [], //绑定挂号医生
            form5: [], //绑定网络门诊医生
            // 表单校验
            rules: {
                //下拉框
                hosId: [
                    {
                        required: true,
                        message: '请选择医院',
                        trigger: 'change'
                    }
                ],
                deptId: [
                    {
                        required: true,
                        message: '请选择科室',
                        trigger: 'change'
                    }
                ],
                //文本
                docName: [
                    {
                        required: true,
                        message: '请输入医生姓名',
                        trigger: 'blur'
                    }
                ],
                docGoodat: [
                    {
                        required: true,
                        message: '请输入医生擅长',
                        trigger: 'blur'
                    }
                ],
                docDes: [
                    {
                        required: true,
                        message: '请输入医生介绍',
                        trigger: 'blur'
                    }
                ],
                docMobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^1(3|4|5|7|8|9)\d{9}$/,
                        message: '手机号格式错误',
                        trigger: 'blur'
                    }
                ],
                docCardNo: [
                    {
                        required: true,
                        message: '请输入身份证ID',
                        trigger: 'blur'
                    },
                    {
                        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                        message: '请输入合法的身份证号码'
                    }
                ],
                docPwd: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                ]
            },
            //处方权限
            field101Options: [
                {
                    label: '开处方',
                    value: 'OPEN'
                },
                {
                    label: '审核处方',
                    value: 'AUDIT'
                }
            ],
            //业务查询权限
            options: [
                {
                    label: '业务查询',
                    value: 1
                }
            ],

            //医生职称字典
            doctorTitle: [],

            //上传并修改
            dialogVisible: false,
            // uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
            uploadImgUrl:
                'http://qiniu.ctjk.net/2021-04-30 14:49:11_nAxytnj_18ouuV.jpg', // 上传的图片服务器地址
            headers: {
                Authorization: 'Bearer ' + getToken()
            }

        }
    },
    created() {
        this.getList()
        listHosData().then((response) => {
            this.hosIdOptions = response.rows
        })

        listBookDept().then((response) => {
            this.deptIdOptions = response.rows
        })

        getDictionarys('doc_data_type').then((response) => {
            console.log
            this.doctorTitle = response.data
        })
    },

    //上传并修改
    props: {
        value: {
            type: String,
            default: ''
        }
    },

    methods: {
        // 上传并修改
        removeImage() {
            this.$emit('input', '')
            this.docAvatar = ''
        },
        handleUploadSuccess(res) {
            this.$emit('input', res.url)
            this.loading.close()
        },
        handleBeforeUpload() {
            this.loading = this.$loading({
                lock: true,
                text: '上传中',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        },
        handleUploadError() {
            this.$message({
                type: 'error',
                message: '上传失败'
            })
            this.loading.close()
        },

        /** 查询医生列表 */
        getList() {
            this.loading = true
            listDocInfo(this.queryParams).then((response) => {
                this.docInfoList = response.data.list
                this.total = response.data.total
                this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.open2 = false
            this.open3 = false
            this.open4 = false
            this.open5 = false
            this.reset()
        },
        change($event) {
            this.$refs.clearSelect.query = ''
            this.$emit('change', $event)
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                key: null,
                docAvatar: null,
                createTime: null,
                createBy: null,
                updateTime: null,
                updateBy: null,
                fgActive: null,
                hosId: null,
                deptId: null,
                docGender: null, //性别
                recipeAuth: '', //处方权限
                bizAuth: [], //业务查询权限
                doctorTitle: null //医生职称
            }
            this.resetForm('form')
        },
        /** 转换字典数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children
            }
            return {
                id: node.id,
                label: node.name,
                children: node.children
            }
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

        /** 重置按钮操作 */
        resetQuery1() {
            this.resetForm('queryForm')
            this.guahaoUpdate()
        },
        //绑定医生公告搜索按钮操作
        handleQueryBySecondLevel() {
            this.guahaoUpdate()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            // this.getTreeselect();
            this.open = true
            this.getList()
            this.fileList = []
            this.title = '添加医生'

            this.docAvatar = null
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            getDocInfo(id).then((response) => {
                this.form = response.data
                // 处方权限
                this.recipeAuth = response.data.recipeAuth
                // 业务查询权限
                let a = response.data.bizAuth
                if (a == undefined || a == 0) {
                    this.bizAuth = []
                } else {
                    this.bizAuth = [a]
                }

                if (response.data.docAvatar != null) {
                    this.docAvatar = response.data.docAvatar
                    this.fileList = [{ name: 'food.jpg', url: response.data.docAvatar }]
                }
                if (response.data.docAvatar == null) {
                    this.fileList = []
                }
                this.open = true
                this.title = '修改医生信息'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        this.form.docAvatar = this.docAvatar
                        this.form.dtModify = null
                        this.form.dtCreate = null
                        this.form.recipeAuth = this.recipeAuth
                        this.form.bizAuth = Number(this.bizAuth.join(','))
                        updateDocInfo(this.form).then((response) => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.open2 = false
                            this.getList()
                            this.bizAuth = []
                            this.recipeAuth = ''
                        })
                    } else {
                        var chufang = this.recipeAuth
                        var chufang2 = chufang.toString()

                        var yewu = 1
                        if (
                            this.form.bizAuth == null ||
                            this.form.bizAuth == '' ||
                            this.form.bizAuth == undefined
                        ) {
                            var yewu = 0
                        }
                        var yewu2 = yewu.toString()

                        this.form.docAvatar = this.docAvatar
                        this.form.docType = 'DOC'
                        this.form.recipeAuth = chufang2
                        this.form.bizAuth = yewu2
                        addDocInfo(this.form).then((response) => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.open2 = false
                            this.getList()
                        })
                    }
                }
            })
        },
        //修改密码
        passwordUpdate(row) {
            console.log(row, 888)
            this.reset()
            // this.getName(row.cardNo)
            // this.cardType = this.cardType;
            const id = row.id || this.ids
            getDocInfo(id).then((response) => {
                this.form = response.data
                console.log(this.form.docPwd, 999)

                // this.form.docPwd = null;  //清空密码
                // if (response.data.avatar != null) {
                //   this.avatar = response.data.avatar;
                //   this.fileList = [{ name: "food.jpg", url: response.data.avatar }];
                // }
                // if (response.data.avatar == null) {
                //   this.fileList = [];
                // }
                this.open2 = true
                this.title = row.docName + '密码 密码修改'
            })

        },
        //修改密码提交
        submitForm2() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        this.form.avatar = this.avatar
                        console.log(this.form.id, 444)
                        updatePassword(this.form.id).then((response) => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.open2 = false
                            this.getList()
                        })
                    } else {
                        var chufang = this.form.recipeAuth
                        var chufang2 = chufang.toString()

                        var yewu = 1
                        if (
                            this.form.bizAuth == null ||
                            this.form.bizAuth == '' ||
                            this.form.bizAuth == undefined
                        ) {
                            var yewu = 0
                        }
                        var yewu2 = yewu.toString()

                        this.form.avatar = this.avatar
                        this.form.docType = 'DOC'
                        this.form.recipeAuth = chufang2
                        this.form.bizAuth = yewu2
                        addDocInfo(this.form).then((response) => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.open2 = false
                            this.getList()
                        })
                    }
                }
            })

        },
        //查询公告
        gonggaoUpdate(row) {
            this.open3 = true
            //停诊公告
            lookGongInfo({ id: row.id, noticeType: 'STOPPING' }).then((response) => {
                this.form2 = response.rows[0]
            })
            //普通公告
            lookGongInfo({ id: row.id, noticeType: 'COMMON' }).then((response) => {
                this.form3 = response.rows[0]
            })

        },
        //绑定挂号医生
        guahaoUpdate(row) {
            this.open4 = true
            this.resetForm('queryForm')
            this.queryParams.docName = row.docName
            bangdingInfo(this.queryParams).then((response) => {
                this.form4 = response.rows
            })
        },
        //绑定网络门诊医生
        wangUpdate(row) {
            this.open5 = true
            console.log(row, 666)
            menzhenInfo().then((response) => {
                console.log(response, 999)
                this.form5 = response.rows
            })
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids
            this.$confirm('是否确认删除"' + ids + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(function() {
                    return delDocInfo(ids)
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有数据?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(function() {
                    return exportDocInfo(queryParams)
                })
                .then((response) => {
                    this.download(response.msg)
                })
        },
        handleStatusChange(row) {
            let text = row.fgActive === '1' ? '启用' : '停用'
            this.$confirm('确认要"' + text + '""' + row.docName + '"吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(function() {
                    return updateDocInfo(row)
                })
                .then(() => {
                    this.msgSuccess(text + '成功')
                })
                .catch(function() {
                    row.fgActive = row.fg_active === '0' ? '1' : '0'
                })
        },
        adUrlBeforeUpload(file) {
            let isRightSize = file.size / 1024 / 1024 < 1
            if (!isRightSize) {
                this.$message.error('文件大小超过 1MB')
            }
            let isAccept = new RegExp('image/*').test(file.type)
            if (!isAccept) {
                this.$message.error('应该选择image/*类型的文件')
            }
            return isRightSize && isAccept
        },
        uploadImage(param) {
            const formData = new FormData()
            formData.append('file', param.file)
            uploadFile(formData)
                .then((response) => {
                    console.log(response, '上传图片成功')
                    this.docAvatar = response.data
                    param.onSuccess() // 上传成功的图片会显示绿色的对勾
                })
                .catch((response) => {
                    console.log('图片上传失败')
                    param.onError()
                })
        },
        getName(iden) {
            let val = iden.length
            let sex = null
            let myDate = new Date()
            let month = myDate.getMonth() + 1
            let day = myDate.getDate()
            let age = 0

            if (val === 18) {
                age = myDate.getFullYear() - iden.substring(6, 10) - 1
                sex = iden.substring(16, 17)
                if (
                    iden.substring(10, 12) < month ||
                    (iden.substring(10, 12) == month && iden.substring(12, 14) <= day)
                ) {
                    age++
                }
            }
            if (val === 15) {
                age = myDate.getFullYear() - iden.substring(6, 8) - 1901
                sex = iden.substring(13, 14)
                if (
                    iden.substring(8, 10) < month ||
                    (iden.substring(8, 10) == month && iden.substring(10, 12) <= day)
                ) {
                    age++
                }
            }
            if (sex % 2 === 0) {
                sex = '女'
            } else {
                sex = '男'
            }
            console.log(sex, 6677)
            if (val > 17) {
                this.form.docGender = sex
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">

// 上传并修改
.image {
    position: relative;

    .mask {
        opacity: 0;
        position: absolute;
        top: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all 0.3s;
    }

    &:hover .mask {
        opacity: 1;
    }
}

.one {
    text-align: center;
    font-size: 15px;
}

.one p:nth-child(1) {
    font-size: 21px;
}
</style>
