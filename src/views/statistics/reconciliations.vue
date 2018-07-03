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
                        <label>待处理天数:<em>{{this.searchDay.item1 ? this.searchDay.item1 : 0}}</em></label>
                        <label>已归档天数:<em>{{this.searchDay.item2 ? this.searchDay.item2 : 0}}</em></label>
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
                    <span>{{this.queryParams.billStartTime ? this.queryParams.billStartTime : '——'}}</span>
                    至
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
                        <div @mouseover="hoverAction(item, key)"
                             @mouseout="hoverHiddenAction(item, key)"
                             v-for="(item,key) in mchConfigArr"
                             :class="key > 0 ? 'margin-left-10 inline' : 'inline'"
                             :data-link="item.configId">
                            <div
                                :class="item.numResult !== '空' ?
                                    'operateItem operatorEmpty borderDark' :
                                     'operateItem operatorEmpty'">
                                <div
                                    :class="idItem === item.configId &&
                                                keyItem === key &&
                                                hoverVisible === true ?
                                                'operateContainer hidden' :
                                                'operateContainer'">
                                    <Icon type="clipboard"></Icon>
                                    <p class="operateName">{{item.configName ? item.configName : ''}}</p>
                                    <p :class="item.numResult !== '空' ? 'dark' : ''">{{item.numResult ? item.numResult :
                                        ''}}</p>
                                </div>
                                <div v-show="idItem === item.configId &&
                                             keyItem === key &&
                                             hoverVisible === true"
                                     class="operateHover">
                                    <div class="operateHoverPull"
                                         @click="pullCheckAction(item)"
                                         v-if="idItem === item.configId &&
                                             keyItem === key &&
                                             item.isPull === true">
                                        <Icon type="android-download"></Icon>
                                        <p>接口拉取</p>
                                    </div>
                                    <div class="operateHoverPush"
                                         v-if="idItem === item.configId &&
                                             keyItem === key &&
                                             item.isUpload === true">
                                        <Upload
                                            ref="upload"
                                            multiple
                                            :data="headerParam"
                                            :action="uploadUrl"
                                            :on-format-error="handleFormatError"
                                            :before-upload="handleUpload"
                                            :on-progress="handleProgress"
                                            :show-upload-list="false"
                                            :on-success="uploadSuccess"
                                            accept=".txt,.csv,
                                                       application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                                       application/vnd.ms-excel">
                                            <div @click="uploadCheckAction(item)">
                                                <Icon type="android-upload"></Icon>
                                                <p>上传账单</p>
                                            </div>
                                        </Upload>
                                    </div>
                                </div>
                                <Icon type="close-circled"
                                      v-show="idItem === item.configId &&
                                             keyItem === key &&
                                             deleteStatus === true"
                                      class="deleteIcon"
                                      @click="emptyOpera(item)"></Icon>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="operatorSection margin-top-10" v-if="fundConfigArr">
                    <p>资金通道</p>
                    <div>
                        <div @mouseover="hoverAction(item, key)"
                             @mouseout="hoverHiddenAction(item, key)"
                             v-for="(item,key) in fundConfigArr" :class="key > 0 ?
                              'margin-left-10 inline' : 'inline'"
                             :data-link="item.configId">
                            <div :class="item.numResult !== '空' ?
                            'operateItem operatorEmpty borderDark' : 'operateItem operatorEmpty'">
                                <div :class="idItem === item.configId && keyItem === key && hoverVisible === true ?
                                'operateContainer hidden' : 'operateContainer'">
                                    <Icon type="clipboard"></Icon>
                                    <p class="operateName">{{item.configName ? item.configName : ''}}</p>
                                    <p :class="item.numResult !== '空' ? 'dark' : ''">{{item.numResult ? item.numResult :
                                        ''}}</p>
                                </div>
                                <div v-show="idItem === item.configId &&
                                             keyItem === key &&
                                             hoverVisible === true"
                                     class="operateHover">
                                    <div class="operateHoverPull"
                                         @click="pullCheckAction(item)"
                                         v-if="idItem === item.configId &&
                                             keyItem === key &&
                                             item.isPull === true">
                                        <Icon type="android-download"></Icon>
                                        <p>接口拉取</p>
                                    </div>
                                    <div class="operateHoverPush"
                                         v-if="idItem === item.configId &&
                                             keyItem === key &&
                                             item.isUpload === true">
                                        <Upload
                                                ref="upload"
                                                multiple
                                                :data="headerParam"
                                                :action="uploadUrl"
                                                :on-format-error="handleFormatError"
                                                :before-upload="handleUpload"
                                                :on-progress="handleProgress"
                                                :show-upload-list="false"
                                                :on-success="uploadSuccess"
                                                accept=".txt,.csv,
                                                       application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                                       application/vnd.ms-excel">
                                            <div @click="uploadCheckAction(item)">
                                                <Icon type="android-upload"></Icon>
                                                <p>上传账单</p>
                                            </div>
                                        </Upload>
                                    </div>
                                </div>
                                <Icon type="close-circled"
                                      v-show="idItem === item.configId &&
                                             keyItem === key &&
                                             deleteStatus === true"
                                      class="deleteIcon"
                                      @click="emptyOpera(item)"></Icon>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="operatorSection margin-top-10" v-if="appConfigArr">
                    <p>业务系统账单</p>
                    <div>
                        <div @mouseover="hoverAction(item, key)"
                             @mouseout="hoverHiddenAction(item, key)"
                             v-for="(item,key) in appConfigArr"
                             :class="key > 0 ? 'margin-left-10 inline' : 'inline'">
                            <div :class="item.numResult !== '空' ?
                            'operateItem operatorEmpty borderDark' : 'operateItem operatorEmpty'">
                                <div :class="idItem === item.configId && keyItem === key && hoverVisible === true ?
                                'operateContainer hidden' : 'operateContainer'">
                                    <Icon type="clipboard"></Icon>
                                    <p class="operateName">{{item.configName ? item.configName : ''}}</p>
                                    <p :class="item.numResult !== '空' ? 'dark' : ''">{{item.numResult ? item.numResult :
                                        ''}}</p>
                                </div>
                                <div
                                    v-show="idItem === item.configId && keyItem === key && hoverVisible === true"
                                    class="operateHover">
                                    <div class="operateHoverPull"
                                         @click="pullCheckAction(item)"
                                         v-if="idItem === item.configId &&
                                             keyItem === key &&
                                             item.isPull === true">
                                        <Icon type="android-download"></Icon>
                                        <p>接口拉取</p>
                                    </div>
                                    <div class="operateHoverPush"
                                         v-if="idItem === item.configId &&
                                             keyItem === key &&
                                             item.isUpload === true">
                                        <Upload
                                                ref="upload"
                                                multiple
                                                :data="headerParam"
                                                :action="uploadUrl"
                                                :on-format-error="handleFormatError"
                                                :before-upload="handleUpload"
                                                :on-progress="handleProgress"
                                                :show-upload-list="false"
                                                :on-success="uploadSuccess"
                                                accept=".txt,.csv,
                                                       application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                                       application/vnd.ms-excel">
                                            <div @click="uploadCheckAction(item)">
                                                <Icon type="android-upload"></Icon>
                                                <p>上传账单</p>
                                            </div>
                                        </Upload>
                                    </div>
                                </div>
                                <Icon type="close-circled"
                                      v-show="idItem === item.configId &&
                                             keyItem === key &&
                                             deleteStatus === true"
                                      class="deleteIcon"
                                      @click="emptyOpera(item)"></Icon>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div slot="footer">
                <Row>
                    <Col span="12">
                    <div class="reconciliationsBottom">
                        <label>历史对账结果</label>
                        <Button :type="keepSuccess === true ? 'primary' : 'default'"
                                shape="circle" size="small"
                                @click="checkToggle(keepSuccess, 1)">保留

                        </Button>
                        <Button :type="keepSuccess === false ? 'primary' : 'default'"
                                shape="circle" size="small"
                                @click="checkToggle(keepSuccess, 2)">不保留

                        </Button>
                    </div>
                    </Col>
                    <Col span="12">
                    <Button type="primary" size="large" @click="submitCheckAction">开始对账</Button>
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
                <CheckboxGroup @on-change="downloadLabelAction" v-model="fundListChecked">
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
    import baseUrl from '../../../config/server';

    export default {
        name: 'searchable-table',
        data () {
            return storeData.call(this);
        },
        created () {
            this.queryParams.billEndTime = parseTime(new Date().getTime() - 24 * 60 * 60 * 1000, '{y}-{m}-{d}'); // 首次进来默认展示一周数据
            this.queryParams.billStartTime = parseTime(new Date().getTime() - 8 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}'); // 首次进来默认展示一周数据
            this.dateSearch = [this.queryParams.billStartTime, this.queryParams.billEndTime];
            this.getList();
            this.uploadUrl = baseUrl + '/unioncheck/portal/doCheck/uploadFile';
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
        mounted () {
            // this.uploadList = this.$refs.upload.fileList;
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
                this.queryParams.billEndTime = parseTime(new Date().getTime() - 24 * 60 * 60 * 1000, '{y}-{m}-{d}');
                this.queryParams.billStartTime = parseTime(new Date().getTime() - 8 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}');
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
                    this.queryParams.billEndTime = parseTime(new Date().getTime() - 24 * 60 * 60 * 1000, '{y}-{m}-{d}');
                this.queryParams.billStartTime = parseTime(new Date().getTime() - 31 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}');
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
                        this.$Message.error({
                            content: response.msg ? response.msg : '客户统一对账表单请求未成功',
                            duration: 2,
                            closable: true
                        });
                    }
                }).catch(() => {
                });
            },
            handleRowChange (selection) {
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
            downloadCancel () {
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
                this.billDateRange = {
                    ...this.billDateRange,
                    billStartTime: this.queryParams.billStartTime,
                    billEndTime: this.queryParams.billEndTime
                };
                this.getCheckSummary();
            },
            // 对账 查看配置
            getCheckSummary () {
                ajax.getCheckSummary(
                    this.billDateRange
                ).then(response => {
                    if (response.success == true) {
                        if (response.data) {
                            if (response.data.configList) {
                                const res = response.data.configList;
                                console.log(res);

                                this.checkBillCount = response.data.checkBillCount;
                                let mchConfigArr = [], // HIS 交易方数据
                                    appConfigArr = [], // 应用数据
                                    fundConfigArr = []; // 资金通道
                                res.forEach((it) => {
                                    this.$set(it, 'numResult', '空');
                                    this.$set(it, 'dataCount', 0);
                                    this.$set(it, 'createUpload', false);
                                    this.$set(it, 'isUpload', false);
                                    this.$set(it, 'isDelete', false);
                                    this.$set(it, 'isPull', false);
                                    if (it.value && JSON.parse(it.value) instanceof Array) {
                                        const sourceTypes = eval(it.value);
                                        sourceTypes.map(item => {
                                            if (item.sourceType==='1' || item.sourceType===1) {
                                                this.$set(it, 'isPull', true);
                                            } else if (item.sourceType==='2' || item.sourceType===2) {
                                                this.$set(it, 'isUpload', true);
                                            }
                                        })
                                    }
                                    if (it.configType === '交易方数据') {
                                        mchConfigArr.push(it);
                                    } else if (it.configType === '应用数据') {
                                        appConfigArr.push(it);
                                    } else if (it.configType === '收款通道') {
                                        fundConfigArr.push(it);
                                    }
                                });
                                this.mchConfigArr = mchConfigArr;
                                this.fundConfigArr = fundConfigArr;
                                this.appConfigArr = appConfigArr;
                                this.getCheckHistory();
                            }
                        } else {
                            this.$Message.error({
                                content: response.msg ? response.msg : '对账配置数据有异常',
                                duration: 10,
                                closable: true
                            });
                        }
                    } else {
                        this.$Message.error(response.msg ? response.msg : '对账配置接口未成功');
                    }
                }).catch(() => {
                });
            },
            // 对账 历史
            getCheckHistory () {
                ajax.getHistoryCheck(
                    this.billDateRange
                ).then(response => {
                    if (response.success == true) {
                        if (response.data) {
                            if (response.data.f730035ResLists) {
                                const res = response.data.f730035ResLists;

                                for (let i in res) {
                                    this.mchConfigArr.map(it => {
                                        if (it.configId + '' === res[i].configId + '') {
                                            this.$set(it, 'isUpdown', false);
                                            this.$set(it, 'isDelete', false);
                                            this.$set(it, 'numResult', res[i].count + '条');
                                            this.$set(it, 'operated', 'operated');
                                        }
                                    });
                                    this.fundConfigArr.map(it => {
                                        if (it.configId + '' === res[i].configId + '') {
                                            this.$set(it, 'isUpdown', false);
                                            this.$set(it, 'isDelete', false);
                                            this.$set(it, 'numResult', res[i].count + '条');
                                            this.$set(it, 'operated', 'operated');
                                        }
                                    });
                                    this.appConfigArr.map(it => {
                                        if (it.configId + '' === res[i].configId + '') {
                                            this.$set(it, 'isUpdown', false);
                                            this.$set(it, 'isDelete', false);
                                            this.$set(it, 'numResult', res[i].count + '条');
                                            this.$set(it, 'operated', 'operated');
                                        }
                                    });
                                }
                            }
                        } else {
                            this.$Message.error({
                                content: response.msg ? response.msg : '对账历史数据有异常',
                                duration: 10,
                                closable: true
                            });
                        }
                    } else {
                        this.$Message.error(response.msg ? response.msg : '对账历史接口未成功');
                    }
                }).catch(() => {
                });
            },
            // 对账 hover上传模块展示
            hoverAction (item, key) {
                this.keyItem = key;
                this.idItem = item.configId;
                this.deleteStatus = item.numResult !== '空' ? true : false;
                console.log(this.keyItem);
                console.log(this.idItem);
                console.log(this.deleteStatus);
                if (this.deleteStatus === false) {
                    this.hoverVisible = true;
                } else {
                    this.hoverVisible = false;
                }
            },
            hoverHiddenAction (item, key) {
                this.idItem = item.configId;
                this.keyItem = key;
                this.deleteStatus = false;
                this.hoverVisible = false;
            },
            // ---对账内部操作 begin ----
            emptyOpera (item) {
                this.showDialog = false;
                this.$Modal.confirm({
                    content: '确定要删除吗',
                    okText: '确定',
                    cancelText: '取消',
                    loading: true,
                    onOk: () => {
                        setTimeout(() => {
                            let queryParam = Object.assign({},
                                this.billDateRange, {configId: item.configId || ''});
                            ajax.deleteCheck(
                                queryParam
                            ).then(response => {
                                if (response.success == true) {
                                    this.$Modal.remove();
                                    this.$Message.success(response.msg ? response.msg : '删除成功');
                                    this.getCheckSummary();
                                    this.getCheckHistory();
                                    this.showDialog = true;
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error({
                                        content: response.msg ? response.msg : '删除失败',
                                        duration: 10,
                                        closable: true
                                    });
                                    this.showDialog = true;
                                }
                            });
                        }, 2000);
                    },
                    onCancel: () => {
                        this.showDialog = true;
                    }
                });
            },
            // 对账 接口拉取
            pullCheckAction (item) {
                this.showDialog = false;
                this.$Modal.confirm({
                    content: '确定要接口拉取吗',
                    okText: '确定',
                    cancelText: '取消',
                    loading: true,
                    onOk: () => {
                        setTimeout(() => {
                            let queryParam = Object.assign({},
                                this.billDateRange, {configId: item.configId || ''});
                            ajax.pullCheck(
                                queryParam
                            ).then(response => {
                                if (response.success == true) {
                                    this.$Modal.remove();
                                    this.$Message.success(response.msg ? response.msg : '接口拉取成功');
                                    this.getCheckSummary();
                                    this.getCheckHistory();
                                    this.showDialog = true;
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error({
                                        content: response.msg ? response.msg : '接口拉取失败',
                                        duration: 10,
                                        closable: true
                                    });
                                    this.showDialog = true;
                                }
                            });
                        }, 2000);
                    },
                    onCancel: () => {
                        this.showDialog = true;
                    }
                });
            },
            uploadCheckAction (item) { // 对账 上传按钮
                this.headerParam = Object.assign({}, this.billDateRange,
                    {
                        configId: item.configId || '',
                        timestamp: ''
                    }
                );
                console.log(this.headerParam)

            },
            handleUpload (file) { // 上传文件前的事件钩子
                if (file) {
                    this.showDialog = false;
                    this.file = null;
                    this.headerParam = Object.assign({}, this.headerParam, {timestamp: file.lastModified})
                    this.fileList.push(file);
                    // 保存文件到需要上传的文件数组里
                    this.uploadFile.push(file);
                }
            },
            handleProgress (event, file) {
                this.$Modal.confirm({
                    content: '文件 ' + file.name + ' 正在上传...',
                });
            },
            handleFormatError (file) {
                this.$Modal.confirm({
                    content: '文件 ' + file.name + ' 格式不正确，请选择图片文件。',
                    okText: '确定',
                    cancelText: '取消',
                });
                this.headerParam = {};
            },
            uploadSuccess (res, file) { // 文件上传回调 上传成功后删除待上传文件
                if (res.success === true) {
                    this.$Modal.confirm({
                        content: '文件 ' + file.name + '上传成功',
                        okText: '确定',
                    });
                    this.getCheckSummary();
                    this.getCheckHistory();
                    this.showDialog = true;
                    this.headerParam = {};
                } else {
                    this.$Modal.warning({
                        content: '文件 ' + file.name + res.msg ? res.msg : '上传失败',
                        okText: '确定',
                    });
                    this.showDialog = true;
                    this.headerParam = {};
                }
            },
            submitCheckAction () {
                if (this.checkBillCount !== 0 || this.checkBillCount !== null) {
                    this.showDialog = false;
                    this.$Modal.confirm({
                        content: '当前选择的对账周期内已存在对账记录，再次发起对账会覆盖原有对账记录，继续对账吗？',
                        okText: '继续',
                        cancelText: '放弃',
                        loading: true,
                        onOk: () => {
                            this.showDialog = true;
                            setTimeout(() => {
                                let queryParam = Object.assign({},
                                    this.billDateRange, {keepSuccess: this.keepSuccess});
                                ajax.submitCheck(
                                    queryParam
                                ).then(response => {
                                    if (response.success == true) {
                                        this.$Modal.remove();
                                        this.$Message.success(response.msg ? response.msg : '对账成功');
                                        // this.getCheckSummary();
                                        // this.getCheckHistory();
                                        this.showDialog = false;
                                        this.getList();
                                    } else {
                                        this.$Modal.remove();
                                        this.$Message.error({
                                            content: response.msg ? response.msg : '对账失败',
                                            duration: 2,
                                            closable: true
                                        });
                                        this.showDialog = true;
                                    }
                                });
                            }, 2000);
                        },
                        onCancel: () => {
                            this.showDialog = true;
                        }
                    });
                    return;
                }
            },
            // ---对账内部操作 end ----
            checkToggle (status, key) {
                if (key === 1) {
                    if (status === true) {
                        this.keepSuccess = false;
                    } else {
                        this.keepSuccess = true;
                    }
                }
                if (key === 2) {
                    if (status === true) {
                        this.keepSuccess = false;
                    } else {
                        this.keepSuccess = true;
                    }
                }
            },
            downloadAction () {
                if (this.multipleSelection.length > 0) {
                    this.downloadShowDialog = true;
                    ajax.fundList(
                        {configTypes: '收款通道,应用数据'}
                    ).then(response => {
                        if (response.success == true) {
                            if (response.data) {
                                let res = response.data;
                                this.fundList = res;
                            } else {
                                this.$Message.error(response.msg ? response.msg : '收款通道接口数据有异常');
                            }
                        } else {
                            this.$Message.error({
                                content: response.msg ? response.msg : '收款通道接口未成功',
                                duration: 2,
                                closable: true
                            });
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
            // ---列表操作 begin ----
            reconciliationsRowAction (row) {
                let timeRow;
                if (row.billStartTime) {
                    timeRow = parseTime(row.billStartTime, '{y}-{m}-{d}');
                    this.rowOperate = true;
                }
                this.rowData = timeRow || '';
                this.billDateRange = {
                    billStartTime: timeRow,
                    billEndTime: timeRow
                };
                this.getCheckSummary();
                this.getCheckHistory();
                this.showDialog = true;
            },
            // 手工勾对
            handworkTick (row) {
                let timeRow,
                    urlParam,
                    url,
                    width,
                    height,
                    left,
                    top;
                if (row.billStartTime) {
                    timeRow = parseTime(row.billStartTime, '{y}-{m}-{d}');
                }
                urlParam = {
                    checkOrderNo: row.checkOrderNo || '',
                    startDate: timeRow,
                    endDate: timeRow
                };
                url = '/unioncheck/portal/partner/openwindows.htm#/checkOpera.html/' +
                    urlParam.checkOrderNo + '/' + urlParam.startDate + '/' + urlParam.endDate;
                width = document.body.clientWidth;
                height = document.body.clientHeight;
                left = (document.body.clientWidth - width - 30) / 2;
                top = (document.body.clientHeight - height - 10) / 2;
                window.open(url, '', 'top=' + top + ',left=' + left +
                    ',scrollbars=yes,dialog=yes,minimizable=yes,modal=open,width=' +
                    width + ',' + 'height=' +
                    height + ',resizable=yes');
            },
            // 查看
            checkAction (row) {
                let urlParam,
                    url,
                    timeRow,
                    width,
                    height,
                    left,
                    top;
                if (row.billStartTime) {
                    timeRow = (parseTime(row.billStartTime, '{y}-{m}-{d}')).replace(/-/g, '');
                }
                urlParam = {
                    checkOrderNo: row.checkOrderNo || '',
                    startDate: timeRow,
                };
                url = '/unioncheck/portal/partner/openwindows.htm#/checkReportForm.html/' + urlParam.checkOrderNo + '/' + urlParam.startDate;
                width = document.body.clientWidth * 0.9;
                height = document.body.clientHeight * 0.9;
                left = (document.body.clientWidth - width - 30) / 2;
                top = (document.body.clientHeight - height - 10) / 2;
                window.open(url, '', 'top=' + top + ',left=' + left + ',scrollbars=yes,dialog=yes,minimizable=yes,modal=open,width=' + width + ',' +
                    'height=' + height + ',resizable=yes');
            },
            // 归档撤销
            resetCheckAction (row) {
                this.$Modal.confirm({
                    content: '确定要归档撤销吗',
                    okText: '确定',
                    cancelText: '取消',
                    loading: true,
                    onOk: () => {
                        setTimeout(() => {
                            ajax.cancelCheck(
                                {unioncheckorderNo: row.checkOrderNo || ''}
                            ).then(response => {
                                if (response.success == true) {
                                    this.$Modal.remove();
                                    this.$Message.success(response.msg ? response.msg : '归档撤销成功');
                                    this.getList();
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error({
                                        content: response.msg ? response.msg : '归档撤销失败',
                                        duration: 10,
                                        closable: true
                                    });
                                }
                            });
                        }, 2000);
                    },
                    onCancel: () => {
                        this.$Message.warning({
                            content: '已取消归档撤销',
                            closable: false
                        });
                    }
                });
            },
            // 重新对账
            AgainReconciliationsAction (row) {
                this.$Modal.confirm({
                    content: '确定要重新对账吗',
                    okText: '确定',
                    cancelText: '取消',
                    loading: true,
                    onOk: () => {
                        this.$Modal.remove();
                        this.reconciliationsRowAction(row);
                    },
                    onCancel: () => {
                        this.$Message.warning({
                            content: '已取消重新对账',
                            closable: false
                        });
                    }
                });
            }
            // ---列表操作 end ----
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
            padding: 12px 0;
            border: 1px solid @borderLight;
            border-radius: 4px;
            text-align: center;
            overflow: hidden;
            &.borderDark {
                border-color: @mainThemeBlueHover;
                box-shadow: 0px 0px 3px @mainThemeBlue;
            }
            .operateContainer {
                text-align: center;
            }
            i {
                font-size: 28px;
                color: @borderLight;
            }
            .dark {
                color: @fontColor;
            }
            p {
                font-size: 12px;
                color: @borderLight;
                &.operateName {
                    color: #495060;
                    font-size: 13px;
                }
            }
            &.operatorEmpty {
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
                        min-width: 58px;
                        height: 84px;
                        cursor: pointer;
                        i {
                            margin-top: 16px;
                            color: @borderLight;
                        }
                        p {
                            font-size: 12px;
                        }
                    }
                    .operateHoverPull {
                        background-color: rgba(55, 55, 55, .3);
                        &:hover {
                            background-color: rgba(55, 55, 55, .6);
                            i {
                                color: @backgroundSuccess;
                            }
                        }
                    }
                    .operateHoverPush {
                        background-color: rgba(55, 55, 55, .3);
                        &:hover {
                            background-color: rgba(55, 55, 55, .6);
                            i {
                                color: @backgroundWarn;
                            }
                        }
                    }
                }
            }
            &.borderDark {
                position: relative;
                .deleteIcon {
                    display: inline-block;
                    position: absolute;
                    color: red;
                    top: 4px;
                    right: 8px;
                    cursor: pointer;
                    color: @backgroundDanger;
                }
                &:hover {
                    border-color: @backgroundDanger;
                    box-shadow: 0 0 3px @backgroundDanger;
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
