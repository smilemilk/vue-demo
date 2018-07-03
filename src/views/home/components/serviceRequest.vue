<template>
    <div style="width:88%;height:200px;margin-left:6%;border-top-left-radius: 8px;border-top-right-radius: 8px;" id="service_request_con"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'serviceRequests',
        mounted () {
            const option = {
                backgroundColor: '-webkit-linear-gradient(90deg, red, blue)',
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
                    left: 0,
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
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
                                    color:'#2ec7c9' // 折线线条填充的颜色
                                }
                            }
                        },
                        areaStyle: {normal: {
                                color:
                                    new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2ec7c9'},
                                        {offset: 0.5, color: '#2ec7c9'},
                                        {offset: 1, color: '#2ec7c9'}
                                    ]
                                )
                            }},
                        data: [220, 45, 546, 745, 872, 624, 10002]
                    }
                ]
            };
            const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
            serviceRequestCharts.setOption(option);
            window.addEventListener('resize', function () {
                serviceRequestCharts.resize();
            });
        }
    };
</script>
