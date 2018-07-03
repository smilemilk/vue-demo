import {parseTime, moneyFormat} from '@/filters';
// import {reconciliationStatus} from 'filters';

export default function () {
    return {
        searchActive: false,
        tableHeight: 320,
        total: 0,
        multipleSelection: [], // 计算选中项
        searchDay: {
            item1: null,
            item2: null
        },
        queryParams: {
            billStartTime: '',
            billEndTime: '',
            page: 1, // 页数
            limit: 10 // 一页几条
        },
        dataList: [],
        showDialog: false,
        downloadShowDialog: false,
        rowOperate: false, // 对账表头时间的替换
        rowData: '', // row对账的日期
        fundList: [], //对账结果之前的收款选择
        hoverVisible: false, // hover操作状态
        keyItem: null,       // hover key
        idItem: '',          // hover id
        deleteStatus: false, // hover 删除状态
        checkBillCount: null, // 对账前判断是否已对账
        keepSuccess: true, // 对账 默认保留
        fundListChecked: [],
        billDateRange: {
            billStartTime: '',
            billEndTime: ''
        },
        mchConfigArr: [], // HIS 交易方数据
        fundConfigArr:[], // 资金通道
        appConfigArr: [], // 应用数据
        loadingStatus: false,
        uploadUrl: '',
        headerParam: {},
        file: null,
        fileList: [],
        uploadFile: [], // 需要上传的
        columnsTable: [
            {
                type: 'selection',
                width: 60,
                align: 'center',
            },
            {
                key: 'billStartTime',
                title: '账单日期',
                align: 'center',
                render: (h, params) => {
                    return h('div', params.row.billStartTime ? parseTime(params.row.billStartTime, '{y}-{m}-{d}') : '——');
                }
            },
            {
                key: 'fundTransactionTotalCount',
                title: '资金笔数(笔)',
                align: 'center',
                render: (h, params) => {
                    return h('div', params.row.fundTransactionTotalCount ? params.row.fundTransactionTotalCount : '——');
                }
            },
            {
                key: 'fundTransactionTotalAmount',
                title: '资金金额(元)',
                align: 'center',
                render: (h, params) => {
                    return h('div', params.row.fundTransactionTotalAmount ? moneyFormat(params.row.fundTransactionTotalAmount / 100) : '——');
                }
            },
            {
                key: 'unioncheckorderStatus',
                title: '对账状态',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    return h('div', params.row.unioncheckorderStatus ?
                        params.row.unioncheckorderStatus === '0' ? '待对账' :
                            params.row.unioncheckorderStatus === '1' ? '对账中' :
                                params.row.unioncheckorderStatus === '2' ? '对账成功' :
                                    params.row.unioncheckorderStatus === '3' ? '对账失败' :
                                        params.row.unioncheckorderStatus === '4' ? '存在异常' :
                                            params.row.unioncheckorderStatus === '5' ? '待对账勾兑' :
                                                params.row.unioncheckorderStatus === '6' ? '已归档' :
                                                    params.row.unioncheckorderStatus : '——');
                }
            },
            {
                key: 'operate',
                title: '操作', // '0' 开始对账，'3'重新对账， '5'手工勾对， '6'查看
                align: 'center',
                width: 160,
                render: (h, params) => {
                    let text = '',
                        text1 = '',
                        text2 = '';
                    let status = params.row.unioncheckorderStatus;
                    if (status == '0') {
                        text = '开始对账';
                    } else if (status == '3') {
                        text = '重新对账';
                    } else if (status == '5') {
                        text = '手工勾对';
                    } else if (status == '6') {
                        text1 = '查看';
                        text2 = '撤销归档'
                    }
                    if (status == '0' ||
                        status == '3' ||
                        status == '5') {
                       return h('div',
                            [h('Button', {
                                props: {
                                    type: 'dashed',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        if (status == '0') {
                                            this.reconciliationsRowAction(params.row);
                                        }

                                        if (status == '3') {
                                            this.AgainReconciliationsAction(params.row);
                                        }

                                        if (status == '5') {
                                            this.handworkTick(params.row);
                                        }
                                    }
                                }
                            }, text)
                            ]);
                       }
                    if (status == '6') {
                        return h('div',
                            [h('Button', {
                                props: {
                                    type: 'dashed',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                            this.checkAction(params.row);
                                    }
                                }
                            }, text1),
                                h('Button', {
                                    props: {
                                        type: 'dashed',
                                        size: 'small'
                                    },
                                    style: "margin-left: 10px",
                                    on: {
                                        click: () => {
                                            this.resetCheckAction(params.row);
                                        }
                                    }
                                }, text2)
                            ],

                            );
                    }

                }
            }
        ]
    }
}

