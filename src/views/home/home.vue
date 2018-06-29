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
                                <em>1111</em>
                            </div>
                            <div class="panelItem-bottom">
                                <div>
                                    <Icon type="ios-cart"></Icon>
                                    <p>今日支出</p>
                                </div>
                                <em>1111</em>
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
                                <em>1111</em>
                            </div>
                            <div class="panelItem-bottom">
                                <div>
                                    <Icon type="ios-cart"></Icon>
                                    <p>本月支出</p>
                                </div>
                                <em>1111</em>
                            </div>
                        </Card>
                    </Col>
                </Col>
            </Row>
        </div>
        <div>
            <Tabs type="card" class="homeCard">
                <TabPane label="标签一">标签一的内容</TabPane>
                <TabPane label="标签二">标签二的内容</TabPane>
                <TabPane label="标签三">标签三的内容</TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    // import ajax from '@/api/agency';
    import {parseTime} from '@/filters';
    export default {
        name: 'home',
        components: {
        },
        data () {
            return {
                homeTitle: ''
            };
        },
        created () {
            this.homeTitle = parseTime(new Date(), "{y}-{m}-{d}");
            // this.getList();
        },
        computed: {

        },
        methods: {
            // getList () {
            //     console.log('00000000009999999');
            //     ajax.refundList({
            //         page: 1,
            //         limit: 10,
            //         billStartTime: '',
            //         billEndTime: '',
            //     }).then(response => {
            //         console.log('0000000');
            //         console.log(response);
            //     }).catch(() => {
            //     });
            // }
        }
    };
</script>

<style lang="less" scoped>
    @import "../../styles/common";

    .homeTitle {
        display: block;
        font-size: 16px;
        margin-bottom: 10px;
        margin-top: 20px;
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
    .homeCard {
        .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
            background: #fff;
            padding: 16px;
        }

        .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
            border-color: transparent;
        }

        .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
            border-color: #fff;
        }
    }
    @media screen and (max-height: 786px){
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
