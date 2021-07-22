<template>
  <div class="app-container" style="padding: 60px;">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
      style="text-align: center"
    >
      <el-form-item label="所属医院" prop="value">
        <el-select
          v-model="queryParams.value"
          placeholder="医院状态"
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

      <el-form-item label="时间" prop="time">
        <el-date-picker type="daterange" v-model="time" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期" end-placeholder="结束日期"
                        range-separator="至" clearable></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button
        >
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"-->
<!--        >重置</el-button-->
<!--        >-->
      </el-form-item>
    </el-form>

    <p style="text-align: center;">群发消息统计</p>
    <!--      @selection-change="handleSelectionChange"-->
    <el-table
      v-loading="loading"
      :data="schList"
      style="width:70%;margin: 0 auto;"
    >
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column label="序号" sortable align="center" prop="hosName" />-->

      <el-table-column label="医院排名" align="center" prop="hos_name" />
      <el-table-column label="科室名称" align="center" prop="dept_name" />

      <el-table-column label="医生姓名" align="center" prop="doc_name" />
      <el-table-column label="消息数" align="center" prop="count" />

    </el-table>
    <!-- 添加或修改基础服务_排班 v1.3.2 A对话框 -->
<!--    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>-->
<!--      <el-form ref="form" :model="form" :rules="rules" label-width="80px">-->

<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
  import {
    listYhgx
  } from "@/api/monitor/tongji";
  import { listHosData } from "@/api/yiliao/base/hosData";

  export default {
    name: "Sch",
    components: {},
    data() {
      return {
        // 设置只能选择当前日期及之后的日期
        pickerOptions:{
          disabledDate(time){
            let _now = Date.now(),
              seven = 10 * 24 * 60 * 60 * 1000,
              sevenDays = _now + seven;
            return time.getTime() < _now || time.getTime() > sevenDays;
            //大于当前的禁止，小于7天前的禁止
          }
        },

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
        time: null,
        // 查询参数
        queryParams: {
          // pageNum: 1,
          // pageSize: 10,
          code:'群发消息统计',
          value:null,
          // 'ru.dt_create':"between '2021-04-20 21:16:28' and '2021-04-21 17:32:25'"
          'dt_create':null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {

        },
        hosIdOptions: [], //所属医院
      };
    },
    created() {
      this.getNowTime();
      listHosData({ hosType: "HOS" }).then((response) => {
        this.hosIdOptions = response.rows;
        if (response.total != 0){
          if(response.rows[0]){
            console.log(response.rows,333)
            this.queryParams.value = response.rows[0].hosId;
            console.log(this.time,2222222)
            this.getList();
          }
        }
      });

    },
    methods: {
      /** 查询基础服务_排班 v1.3.2 A列表 */
      getList() {
        this.loading = true;
        // this.$set(this.queryParams, "ru.dt_create", );

        listYhgx(this.queryParams).then((response) => {
          this.schList = response.data;
          this.loading = false;
        });
      },

      getList1() {
        this.loading = true;
        console.log(this.time,555)
        // "between '2021-04-20 21:16:28' and '2021-04-21 17:32:25'"
        // var aa = "between '2021-04-20' and '2021-04-21'";
        var aa = "between '"+this.time[0]+"' and '"+this.time[1]+"'";
        this.$set(this.queryParams, "dt_create", aa);

        listYhgx(this.queryParams).then((response) => {
          this.schList = response.data;
          this.loading = false;
        });
      },

      getNowTime() {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        month = month + 1;
        month = month.toString().padStart(2, "0");
        date = date.toString().padStart(2, "0");
        var defaultDate = `${year}-${month}-${date}`;
        var aa = "between '"+defaultDate+"' and '"+defaultDate+"'";
        this.time = aa;
        this.$set(this.queryParams, "dt_create", aa);
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList1();
      },
    },
  };
</script>

<!--<style>-->
<!--  .el-table{-->
<!--    width: 70%;-->
<!--    margin: 0 auto;-->
<!--  }-->
<!--  .el-form&#45;&#45;inline{-->
<!--    text-align: center;-->
<!--  }-->
<!--  .version-container {-->
<!--    padding: 60px;-->
<!--  }-->
<!--</style>-->
