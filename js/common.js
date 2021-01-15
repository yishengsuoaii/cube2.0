$(function () {
    if(!sessionStorage.getItem('token')){
        window.location.href="./../login.html"
    }

    var messageTimer =null
    layui.use('layer', function(){
    var layer = layui.layer;
    //退出登录
    $('#userExit').click(function () {
                layer.open({
                    type: 1,
                    content: `<div style="padding: 20px 20px 0;">是否退出</div>`,
                    btn: ["确定退出", "暂不退出"],
                    yes: function (index, layero) {
                        location.href = "./../login.html";
                        sessionStorage.removeItem('token')
                    },
                    btn2: function (index, layero) {
                        //return false 开启该代码可禁止点击该按钮关闭
                    }
                })
            })
    })
    


    $.post({
        url: "http://8.131.247.153/account/userinfo/",
        dataType: "json",
        async: false,
        headers: {
            token: sessionStorage.getItem('token')
        },
        success: function (result) {
            $(".userName").text(result.data.account_name)
        }
    });
    // 获取消息
    $.ajax({
        type: 'GET',
        url: "http://8.131.247.153/account/message/",
        dataType: "json",
        async: false,
        headers: {
            token: sessionStorage.getItem('token')
        },
        success: function (res) {
            if (res.msg === 'success') {
                var str = ''
                if (res.data.length > 0) {
                    $('#hot').show()
                    res.data.forEach(item => {
                        str += `
                    <div class="messageList" data-id="${item.message_id}">
                        <p class="messageName">
                           ${item.message_title}
                        </p>
                        <p class="messageTime"> ${item.datetime}</p>
                    </div>
                    `
                    })
                } else {
                    str = '<p class="notMessage">当前暂无消息</p>'
                }
                $('#messageContent').html(str)
            }
        }
    })



    // 查看消息
    $('#messageContent').on('click', '.messageList', function () {
        window.open('http://8.131.247.153/html/message.html?id=' + $(this).attr('data-id') +
            '&key=' + sessionStorage.getItem('token'))
    })

    // 控制消息显示与隐藏
    $('.messageBox').hover(function () {
        clearTimeout(messageTimer)
        $('#messageDialog').show()
    }, function () {
        clearTimeout(messageTimer)
        messageTimer = setTimeout(() => {
            $('#messageDialog').hide()
        }, 500)
    })
    $('#messageDialog').hover(function () {
        clearTimeout(messageTimer)
    }, function () {
        messageTimer = setTimeout(() => {
            $('#messageDialog').hide()
        }, 500)
    })

})