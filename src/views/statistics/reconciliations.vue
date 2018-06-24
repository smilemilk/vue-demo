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
                    <a>最近一周</a>
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
                        <Button type="primary">开始对账</Button>
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
                dateSearch: '',
                columnsTable: table.columnsTable,
                dataList: [],
                initTable3: []
            };
        },
        created() {
            this.getList();
        },
        computed: {
            dataListComputed () {
                console.log('8888888')
                console.log(this.$refs.table)
                if (this.$refs.table) {
                    console.log('--------------')
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
                    this.queryParams.billStartTime = parseTime(this.dateSearch[0]);
                    this.queryParams.billEndTime = parseTime(this.dateSearch[1]);
                } else {
                    this.queryParams.billStartTime = '';
                    this.queryParams.billEndTime = '';
                }
            },
            getList () {
                console.log('00000000009999999');
                ajax.refundList({
                    page: 1,
                    limit: 50,
                    billStartTime: '2018-06-24',
                    // billEndTime: '',
                }).then(response => {
                    console.log('0000000');
                    console.log(response);
                }).catch(() => {
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
    .ivu-page.mini{
        margin-top: 15px;
    }
</style>
