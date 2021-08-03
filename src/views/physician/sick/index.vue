<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="患者昵称" prop="sickNickname">
        <el-input
          v-model="queryParams.sickNickname"
          placeholder="请输入患者昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="患者姓名" prop="sickName">
        <el-input
          v-model="queryParams.sickName"
          placeholder="请输入患者姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="籍贯" prop="nativePlace">
        <el-input
          v-model="queryParams.nativePlace"
          placeholder="请输入籍贯"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="紧急联系人姓名" prop="sickEmergencyName">
        <el-input
          v-model="queryParams.sickEmergencyName"
          placeholder="请输入紧急联系人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="紧急联系人关系" prop="sickEmergencyRelation">
        <el-input
          v-model="queryParams.sickEmergencyRelation"
          placeholder="请输入紧急联系人关系"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="紧急联系人电话" prop="sickEmergencyPerson">
        <el-input
          v-model="queryParams.sickEmergencyPerson"
          placeholder="请输入紧急联系人电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账号" prop="sickUsername">
        <el-input
          v-model="queryParams.sickUsername"
          placeholder="请输入账号"
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
          v-hasPermi="['api:sick:add']"
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
          v-hasPermi="['api:sick:edit']"
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
          v-hasPermi="['api:sick:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['api:sick:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sickList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="患者id" align="center" prop="id" />
      <el-table-column label="患者头像" align="center" prop="sickProfilePhoto" />
      <el-table-column label="患者昵称" align="center" prop="sickNickname" />
      <el-table-column label="患者姓名" align="center" prop="sickName" />
      <el-table-column label="患者年龄" align="center" prop="sickAge" />
      <el-table-column label="患者性别" align="center" prop="sickSex" />
      <el-table-column label="血型" align="center" prop="bloodType" />
      <el-table-column label="籍贯" align="center" prop="nativePlace" />
      <el-table-column label="手机号" align="center" prop="contactsMobile" />
      <el-table-column label="邮箱" align="center" prop="contactsEmaill" />
      <el-table-column label="职业" align="center" prop="sickOccupation" />
      <el-table-column label="身份证" align="center" prop="contactsIdentity" />
      <el-table-column label="患者住址" align="center" prop="sickSite" />
      <el-table-column label="患者人员类型" align="center" prop="sickPersonnelType" />
      <el-table-column label="电子病例文件" align="center" prop="sickRecord" />
      <el-table-column label="影像报告" align="center" prop="sickImageReport" />
      <el-table-column label="紧急联系人姓名" align="center" prop="sickEmergencyName" />
      <el-table-column label="紧急联系人关系" align="center" prop="sickEmergencyRelation" />
      <el-table-column label="紧急联系人电话" align="center" prop="sickEmergencyPerson" />
      <el-table-column label="账号" align="center" prop="sickUsername" />
      <el-table-column label="密码" align="center" prop="sickPasswrod" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="创建人" align="center" prop="createrBy" />
      <el-table-column label="修改人类型" align="center" prop="updateType" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['api:sick:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:sick:remove']"
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

    <!-- 添加或修改患者个人信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="患者头像" prop="sickProfilePhoto">
          <el-input v-model="form.sickProfilePhoto" placeholder="请输入患者头像" />
        </el-form-item>
        <el-form-item label="患者昵称" prop="sickNickname">
          <el-input v-model="form.sickNickname" placeholder="请输入患者昵称" />
        </el-form-item>
        <el-form-item label="患者姓名" prop="sickName">
          <el-input v-model="form.sickName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="患者年龄" prop="sickAge">
          <el-input v-model="form.sickAge" placeholder="请输入患者年龄" />
        </el-form-item>
        <el-form-item label="患者性别" prop="sickSex">
          <el-select v-model="form.sickSex" placeholder="请选择患者性别">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="血型(0A,1B,2AB,3O,4其他)" prop="bloodType">
          <el-select v-model="form.bloodType" placeholder="请选择血型(0A,1B,2AB,3O,4其他)">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
        </el-form-item>
        <el-form-item label="邮箱" prop="contactsEmaill">
          <el-input v-model="form.contactsEmaill" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="职业(0学生,1务农,2工人,3军人)" prop="sickOccupation">
          <el-input v-model="form.sickOccupation" placeholder="请输入职业(0学生,1务农,2工人,3军人)" />
        </el-form-item>
        <el-form-item label="身份证" prop="contactsIdentity">
          <el-input v-model="form.contactsIdentity" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="患者住址" prop="sickSite">
          <el-input v-model="form.sickSite" placeholder="请输入患者住址" />
        </el-form-item>
        <el-form-item label="患者人员类型" prop="sickPersonnelType">
          <el-select v-model="form.sickPersonnelType" placeholder="请选择患者人员类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="电子病例文件" prop="sickRecord">
          <el-input v-model="form.sickRecord" placeholder="请输入电子病例文件" />
        </el-form-item>
        <el-form-item label="影像报告" prop="sickImageReport">
          <el-input v-model="form.sickImageReport" placeholder="请输入影像报告" />
        </el-form-item>
        <el-form-item label="紧急联系人姓名" prop="sickEmergencyName">
          <el-input v-model="form.sickEmergencyName" placeholder="请输入紧急联系人姓名" />
        </el-form-item>
        <el-form-item label="紧急联系人关系" prop="sickEmergencyRelation">
          <el-input v-model="form.sickEmergencyRelation" placeholder="请输入紧急联系人关系" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="sickEmergencyPerson">
          <el-input v-model="form.sickEmergencyPerson" placeholder="请输入紧急联系人电话" />
        </el-form-item>
        <el-form-item label="账号" prop="sickUsername">
          <el-input v-model="form.sickUsername" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="sickPasswrod">
          <el-input v-model="form.sickPasswrod" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否删除，" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入是否删除，" />
        </el-form-item>
        <el-form-item label="创建人" prop="createrBy">
          <el-input v-model="form.createrBy" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="修改人类型" prop="updateType">
          <el-select v-model="form.updateType" placeholder="请选择修改人类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
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
import { listSick, getSick, delSick, addSick, updateSick, exportSick } from "@/api/physician/sick/sick";

export default {
  name: "Sick",
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
      // 患者个人信息表格数据
      sickList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sickNickname: null,
        sickName: null,
        nativePlace: null,
        contactsMobile: null,
        sickEmergencyName: null,
        sickEmergencyRelation: null,
        sickEmergencyPerson: null,
        sickUsername: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询患者个人信息列表 */
    getList() {
      this.loading = true;
      listSick(this.queryParams).then(response => {
        this.sickList = response.rows;
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
        sickProfilePhoto: null,
        sickNickname: null,
        sickName: null,
        sickAge: null,
        sickSex: null,
        bloodType: null,
        nativePlace: null,
        contactsMobile: null,
        contactsEmaill: null,
        sickOccupation: null,
        contactsIdentity: null,
        sickSite: null,
        sickPersonnelType: null,
        sickRecord: null,
        sickImageReport: null,
        sickEmergencyName: null,
        sickEmergencyRelation: null,
        sickEmergencyPerson: null,
        sickUsername: null,
        sickPasswrod: null,
        status: "0",
        delFlag: null,
        createrBy: null,
        createTime: null,
        updateBy: null,
        updateType: null,
        updateTime: null
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
      this.title = "添加患者个人信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSick(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改患者个人信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSick(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSick(this.form).then(response => {
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
      this.$confirm('是否确认删除患者个人信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSick(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有患者个人信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSick(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
