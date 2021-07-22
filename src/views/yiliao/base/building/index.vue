<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="大楼名称" prop="buildingName">
        <el-input
          v-model="queryParams.buildingName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属医院" prop="hosId">
        <el-select v-model="queryParams.hosId" placeholder="医院状态" clearable size="small">
          <el-option
            v-for="dictionary in hosIdOptions"
            :key="dictionary.hosId"
            :label="dictionary.hosName"
            :value="dictionary.hosId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="大楼状态" prop="fgActive">
        <el-select v-model="queryParams.fgActive" placeholder="医院状态" clearable size="small">
          <el-option
            v-for="dictionary in statusOptions"
            :key="dictionary.data"
            :label="dictionary.name"
            :value="dictionary.data"
          />
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
          @click="handleAdd"
          v-hasPermi="['api:building:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleUpdateBuildingActiveStart"
          v-hasPermi="['api:building:delete']"
        >启用</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleUpdateBuildingActiveStop"
          v-hasPermi="['api:building:delete']"
        >停用</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['api:building:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['api:building:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['api:building:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="buildingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="编号" align="center" prop="id" /> -->
      <el-table-column label="医院名称" align="center" prop="hosName" />
      <el-table-column label="大楼名称" align="center" prop="buildingName" />
      <el-table-column label="楼层数" align="center" prop="buildingNum" />
      <!-- <el-table-column label="所属医院" align="center" prop="hosId" /> -->
      <!-- <el-table-column label="是否有效" align="center" prop="fgActive" /> -->
      <el-table-column label="状态" align="center" key="fgActive">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.fgActive"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChangeByBuilding(scope.row)"
              ></el-switch>
            </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleQueryListByBuildingId(scope.row)"
            v-hasPermi="['api:building:query']"
          >楼层导航</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['api:building:edit']"
          >详情</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['api:building:remove']"-->
<!--          >删除</el-button>-->
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

    <!-- 添加或修改 医院楼栋对话框 -->
    <el-dialog :title="titleByBuilding" :visible.sync="openByBuilding" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属医院" prop="buildingId">
          <el-select v-model="form.hosId" placeholder="所属医院" clearable size="small">
            <el-option
              v-for="dictionary in hosIdOptions"
              :key="dictionary.hosId"
              :label="dictionary.hosName"
              :value="dictionary.hosId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="大楼名称" prop="floorNo">
          <el-input v-model="form.buildingName" placeholder="请输入大楼名称" />
        </el-form-item>
        <el-form-item label="楼层数" prop="roomName">
          <el-input v-model="form.buildingNum" placeholder="请输入楼层数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormByBuilding">确 定</el-button>
        <el-button @click="cancelByBuilding">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改 楼层导航对话框 -->
    <el-dialog :title="titleByFloor" :visible.sync="openByFloor" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="大楼名称" prop="buildingName">
          <el-input v-model="form.buildingName" :disabled="disabled" placeholder="请输入大楼名称" />
        </el-form-item>
        <el-form-item label="楼层数" prop="floorNo">
          <el-input v-model="form.floorNo" placeholder="请输入楼层数" />
        </el-form-item>
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="form.roomName" placeholder="请输入房间名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormByFloor">确 定</el-button>
        <el-button @click="cancelByFloor">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 楼层导航页 -->
    <el-dialog :title="titleByFloor" :visible.sync="openHosFloorByBuildingId" width="1200px" append-to-body>
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="楼层" prop="floorNo">
          <el-input
            v-model="queryParams.floorNo"
            placeholder="请输入楼层号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="房间名称" prop="roomName">
          <el-input
            v-model="queryParams.roomName"
            placeholder="请输入房间名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="楼层状态" prop="fgActive">
          <el-select v-model="queryParams.fgActive" placeholder="楼层状态" clearable size="small">
            <el-option
              v-for="dictionary in statusOptions"
              :key="dictionary.data"
              :label="dictionary.name"
              :value="dictionary.data"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryByBuilding">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetRestart">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAddByBuildingId"
            v-hasPermi="['api:floor:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="multiple"
            @click="handleUpdateFloorActiveStart"
            v-hasPermi="['api:floor:remove']"
          >启用</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleUpdateFloorActiveStop"
            v-hasPermi="['api:floor:remove']"
          >停用</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="floorList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="大楼名称" align="center" prop="buildingName" />
        <!-- <el-table-column label="大楼编号" align="center" prop="buildingId" /> -->
        <el-table-column label="楼层" align="center" prop="floorNo" />
        <el-table-column label="房间名称" align="center" prop="roomName" />
        <el-table-column label="状态" align="center" key="fgActive">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.fgActive"
              active-value="1"
              inactive-value="0"
              @change="handleStatusChangeByFloor(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleQueryByBuildingId(scope.row)"
              v-hasPermi="['api:floor:edit']"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="totalByBuildingId>0"
        :total="totalByBuildingId"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getListByBuildingId"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOpenHosFloorByBuildingId">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBuilding,
  delBuilding,
  addBuilding,
  updateBuilding,
  updateBaseHosFloorActivesByStart,
  updateBaseHosFloorActivesByStop,
  updateBaseHosBuildingActivesByStart,
  updateBaseHosBuildingActivesByStop,
  getBuilding
} from '@/api/yiliao/base/building'
import { listHosData} from "@/api/yiliao/base/hosData";
import { getDictionarys} from "@/api/system/dictionary";
import { listFloor, updateFloor, addFloor, getBaseHosFloorAndBuildingName } from '@/api/yiliao/base/floor'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Building",
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
      // 总条数
      total: 0,
      // 医院大楼表格数据
      buildingList: [],
      // 大楼楼层
      floorList:[],
      // 状态数据字典
      statusOptions: [],
      // 医院数据字典
      hosIdOptions: [],
      // 弹出层标题
      titleByBuilding: "",
      titleByFloor: "",
      // 楼栋新增按钮
      openByBuilding: false,
      // 楼层导航新增
      openByFloor: false,
      //楼层导航页
      openHosFloorByBuildingId: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        buildingName: null,
        buildingNum: null,
        hosName: null,
        fgActive: null,
        buildingId: null,
        hosId : null,
        floorNo:null,
        roomName :null,
        id:null
      },
      // 查询参数
      queryParam: {
        hosType: "HOS"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //楼层导航列表
      floorListByBuildingId: [],
      //楼层导航页分页总数
      totalByBuildingId: 0,
      disabled:false,
      buildingIdByCancel:null,
      buildingId:null,
      buildingName:null,
      id:null,
    };
  },
  created() {
    this.getList();
    getDictionarys("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    listHosData(this.queryParam).then(response => {
      this.hosIdOptions = response.rows;
    });
  },
  methods: {
    /** 查询医院大楼列表 */
    getList() {
      this.loading = true;
      listBuilding(this.queryParams).then(response => {
        this.buildingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancelByBuilding() {
      this.openByBuilding = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        buildingName: null,
        buildingNum: null,
        hosName: null,
        fgActive: null,
        buildingId: null,
        hosId: null,
        id:null
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
    /** 楼层页搜索按钮操作 */
    handleQueryByBuilding() {
      this.queryParams.pageNum = 1;
      this.getListByBuildingId();
    },
    /** 楼层页重置按钮操作 */
    resetRestart() {
      this.resetForm("queryForm");
      this.handleQueryByBuilding();
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
      this.openByBuilding = true;
      this.titleByBuilding = "添加医院大楼";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBuilding(id).then((response) => {
        this.form = response.data;
        this.openByBuilding = true;
        this.title = "修改医院大楼";
      });
    },
    /** 楼层导航提交按钮 */
    submitFormByFloor() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log("update Id:"+this.form.id)
          if (this.form.id != null) {
            updateFloor(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.openByFloor = false;
              this.getListByBuildingId();
            });
          } else {
            addFloor(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.openByFloor = false;
              this.getListByBuildingId();
            });
          }
        }
      });
    },
    /** 医院大楼提交按钮 */
    submitFormByBuilding() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBuilding(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.openByBuilding = false;
              this.getList();
            });
          } else {
            addBuilding(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.openByBuilding = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除医院大楼编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBuilding(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    handleStatusChangeByBuilding(row) {
      let text = row.fgActive === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.buildingName + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateBuilding(row);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.fgActive = row.fgActive === "0" ? "1" : "0";
        });
    },
    handleStatusChangeByFloor(row) {
      let text = row.fgActive === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.buildingName + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateFloor(row);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.fgActive = row.fgActive === "0" ? "1" : "0";
      });
    },
    /** 楼层导航按钮 */
    handleQueryListByBuildingId(row) {
      this.resetForm("queryForm");
      this.buildingId = row.id
      this.buildingName = row.buildingName
      row.fgActive = null;
      this.reset();
      row.buildingId = row.id
      this.form = row;
      this.getListByBuildingId();
      this.openHosFloorByBuildingId = true;
      this.titleByFloor = "楼层导航";
    },
    /** 查询楼层导航列表 */
    getListByBuildingId() {
        this.loading = true;
        this.queryParams.buildingId = this.buildingId;
        listFloor(this.queryParams).then(response => {
          this.floorList = response.rows;
          this.totalByBuildingId = response.total;
          this.loading = false;
        });
    },
    /** 楼层导航中的详情 */
    async handleQueryByBuildingId(row) {
      this.reset();
      getBaseHosFloorAndBuildingName(row).then((response) => {
        this.id = response.data.id;
        this.form = response.data;
        this.disabled = true;
        this.openByFloor = true;
        this.titleByFloor = "楼栋楼层详情";
      });
      console.log("form:"+this.id)
    },
    // 楼层导航中 编辑页取消
    cancelByFloor() {
      this.openByFloor = false;
      this.getListByBuildingId();
    },
    // 楼层导航页取消
    cancelOpenHosFloorByBuildingId() {
      this.openHosFloorByBuildingId = false;
      this.getList();
    },
    //导航页新增
    handleAddByBuildingId(){
      this.reset();
      this.form.buildingId = this.buildingId;
      this.form.buildingName = this.buildingName;
      this.disabled = true;
      this.openByFloor = true;
      this.titleByFloor = "楼栋楼层新增";
    },
    /** Building启用按钮 */
    handleUpdateBuildingActiveStart(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认启用医院大楼编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateBaseHosBuildingActivesByStart(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("启用成功");
      })
    },
    /** Building停用按钮 */
    handleUpdateBuildingActiveStop(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认停用医院大楼编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateBaseHosBuildingActivesByStop(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("停用成功");
      })
    },/** Floor停用按钮 */
    handleUpdateFloorActiveStart(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认停用医院大楼编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateBaseHosFloorActivesByStart(ids);
      }).then(() => {
        this.getListByBuildingId();
        this.msgSuccess("启用成功");
      })
    },
    /** Floor停用按钮 */
    handleUpdateFloorActiveStop(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认停用医院大楼编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateBaseHosFloorActivesByStop(ids);
      }).then(() => {
        this.getListByBuildingId();
        this.msgSuccess("停用成功");
      })
    },
  }
};
</script>
