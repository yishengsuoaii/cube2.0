
    $(function () {

        if(!sessionStorage.getItem('token')){
            window.top.location.href="./../login.html"
        }
        layui.use(['form', 'layer','element','table'], function () {
            var form = layui.form;
            var layer = layui.layer;
            //    监听提交
            form.on('submit(formDemo)', function (data) {
                // layer.msg(JSON.stringify(data.field));
                return false;
            });
            var table = layui.table;

            $.ajax({
                url:'http://8.131.247.153/usage_and_billing/export_billing_table/?token='+sessionStorage.getItem('token'),
                type:'POST',
                success:function(res){
                   
                    if(res.msg==='success'){
                       var allData = []
                        res.data.forEach(item => {
                            allData.push({
                                actionName: item[0],
                                plugName: item[1],
                                useTime: item[2],
                                plugPrice:item[3],
                                money: item[4],
                                time: item[5]
                            })
                        })
                        table.render({
                            elem: '#billTable',
                            height: 680,
                            page: {
                                theme: '#F2591A'
                            }, //开启分页
                            limits:[20,40,60,80,100],
                            limit: 20,
                            cellMinWidth: 100,
                            text: {
                                none: '暂无相关数据'
                            },
                            cols: [[ //表头
                              {field: 'actionName', title: '活动名称',align:'center'},
                              {field: 'plugName', title: '插件名称',align:'center'},
                              {field: 'useTime', title: '使用时长(分钟)',align:'center'},
                              {field: 'plugPrice', title: '插件单价(元/小时)',align:'center'},
                              {field: 'money', title: '产生费用(元)',align:'center'},
                              {field: 'time', title: '扣费时间',align:'center'},
                            ]],
                            data:allData
                          })
                    }
                }
            })
        });
        // 限制只能输入数字
        $('.inPay').keyup(function(){
            $(this).val($(this).val().replace(/[^\d.]/g,''))
        })
        var out_trade_no = ''
        $('.payBtn').on('click', function () {
            if ($('.inPay').val().length > 0) {
                layer.open({
                    type: 1,
                    title: '扫码支付',
                    skin: 'layui-ext-yourskin' //只对该层采用myskin皮肤
                        ,
                    content: $('#qrcode')
                });
                $('#qrcode').empty()
                var qrcode = new QRCode(document.getElementById("qrcode"));
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    async: false,
                    url: "http://8.131.247.153/usage_and_billing/wxpay/",
                    data: $(".form").serialize(),
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    success: function (result) {
                        if (result.msg == "success") {
                            qrcode.makeCode(result.data.code_url);
                            out_trade_no = result.data.out_trade_no
                            monitorState()
                        }
                    },
                });
            }
        })

        function monitorState() {
            // 监听支付状态
            wxTimer = setInterval(() => {
                $.ajax({
                    type: "POST",
                    url: "http://8.131.247.153/usage_and_billing/order_query/",
                    data: {
                        out_trade_no: out_trade_no
                    },
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    success: function (result) {
                        if (result.msg == "success" && result.data.trade_state == "SUCCESS") {
                            if (wxTimer) { // 支付成功！钱收到了！就不用在监听了
                                clearInterval(wxTimer);
                                wxTimer = null;
                                layer.msg("支付成功")
                                setTimeout(()=>{
                                    layer.closeAll()
                                },1000)
                            }
                        } else if (result.msg == "error") {
                            layer.msg("支付失败")
                            setTimeout(()=>{
                                layer.closeAll()
                            },1000)
                        }
                    }
                })
            }, 1000);
        }
        // 账单导出

        $('.export').click(function(){
            window.location.href = 'http://8.131.247.153/usage_and_billing/export_billing_table/?token='+sessionStorage.getItem('token')
        })
    })