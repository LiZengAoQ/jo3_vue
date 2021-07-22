<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="医生姓名" prop="docName">
        <el-input
          v-model="queryParams.docName"
          placeholder="请输入医生姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息内容" prop="msgContent">
        <el-input
          v-model="queryParams.msgContent"
          placeholder="请输入消息内容"
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

    <el-table v-loading="loading" :data="massList" @selection-change="handleSelectionChange">
      <el-table-column label="医生姓名" align="center" prop="docName" />
      <el-table-column label="消息内容" align="center" prop="msgContent" />
      <el-table-column label="创建时间" align="center" prop="dtCreate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtCreate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息类型" align="center" prop="msgType" >
        <template slot-scope="scope">
          <p v-if="scope.row.msgType == 'TEXT'">文本</p>
          <p v-if="scope.row.msgType == 'PIC'">图片</p>
          <p v-if="scope.row.msgType == 'AUDIO'">语音</p>
          <p v-if="scope.row.msgType == 'VEDIO'">视频</p>
          <p v-if="scope.row.msgType == 'ARTICLE'">文章</p>
          <p v-if="scope.row.msgType == 'INSPECT'">检验单</p>
          <p v-if="scope.row.msgType == 'CHECK'">检查单</p>
          <p v-if="scope.row.msgType == 'CONSULT'">咨询</p>
          <p v-if="scope.row.msgType == 'RECIPE'">外配处方</p>
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
  </div>
</template>

<script>
import { listMass } from "@/api/yiliao/relation/mass";
import Editor from '@/components/Editor';

export default {
  name: "Mass",
  components: {
    Editor,
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
      // 医患关系_群发记录表格数据
      massList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        senderId: null,
        reciverIds: null,
        msgContent: null,
        msgType: null,
        fgActive: null,
        dtCreate: null,
        docName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fgActive: [
          { required: true, message: "是否有效不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询医患关系_群发记录列表 */
    getList() {
      this.loading = true;
      listMass(this.queryParams).then(response => {
        this.massList = response.rows;
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
        senderId: null,
        reciverIds: null,
        msgContent: null,
        msgType: null,
        fgActive: null,
        dtCreate: null,
        docName:null,

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
    }
  }
};
</script>
