<template>
    <div class="home-container">
        <time class="homeTitle">{{startDate}}</time>
        <div>
            <Row :gutter="16">
                <Col span="12" :xs="24" :sm="12" :md="12" :lg="12" style="margin-bottom: 10px;">
                <Col span="12" :xs="24" :sm="22" :md="20" :lg="16">
                <Card class="panelBox">
                    <div class="panelItem-top">
                        <div>
                            <Icon type="social-yen"></Icon>
                            <p>今日收入</p>
                        </div>
                        <em v-if="todayStatistics.in">{{todayStatistics.in}}</em>
                    </div>
                    <div class="panelItem-bottom">
                        <div>
                            <Icon type="ios-cart"></Icon>
                            <p>今日支出</p>
                        </div>
                        <em v-if="todayStatistics.out">{{todayStatistics.out}}</em>
                    </div>
                </Card>
                </Col>
                </Col>
                <Col span="12" :xs="24" :sm="12" :md="12" :lg="12" style="margin-bottom: 10px;">
                <Col span="12" :xs="24" :sm="22" :md="20" :lg="16">
                <Card class="panelBox">
                    <div class="panelItem-top">
                        <div>
                            <Icon type="social-yen"></Icon>
                            <p>本月收入</p>
                        </div>
                        <em v-if="weekStatistics.in">{{weekStatistics.in}}</em>
                    </div>
                    <div class="panelItem-bottom">
                        <div>
                            <Icon type="ios-cart"></Icon>
                            <p>本月支出</p>
                        </div>
                        <em v-if="weekStatistics.out">{{weekStatistics.out}}</em>
                    </div>
                </Card>
                </Col>
                </Col>
            </Row>
        </div>
        <div>
            <Tabs type="card" class="homeCard">
                <TabPane label="日订单">{{nowDate}}</TabPane>
                <TabPane label="月订单">{{monthDate}}</TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    import ajax from '@/api/home';
    import {parseTime, moneyFormat} from '@/filters';

    export default {
        name: 'home',
        components: {},
        data () {
            return {
                startDate: '',
                nowDate: '',
                monthDate: '',
                todayStatistics: {
                    in: null,
                    out: null
                },
                weekStatistics: {
                    in: null,
                    out: null
                }
            };
        },
        created () {
            this.todayTotal();
        },
        computed: {
        },
        methods: {
            getTodayList (start, end) {
                let queryParam = {
                    start_time: start,
                    end_time: end
                };
                ajax.statisticsList(queryParam).then(response => {
                    if (response.success == true) {
                        if (response.data) {
                            this.todayStatistics = {
                                in: moneyFormat(response.data.inAmount / 100),
                                out: moneyFormat(response.data.outAmount / 100),
                            };
                        }
                    } else {
                        this.$Message.error(response.msg ? response.msg : '今日财务信息请求未成功');
                    }
                }).catch(() => {
                });
            },
            getWeekList (start, end) {
                let queryParam = {
                    start_time: start,
                    end_time: end
                };
                ajax.statisticsList(queryParam).then(response => {
                    if (response.success == true) {
                        if (response.data) {
                            this.weekStatistics = {
                                in: moneyFormat(response.data.inAmount / 100),
                                out: moneyFormat(response.data.outAmount / 100),
                            };
                        }
                    } else {
                        this.$Message.error(response.msg ? response.msg : '本月财务信息请求未成功');
                    }
                }).catch(() => {
                });
            },
            todayTotal(){
                const today = new Date();
                this.startDate = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? "0" + today.getDate() : today.getDate());
                this.getTodayList(this.startDate, this.startDate);

                let monthStartDate = this.getCurrentMonthFirst();
                let monthEndDate = this.getCurrentMonthLast();
                let startDateStr = monthStartDate.getFullYear() + "-" + ((monthStartDate.getMonth() + 1) < 10 ? "0" + (monthStartDate.getMonth() + 1) : (monthStartDate.getMonth() + 1)) + "-" + (monthStartDate.getDate() < 10 ? "0" + monthStartDate.getDate() : monthStartDate.getDate());
                let endDateStr = monthEndDate.getFullYear() + "-" + ((monthEndDate.getMonth() + 1) < 10 ? "0" + (monthEndDate.getMonth() + 1) : (monthEndDate.getMonth() + 1)) + "-" + (monthEndDate.getDate() < 10 ? "0" + monthEndDate.getDate() : monthEndDate.getDate());
                this.getWeekList(startDateStr, endDateStr);

                this.nowDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate(); // line 时间点 当天
                this.monthDate = today.getFullYear() + "/" + (today.getMonth() + 1); // line 时间点 月
            },
            // 获取当前月的第一天
            getCurrentMonthFirst(){
                let date = new Date();
                date.setDate(1);
                return date;
            },
            // 获取当前月的最后一天
            getCurrentMonthLast(){
                let date = new Date();
                let currentMonth = date.getMonth();
                let nextMonth = ++ currentMonth;
                let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
                let oneDay = 1000 * 60 * 60 * 24;
                return new Date(nextMonthFirstDay - oneDay);
            },
//            transferDate(dt) {
//                var d = dt.split(" ");
//                var dYear = d[0].substring(0, 4);
//                var dMonth = d[0].substring(5, 7);
//                var dDate = d[0].substring(8, 10);
//                var lastLoginDate = dYear + "年" + dMonth + "月" + dDate + "日" + " " + d[1];
//                return lastLoginDate;
//            },
            //缓存指标
            loadIndexHistory(indexId) {
                var nowtime = new Date();
                var pre = nowtime.getFullYear() + nowtime.getMonth() + nowtime.getDate();
                var indexValue = sessionStorage.getItem(pre + "#" + indexId) == null ? '' : sessionStorage.getItem(pre + "#" + indexId);
                if (indexValue.indexOf("undefined") > -1) indexValue = "￥0.00";
            },
            saveIndexHistory(indexId) {
                var nowtime = new Date();
                var pre = nowtime.getFullYear() + nowtime.getMonth() + nowtime.getDate();
                if (indexValue.indexOf("undefined") > -1) indexValue = "￥0.00";
                return sessionStorage.setItem(pre + "#" + indexId, indexValue);
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../../styles/common";

    .homeTitle {
        display: block;
        font-size: 16px;
        margin-bottom: 5px;
        margin-top: 15px;
        margin-left: 5px;
    }

    .panelBox {
        [class^="panelItem-"] {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: center;
            i {
                font-size: 28px;
                margin-left: 8px;
            }
            p {
                font-size: 16px;
                margin-left: 40px;
                margin-top: -30px;
            }
            em {
                display: inline-block;
                font-size: 20px;
                font-style: normal;
                font-weight: 500;
                &:before {
                    display: inline-block;
                    content: '￥';
                    margin-right: 5px;
                    color: @fontColor;
                    font-size: 14px;
                    vertical-align: bottom;
                    font-weight: normal;
                }
            }
            &.panelItem-top {
                margin-bottom: 15px;
                i {
                    color: @backgroundSuccess;
                }
                em {
                    color: @backgroundSuccess;
                }
            }
            &.panelItem-bottom {
                padding-top: 15px;
                border-top: 1px solid @borderLight;
                i {
                    color: @backgroundDanger;
                }
                em {
                    color: @backgroundDanger;
                }
            }
        }
    }

    @media screen and (max-height: 786px) {
        .panelBox {
            [class^="panelItem-"] {
                &.panelItem-top {
                    margin-bottom: 10px;
                }
                &.panelItem-bottom {
                    padding-top: 10px;
                }
            }
        }
    }
</style>
