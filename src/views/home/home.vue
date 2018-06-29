<template>
    <div class="home-container">
        <time class="homeTitle">{{homeTitle}}</time>
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
                                <em v-if="todayStatistics">{{todayStatistics.in}}</em>
                            </div>
                            <div class="panelItem-bottom">
                                <div>
                                    <Icon type="ios-cart"></Icon>
                                    <p>今日支出</p>
                                </div>
                                <em v-if="todayStatistics">{{todayStatistics.out}}</em>
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
                                <em v-if="weekStatistics">{{weekStatistics.in}}</em>
                            </div>
                            <div class="panelItem-bottom">
                                <div>
                                    <Icon type="ios-cart"></Icon>
                                    <p>本月支出</p>
                                </div>
                                <em v-if="weekStatistics">{{weekStatistics.out}}</em>
                            </div>
                        </Card>
                    </Col>
                </Col>
            </Row>
        </div>
        <div>
            <Tabs type="card" class="homeCard">
                <TabPane label="日订单">标签一的内容</TabPane>
                <TabPane label="月订单">标签二的内容</TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    import ajax from '@/api/home';
    import {parseTime} from '@/filters';

    export default {
        name: 'home',
        components: {},
        data () {
            return {
                homeTitle: '',
                todayStatistics: {
                    in: undefined,
                    out: undefined
                },
                weekStatistics: {
                    in: undefined,
                    out: undefined
                }
            };
        },
        created () {
            this.homeTitle = parseTime(new Date(), '{y}-{m}-{d}');
            this.getTodayList();
            this.getWeekList();
        },
        computed: {},
        methods: {
            getTodayList () {
                let queryParam = {
                    start_time: this.homeTitle,
                    end_time: this.homeTitle
                };
                ajax.statisticsList(queryParam).then(response => {
                    if (response.success == true) {
                        if (response.data) {
                            this.todayStatistics = {
                                in: response.data.inAmount,
                                out: response.data.outAmount,
                            };
                        }
                    } else {
                        this.$Message.error(response.msg ? response.msg : '今日财务信息请求未成功');
                    }
                }).catch(() => {
                });
            },
            getWeekList () {
                let queryParam = {
                    start_time: this.homeTitle,
                    end_time: parseTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}')
                };
                ajax.statisticsList(queryParam).then(response => {
                    if (response.success == true) {
                        if (response.data) {
                            this.weekStatistics = {
                                in: response.data.inAmount,
                                out: response.data.outAmount,
                            };
                        }
                    } else {
                        this.$Message.error(response.msg ? response.msg : '本月财务信息请求未成功');
                    }
                }).catch(() => {
                });
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
