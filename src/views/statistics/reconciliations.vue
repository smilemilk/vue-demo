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
                            <label>待处理天数:<em>{{this.searchDay.item1 ? this.searchDay.item1: 0}}</em></label>
                            <label>已归档天数:<em>{{this.searchDay.item2 ? this.searchDay.item2: 0}}</em></label>
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
                <figure v-if="rowOperate === false">
                    <span>{{this.queryParams.billStartTime ? this.queryParams.billStartTime : '——'}}</span>至
                    <span>{{this.queryParams.billEndTime ? this.queryParams.billEndTime : '——'}}</span>
                </figure>
                <figure v-else>
                    <span>{{this.rowData}}</span>
                </figure>
                <title>开始对账</title>
            </div>
            <div>
                <section class="operatorSection" v-if="mchConfigArr">
                    <p>医院账单</p>
                    <div>
                        <div class="operateItem operatorEmpty" v-for="item in mchConfigArr">
                            <div class="operateContainer">
                                <Icon type="clipboard"></Icon>
                                <p class="operateName">{{item.configName ? item.configName : ''}}</p>
                                <p>空</p>
                            </div>
                            <div class="operateHover">
                                <div class="operateHoverPull">
                                    <Icon type="android-download"></Icon>
                                    <p>接口拉取</p>
                                </div>
                                <div class="operateHoverPush">
                                    <Icon type="android-upload"></Icon>
                                    <p>上传账单</p>
                                </div>
                            </div>
                            <Icon type="trash-a" class="hidden" @click="emptyOpera"></Icon>
                        </div>
                    </div>
                </section>
                <section class="operatorSection" v-if="appConfigArr">
                    <p>医院账单</p>
                    <div>
                        <div class="operateItem operatorEmpty" v-for="item in appConfigArr">
                            <div class="operateContainer">
                                <Icon type="clipboard"></Icon>
                                <p class="operateName">{{item.configName ? item.configName : ''}}</p>
                                <p>空</p>
                            </div>
                            <div class="operateHover">
                                <div class="operateHoverPull">
                                    <Icon type="android-download"></Icon>
                                    <p>接口拉取</p>
                                </div>
                                <div class="operateHoverPush">
                                    <Icon type="android-upload"></Icon>
                                    <p>上传账单</p>
                                </div>
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
                v-model="downloadShowDialog"
                @on-cancel="downloadCancel"
                >
            <div slot="header">
                <p>对账结果下载</p>
            </div>
            <div v-if="fundList">
                <CheckboxGroup @on-change="downloadLabelAction"  v-model="fundListChecked">
                    <Checkbox :label="item.configName" :key="item.configId" v-for="item in fundList">
                        <span>{{item.configName}}</span>
                    </Checkbox>
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
    import storeData from './store/reconciliations';
    import {parseTime} from '@/filters';
    import ajax from '@/api/statistics';
    import {downloadExcel} from '@/libs/file';

    export default {
        name: 'searchable-table',
        data () {
            return storeData.apply(this);
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
                this.searchDay = {
                    item1: null,
                    item2: null
                },
                    this.getList();
            },
            dateMonthAction () {
                this.searchDay = {
                    item1: null,
                    item2: null
                },
                    this.queryParams.billEndTime = parseTime(new Date(), '{y}-{m}-{d}');
                this.queryParams.billStartTime = parseTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}');
                this.dateSearch = [this.queryParams.billStartTime, this.queryParams.billEndTime];
                this.getList();
            },
            getList () {
                ajax.checkList(this.queryParams).then(response => {
                    if (response.success == true) {
                        if (response.data.items) {
                            this.dataList = response.data.items;
                            this.total = response.data.totalCount;
                            let item1 = 0;
                            let item2 = 0;
                            if (response.data.items) {
                                response.data.items.map((it) => {
                                    if (it.unioncheckorderStatus == '4' || it.unioncheckorderStatus == '5') {
                                        item1 = item1 + 1;
                                    }
                                });
                                response.data.items.map((it) => {
                                    if (it.unioncheckorderStatus == '6') {
                                        item2 = item2 + 1;
                                    }
                                });
                                this.searchDay = {...this.searchDay, 'item1': item1, 'item2': item2};
                            }
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
                    let num = this.multipleSelection.length;
                    let queryParam = [];
                    if (this.multipleSelection) {
                        this.multipleSelection.forEach(it => {
                            let item = {
                                billDate: parseTime(it.billStartTime, '{y}-{m}-{d}'),
                                fundTransactionTotalAmount: it.fundTransactionTotalAmount,
                                fundTransactionTotalCount: it.fundTransactionTotalCount,
                                unioncheckorderStatus: it.unioncheckorderStatus
                            };
                            queryParam.push(item);
                            return queryParam;
                        });
                    }
                    this.$Modal.confirm({
                        content: '确定要导出' + num + '条数据?',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            setTimeout(() => {
                                downloadExcel({
                                    url: 'unioncheck/merchantCheck/downloadCheck',
                                    input: {item: JSON.stringify(queryParam)}
                                });
                            }, 2000);
                        },
                        onCancel: () => {
                        }
                    });
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
                this.fundListChecked = data;
            },
            downloadCancel() {
                this.fundListChecked = [];
            },
            handleLabelAction () {
                if (this.fundListChecked.length > 0) {
                    this.downloadShowDialog = false;
                    this.$Modal.confirm({
                        content: '确定要下载&nbsp;&nbsp;' + this.fundListChecked + '&nbsp;&nbsp;账单',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            setTimeout(() => {
                                let orderNos = [];
                                if (this.multipleSelection) {
                                    this.multipleSelection.map(it => {
                                        orderNos.push(it.checkOrderNo);
                                        return orderNos;
                                    });
                                }
                                let queryParams = {
                                    fundNames: this.fundListChecked.join(',') || '',
                                    checkOrderNos: orderNos.join(',')
                                };
                                downloadExcel({
                                    url: 'unioncheck/merchantCheck/downloadSummaryCheck',
                                    input: queryParams
                                });
                                this.downloadShowDialog = false;
                            }, 2000);
                        },
                        onCancel: () => {
                            this.downloadShowDialog = true;
                        }
                    });
                } else {
                    this.$Message.error({
                        content: '请先选择收款通道',
                        duration: 2,
                        closable: true
                    });
                    return;
                }
            },
            reconciliationsOpera () {
                this.rowOperate = false;
                this.showDialog = true;
                this.billDateRange = {...this.billDateRange,
                    billStartTime: this.queryParams.billStartTime,
                    billEndTime: this.queryParams.billEndTime
                };
                this.getCheckSummary();
            },
            // 对账 查看配置
            getCheckSummary() {
                ajax.getCheckSummary(
                    this.billDateRange
                ).then(response => {
                    if (response.success == true) {
                        if (response.data) {
                            if (response.data.configList) {
                                const res = response.data.configList;
                                console.log(res)

                                let mchConfigArr = [], // HIS 交易方数据
                                    appConfigArr = [], // 应用数据
                                    fundConfigArr = []; // 资金通道
                                res.forEach(function (item) {
                                    item.numResult = "空";
                                    item.dataCount = 0;
                                    item.createUpload = false;
                                    item.isDelete = false;
                                    item.isUpload = false;
                                    item.isPull = false;
                                    item.uploadClass = "dz-updown";
                                    if (item.value && JSON.parse(item.value) instanceof Array) {
                                        var sourceTypes = eval(item.value);
                                        for (var j in sourceTypes) {
                                            if (sourceTypes[j].sourceType == '4') {
                                                item.isUpdown = false;
                                                item.numResult = "以HIS为准(空)";
                                            } else if (sourceTypes[j].sourceType == '2') {
                                                item.isUpdown = true;
                                                item.isPull = true;
                                            } else if (sourceTypes[j].sourceType == '1') {
                                                item.isUpdown = true;
                                                item.isUpload = true;
                                            } else {
                                                item.isUpdown = true;
                                            }
                                        }

                                        if ((item.isUpload && !item.isPull) || (!item.isUpload && item.isPull)) {
                                            item.uploadClass = "dz-updown one";
                                        }
                                    } else {
                                        item.isUpdown = true;
                                        item.isDelete = false;
                                    }

                                    if (!item.histroyData) {
                                        item.histroyData = true;
                                    }
                                    if (item.configType === '交易方数据') {
                                        mchConfigArr.push(item);
                                    } else if (item.configType === '应用数据') {
                                        appConfigArr.push(item);
                                    } else if (item.configType === '收款通道') {
                                        fundConfigArr.push(item);
                                    }
                                });
                                this.mchConfigArr = mchConfigArr;
                                this.fundConfigArr = fundConfigArr;
                                this.appConfigArr = appConfigArr;
                                console.log(mchConfigArr)
                                console.log(appConfigArr)
                            }
                        } else {
                            this.$Message.error(response.msg ? response.msg : '对账配置数据有异常');
                        }
                    } else {
                        this.$Message.error(response.msg ? response.msg : '对账配置接口未成功');
                    }
                }).catch(() => {
                });
            },
            // 对账内部操作
            emptyOpera () {
                this.showDialog = false;
                this.$Modal.confirm({
                    content: '确定要删除吗',
                    okText: '确定',
                    cancelText: '取消',
                    loading: true,
                    onOk: () => {
                        setTimeout(() => {
                        }, 2000);
                    },
                    onCancel: () => {
                        this.showDialog = true;
                    }
                });
            },
            downloadAction () {
                if (this.multipleSelection.length > 0) {
                    this.downloadShowDialog = true;
                    ajax.fundList(
                        {configTypes: "收款通道,应用数据"}
                    ).then(response => {
                        if (response.success == true) {
                            if (response.data) {
                                let res = response.data;
                                this.fundList = res;
                            } else {
                                this.$Message.error(response.msg ? response.msg : '收款通道接口数据有异常');
                            }
                        } else {
                            this.$Message.error(response.msg ? response.msg : '收款通道接口未成功');
                        }
                    }).catch(() => {
                    });
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
            },
            reconciliationsRowAction(row) {
                let  timeRow;
                if (row.billStartTime) {
                    timeRow = parseTime(row.billStartTime, '{y}-{m}-{d}');
                    this.rowOperate = true;
                }
                this.rowData = timeRow || '';
                this.showDialog = true;
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
                font-size: 12px;
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
            position: relative;
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
                &:hover {
                    .operateContainer {
                        display: none;
                    }
                    .operateHover {
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: flex;
                        flex-wrap: nowrap;
                        width: 116px;
                        align-items: center;
                        justify-content: center;
                        [class^="operateHover"] {
                            height: 84px;
                            /*display: flex;*/
                            /*align-items: center;*/
                            /*justify-content: center;*/
                            p {
                                font-size: 12px;
                            }
                        }
                        .operateHoverPull {
                            background-color: rgba(55, 55, 55, .8);
                            i {
                                color: @backgroundSuccess;
                            }
                        }
                        .operateHoverPush {
                            background-color: rgba(55, 55, 55, .6);
                            i {
                                color: @backgroundWarn;
                            }
                        }
                    }
                }
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
                    background-color: rgba(55, 55, 55, .6);
                    z-index: 10001;
                }
            }
        }
    }

    @media screen and (max-height: 786px) {
        .searchBox {
            .ivu-form-item {
                margin-bottom: 8px;
            }
            form {
                & + div {
                    padding-top: 7px;
                }
            }
        }
    }
</style>
