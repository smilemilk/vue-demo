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
            return h('div', parseTime(params.row.billStartTime, '{y}-{m}-{d}'))
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
        align: 'center'
    },
    {
        key: 'operate',
        title: '操作',
        align: 'center',
        render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'dashed',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            console.log(params)
                            // this.remove(params)
                        }
                    }
                }, '手工勾对')
            ]);
        }
    }
];
