<template>
    <div>
        <Card class="searchBox">
            <Form ref="queryParams" :model="queryParams" inline :label-width="60" label-position="left">
                <FormItem label="日期:" prop="dateSearch">
                    <DatePicker v-model="dateSearch"
                                format="yyyy-MM-dd"
                                type="daterange"
                                placement="bottom-start"
                                placeholder="选择开始日期—结束日期"
                                style="width: 200px"
                                @change="dateChange"></DatePicker>
                </FormItem>
                <div class="dateSearchQuick">
                    <a @click="dateWeekAction">最近一周</a>
                    <a>最近30天</a>
                </div>
            </Form>
            <div>
                <Row>
                    <Col span="12" :md="12" :sm="24" :xs="24">
                        <figure>
                            <label>待处理天数:<em>1</em></label>
                            <label>已归档天数:<em>1</em></label>
                        </figure>
                    </Col>
                    <Col span="12" :md="12" :sm="24" :xs="24">
                        <Button type="primary">查询</Button>
                        <Button type="primary">导出</Button>
                        <Button type="primary" @click="reconciliationsOpera">开始对账</Button>
                        <Button type="primary">对账结果下载</Button>
                    </Col>
                </Row>
            </div>
        </Card>
        <Card>
            <Table
                    ref="table"
                    :columns="columnsTable"
                    :data="dataListComputed"
                    :height="tableHeight"
                    highlight-row
                    border></Table>
            <Page :total="total"
                  size="small"
                  show-elevator
                  show-sizer></Page>
        </Card>
        <Modal
                class-name="reconciliationsDialog"
                width="70%"
                v-model="showDialog">
            <div slot="header">
                <figure>
                    <span>{{this.queryParams.billStartTime ? this.queryParams.billStartTime : '——'}}</span>至
                    <span>{{this.queryParams.billEndTime ? this.queryParams.billEndTime : '——'}}</span>
                </figure>
                <title>开始对账</title>
            </div>
            <div>
                <section>
                    <p>医院账单</p>
                    <div>

                    </div>
                </section>
            </div>
            <div slot="footer">
                <Row>
                    <Col span="12">
                        <div class="reconciliationsBottom">
                            <label>历史对账结果</label>
                            <Button type="primary" shape="circle" size="small">保留</Button>
                            <Button type="default" shape="circle" size="small">不保留</Button>
                        </div>
                    </Col>
                    <Col span="12">
                        <Button type="primary" size="large">开始对账</Button>
                    </Col>
                </Row>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as table from './store/reconciliations';
    import {parseTime} from '@/filters';
    import ajax from '@/api/statistics';

    export default {
        name: 'searchable-table',
        data () {
            return {
                tableHeight: 320,
                total: 0,
                queryParams: {
                    billStartTime: '',
                    billEndTime: '',
                    page: 1
                },
                dateSearch: [],
                columnsTable: table.columnsTable,
                dataList: [],
                initTable3: [],

                showDialog: false
            };
        },
        created () {
            this.getList();
        },
        computed: {
            dataListComputed () {
                console.log('8888888');
                console.log(this.$refs.table);
                if (this.$refs.table) {
                    console.log('--------------');
                    this.tableHeight =
                        window.innerHeight - this.$refs.table.$el.offsetTop - 400;
                    if (this.tableHeight < 200) {
                        this.tableHeight = 200;
                    }
                }
                return this.dataList;
            }
        },
        methods: {
            dateChange (val) {
                if (val) {
                    this.queryParams.billStartTime = parseTime(this.dateSearch[0], '{y}-{m}-{d}');
                    this.queryParams.billEndTime = parseTime(this.dateSearch[1], '{y}-{m}-{d}');
                } else {
                    this.queryParams.billStartTime = '';
                    this.queryParams.billEndTime = '';
                }
            },
            dateWeekAction() {
                this.queryParams.billEndTime = parseTime(new Date(), '{y}-{m}-{d}');
                this.queryParams.billStartTime = parseTime(new Date().getTime() - 7*24*60*60*1000, '{y}-{m}-{d}')
                this.dateSearch = [this.queryParams.billStartTime, this.queryParams.billEndTime];
            },
            getList () {
                console.log('00000000009999999');
                ajax.refundList({
                    page: 1,
                    limit: 50,
                    billStartTime: '2018-06-24',
                    // billEndTime: '',
                }).then(response => {
                    response = {
                        'success': true,
                        'msg': null,
                        'data':
                            {
                                'page': 1,
                                'start': 0,
                                'limit': 10000,
                                'jqGrid': true,
                                'totalCount': 3,
                                'pages': 1,
                                'items':
                                    [{
                                        'checkOrderNo': 855302639452169,
                                        'mchUserId': 829396034256942,
                                        'billStartTime': 1529337600000,
                                        'billEndTime': null,
                                        'unioncheckorderStatus': '5',
                                        'mchBusinessTotalAmount': 57479879,
                                        'appBusinessTotalAmount': 57478279,
                                        'fundTransactionTotalAmount': 60505679,
                                        'appBusinessTotalCount': 1283,
                                        'fundTransactionTotalCount': 1321
                                    },
                                        {
                                            'checkOrderNo': 855302639452167,
                                            'mchUserId': 829396034256942,
                                            'billStartTime': 1529251200000,
                                            'billEndTime': null,
                                            'unioncheckorderStatus': '5',
                                            'mchBusinessTotalAmount': 45001839,
                                            'appBusinessTotalAmount': 45001839,
                                            'fundTransactionTotalAmount': 45001839,
                                            'appBusinessTotalCount': 1446,
                                            'fundTransactionTotalCount': 1446
                                        }, {
                                        'checkOrderNo': 855302639452165,
                                        'mchUserId': 829396034256942,
                                        'billStartTime': 1529164800000,
                                        'billEndTime': null,
                                        'unioncheckorderStatus': '6',
                                        'mchBusinessTotalAmount': 28932032,
                                        'appBusinessTotalAmount': 28932032,
                                        'fundTransactionTotalAmount': 28932032,
                                        'appBusinessTotalCount': 1242,
                                        'fundTransactionTotalCount': 1242
                                    }],
                                'orderColumn': null,
                                'orderDir': 'DESC',
                                'mchUserId': 829396034256942,
                                'billStartTime': 1529164800000,
                                'billEndTime': 1529769599000,
                                'unioncheckorderStatus': '',
                                'defaultOrderColumn': null
                            }
                    };
                    console.log(response);
                    if (response.success == true) {
                        console.log('======');
                    }
                }).catch(() => {
                    console.log('erro');
                });
            },
            search (data, argumentObj) {
                let res = data;
                let dataClone = data;
                for (let argu in argumentObj) {
                    if (argumentObj[argu].length > 0) {
                        res = dataClone.filter(d => {
                            return d[argu].indexOf(argumentObj[argu]) > -1;
                        });
                        dataClone = res;
                    }
                }
                return res;
            },
            reconciliationsOpera () {
                this.showDialog = true;
            }
        }
    };
</script>

<style lang="less" scoped>
    .ivu-card {
        margin-bottom: 10px;
    }

    .searchBox {
        .ivu-form-item {
            margin-bottom: 12px;
        }
        form {
            & + div {
                padding-top: 12px;
                border-top: 1px solid #e9eaec;
            }
        }
        .dateSearchQuick {
            a {
                display: inline-block;
                height: 32px;
                line-height: 32px;
                overflow: hidden;
                margin: 0 15px 0 25px;
                &:nth-child(2) {
                    margin-right: 0;
                }
            }
        }
        figure {
            height: 32px;
            overflow: hidden;
            label {
                display: inline-block;
                height: 32px;
                line-height: 32px;
                margin-right: 15px;
                em {
                    display: inline-block;
                    margin-left: 5px;
                    font-style: normal;
                }
            }
        }
        button {
            margin-right: 15px;
        }
    }

    .dateSearchQuick {
        display: inline-block;
    }

    .ivu-page.mini {
        margin-top: 15px;
    }

    .reconciliationsDialog {
        .reconciliationsBottom {
            height: 36px;
            overflow: hidden;
            text-align: left;
            line-height: 36px;
            label{
                display: inline-block;
            }
        }
    }
</style>
