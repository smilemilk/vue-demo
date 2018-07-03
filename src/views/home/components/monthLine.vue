<template>
    <div style="width:88%;height:200px;margin-left:6%;border-top-left-radius: 8px;border-top-right-radius: 8px;" id="month_request_con"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'monthLine',
        mounted () {
            const option = {
                backgroundColor: '-webkit-linear-gradient(90deg, rgba(49, 198, 199, 1), rgba(49, 198, 199, .8))',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: 'transparent' // 坐标提示的背景色
                        }
                    }
                },
                grid: {
                    top: 0,
                    left: -130,
                    right: 0,
                    bottom: 0,
                    height: 200,
                    containLabel: true,
                    show: false,
                    borderWidth: 0
                },
                xAxis: [
                    {
                        default: 0,
                        type: 'category',
                        boundaryGap: false,
                        show : false,
                        data: [],
//                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                         axisLabel: {
                            interval: 0
                         }
                    }
                ],
                yAxis: [
                    {
                        axisLabel: {
                            interval: 0
                        },
                        show : false,
                        type: 'value',
                        boundaryGap: false,
                        max: function(value) {
                            return value.max * 2.3;
                        },
                    },
                ],
                series: [
                    {
                        name: '快递/电商',
                        type: 'line',
                        stack: '总量',
                        symbol: 'none', // 去掉折线点
                        smooth: true, // 折线平滑
                        label: {
                            normal: {
                                show: false,
                                position: 'top'
                            }
                        },
                        itemStyle : {
                            normal : {
                                lineStyle:{
                                    color:'rgba(37,160,160,.8)' // 折线线条填充的颜色
                                }
                            }
                        },
                        areaStyle: {normal: {
                                color:
                                    new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: 'rgba(14,128,128, 1)'},
                                        {offset: 0.5, color: 'rgba(14,128,128, .8)'},
                                        {offset: 1, color: 'rgba(14,128,128, .3)'}
                                    ]
                                )
                            }},
                        data: [520, 345, 646, 1745, 872, 824, 902]
                    }
                ]
            };
            const serviceRequestCharts = echarts.init(document.getElementById('month_request_con'));
            serviceRequestCharts.setOption(option);
            window.addEventListener('resize', function () {
                serviceRequestCharts.resize();
            });
        }
    };
</script>
