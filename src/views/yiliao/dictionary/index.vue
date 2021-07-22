<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入角色名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择角色状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dictionary in statusOptions"
            :key="dictionary.name"
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
          v-hasPermi="['system:dictionary:add']"
        >新增
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="visibleCancel"
          type="danger"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleHome"
          v-hasPermi="['system:dict:remove']"
        >返回顶级
        </el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="dictionaryList"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="角色名称" align="center" prop="name"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="修改时间" align="center" prop="updateTime"/>
      <el-table-column label="角色状态" align="center" key="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
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
            v-hasPermi="['system:dictionary:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updatePermissionUpdate(scope.row)"
            v-hasPermi="['system:dictionary:edit']"
          >修改权限
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dictionary:remove']"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改角色对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色名称"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改角色对话框 -->
    <el-dialog :title="title" :visible.sync="open1" append-to-body width="600px" @selection-change="handleSelectionChange">
      <el-form ref="form1" :model="form1" label-width="80px">
        <el-form-item label="菜单权限">
          <el-checkbox v-model="permissionExpand" @change="handleCheckedTreeExpand($event, 'permission')">展开/折叠
          </el-checkbox>
          <el-checkbox v-model="permissionNodeAll" @change="handleCheckedTreeNodeAll($event, 'permission')">全选/全不选
          </el-checkbox>
          <el-checkbox v-model="form1.permissionCheckStrictly" @change="handleCheckedTreeConnect($event, 'permission')">
            父子联动
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="permissionOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form1.permissionCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    listDictionary,
    getDictionary,
    delDictionary,
    addDictionary,
    updateDictionary,
    updateDictionaryEditPermission,
    exportDictionary,
    getDictionarys,
    clearCache,
    selectDictionaryById,
    importTemplate
  } from '@/api/yiliao/dictionary/rolePermission'
  import { getToken } from '@/utils/auth'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    treeselect as permissionTreeselect,
    rolePermissionTreeselect
  } from '@/api/yiliao/workstation/permission'

  export default {
    name: 'Dictionary',
    components: {
      Treeselect
    },
    data() {
      return {
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 遮罩层
        loading: true,
        // 顶级设置
        visibleCancel: false,
        // 显示搜索条件
        showSearch: true,
        // 角色表格数据
        dictionaryList: [],
        // 菜单列表
        permissionOptions: [],
        // 状态数据角色
        statusOptions: [],
        isDataOptions: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        open1: false,
        // 是否显示弹出层（数据权限）
        openDataScope: false,
        permissionExpand: false,
        permissionNodeAll: false,
        deptExpand: true,
        deptNodeAll: false,
        // 父类状态值
        idData: 0,
        // 总条数
        total: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          type: 'api_doc_type',
          parentid: 567,
          name: null,
          sort: null,
          code: null,
          data: null,
          isDefault: null,
          formcss: null,
          listcss: null,
          status: null
        },
        // 表单参数
        form: {
          sort: 0,
          parentid: 567,
          status: 1,
          data: 0,
          code: 'api_doc_type',
          isData: 1
        },
        form1: {
          sort: 0,
          parentid: 567,
          status: 1,
          data: 0,
          code: 'api_doc_type',
          isData: 1
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        // 表单校验
        rules: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
        rowId:null
      }
    },
    created() {
      this.getList()
      getDictionarys('sys_normal_disable').then((response) => {
        this.statusOptions = response.data
      })

      getDictionarys('sys_yes_no').then((response) => {
        this.isDataOptions = response.data
      })
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true
        listDictionary(this.queryParams).then((response) => {
          this.dictionaryList = response.data
          this.loading = false
        })
      },
      /** 转换角色数据结构 */
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
      // 角色状态角色翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status)
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      cancel1() {
        this.open1 = false
        this.reset1()
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          sort: 0,
          parentid: 567,
          status: 1,
          data: 0,
          code: 'api_doc_type',
          isData: 1
        }
        this.resetForm('form')
      },
      reset1() {
        this.form1 = {
          id: null,
          sort: 0,
          parentid: 567,
          status: 1,
          data: 0,
          code: 'api_doc_type',
          isData: 1
        }
        this.permissionExpand = false,
        this.permissionNodeAll = false,
        this.deptExpand = true,
        this.deptNodeAll = false,
        this.form1 = {
          id: undefined,
          name: undefined,
          code: undefined,
          sort: 0,
          status: '1',
          permissionIds: [],
          deptIds: [],
          permissionCheckStrictly: true,
          deptCheckStrictly: true,
          remark: undefined
        }
        this.resetForm('form1')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset()
        this.open = true
        this.title = '添加角色'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getDictionary(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改角色'
        })
      },
      /** 根据角色ID查询菜单树结构 */
      getRolePermissionTreeselect(id) {
        return rolePermissionTreeselect(id).then(response => {
          this.permissionOptions = response.menus;
          return response;
        });
      },
      updatePermissionUpdate(row) {
        this.reset1()
        this.getPermissionTreeselect();

        const id = row.id || this.ids
        this.rowId = id;
        const rolePermission = this.getRolePermissionTreeselect(id)

        getDictionary(id).then(response => {
          this.form1 = response.data;
          this.form1.permissionCheckStrictly = true
          this.open1 = true;
          this.$nextTick(() => {
            rolePermission.then(res => {
              let checkedKeys = res.checkedKeys;
              checkedKeys.forEach((v) => {
                this.$nextTick(()=>{
                  this.$refs.menu.setChecked(v, true ,false);
                })
              })
            });
          });
          this.title = "修改角色";
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id != null) {
              updateDictionary(this.form).then((response) => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addDictionary(this.form).then((response) => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 提交按钮 */
      submitForm1() {
        this.$refs['form1'].validate((valid) => {
          if (valid) {
            this.form1.id = this.rowId;
            this.form1.permissionIds = this.getPermissionAllCheckedKeys()
            updateDictionaryEditPermission(this.form1).then((response) => {
              this.msgSuccess('修改成功')
              this.open1 = false
              this.rowId = null
              this.getList()
            })
          }
        })
      },

      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除角色编号为"' + row.id + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return delDictionary(row.id)
          })
          .then(() => {
            this.getList()
            this.msgSuccess('删除成功')
          })
      },
      /** 根据角色ID查询结构 */
      getRoleDeptTreeselect(id) {
        return roleDeptTreeselect(id).then(response => {
          this.deptOptions = response.depts
          return response
        })
      },
      // 所有菜单节点数据
      getPermissionAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.menu.getCheckedKeys()
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
        return checkedKeys
      },
      // 树权限（展开/折叠）
      handleCheckedTreeExpand(value, type) {
        if (type == 'permission') {
          let treeList = this.permissionOptions
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
          }
        } else if (type == 'dept') {
          let treeList = this.deptOptions
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
          }
        }
      },
      /** 查询菜单树结构 */
      getPermissionTreeselect() {
        permissionTreeselect().then(response => {
          this.permissionOptions = response.data
        })
      },
      // 树权限（全选/全不选）
      handleCheckedTreeNodeAll(value, type) {
        if (type == 'permission') {
          this.$refs.menu.setCheckedNodes(value ? this.permissionOptions : [])
        } else if (type == 'dept') {
          this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
        }
      },
      // 树权限（父子联动）
      handleCheckedTreeConnect(value, type) {
        if (type == 'permission') {
          this.form.permissionCheckStrictly = value ? true : false
        } else if (type == 'dept') {
          this.form.deptCheckStrictly = value ? true : false
        }
      },
      handleStatusChange(row) {
        let text = row.status === '1' ? '启用' : '停用'
        this.$confirm('确认要"' + text + '""' + row.name + '"吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return updateDictionary(row)
          })
          .then(() => {
            this.msgSuccess(text + '成功')
          })
          .catch(function() {
            row.status = row.status === '0' ? '1' : '0'
          })
      }
    }
  }
</script>
