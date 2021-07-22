<template>
  <div style=" overflow: hidden;">
    <el-row>
      <el-col :span="24" :offset="0">
        <div
          id="dataShow"
          onmouseover="this.style.overflow='overlay'"
          onmouseout="this.style.overflow='hidden'"
          class="dataShow"
        >
          <div
            v-for="(item, index) in logList"
            :key="index"
            style="background-color: #f5f5f5; padding:24px;"
          >
            <el-row>
              <div v-if="item.msgSenderType == '用户'">
                <el-col :span="20" :offset="0">
                  <div style="width: 51%; display: flex;">
                    <div style="width: 9%;" v-if="item.avatar != null">
                      <img
                        :src="item.avatar"
                        alt=""
                        srcset=""
                        style="width: 61px;border-radius: 13px;height: 61px"
                      />
                    </div>
                    <div style="width: 9%;" v-else>
                      <img
                        src="@/assets/default/default.png"
                        alt=""
                        srcset=""
                        style="width: 61px;border-radius: 13px;height: 61px"
                      />
                    </div>
                    <div style="margin-left:2%">
                      <span>
                        {{ item.realName }}
                      </span>
                      <div>
                        <!--                        <span>性别:{{ item.visitGender }}</span>-->
                        <!--                        <span> 年龄:{{ item.visitAge }}</span>-->
                        <!--                        <span> 电话:{{ item.userMobile }}</span>-->
                      </div>
                      <span>{{ item.dtCreate }}</span>
                    </div>
                  </div>
                  <span class="bb">
                    {{ item.msgContent }}
                  </span>
                </el-col>
              </div>
              <el-col :span="1">
                <span>
                  <svg-icon
                    slot="reference"
                    icon-class="girl"
                    style="font-size: 40px"
                  />
                  <!--对应头像-->
                </span>
              </el-col>
            </el-row>
            <br />
            <el-row>
              <el-col :span="1">
                <span>
                  <svg-icon
                    slot="reference"
                    icon-class="person"
                    style="font-size: 40px"
                  />
                </span>
              </el-col>
              <div v-if="item.msgSenderType == '医生'">
                <el-col :span="24">
                  <div
                    style="width: 51%;
                          display: flex;
                          justify-content: flex-end;
                          margin-left: 49%;"
                  >
                    <div style="margin-right:2%;text-align:right;">
                      <span>
                        {{ item.docName }}
                      </span>
                      <div>
                        <!--                        <span>性别:女</span>-->
                        <!--                        <span> 年龄:31</span>-->
                        <!--                        <span> 电话:15630526180</span>-->
                      </div>
                      <span>{{ item.dtCreate }}</span>
                    </div>
                    <div style="width: 7.5%;" v-if="item.docAvatar != null">
                      <img
                        :src="item.docAvatar"
                        alt=""
                        srcset=""
                        style="width: 61px;border-radius: 13px;height: 61px"
                      />
                    </div>
                    <div style="width: 7.5%;" v-else>
                      <img
                        src="@/assets/default/default.png"
                        alt=""
                        srcset=""
                        style="width: 61px;border-radius: 13px;height: 61px"
                      />
                    </div>
                  </div>
                  <span class="aa">
                    {{ item.msgContent }}
                  </span>
                </el-col>
              </div>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listMessage,
  getMessage,
  delMessage,
  addMessage,
  updateMessage,
  exportMessage
} from "@/api/yiliao/relation/message";

export default {
  name: "Message",
  components: {},
  data() {
    return {
      // 敏感词日志记录表格数据
      logList: [],
      // 表单参数
      form: {},
      rules: {}
    };
  },
  created() {
    let id = this.$route.query.rdId;
    this.loading = true;
    getMessage(id).then(response => {
      this.logList = response.data;
      this.total = response.total;
      this.loading = false;
    });
  }
};
</script>

<style>
.font {
  font-size: 16px;
  font-weight: bold;
  font-family: "微软雅黑 Light";
}

.dataShow {
  /* overflow-y: hidden;
                          overflow-x: hidden;
                          margin-bottom: -24px;
                          margin-top: -24px;
                          height:600px;
                          margin-bottom: 5%;
                          margin-top: 5%; */
}

.aa {
  float: right;
  position: relative;
  display: inline-block;
  max-width: calc(40%);
  min-height: 35px;
  line-height: 2.1;
  font-size: 15px;
  padding: 6px 10px;
  text-align: left;
  word-break: break-all;
  background-color: #9eea6a;
  color: #000;
  border-radius: 4px;
  box-shadow: 0px 1px 7px -5px #000;
  border: 0px solid #000;
  margin-top: 8px;
  margin-right: 76px;
}

.aa:after {
  content: "";
  border-top: solid 5px #00800000;
  border-left: solid 10px #9eea6a;
  border-right: solid 10px #00800000;
  border-bottom: solid 5px #00800000;
  position: absolute;
  top: 10px;
  left: 100%;
}

.bb {
  display: inline-block;
  line-height: 30px;
  font-style: normal;
  background-color: white;
  letter-spacing: 2px;
  position: relative;
  max-width: calc(40%);
  min-height: 35px;
  line-height: 2.1;
  font-size: 15px;
  padding: 6px 10px;
  text-align: left;
  word-break: break-all;
  border-radius: 4px;
  color: #000;
  box-shadow: 0px 1px 7px -5px #000;
  border: 0px solid #000;
  margin-top: 8px;
  margin-left: 76px;
}

.bb:after {
  content: "";
  border-top: solid 5px #00800000;
  border-left: solid 10px #00800000;
  border-right: solid 10px white;
  border-bottom: solid 5px #00800000;
  position: absolute;
  top: 10px;
  right: 100%;
}
</style>
