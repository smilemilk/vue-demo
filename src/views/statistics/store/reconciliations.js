import {parseTime} from '@/filters';

export const columnsTable = [
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
            return h('div', parseTime(params.row.billStartTime, '{y}-{m}-{d}'));
        }
    },
    {
        key: 'fundTransactionTotalCount',
        title: '资金笔数',
        align: 'center'
    },
    {
        key: 'fundTransactionTotalAmount',
        title: '资金金额',
        align: 'center'
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
        title: '操作',
        align: 'center',
        width: 140,
        render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'dashed',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            console.log(params);
                            // this.remove(params)
                        }
                    }
                }, '开始对账')
            ]);
        }
    }
];
