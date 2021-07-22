<template style="background: #f3f4f8;">
    <div
        class="app-container"
        style="margin: auto; width: 100%; background: #f3f4f8; margin-top: 30px"
    >
        <div v-for="(item, index) in schList"
             :key="index"
        >
        <div class="chufang" style="margin: auto; width: 60% ">
            <h5 style="display: inline-block;
                font-size: 14px;
                margin: 0 0 7px;
                padding: 0;    font-size: 13px;
                text-overflow: ellipsis;
                float: left;"
            > 处方</h5>
            <div style="display: inline-block;
                display: flex;
                justify-content: flex-end;
                color: #ff780e;
                font-weight: bold;    font-size: 13px;
                position: relative;
                padding: 0;"
            >
                <p v-if="item.orderStatus == 'WAITTAKE'">待配送</p>
                <p v-if="item.orderStatus == 'SHIPPING'">配送中</p>
                <p v-if="item.orderStatus == 'COMPLETE'">已完成</p>
            </div>
        </div>
        <div
            class="content"
            style="
        display: flex;
        justify-content: space-between;
        width: 60%;
        margin: auto;"
        >

                <div style="width: 200%;">
                    <div class="top">
                        <div style="">处方编号：{{ item.orderNo }}</div>
                        <div style="">开方日期：{{ item.dtCreate }}</div>
                    </div>
                    <div id="bor"></div>

                    <div class="xinxi">
                        <span>患者姓名:{{ item.visitName }}</span>
                        <span style="margin: 0 30px">性别：{{ item.visitGender }}</span>
                        <span>年龄：25</span>
                        <span style="margin: 0 30px">手机号：{{ item.visitMobile }}</span>
                    </div>

                    <div><span>过敏史：{{ item.allergyHistory }}</span></div>
                    <div><span>初步诊断：{{ item.diagnosis }}</span></div>
                    <div id="bor"></div>
                    <div>
                        <div>
                            <span style="width: 25%">药品信息</span>
                            <span style="width: 70%; text-align: right">药品总价：{{ item.drugTotalPrice }}元</span>
                        </div>

                        <div>
                            <span style="width: 55%">{{ item.drugName }}</span>
                            <span style="width: 20%">{{ item.drugSpecification }}</span>
                            <span style="width: 20%; text-align: right; color: #ff780e"
                            >￥{{ item.drugTotalPrice }}</span
                            >
                        </div>

                        <div>
            <span style="width: 75%; font-weight: normal"
            >药品用法：{{ item.admission }}，{{ item.frequencyName }}</span
            >
                            <span
                                style="
                width: 20%;
                text-align: right;
                font-weight: normal;
                color: #0e9aef;
              "
                            >x 1</span
                            >
                        </div>
                        <div id="bor"></div>
                        <div>
                            <div>
                                <span style="width: 48%">处方医生：{{ item.kfName }}</span>
                                <span style="width: 48%">审核药师：{{ item.shName }}</span>
                            </div>
                            <div>
                                <span style="width: 48%"><img src="item.openStamp"> </span>
                                <span style="width: 48%"><img src="item.auditStamp"></span>
                            </div>
                            <div>
                                <span style="width: 48%">开方时间：{{ item.dtCreate }}</span>
                                <span style="width: 48%">审核时间：{{ item.shTime }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { listYhgx } from '@/api/monitor/tongji'

export default {
    name: 'listYhgx',
    components: {},
    data() {
        return {
            dialogVisibe: false,
            schList: []
        }
    },
    created() {
        let id = this.$route.query.id
        listYhgx({ code: '处方信息记录详情', value: id }).then((response) => {
            this.schList = response.data
            this.loading = false
        })
    },
    methods: {}
}
</script>
<style scoped>
.el-dialogs {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*height:600px;*/
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
}

.el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
}

.container {
    font-size: 13px;
}

.app-container span {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
    font-size: 13px;
}

.xinxi span {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
}

div {
    margin-bottom: 15px;
}

.top div {
    font-size: 13px;
    margin-bottom: 15px;
}

#bor {
    margin: 15px 0;
    border-bottom: 1px solid #e7eaec !important;
}

.chufang {
    background-color: #fff;
    border-color: #e7eaec;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    border-style: solid solid none;
    /* border-width: 4px 0 0; */
    border-width: 0 0;
    color: inherit;
    margin-bottom: 0;
    padding: 14px 15px 7px;
    min-height: 48px;
}

.content {
    background-color: #fff;
    color: inherit;
    padding: 15px 20px 20px;
    border-color: #e7eaec;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    border-style: solid solid none;
    border-width: 1px 0;
}

.el-row {
    margin-bottom: 20px;
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
