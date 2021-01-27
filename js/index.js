if(!sessionStorage.getItem('token')){
    window.location.href="./../login.html"
}
$(function () {
    var switchValue = "True";
    var form
    layui.use(['form', 'layer', 'jquery', 'laydate'], function () {
        form = layui.form;
        var layer = layui.layer;
        var $ = layui.jquery;
        var laydate = layui.laydate;

        form.on('select(select-order)', function (data) {
            $.ajax({
                type: "POST",
                dataType: "json",
                async: false,
                headers: {
                    token: sessionStorage.getItem('token')
                },
                url: "http://8.131.247.153/event/event_list/",
                data: {
                    order_by: data.value
                },
                success: function (result) {
                    if (result.msg == "success") {
                        drawDom(result.data)
                    }
                }
            })
        });

        form.on('switch(switchTest)', function (data) {
            if (data.elem.checked) {
                switchValue = "True";
                $('#roomCode').attr('disabled',true)
                $('#roomCode').val('')
            } else {
                switchValue = "False";
                $('#roomCode').removeAttr('disabled')
            }
        });
        laydate.render({
            elem: '#test5',
            type: 'datetime',
            range: true,
            done: function (aa) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    async: false,
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    url: "http://8.131.247.153/event/event_list/",
                    data: {
                        start_time1: aa
                    },
                    success: function (result) {
                        if (result.msg === 'success') {
                            drawDom(result.data)
                        }
                    }
                })
            }
        });
        laydate.render({
            elem: '#test6',
            type: 'datetime'
        });
        laydate.render({
            elem: '#test7',
            type: 'datetime'
        });

    });

    // 获取账户信息
    getUserInfo()

    function getUserInfo() {
        $.post({
            url: "http://8.131.247.153/account/userinfo/",
            dataType: "json",
            async: false,
            headers: {
                token: sessionStorage.getItem('token')
            },
            success: function (result) {
                $(".account_amount").text(result.data.account_amount);
                if (result.data.account_category == "paid_user") {
                    $(".account_category").text("付费版");
                }
                $(".event_number").text(result.data.event_number);
                $(".account_total_payment").text(result.data.account_total_payment)
            },
        })

    }
    // 获取所有频道
    getAllChannel()

    function getAllChannel() {
        $.post({
            url: "http://8.131.247.153/event/event_list/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            success: function (result) {
                if (result.msg == "success") {
                    drawDom(result.data)
                }
            }
        })
    }
    // 绘制频道dom
    function drawDom(data) {
        var divStr =
            `<button class="layui-btn" id="newAdd"><img src="../image/add.png" /><p>新建直播频道</p></button>`;
        data.forEach((item, index) => {
            if (index % 3 === 0) {
                divStr += `<div class="chan chanMargin" name="chan" id="${item.event_id}">
                            <img class="channel-cover" src="../image/action-cover.png"><div class="channelInfo">
                                <h1 class="channel-name">${item.event_title}</h1>
                                <p class="channel-time">${item.event_start_time.replace('T',' ')}</p>
                                <p class="channel-intro">${item.event_description}</p>
                            </div>
                            <img src="./../image/set-icon.png" alt="" class="setChannel">
                            <img src="./../image/delete-icon.png" alt="" class="deleteChannel">
                        </div>
                    `
            } else {
                divStr += `<div class="chan" name="chan" id="${item.event_id}">
                            <img class="channel-cover" src="../image/action-cover.png"><div class="channelInfo">
                                <h1 class="channel-name">${item.event_title}</h1>
                                <p class="channel-time">${item.event_start_time.replace('T',' ')}</p>
                                <p class="channel-intro">${item.event_description}</p>
                            </div>
                            <img src="./../image/set-icon.png" alt="" class="setChannel">
                            <img src="./../image/delete-icon.png" alt="" class="deleteChannel">
                        </div>
                    `
            }

        })
        $(".channelContent").html(divStr)
    }
    // 创建频道
    $('.channelContent').on('click', '#newAdd', function () {
        layer.open({
            type: 1,
            area: ['654px', '546px'],
            title: ['新建直播频道', 'color:#fff'],
            content: $("#addDialog"),
            shade: 0.3,
            shadeClose: true,
            closeBtn: 1,
            btn: ['确认', '取消'],
            btnAlign: 'c',
            resize: false,
            btn1: function (index, layero) {
                
                if ($.trim($("#username").val()).length <= 0) {
                    layer.msg('请输入频道名称!')
                    $("#username").focus()
                    return;
                } else if ($.trim($(".layui-textarea").val()).length <= 0) {
                    layer.msg('请输入活动简介!')
                    $(".layui-textarea").focus()
                    return;
                } else if ($.trim($("#test6").val()).length <= 0) {
                    layer.msg('请输入活动开始时间!')
                    return;
                } else if ($.trim($("#test7").val()).length <= 0) {
                    layer.msg('请输入活动结束时间!')
                    return;
                }else if(switchValue==='False' && $('#roomCode').val().length<6) {
                    layer.msg('请输入六位密码!')
                    $("#roomCode").focus()
                    return
                } else {
                    var formdata = new FormData();
                    formdata.append("event_title", $("input[name='event_title']")
                        .val());
                    formdata.append("event_description", $(
                        "textarea[name='event_description']").val());
                    formdata.append("event_start_time", $(
                            "input[name='event_start_time']")
                        .val());
                    formdata.append("event_end_time", $("input[name='event_end_time']")
                        .val());

                    formdata.append("event_private", switchValue);
                    formdata.append("event_access_code", $(
                        "input[name='event_access_code']").val());
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        async: false,
                        processData: false,
                        // 告诉jQuery不要去设置Content-Type请求头
                        contentType: false,
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        url: "http://8.131.247.153/event/create_event/",
                        data: formdata,
                        success: function (result) {
                            if (result.msg == "success") {
                                layer.msg('创建成功,直播时间以起始时间为准!',{
                                    time: 2000, 
                                  })
                                setTimeout(() => {
                                    layer.closeAll()
                                    getAllChannel()
                                    getUserInfo()
                                    deleteInfo()
                                }, 2000)

                            } else if (result.msg == "error") {
                                layer.msg('创建失败,请重试!')
                            }
                        },
                    });
                }
            },
            btn2: function () {
                layer.closeAll();
                deleteInfo()
            },
            cancel: function () {
                layer.closeAll();
                deleteInfo()
            }

        });
    })
    // 删除频道
    $('.channelContent').on('click', '.deleteChannel', function (e) {
        var id = $(this).parents('.chan').attr('id')
        layer.open({
            type: 1,
            title: '删除提示',
            content: '<div style="padding: 30px 100px;font-size:18px;color:#666;">此操作将删除该频道,是否继续?</div>',
            shade: 0.3,
            shadeClose: true,
            closeBtn: 0,
            resize: false,
            btn: ['确认', '取消'],
            btnAlign: 'c',
            btn1: function () {
                $.ajax({
                    type: 'POST',
                    url: 'http://8.131.247.153/event/delete_event/',
                    dataType: "json",
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    data: {
                        event_id: id
                    },
                    success: function (result) {
                        if (result.msg == "success") {
                            layer.msg('删除成功!')
                            setTimeout(() => {
                                layer.closeAll()
                                getAllChannel()
                                getUserInfo()
                            }, 500)

                        } else if (result.msg == "error") {
                            layer.msg('删除失败,请重试!')
                        }
                    },
                })
            },
            btn2: function () {
                layer.closeAll();
            },
        });
        e.stopPropagation()
    })

    // 修改频道
    $('.channelContent').on('click', '.setChannel', function (e) {
        getSingleChannel($(this).parents('.chan').attr('id'))
        e.stopPropagation()
    })
    // 获取单个频道信息
    function getSingleChannel(id) {

        $.ajax({
            type: 'GET',
            url: 'http://8.131.247.153/event/check_event/',
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: id
            },
            success: function (result) {
                $("#username").val(result.data.event_title)
                $(".layui-textarea").val(result.data.event_description)
                $("#test6").val(result.data.event_start_time.replace('T', ' '))
                $("#test7").val(result.data.event_end_time.replace('T', ' '))
                $("#roomCode").val(result.data.event_access_code)

                if (result.data.event_private) {
                    setTimeout(() => {
                        $("#showType").attr('checked', 'checked');
                        $('#roomCode').attr('disabled',true)
                        switchValue= 'True'
                        form.render('checkbox');
                    }, 10)

                } else {
                    setTimeout(() => {
                        $("#showType").removeAttr('checked');
                        $('#roomCode').removeAttr('disabled')
                        switchValue= 'False'
                        form.render('checkbox');
                    }, 10)

                }
                $('#switchDom').empty('').html(` <label class="layui-form-label">是否公开:</label>
                <div class="layui-input-block">
                    <input id="showType" type="checkbox" name="event_private" checked="checked" lay-skin="switch" lay-text="公开|加密" lay-filter="switchTest">
                </div>`)
                layer.open({
                    type: 1,
                    area: ['654px', '546px'],
                    title: ['修改直播频道', 'color:#fff'],
                    content: $("#addDialog"),
                    shade: 0.3,
                    shadeClose: true,
                    closeBtn: 1,
                    btn: ['确认', '取消'],
                    btnAlign: 'c',
                    resize: false,
                    btn1: function () {
                        
                        if ($.trim($("#username").val()).length <= 0) {
                            layer.msg('请输入频道名称!')
                            $("#username").focus()
                            return;
                        } else if ($.trim($(".layui-textarea").val()).length <= 0) {
                            layer.msg('请输入活动简介!')
                            $(".layui-textarea").focus()
                            return;
                        } else if ($.trim($("#test6").val()).length <= 0) {
                            layer.msg('请输入活动开始时间!')
                            return;
                        } else if ($.trim($("#test7").val()).length <= 0) {
                            layer.msg('请输入活动结束时间!')
                            return;
                        } else if(switchValue==='False' && $('#roomCode').val().length<6) {
                            layer.msg('请输入六位密码!')
                            $("#roomCode").focus()
                            return
                        } else {
                            var formdata = new FormData();
                            formdata.append("event_id", id);
                            formdata.append("event_title", $(
                                    "input[name='event_title']")
                                .val());
                            formdata.append("event_description", $(
                                "textarea[name='event_description']").val());
                            formdata.append("event_start_time", $(
                                    "input[name='event_start_time']")
                                .val());
                            formdata.append("event_end_time", $(
                                    "input[name='event_end_time']")
                                .val());

                            formdata.append("event_private", switchValue);
                            formdata.append("event_access_code", $(
                                "input[name='event_access_code']").val());
                            $.ajax({
                                type: "POST",
                                dataType: "json",
                                async: false,
                                processData: false,
                                // 告诉jQuery不要去设置Content-Type请求头
                                contentType: false,
                                headers: {
                                    token: sessionStorage.getItem('token')
                                },
                                url: "http://8.131.247.153/event/check_event/",
                                data: formdata,
                                success: function (result) {
                                    if (result.msg == "success") {
                                        layer.msg('修改成功,直播时间以起始时间为准!',{
                                            time: 2000,
                                          })
                                        setTimeout(() => {
                                            layer.closeAll()
                                            getAllChannel()
                                            getUserInfo()
                                            deleteInfo()
                                        }, 2000);

                                    } else if (result.msg == "error") {
                                        layer.msg('修改失败,请重试!')
                                    }
                                },
                            });
                        }
                    },
                    btn2: function () {
                        layer.closeAll();
                        deleteInfo()
                    },
                    cancel: function () {
                        layer.closeAll();
                        deleteInfo()
                    }

                });

            }
        })
    }
    // 手动排序
    $('#order-icon').on('click', function () {
        if ($("#select-order").val() === 'event_start_time') {
            $("#select-order").val('-event_start_time');
        } else {
            $("#select-order").val('event_start_time');
        }
        layui.form.render('select');

        $.ajax({
            type: "POST",
            dataType: "json",
            async: false,
            headers: {
                token: sessionStorage.getItem('token')
            },
            url: "http://8.131.247.153/event/event_list/",
            data: {
                order_by: $("#select-order").val()
            },
            success: function (result) {
                if (result.msg == "success") {
                    drawDom(result.data)
                }
            }
        })
    })

    // 关键字搜索
    $('.inp').on('keypress', function (event) { // 监听回车事件
        if (event.keyCode == "13") {
            $.ajax({
                type: "POST",
                dataType: "json",
                async: false,
                headers: {
                    token: sessionStorage.getItem('token')
                },
                url: "http://8.131.247.153/event/event_list/",
                data: {
                    keyword: $.trim($('.inp').val())
                },
                success: function (result) {
                    if (result.msg == "success") {
                        drawDom(result.data)
                    }
                }
            })
        }
    })
    $(".danger").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            async: false,
            headers: {
                token: sessionStorage.getItem('token')
            },
            url: "http://8.131.247.153/event/event_list/",
            data: {
                keyword: $.trim($('.inp').val())
            },
            success: function (result) {
                if (result.msg == "success") {
                    drawDom(result.data)
                }
            }
        })
    });
    // 进入频道
    $('.channelContent').on('click', '.chan', function () {
        window.location.href = "./../html/live.html?id="+$(this).attr('id')
    })

    // 限制只能输入数字
    $('#roomCode').keyup(function(){
        $(this).val($(this).val().replace(/[^\d]/g,''))
    })
    // 删除默认信息
    function deleteInfo(){
        $("#username").val('')
        $(".layui-textarea").val('')
        $("#test6").val('')
        $("#test7").val('')
        $("#roomCode").val('')
    }
})