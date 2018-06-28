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
                                @on-change="dateChange"></DatePicker>
                </FormItem>
                <div class="dateSearchQuick">
                    <a @click="dateWeekAction">最近一周</a>
                    <a @click="dateMonthAction">最近30天</a>
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
                        <Button type="primary" @click="getList('queryParams')">查询</Button>
                        <Button type="primary" @click="exportAction">导出</Button>
                        <Button type="primary" @click="reconciliationsOpera">开始对账</Button>
                        <Button type="primary" @click="downloadAction">对账结果下载</Button>
                        <Button @click="handleSelectAll(true)" style="display:none;">全选</Button>
                    </Col>
                </Row>
            </div>
        </Card>
        <Card>
            <Table
                    ref="table"
                    :columns="columnsTable"
                    :data="dataList"
                    :height="tableHeight"
                    highlight-row
                    border
                    @on-selection-change="handleRowChange"
            ></Table>
            <Page :total="total"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="handleCurrentPageChange"
                  @on-page-size-change="handlePageSizeChange"></Page>
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
                <section class="operatorSection">
                    <p>医院账单</p>
                    <div>
                        <div class="operateItem operatorEmpty">
                            <div class="operateContainer">
                                <Icon type="clipboard"></Icon>
                                <p class="operateName">HIS</p>
                                <p>空</p>
                            </div>
                            <Icon type="trash-a" class="hidden" @click="emptyOpera"></Icon>
                        </div>
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
        <Modal
                class-name="downloadDialog"
                width="300px"
                v-model="downloadShowDialog">
            <div slot="header">
                <p>对账结果下载</p>
            </div>
            <div>
                <CheckboxGroup @on-change="downloadLabelAction">
                    <Checkbox label="微脉代收"></Checkbox>
                    <Checkbox label="支付宝"></Checkbox>
                    <Checkbox label="支付宝-健康台州"></Checkbox>
                    <Checkbox label="支付宝-健康台州"></Checkbox>
                    <Checkbox label="支付宝-微脉"></Checkbox>
                </CheckboxGroup>
            </div>
            <div slot="footer">
                <Row>
                    <Col span="24">
                        <Button type="primary" @click="handleLabelAction">确认</Button>
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
                searchActive: false,
                tableHeight: 320,
                total: 0,
                multipleSelection: [], // 计算选中项
                queryParams: {
                    billStartTime: '',
                    billEndTime: '',
                    page: 1, // 页数
                    limit: 10 // 一页几条
                },
                dateSearch: [],
                columnsTable: table.columnsTable,
                dataList: [],
                initTable3: [],

                showDialog: false,
                downloadShowDialog: false,
                downloadLabels: [],
            };
        },
        created () {
            this.queryParams.billEndTime = parseTime(new Date(), '{y}-{m}-{d}'); // 首次进来默认展示一周数据
            this.queryParams.billStartTime = parseTime(new Date().getTime() - 60 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}'); // 首次进来默认展示一周数据
            this.dateSearch = [this.queryParams.billStartTime, this.queryParams.billEndTime];
            this.getList();
        },
        computed: {
            // dataListComputed () {
            //     if (this.$refs.table) {
            //         this.tableHeight =
            //             window.innerHeight - this.$refs.table.$el.offsetTop - 400;
            //         if (this.tableHeight < 200) {
            //             this.tableHeight = 200;
            //         }
            //     }
            //     return this.dataList;
            // }
        },
        methods: {
            dateChange (val) {
                if (val) {
                    this.queryParams.billStartTime = parseTime(this.dateSearch[0], '{y}-{m}-{d}');
                    this.queryParams.billEndTime = parseTime(this.dateSearch[1], '{y}-{m}-{d}');
                    console.log(this.queryParams);
                } else {
                    this.queryParams.billStartTime = '';
                    this.queryParams.billEndTime = '';
                }
            },
            dateWeekAction () {
                this.queryParams.billEndTime = parseTime(new Date(), '{y}-{m}-{d}');
                this.queryParams.billStartTime = parseTime(new Date().getTime() - 7 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}');
                this.dateSearch = [this.queryParams.billStartTime, this.queryParams.billEndTime];
                this.getList();
            },
            dateMonthAction () {
                this.queryParams.billEndTime = parseTime(new Date(), '{y}-{m}-{d}');
                this.queryParams.billStartTime = parseTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}');
                this.dateSearch = [this.queryParams.billStartTime, this.queryParams.billEndTime];
                this.getList();
            },
            getList () {
                ajax.refundList(this.queryParams).then(response => {
                    if (response.success == true) {
                        if (response.data.items) {
                            this.dataList = response.data.items;
                            this.total = response.data.totalCount;
                        } else {
                            this.dataList = [];
                        }
                    } else {
                        this.$Message.error(response.msg ? response.msg : '客户统一对账表单请求未成功');
                    }
                }).catch(() => {
                });
            },
            handleRowChange (selection) {
                console.log(selection);
                this.multipleSelection = selection;
            },
            handleSelectAll (status) {
                this.$refs.table.selectAll(status);
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
            exportAction () {
                if (this.multipleSelection.length > 0) {
                    console.log(this.multipleSelection);
                } else {
                    this.$Message.error({
                        content: '请先选择要导出的账单',
                        duration: 2,
                        closable: true
                    });
                    return;
                }
            },
            downloadLabelAction (data) {
                console.log(data);
                this.downloadLabels = data;
            },
            handleLabelAction () {
                if (this.downloadLabels.length > 0) {
                    console.log(this.downloadLabels);
                    // this.$Modal.success({
                    //     title: '确定要下载' + this.downloadLabels + '账单',
                    //     content: '确定要下载' + this.downloadLabels + '账单'
                    // });
                } else {
                    this.$Message.error({
                        content: '请先选择要对账的类目',
                        duration: 2,
                        closable: true
                    });
                    return;
                }
            },
            reconciliationsOpera () {
                this.showDialog = true;
            },
            // 对账内部操作
            emptyOpera() {
                this.showDialog = false;
                this.$Modal.confirm({
                    content: '确定要删除吗',
                    okText: '确定',
                    cancelText: '取消'
                }).then(
                ).catch(()=>{
                    this.showDialog = true;
                });
            },
            downloadAction () {
                if (this.multipleSelection.length > 0) {
                    this.downloadShowDialog = true;
                    console.log(this.multipleSelection);
                } else {
                    this.$Message.error({
                        content: '请先选择要下载的账单',
                        duration: 2,
                        closable: true
                    });
                    return;
                }
            },
            handleCurrentPageChange (val) {
                this.queryParams.page = val;
                this.getList();
            },
            handlePageSizeChange (val) {
                this.queryParams.limit = val;
                this.getList();
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../../styles/common";

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
                border-top: 1px solid @borderLight;
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

    .downloadDialog {
        .ivu-checkbox-group-item {
            display: block;
            margin-top: 8px;
            margin-bottom: 8px;
        }
    }

    .reconciliationsDialog {
        .reconciliationsBottom {
            height: 36px;
            overflow: hidden;
            text-align: left;
            line-height: 36px;
            label {
                display: inline-block;
            }
        }
    }

    .operatorSection {
        & > p {
            background-color: @borderLighter;
            margin-bottom: 15px;
            padding: 7px 0 7px 15px;
            & + div {
                padding-left: 15px;
            }
        }
        .operateItem {
            width: 116px;
            height: 84px;
            display: inline-block;
            padding: 5px 15px;
            border: 1px solid @borderLight;
            border-radius: 4px;
            text-align: center;
            overflow: hidden;
            .operateContainer {
                text-align: center;
            }
            i {
                font-size: 28px;
                color: @borderLight;
            }
            p {
                font-size: 14px;
                color: @borderLight;
                &.operateName {
                    color: #495060;
                    font-size: 15px;
                }
            }
            &.operatorEmpty {

            }
            &.operatorHas {
                display: flex;
                align-items: center;
                justify-content: center;
                border-color: @backgroundDanger;
                .operateContainer {
                    display: none;
                }
                .hidden {
                    display: block;
                }
                i {
                    color: @backgroundDanger;
                    cursor: pointer;
                    z-index: 10002;
                }
                &:hover {
                    background-color: rgba(55,55,55,.6);
                    z-index: 10001;
                }
            }
        }
    }
</style>
