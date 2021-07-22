<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="docName">
        <el-input
          v-model="queryParams.docName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属医院" prop="hosName">
        <el-select v-model="queryParams.hosName" placeholder="请选择所属医院" clearable size="small">
          <el-option
            v-for="(dictionary,index) in hosOptions"
            :key="index"
            :label="dictionary"
            :value="dictionary"
          >{{dictionary}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室" prop="deptName">
        <el-select v-model="queryParams.deptName" placeholder="请选择所属科室" clearable size="small">
          <el-option
            v-for="(dictionary,index) in deptOptions"
            :key="index"
            :label="dictionary"
            :value="dictionary"
          >{{dictionary}}
          </el-option>
        </el-select>
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
          @click="handleAddFgRecommend"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="DocRecommendList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="医生编号" align="center" prop="id"/>
      <el-table-column label="姓名" align="center" prop="docName"/>
      <el-table-column label="所属医院" align="center" prop="hosName"/>
      <el-table-column label="所属科室" align="center" prop="deptName"/>
      <el-table-column label="名医排序" align="center" prop="famousSort"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateBySortTitle(scope.row)"
            v-hasPermi="['api:docRecommend:update']"
          >修改排序
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:docRecommend:update']"
          >取消推荐
          </el-button>
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

    <!-- 添加对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1400px" append-to-body>

      <el-form :model="queryParams" ref="queryFormByAdd" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="姓名" prop="docName">
          <el-input
            v-model="queryParams.docName"
            placeholder="请输入姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属医院" prop="hosName">
          <el-select v-model="queryParams.hosName" placeholder="请选择所属医院" clearable size="small">
            <el-option
              v-for="(dictionary,index) in hosOptions"
              :key="index"
              :label="dictionary"
              :value="dictionary"
            >{{dictionary}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属科室" prop="deptName">
          <el-select v-model="queryParams.deptName" placeholder="请选择所属科室" clearable size="small">
            <el-option
              v-for="(dictionary,index) in deptOptions"
              :key="index"
              :label="dictionary"
              :value="dictionary"
            >{{dictionary}}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryByAdd">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryByAdd">重置</el-button>
        </el-form-item>
      </el-form>


      <el-table v-loading="loading" :data="DocRecommendListByAdd" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="id" align="center" prop="id"/>
        <el-table-column label="姓名" align="center" prop="docName"/>
        <el-table-column label="所属医院" align="center" prop="hosName"/>
        <el-table-column label="所属科室" align="center" prop="deptName"/>
        <el-table-column label="是否推荐" align="center">否</el-table-column>
        <el-table-column label="名医排序" align="center" prop="famousSort"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdateBySortTitle(scope.row)"
              v-hasPermi="['api:docRecommend:update']"
            >修改排序
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getListByAdd"
      />

      <div slot="footer" class="dialog-footer">
        <el-button
          :disabled="multiple"
          @click="handleAddFgRecommendById"
          v-hasPermi="['api:docRecommend:update']"
        >添加
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改排序对话框 -->
    <el-dialog :title="titleUpdate" :visible.sync="openUpdate" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="排序" prop="famousSort">
          <el-input v-model="form.famousSort"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormByUpdateSort">修 改</el-button>
        <el-button @click="cancelUpdate">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listDocRecommend,
    updateDocRecommendById,
    updateDocRecommend,
    getDeptNameList,
    getHosNameList
  } from '@/api/yiliao/base/docRecommend'

  export default {
    name: 'DocRecommend',
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],

        //医院字典
        hosOptions: [],
        //科室字典
        deptOptions: [],

        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 医生信息表格数据
        DocRecommendList: [],
        //新增界面的医生表格数据
        DocRecommendListByAdd: [],
        // 弹出层标题
        title: '',
        // 弹出层标题
        titleUpdate: '',
        // 是否显示弹出层
        open: false,
        openUpdate: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          docName: null,
          hosName: null,
          deptName: null,
          famousSort: null,
          fgRecommend: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      }
    },
    created() {
      this.getList()
      this.getDeptNameListMethod()
      this.getHosNameListMethod()
    },
    methods: { //函数
      getDeptNameListMethod() {
        this.queryParams.fgRecommend = '1'
        getDeptNameList(this.queryParams).then(response => {
          this.deptOptions = response.data
        })
      },

      getHosNameListMethod() {
        this.queryParams.fgRecommend = '1'
        getHosNameList(this.queryParams).then(response => {
          this.hosOptions = response.data
        })
      },

      getDeptNameListMethodBy0() {
        this.queryParams.fgRecommend = '0'
        getDeptNameList(this.queryParams).then(response => {
          this.deptOptions = response.data
        })
      },

      getHosNameListMethodBy0() {
        this.queryParams.fgRecommend = '0'
        getHosNameList(this.queryParams).then(response => {
          this.hosOptions = response.data
        })
      },

      /** 查询医生信息列表 */
      getList() {
        this.loading = true
        this.queryParams.fgRecommend = '1'
        listDocRecommend(this.queryParams).then(response => {
          this.DocRecommendList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      /** 查询医生信息列表 新增专用*/
      getListByAdd() {
        this.loading = true
        this.queryParams.fgRecommend = '0'
        listDocRecommend(this.queryParams).then(response => {
          this.DocRecommendListByAdd = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
        this.getDeptNameListMethod()
        this.getHosNameListMethod()
        // this.resetQuery();
      },
      // 取消修改排序对话框按钮
      cancelUpdate() {
        this.openUpdate = false
        this.reset()
        this.getDeptNameListMethod()
        this.getHosNameListMethod()
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          docName: null,
          hosName: null,
          deptName: null,
          famousSort: null,
          fgRecommend: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
        this.getDeptNameListMethod()
        this.getHosNameListMethod()
      },
      /** 搜索按钮操作 新增装专用*/
      handleQueryByAdd() {
        this.queryParams.pageNum = 1
        this.getListByAdd()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 重置按钮操作  新增专用 */
      resetQueryByAdd() {
        this.resetForm('queryFormByAdd')
        this.handleQueryByAdd()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮 */
      handleAddFgRecommend() {
        this.reset()
        this.getDeptNameListMethodBy0()
        this.getHosNameListMethodBy0()
        this.getListByAdd()
        this.open = true
        this.title = '推荐医生'
      },
      /** 修改排序 */
      handleUpdateBySortTitle(row) {
        this.reset()
        this.form = row
        this.openUpdate = true
        this.titleUpdate = '名医排序'
      },
      /** 修改排序对话框修改 */
      submitFormByUpdateSort() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.deptId != null) {
              updateDocRecommend(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.openUpdate = false
                this.getList()
                this.getDeptNameListMethod()
                this.getHosNameListMethod()
              })
            } else {
              this.msgSuccess('修改失败')
              this.openUpdate = false
              this.getList()
              this.getDeptNameListMethod()
              this.getHosNameListMethod()
            }
          }
        })
      },
      /** 取消推荐 */
      handleDelete(row) {
        const ids = row.id || this.ids
        row.fgRecommend = '0'
        this.$confirm('是否确认不再推荐医生信息编号为"' + ids + '"的信息?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return updateDocRecommend(row)
        }).then(() => {
          this.getList()
          this.getDeptNameListMethod()
          this.getHosNameListMethod()
          this.msgSuccess('取消成功')
        })
      },
      /** 批量添加 */
      handleAddFgRecommendById(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认添加所选数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return updateDocRecommendById(ids)
        }).then(() => {
          this.open = false
          this.getList()
          this.getDeptNameListMethod()
          this.getHosNameListMethod()
          this.msgSuccess('添加成功')
        })
      }
    }
  }
</script>
