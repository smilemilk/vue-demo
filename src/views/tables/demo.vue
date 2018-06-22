<template>
    <div>
        <Card>
           <Table :columns="columns1" :data="data3"></Table>
        </Card>
    </div>
</template>

<script>
    import * as table from './data/search';

    export default {
        name: 'searchable-table',
        data () {
            return {
                searchConName1: '',
                searchConName2: '',
                searchConTel2: '',
                searchConName3: '',
                columns1: table.columns1,
                data1: [],
                initTable1: [],
                data2: [],
                initTable2: [],
                data3: [],
                initTable3: []
            };
        },
        methods: {
            init () {
                this.data1 = this.initTable1 = table.searchTable1;
                this.data2 = this.initTable2 = table.searchTable2;
                this.data3 = this.initTable3 = table.searchTable3;
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
        },
        mounted () {
            this.init();
        }
    };
</script>
