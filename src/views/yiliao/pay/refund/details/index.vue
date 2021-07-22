<template style="background: #f3f4f8;">
    <div
        class="app-container"
        style="margin: auto; width: 100%; background: #f3f4f8; margin-top: 30px"
    >
        <div v-for="(item, index) in listData"
             :key="index">
            <div class="chufang" style="margin: auto; width: 60% ">
                <h5 style="display: inline-block;
                font-size: 14px;
                margin: 0 0 7px;
                padding: 0;    font-size: 13px;
                text-overflow: ellipsis;
                float: left;"
                > 退款订单详情</h5>
            </div>
            <div
                class="content"
                style="
                display: flex;
                justify-content: space-between;
                width: 60%;
                margin: auto;
                "
            >
                <div style="width: 100%; ">
                    <div>
                        <span style="width: 25%">平台退款单号 {{ item.refund_no }}</span>
                        <span style="width: 70%; text-align: right">平台支付单号 {{ item.pay_trade_no}}</span>
                    </div>
                    <div>
            <span style="width: 25%">退款金额 {{item.refund_amount * 0.01}}</span>
                        <span style="width: 70%; text-align: right">退款状态 <span v-if="item.refund_status == '0'">退款中</span>
                        <span v-if="item.refund_status == '1'">成功</span>
                        </span>
                    </div>
                    <div>
            <span style="width: 25%">服务商
            <span v-if="item.pay_way == '11'">微信</span>
                        <span v-if="item.pay_way == '12'">支付宝</span>
            </span>
                        <span style="width: 70%; text-align: right">服务商退款单号 </span>
                    </div>
                    <div>
            <span style="width: 25%">创建时间 {{item.dtCreate}}</span>
                        <span style="width: 70%; text-align: right">退款时间 {{item.dtCreate}}</span>
                    </div>
                    <div id="bor"></div>
                    <div class="chufang" style="margin-left: -16px; width: 60% ">
                        <h5 style="display: inline-block;
                        font-size: 14px;
                        margin: 0 0 7px;
                        padding: 0;    font-size: 13px;
                        text-overflow: ellipsis;
                        float: left;"
                        > 支付详情</h5>
                    </div>
                    <div style="border-bottom: 1px solid #e7eaec !important;"></div>
                    <div>
            <span style="width: 25%">平台支付单号 {{item.pay_trade_no}}</span>
                        <span style="width: 70%; text-align: right"></span>
                    </div>
                    <div>
            <span style="width: 70%">交易主题 {{item.subject}}</span>
                        <span style="width: 25%; text-align: right">支付状态
                        <span v-if="item.pay_status == '1'">支付成功</span>
                        <span v-if="item.pay_status == '0'">未知</span>
                        <span v-if="item.pay_status == '2'">退款成功</span>
                        <span v-if="item.pay_status == '3'">交易结束</span>
                        <span v-if="item.pay_status == '-3'">交易关闭</span>
                        <span v-if="item.pay_status == '-2'">退款失败</span>
                        <span v-if="item.pay_status == '-1'">支付失败</span></span>
                    </div>
                    <div>
            <span style="width: 25%">支付金额 {{item.refund_amount * 0.01}}</span>
                        <span style="width: 70%; text-align: right">已退款金额 {{item.refund_amount * 0.01}}</span>
                    </div>
                    <div>
            <span style="width: 25%">服务商 <span v-if="item.pay_way == '11'">微信</span>
                        <span v-if="item.pay_way == '12'">支付宝</span></span>
                        <span style="width: 70%; text-align: right">服务商支付单号 </span>
                    </div>
                    <div>
            <span style="width: 25%">创建时间 {{item.dtCreate}}</span>
                        <span style="width: 70%; text-align: right">支付时间 {{item.shTime}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { listYhgx, listYhgxPlus } from '@/api/monitor/tongji'

export default {
    name: 'Sch',
    components: {},
    data() {
        return {
            dialogVisible: false,
            // 查询参数
            queryParams: {
                code: '退款订单详情'
            },
            listData: []
        }
    },
    created() {
        let id = this.$route.query.id
        this.queryParams.value = id
        this.queryParams.code = '退款订单详情'
        listYhgxPlus(this.queryParams).then((response) => {
            this.listData = response.rows
            this.loading = false
        })
    },
    methods: {}
}
</script>
<style scoped>
.el-dialog {
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

span {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
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
    font-size: 13px;
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
