export const columns1 = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        key: 'name',
        title: '账单日期',
        align: 'center'
    },
    {
        key: 'tel',
        title: '资金笔数',
        align: 'center'
    },
    {
        key: 'tel',
        title: '资金金额',
        align: 'center'
    },
    {
        key: 'tel',
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

export const searchTable1 = [
    {
        name: 'Aresn',
        tel: '17712345678'
    },
    {
        name: 'Lison',
        tel: '17787654321'
    },
    {
        name: 'Lili',
        tel: '12212345678'
    },
    {
        name: 'Lucy',
        tel: '13312345678'
    }
];

export const searchTable2 = [
    {
        name: 'Aresn',
        tel: '17712345678'
    },
    {
        name: 'Lison',
        tel: '17787654321'
    },
    {
        name: 'Lili',
        tel: '12212345678'
    },
    {
        name: 'Lucy',
        tel: '13312345678'
    }
];

export const searchTable3 = [
    {
        name: 'Aresn',
        tel: '17712345678'
    },
    {
        name: 'Lison',
        tel: '17787654321'
    },
    {
        name: 'Lili',
        tel: '12212345678'
    },
    {
        name: 'Lucy',
        tel: '13312345678'
    }
];
