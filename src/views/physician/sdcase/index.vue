<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="病例编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入病例编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所患疾病" prop="beIll">
        <el-input
          v-model="queryParams.beIll"
          placeholder="请输入所患疾病"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['api:sdcase:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['api:sdcase:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['api:sdcase:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['api:sdcase:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sdcaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="病例id" align="center" prop="id" />
      <el-table-column label="病例编号" align="center" prop="code" />
      <el-table-column label="就诊日期" align="center" prop="treatmentTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.treatmentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="病例症状" align="center" prop="caseSymptom" />
      <el-table-column label="现病史" align="center" prop="medicalHistory" />
      <el-table-column label="病情发现时间" align="center" prop="findTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.findTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="病例叙述" align="center" prop="caseIntroduce" />
      <el-table-column label="病史叙述者" align="center" prop="historyNarrator" />
      <el-table-column label="可靠程度" align="center" prop="reliabilityDegree" />
      <el-table-column label="所患疾病" align="center" prop="beIll" />
      <el-table-column label="病因" align="center" prop="pathogenesis" />
      <el-table-column label="家族病史" align="center" prop="familyHistory" />
      <el-table-column label="手术史" align="center" prop="surgery" />
      <el-table-column label="既往史" align="center" prop="pastHistory" />
      <el-table-column label="过敏史" align="center" prop="allergyHistory" />
      <el-table-column label="诊断结果" align="center" prop="diagnosis" />
      <el-table-column label="个人医院公共" align="center" prop="affiliation" />
      <el-table-column label="共享价格" align="center" prop="caseSharePrice" />
      <el-table-column label="是否推荐" align="center" prop="caseRecommend" />
      <el-table-column label="3d病例状态" align="center" prop="status" />
      <el-table-column label="创建人" align="center" prop="createrBy" />
      <el-table-column label="是否发布" align="center" prop="releases" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['api:sdcase:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:sdcase:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改3d病例对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="病例编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入病例编号" />
        </el-form-item>
        <el-form-item label="就诊日期" prop="treatmentTime">
          <el-date-picker clearable size="small"
            v-model="form.treatmentTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择就诊日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="病例症状" prop="caseSymptom">
          <el-input v-model="form.caseSymptom" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="现病史" prop="medicalHistory">
          <el-input v-model="form.medicalHistory" placeholder="请输入现病史" />
        </el-form-item>
        <el-form-item label="病情发现时间" prop="findTime">
          <el-date-picker clearable size="small"
            v-model="form.findTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择病情发现时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="病例叙述" prop="caseIntroduce">
          <el-input v-model="form.caseIntroduce" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="病史叙述者" prop="historyNarrator">
          <el-input v-model="form.historyNarrator" placeholder="请输入病史叙述者" />
        </el-form-item>
        <el-form-item label="可靠程度(0不可靠,1较为可靠,2可靠)" prop="reliabilityDegree">
          <el-input v-model="form.reliabilityDegree" placeholder="请输入可靠程度(0不可靠,1较为可靠,2可靠)" />
        </el-form-item>
        <el-form-item label="所患疾病" prop="beIll">
          <el-input v-model="form.beIll" placeholder="请输入所患疾病" />
        </el-form-item>
        <el-form-item label="病因" prop="pathogenesis">
          <el-input v-model="form.pathogenesis" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="家族病史" prop="familyHistory">
          <el-input v-model="form.familyHistory" placeholder="请输入家族病史" />
        </el-form-item>
        <el-form-item label="手术史" prop="surgery">
          <el-input v-model="form.surgery" placeholder="请输入手术史" />
        </el-form-item>
        <el-form-item label="既往史" prop="pastHistory">
          <el-input v-model="form.pastHistory" placeholder="请输入既往史" />
        </el-form-item>
        <el-form-item label="过敏史" prop="allergyHistory">
          <el-input v-model="form.allergyHistory" placeholder="请输入过敏史" />
        </el-form-item>
        <el-form-item label="诊断结果" prop="diagnosis">
          <el-input v-model="form.diagnosis" placeholder="请输入诊断结果" />
        </el-form-item>
        <el-form-item label="(0个人,1医院,2公共)" prop="affiliation">
          <el-input v-model="form.affiliation" placeholder="请输入(0个人,1医院,2公共)" />
        </el-form-item>
        <el-form-item label="共享价格" prop="caseSharePrice">
          <el-input v-model="form.caseSharePrice" placeholder="请输入共享价格" />
        </el-form-item>
        <el-form-item label="是否推荐( 0 未推荐 1 推荐)" prop="caseRecommend">
          <el-input v-model="form.caseRecommend" placeholder="请输入是否推荐( 0 未推荐 1 推荐)" />
        </el-form-item>
        <el-form-item label="3d病例状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否删除( 0 未删除 1 删除)" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入是否删除( 0 未删除 1 删除)" />
        </el-form-item>
        <el-form-item label="创建人" prop="createrBy">
          <el-input v-model="form.createrBy" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="是否发布(0 私有, 1 发布)" prop="releases">
          <el-input v-model="form.releases" placeholder="请输入是否发布(0 私有, 1 发布)" />
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
import { listSdcase, getSdcase, delSdcase, addSdcase, updateSdcase, exportSdcase } from "@/api/physician/sdcase/sdcase";

export default {
  name: "Sdcase",
  components: {
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
      // 3d病例表格数据
      sdcaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        treatmentTime: null,
        caseSymptom: null,
        medicalHistory: null,
        findTime: null,
        caseIntroduce: null,
        historyNarrator: null,
        reliabilityDegree: null,
        beIll: null,
        pathogenesis: null,
        familyHistory: null,
        surgery: null,
        pastHistory: null,
        allergyHistory: null,
        diagnosis: null,
        affiliation: null,
        caseSharePrice: null,
        caseRecommend: null,
        status: null,
        createrBy: null,
        releases: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        releases: [
          { required: true, message: "是否发布(0 私有, 1 发布)不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询3d病例列表 */
    getList() {
      this.loading = true;
      listSdcase(this.queryParams).then(response => {
        this.sdcaseList = response.rows;
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
        code: null,
        treatmentTime: null,
        caseSymptom: null,
        medicalHistory: null,
        findTime: null,
        caseIntroduce: null,
        historyNarrator: null,
        reliabilityDegree: null,
        beIll: null,
        pathogenesis: null,
        familyHistory: null,
        surgery: null,
        pastHistory: null,
        allergyHistory: null,
        diagnosis: null,
        affiliation: null,
        caseSharePrice: null,
        caseRecommend: null,
        status: "0",
        delFlag: null,
        createrBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        releases: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加3d病例";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSdcase(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改3d病例";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSdcase(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSdcase(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除3d病例编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSdcase(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有3d病例数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSdcase(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
