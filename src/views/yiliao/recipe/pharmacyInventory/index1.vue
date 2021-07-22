<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

            <el-form-item label="库存" prop="hosName">
                <el-select v-model="queryParams.fgHave" clearable size="small">
                    <el-option label="有" value="1"/>
                    <el-option label="无" value="0"/>
                </el-select>
            </el-form-item>

            <el-form-item label="所属医院" prop="hosName">
                <el-select v-model="queryParams.hosName" placeholder="请选择所属医院" clearable size="small">
                    <el-option
                        v-for="dictionary in hosList"
                        :key="dictionary"
                        :label="dictionary"
                        :value="dictionary"
                    >{{ dictionary }}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="药品名称" prop="drugName">
                <el-input
                    v-model="queryParams.drugName"
                    placeholder="请输入药品名称"
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

        <el-table v-loading="loading" :data="pharmacyInventoryList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="药品类型" align="center" prop="drugType">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.drugType=='WESTERN_MEDICINE'">西药</el-tag>
                    <el-tag v-if="scope.row.drugType=='HERBAL_MEDICINE'">草药</el-tag>
                    <el-tag v-if="scope.row.drugType=='PATENT_MEDICINE'">成药</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="药品编码" align="center" prop="drugCode"/>
            <el-table-column label="药品名称" align="center" prop="drugName"/>
            <el-table-column label="药品英文名" align="center" prop="drugEnglishName"/>
            <el-table-column label="药品规格" align="center" prop="drugSpecification"/>
            <el-table-column label="药品单位" align="center" prop="drugUnit"/>
            <el-table-column label="药品用法" align="center" prop="drugAdmission"/>
            <el-table-column label="药品产地" align="center" prop="drugOrigin"/>
            <el-table-column label="药品剂型" align="center" prop="dosageForm"/>
            <el-table-column label="平台价格" align="center" prop="platPrice"/>
            <el-table-column label="库存状态" align="center" prop="fgHave">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.fgHave=='1'">有</el-tag>
                    <el-tag v-if="scope.row.fgHave=='0'">无</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="库存数量" align="center" prop="platInventory"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                    >详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getListOther"
        />

        <!-- 展示详情对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="药品名称" prop="drugName">
                    <el-input v-model="form.drugName" placeholder="请输入药品名称" readonly/>
                </el-form-item>
                <el-form-item label="药品类型" prop="drugType">
                    <el-select v-model="form.drugType" placeholder="请选择药品类型" disabled>
                        <el-option label="西药" value="WESTERN_MEDICINE"/>
                        <el-option label="草药" value="HERBAL_MEDICINE"/>
                        <el-option label="成药" value="PATENT_MEDICINE"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="药品编码" prop="drugCode">
                    <el-input v-model="form.drugCode" placeholder="请输入药品编码" readonly/>
                </el-form-item>
                <el-form-item label="药品英文名" prop="drugEnglishName">
                    <el-input v-model="form.drugEnglishName" placeholder="请输入药品英文名" readonly/>
                </el-form-item>
                <el-form-item label="药品规格" prop="drugSpecification">
                    <el-input v-model="form.drugSpecification" placeholder="请输入药品规格" readonly/>
                </el-form-item>
                <el-form-item label="药品单位" prop="drugUnit">
                    <el-input v-model="form.drugUnit" placeholder="请输入药品单位" readonly/>
                </el-form-item>
                <el-form-item label="剂量单位" prop="dosageUnit">
                    <el-input v-model="form.dosageUnit" placeholder="请输入剂量单位" readonly/>
                </el-form-item>
                <el-form-item label="药品用法" prop="drugAdmission">
                    <el-input v-model="form.drugAdmission" placeholder="请输入药品用法" readonly/>
                </el-form-item>
                <el-form-item label="药品产地" prop="drugOrigin">
                    <el-input v-model="form.drugOrigin" placeholder="请输入药品产地" readonly/>
                </el-form-item>
                <el-form-item label="平台价格" prop="platPrice">
                    <el-input v-model="form.platPrice" placeholder="请输入平台价格" readonly/>
                </el-form-item>
                <el-form-item label="库存量" prop="platInventory">
                    <el-input v-model="form.platInventory" readonly/>
                </el-form-item>
                <el-form-item label="修改库存状态" prop="fgHave">
                    <el-select v-model="form.fgHave">
                        <el-option label="有" value="1"/>
                        <el-option label="无" value="0"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="拼音码" prop="speedyCodePinyin">
                    <el-input v-model="form.speedyCodePinyin" placeholder="请输入拼音码" readonly/>
                </el-form-item>
                <el-form-item label="五笔码" prop="speedyCodeWubi">
                    <el-input v-model="form.speedyCodeWubi" placeholder="请输入五笔码" readonly/>
                </el-form-item>
                <el-form-item label="其他码" prop="speedyCodeOther">
                    <el-input v-model="form.speedyCodeOther" placeholder="请输入其他码" readonly/>
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
    listPharmacyInventory,
    getHosList,
    addChangeRecord,
    updateFgHave
} from '@/api/yiliao/recipe/pharmacyInventory'

export default {
    name: 'ChangeRecord',
    components: {},
    data() {
        return {
            // 遮罩层
            loading: true,
            //医院字典
            hosList: [],
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
            // 变更记录表格数据
            pharmacyInventoryList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
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
                modifierId: null,
                modifierType: null,
                dosage: null,
                tag: null,
                drugExplain: null,
                fgPrescriable: null,
                hosId: null,
                hosName: null,
                rhdId: null,
                fgHave: null//是否有药
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                fgActive: [
                    { required: true, message: '是否有效不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getListOne()
        //this.handleQuery();
    },
    methods: {
        /** 查询第一个下拉列表的药品列表 */
        async getListOne() {
            this.loading = true
            const response = await getHosList(this.queryParams)
            this.hosList = response.data
            this.queryParams.hosName = this.hosList[0]//设置下拉列表默认值
            this.queryParams.fgHave = '1'//默认设置展示有库存的药品 0为没库存

            listPharmacyInventory(this.queryParams).then(response => {
                this.pharmacyInventoryList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        //查询选择的其他下拉列表的药品列表
        getListOther() {
            listPharmacyInventory(this.queryParams).then(response => {
                this.pharmacyInventoryList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        // 表单重置
        reset() {
            this.form = {
                drugName: null
            }
            this.resetForm('form')
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getListOther()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm')
            this.queryParams.pageNum = 1
            this.getListOne()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            this.form = row
            this.open = true
            this.title = '药房库存详情'
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateFgHave(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getListOther()
                        })
                    } else {
                        addChangeRecord(this.form).then(response => {
                            this.msgSuccess('新增成功')
                            this.open = false
                            this.getListOther()
                        })
                    }
                }
            })
        }
    }
}
</script>
