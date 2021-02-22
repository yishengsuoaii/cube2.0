$(function () {
    if (!sessionStorage.getItem('token')) {
        window.location.href = "./../login.html"
    }

     // 基于准备好的dom，初始化echarts实例
     var myChart = echarts.init(document.getElementById('echarts'));
    // 获取所有频道
    $.post({
        url: "http://www.cube.vip/event/event_list/",
        dataType: "json",
        headers: {
            token: sessionStorage.getItem('token')
        },
        success: function (result) {
            if (result.msg == "success") {
                result.data.forEach(item => {
                    $('#active').append(`
                    <option value="${item.event_id}">${item.event_title}</option>
                    `)
                })
                if (result.data.length > 0) {
                    selectId(result.data[0].event_id)
                }
                
                layui.use('form', function () {
                    var form = layui.form;
                    form.on('select(active)', function (data) {
                        selectId(data.value)
                    })
                })
            }
        }
    })

    function selectId(id) {
        $.ajax({
            url: "http://www.cube.vip/event/get_data_view/",
            dataType: "json",
            type: 'GET',
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: id
            },
            success: function (result) {
                if (result.msg == "success") {
                    $('.liveTime').text(result.data.live_stream_total)
                    $('.audienceNum').text(result.data.event_number_online)
                    $('.audienceAllNum').text(result.data.event_number_views)
                    $('.likeNum').text(result.data.event_number_likes)
                    $('.viewAllTime').text(result.data.total)
                    $('.adLikeNum').text(result.data.event_number_ads_clicks)
                    var valueData = []
                    var nameData = []
                   result.data.histogram_data.forEach(item=>{
                    valueData.push(item.value)
                    nameData.push(item.name)
                   })

                    // 指定图表的配置项和数据
                    var option = {
                        color: ['#3398DB'],
                        title: {
                            text: '插件使用时长'
                        },
                        tooltip: {},
                        legend: {
                            data: ['人']
                        },
                        xAxis: {
                            data: nameData
                        },
                        yAxis: {},
                        series: [{
                            name: '使用时长',
                            type: 'bar',
                            data: valueData
                        }]
                    };
                
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                }
            }
        })
    }
    
})