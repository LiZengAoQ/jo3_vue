<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="开方机构" prop="hosId">
        <el-select
          v-model="queryParams.hosId"
          placeholder="开方机构"
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

      <el-form-item label="处方状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          placeholder="处方状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dictionary in statusOptions"
            :key="dictionary.value"
            :label="dictionary.label"
            :value="dictionary.value"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>'

      <el-form-item label="开方医生" prop="docName">
        <el-input
          v-model="docName"
          placeholder="请输入开方医生"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="患者姓名" prop="visitName">
        <el-input
          v-model="visitName"
          placeholder="请输入患者姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处方单号" prop="orderNo">
        <el-input
          v-model="orderNo"
          placeholder="请输入处方单号"
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
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="schList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="处方类型" align="center" prop="orderType" >
         <template slot-scope="scope">
           <p v-if="scope.row.orderType == 'WESTERN_RECIPE'">西药方</p>
           <p v-if="scope.row.orderType == 'CHINESE_RECIPE'">中药方</p>
         </template>
       </el-table-column>
       <el-table-column label="处方单号" align="center" prop="orderNo" />
       <el-table-column label="处方状态" align="center" prop="orderStatus" >
         <template slot-scope="scope">
           <p v-if="scope.row.orderStatus == 'WAITTAKE'">待配送</p>
           <p v-if="scope.row.orderStatus == 'SHIPPING'">配送中</p>
           <p v-if="scope.row.orderStatus == 'COMPLETE'">已完成</p>
<!--           <p v-if="scope.row.orderStatus == 'RECALL'">已召回</p>-->
<!--           <p v-if="scope.row.orderStatus == 'AUDIT'">已审核</p>-->
         </template>
       </el-table-column>
       <el-table-column label="开方医院" align="center" prop="hosName" />
       <el-table-column label="开方医生" align="center" prop="docName" />
       <el-table-column label="开方时间" align="center" prop="dtCreate" >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.dtCreate,'{y}-{m}-{d} {h}:{m}')}}</span>
        </template>
       </el-table-column>
       <el-table-column label="审核药师" align="center" prop="shName" />
<!--       <el-table-column label="审核时间" align="center" prop="schId" />-->
      <el-table-column label="审核时间" align="center" prop="shTime" >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.shTime,'{y}-{m}-{d} {h}:{m}')}}</span>
        </template>
      </el-table-column>
       <el-table-column label="姓名" align="center" prop="visitName" />
       <el-table-column label="性别" align="center" prop="visitGender" />
       <el-table-column label="年龄" align="center" prop="visitAge" />
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

            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    listYhgx
  } from "@/api/monitor/tongji";
import {
  listSch,
  getSch,
  delSch,
  addSch,
  updateSch,
  exportSch,
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
      //处方状态
      statusOptions:[{
        label:'待配送',
        value:'WAITTAKE'
      },{
        label:'配送中',
        value:'SHIPPING'
      },{
        label:'已完成',
        value:'COMPLETE'
      }],

      docName:null,
      visitName:null,
      orderNo:null,
      // 查询参数
      queryParams: {
        code:'外配处方订单',
        hosId:null,
        orderStatus:null,
        docName:null,
        visitName:null,
        orderNo:null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {

      },
      hosIdOptions: [], //所属医院
      deptIdOptions: [], //科室
      wubieOptions: [], //排班午别
      docOptions: [], //医生
      // 生成规则
      field101Options: [
        {
          label: "无",
          value: 1,
        },
        {
          label: "每周",
          value: 2,
        },
        {
          label: "每两周",
          value: 3,
        },
        {
          label: "每月",
          value: 4,
        },
      ],
    };
  },
  created() {
    this.getList();
    listHosData({ hosType: "HOS" }).then((response) => {
      this.hosIdOptions = response.rows;
    });

    listBookDept().then((response) => {
      this.deptIdOptions = response.rows;
    });

    listDictionary({ code: "base_sch_type", isData: "1" }).then((response) => {
      this.wubieOptions = response.data;
    });

    listDocInfo({ docType: "DOC" }).then((response) => {
      this.docOptions = response.data.list;
    });
  },
  methods: {
    /** 查询基础服务_排班 v1.3.2 A列表 */
    getList() {
      this.loading = true;
      listYhgx(this.queryParams).then((response) => {
        this.schList = response.data;
        // this.total = response.total;
        this.loading = false;
      });
    },

    getList1() {
      this.loading = true;
      var docName = "like"+this.docName;
      var visitName = "like"+this.visitName;
      var orderNo = "like"+this.orderNo;
      if(this.docName){
        this.$set(this.queryParams,'docName',docName);
      }else{
        this.$set(this.queryParams,'docName',this.docName);
      }
      if(this.visitName){
        this.$set(this.queryParams,'visitName',visitName);
      }else{
        this.$set(this.queryParams,'visitName',this.visitName);
      }
      if(this.orderNo){
        this.$set(this.queryParams,'orderNo',orderNo);
      }else{
        this.$set(this.queryParams,'orderNo',this.orderNo);
      }

      listYhgx(this.queryParams).then((response) => {
        this.schList = response.data;
        // this.total = response.total;
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
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
      this.getList1();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.schId);
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
      // getSch(schId).then((response) => {
      //   this.form = response.data[0];
      //   this.open = true;
      //   this.title = "修改排班";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.schId != null) {
            updateSch(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            // this.form.deptId = this.form.deptCode;
            addSch(this.form).then((response) => {
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
        '是否确认删除基础服务_排班 v1.3.2 A编号为"' + schIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
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
      this.$confirm("是否确认导出所有基础服务_排班 v1.3.2 A数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSch(queryParams);
        })
        .then((response) => {
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
          type: "warning",
        }
      )
        .then(function () {
          return updateSch(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.fgActive = row.fgActive === "0" ? "1" : "0";
        });
    },
  },
};
</script>
