if(!sessionStorage.getItem('token')){
    window.location.href="./../login.html"
}
$(function () {
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
                url: "http://www.cube.vip/event/event_list/",
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
        $.get({
            url: "http://www.cube.vip/event/get_event_Category/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            success: function (res) {
              if(res.msg==='success'){
                  var str = '<option value="">请选择分类</option>'
                  res.data.forEach(item=>{
                    str+=`<option name="${item.event_category_id}" value="${item.event_category_id}">${item.event_category}</option>`
                  })
                  $('#channel-type').html(str)
                  form.render('select');
              }
            }
        })

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
                    url: "http://www.cube.vip/event/event_list/",
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
    });

    // 获取账户信息
    getUserInfo()

    function getUserInfo() {
        $.post({
            url: "http://www.cube.vip/account/userinfo/",
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
            url: "http://www.cube.vip/event/event_list/",
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
                            <img src="./../image/set-icon.png" alt="设置" class="setChannel">
                            <div id="hintBox">
                                设置<div id="hintAngle"></div>
                            </div>
                            <img src="./../image/delete-icon.png" alt="" class="deleteChannel">
                            <div id="hintBox1">
                                删除<div id="hintAngle"></div>
                            </div>
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
                            <div id="hintBox">
                                设置<div id="hintAngle"></div>
                            </div>
                            <img src="./../image/delete-icon.png" alt="" class="deleteChannel">
                            <div id="hintBox1">
                                删除<div id="hintAngle"></div>
                            </div>
                        </div>
                    `
            }

        })
        $(".channelContent").html(divStr)
    }

    // // 提示
    // $('.channelContent').on('hover','.setChannel',function(){
    //     alert(1)
    //     $(this).siblings('#hintBox').toggle()
    // })

    // $('.channelContent').on('hover','.deleteChannel',function(){
    //     alert(2)
    //     $(this).siblings('#hintBox1').toggle()
    // })

    // 创建频道
    $('.channelContent').on('click', '#newAdd', function () {
        layer.open({
            type: 1,
            area: ['654px', '426px'],
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
                } else if ($('#channel-type').val()==='') {
                    layer.msg('请选择频道分类!')
                    $("#channel-type").focus()
                    return;
                }
                else if ($.trim($(".layui-textarea").val()).length <= 0) {
                    layer.msg('请输入活动简介!')
                    $(".layui-textarea").focus()
                    return;
                } else {
                    var formdata = new FormData();
                    formdata.append("event_title", $("input[name='event_title']")
                        .val());
                    formdata.append("event_description", $(
                        "textarea[name='event_description']").val());
                    formdata.append("event_category_id", $('#channel-type').val());
                    
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
                        url: "http://www.cube.vip/event/create_event/",
                        data: formdata,
                        success: function (result) {
                            if (result.msg == "success") {
                                layer.msg('创建成功!',{
                                    time: 300, 
                                  })
                                setTimeout(() => {
                                    layer.closeAll()
                                    getAllChannel()
                                    getUserInfo()
                                    deleteInfo()
                                }, 300)

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
                    url: 'http://www.cube.vip/event/delete_event/',
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
            url: 'http://www.cube.vip/event/check_event/',
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
                $('#channel-type').val(result.data.event_category_id)
                form.render('select');
                layer.open({
                    type: 1,
                    area: ['654px', '426px'],
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
                        } else if ($('#channel-type').val()==='') {
                            layer.msg('请选择频道分类!')
                            $("#channel-type").focus()
                            return;
                        }else if ($.trim($(".layui-textarea").val()).length <= 0) {
                            layer.msg('请输入活动简介!')
                            $(".layui-textarea").focus()
                            return;
                        } else {
                            var formdata = new FormData();
                            formdata.append("event_id", id);
                            formdata.append("event_title", $(
                                    "input[name='event_title']")
                                .val());
                            formdata.append("event_description", $(
                                "textarea[name='event_description']").val());
                            formdata.append("event_category_id", $('#channel-type').val());
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
                                url: "http://www.cube.vip/event/check_event/",
                                data: formdata,
                                success: function (result) {
                                    if (result.msg == "success") {
                                        layer.msg('修改成功!',{
                                            time: 300,
                                          })
                                        setTimeout(() => {
                                            layer.closeAll()
                                            getAllChannel()
                                            getUserInfo()
                                            deleteInfo()
                                        }, 300);

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
            url: "http://www.cube.vip/event/event_list/",
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
                url: "http://www.cube.vip/event/event_list/",
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
            url: "http://www.cube.vip/event/event_list/",
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

    // 删除默认信息
    function deleteInfo(){
        $("#username").val('')
        $(".layui-textarea").val('')
        $('#channel-type').val('')
        form.render('select');
    }
})